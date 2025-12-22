// /api/brain.js
// Vercel Serverless Function (Node.js)

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 서버 전용 키
);

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    /* ======================================================
       1️⃣ 루웨인 전원 스위치 (가장 먼저)
       ====================================================== */
    const { data: system, error: systemError } = await supabase
      .from("system_config")
      .select("system_status")
      .limit(1)
      .single();

    if (
      systemError ||
      !system ||
      system.system_status !== "on"
    ) {
      return res.status(200).json({
        reply: "루웨인은 아직 가동되지 않았습니다. (준비 중)",
      });
    }

    /* ======================================================
       2️⃣ 요청 파싱
       ====================================================== */
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const message = (body.message || "").toString().trim();
    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    /* ======================================================
       3️⃣ OpenAI 키 확인 (전원 ON 이후에만)
       ====================================================== */
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        reply:
          "루웨인 핵심은 기동되었으나, 외부 대화 모듈(OpenAI)이 아직 연결되지 않았습니다.",
      });
    }

    /* ======================================================
       4️⃣ OpenAI 호출
       ====================================================== */
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You are REKA (Luwein). Reply concisely in Korean unless user writes otherwise.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      return res.status(500).json({
        error: "OpenAI request failed",
        status: r.status,
        details: errText.slice(0, 2000),
      });
    }

    const data = await r.json();

    let reply = "";
    if (typeof data.output_text === "string") {
      reply = data.output_text;
    } else {
      reply = JSON.stringify(data).slice(0, 2000);
    }

    return res.status(200).json({ reply });
  } catch (e) {
    return res.status(500).json({
      error: "Server error",
      details: String(e?.message || e),
    });
  }
}
