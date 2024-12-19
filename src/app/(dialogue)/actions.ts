"use server";

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function runOpenAi(topic: string) {
  if (!topic) {
    return { error: "Topic is required" };
  }

  const configuration = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

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

export async function runGoogleAi(topic: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const prompt = `You are an AI that generates short dialogues between two people on a given topic.Generate a short dialogue on the topic:
    ${topic}`;

  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [],
  });

  try {
    const response = await chatSession.sendMessage(prompt);
    return { text: response.response.text() };
  } catch (error) {
    console.error(error);
    return { error: "Failed to generate dialogue" };
  }
}
