/**
 * Netlify Serverless Function — Claude AI Chat Proxy
 * Proxies chat requests to the Anthropic API
 *
 * Environment variable required: ANTHROPIC_API_KEY
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 300;

// Simple in-memory rate limiting (per function instance)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds
const RATE_LIMIT_MAX = 5; // max requests per window per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

exports.handler = async function (event) {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Check API key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  // Rate limit by IP
  const clientIP =
    event.headers["x-forwarded-for"] ||
    event.headers["client-ip"] ||
    "unknown";
  if (isRateLimited(clientIP)) {
    return {
      statusCode: 429,
      headers: { "Retry-After": "10" },
      body: JSON.stringify({ error: "Too many requests. Please wait." }),
    };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  const { messages, systemPrompt } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "messages array is required" }),
    };
  }

  // Sanitize messages — only allow role/content
  const sanitizedMessages = messages.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: String(m.content).slice(0, 2000),
  }));

  try {
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt || "",
        messages: sanitizedMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "AI service temporarily unavailable",
        }),
      };
    }

    const data = await response.json();
    const reply =
      data.content && data.content[0] ? data.content[0].text : "";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Chat function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
