"use server";

import OpenAI from "openai";

const configuration = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function runAi(topic: string) {
  if (!topic) {
    return { error: "Topic is required" };
  }

  try {
    const completion = await configuration.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that generates short dialogues between two people on a given topic.",
        },
        {
          role: "user",
          content: `Generate a short dialogue on the topic: ${topic}`,
        },
      ],
      max_tokens: 150,
    });

    const dialogue = completion.choices[0]?.message.content;
    console.log("dialogue: ", dialogue);
    return { text: dialogue };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate dialogue" };
  }
}
