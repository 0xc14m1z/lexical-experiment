import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: process.env.OPEN_AI_ORG,
  apiKey: process.env.OPEN_AI_TOKEN,
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  const prompt = await request.text();
  const response = await openai.createChatCompletion({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] })
  return new Response(response.data.choices[0]?.message?.content?.trim() ?? "");
}
