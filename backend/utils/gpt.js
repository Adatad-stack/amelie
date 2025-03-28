import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function chatWithGpt(messages, contexte) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    temperature: 0.7
  });

  return completion.choices[0].message.content;
}
