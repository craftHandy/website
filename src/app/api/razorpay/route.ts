import type { NextRequest } from "next/server";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;
const PUBLIC_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? RAZORPAY_KEY_ID;

export async function GET() {
    if (!PUBLIC_KEY_ID) {
        return new Response(JSON.stringify({ error: "Razorpay public key is not configured." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ key_id: PUBLIC_KEY_ID }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(request: NextRequest) {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        return new Response(JSON.stringify({ error: "Razorpay credentials are not configured." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    const body = await request.json();
    const { amount, currency, receipt, notes } = body;

    console.log("Razorpay API: create order", {
        amount,
        currency,
        receipt,
        notes: {
            customerName: notes?.customerName,
            customerEmail: notes?.customerEmail,
        },
        credentialsPresent: {
            keyId: !!RAZORPAY_KEY_ID,
            keySecret: !!RAZORPAY_KEY_SECRET,
        },
    });

    if (!amount || !currency || !receipt) {
        return new Response(JSON.stringify({ error: "Missing order creation data." }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify({
            amount,
            currency,
            receipt,
            payment_capture: 1,
            notes,
        }),
    });

    if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        console.error("Razorpay API: order creation failed", {
            status: response.status,
            errorPayload,
        });
        return new Response(JSON.stringify({ error: errorPayload?.error?.description || "Failed to create Razorpay order." }), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    }

    const data = await response.json();
    console.log("Razorpay API: order created", { id: data.id, amount: data.amount, currency: data.currency });
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
