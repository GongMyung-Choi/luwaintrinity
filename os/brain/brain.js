import OpenAI from "openai";

export default async function handler(req, res) {
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const { message } = req.body;

    const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "당신은 공명의 AI 레카입니다." },
            { role: "user", content: message }
        ],
    });

    const reply = completion.choices[0]?.message?.content || "";

    res.status(200).json({ reply });
}
