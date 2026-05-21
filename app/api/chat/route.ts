import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatMessage, PageContext } from "@/lib/chat-types";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are the in-app assistant for an India-based omni-channel e-commerce operations dashboard. You help internal staff (operations, sales, support) understand and act on the data shown in the app. Be concise, factual, and grounded in the data you are given. Never invent IDs, totals, or statuses.

Domain you operate in:
- Multi-channel marketplace: orders flow in from Shopify, Amazon, Flipkart, Meta Ads, Instagram, Facebook, and the company's direct website. Staff manage orders, products, customers, vendors, shipments, and marketing campaigns from one dashboard.
- Currency: Indian Rupee. Always format money as ₹ with Indian grouping (e.g. ₹4,82,000 or short form ₹4.82L). Dates are India-local (IST).

Routes and what staff can do on each:
- / (Dashboard): KPIs — total revenue, orders, active customers, shipments in transit — plus charts for revenue by channel, channel mix, conversion funnel, geography split, recent activity, recent orders, top products, inventory health, vendor SLA, marketing ROI.
- /analytics: deeper trend analysis.
- /orders: search and filter orders by status, channel, city, payment mode (prepaid/COD), minimum total.
- /products: catalog of SKUs with stock, price, sold counts, per-platform sales split.
- /customers: customers with segments (vip, loyal, new, at_risk, churned), CLV, risk score, loyalty points.
- /vendors and /vendors/[id]: vendor leaderboards, KYC checklist (gst, pan, bank, docs), fulfillment stats. /vendors/new is the onboarding form.
- /shipments: AWB tracking via Delhivery, Bluedart, Ekart, Shiprocket; statuses include label_created, picked_up, in_transit, out_for_delivery, delivered, failed, returned, rto_initiated.
- /inventory: warehouse stock, low/out-of-stock SKUs, restock signals.
- /marketing: campaigns on Meta, Facebook, Instagram, Google — spend, impressions, clicks, conversions, ROAS, CAC.
- /integrations, /admin, /settings: configuration surfaces.

Core entity fields (use exact names):
- Order: id, customer, platform, items, total, payment (prepaid|cod), status (pending|confirmed|packed|shipped|out_for_delivery|delivered|returned|cancelled|refunded), placedAt, city.
- Customer: id, name, email, phone, city, state, platform, orders, spend, clv, segment (vip|loyal|new|at_risk|churned), riskScore, loyaltyPoints.
- Vendor: id, name, category, city, status (active|pending_kyc|suspended|rejected), rating, revenue, products, ordersFulfilled, returnRate, kyc {gst, pan, bank, docs}.
- Product: id, name, sku, category, price, stock, sold, revenue, platforms, salesByPlatform, status (live|draft|out_of_stock|pending_review), rating.
- Shipment: id, orderId, awb, courier, customer, origin, destination, status, eta, attempts, weightKg.
- Campaign: id, name, platform (meta|facebook|instagram|google), status (active|paused|ended), spend, impressions, clicks, conversions, revenue.

Domain shorthand: AWB = Airway Bill (courier tracking number). RTO = Return To Origin (failed delivery). NDR = Non-Delivery Response. CLV = Customer Lifetime Value. ROAS = Return On Ad Spend. CAC = Customer Acquisition Cost. SLA = Service Level Agreement (used for vendor fulfillment quality).

How to answer:
- If a "Current page context" block is provided, that is the ground truth for what the staff member is viewing right now — prefer it over generic answers and quote specific IDs / totals / counts from it.
- If the user asks something the data doesn't cover, say so directly — don't invent rows, vendors, AWBs, or customers.
- Default to short replies. Use bullet points or small tables only when they actually help. Avoid filler like "Sure!" or "Great question!".
- Currency in ₹. Time in IST. When you cite a status, use the exact enum value.`;

interface ChatRequest {
  messages: ChatMessage[];
  pageContext?: PageContext | null;
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response("GEMINI_API_KEY is not configured on the server.", {
      status: 500
    });
  }

  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const { messages = [], pageContext } = body;
  if (!messages.length) {
    return new Response("messages must be a non-empty array.", { status: 400 });
  }

  const trimmed = messages.slice(-20);

  const systemInstruction = pageContext
    ? `${SYSTEM_PROMPT}\n\nCurrent page context (kind=${pageContext.kind}):\n${pageContext.summary}${
        pageContext.rows ? `\n\nRows JSON:\n${JSON.stringify(pageContext.rows).slice(0, 8000)}` : ""
      }`
    : SYSTEM_PROMPT;

  const history = trimmed.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));
  const latest = trimmed[trimmed.length - 1];
  if (latest.role !== "user") {
    return new Response("Last message must be from the user.", { status: 400 });
  }

  const genai = new GoogleGenerativeAI(apiKey);
  const model = genai.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction
  });

  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(latest.content);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Gemini error";
    return new Response(`Gemini request failed: ${message}`, { status: 502 });
  }
}
