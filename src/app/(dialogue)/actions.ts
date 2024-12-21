"use server";

import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function runOpenAi(topic: string, tone: string, language: string) {
  if (!topic) {
    return { error: "Topic is required" };
  }

  const configuration = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    console.log(
      "prompt Open: ",
      `You are an AI that generates short dialogues between two people on a given topic using ${tone} tone and in language with code: "${language}".`
    );
    const completion = await configuration.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an AI that generates short dialogues between two people on a given topic using ${tone} tone and in Russian language.`,
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

export async function runGoogleAi(
  topic: string,
  tone: string,
  language: string
) {
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

  const prompt = `You are an AI that generates short dialogues in ${language} between two people on a given topic. Generate a dialogue in ${language} on the topic:
    ${topic}. Use real names and ${tone} tone. Do not provide translations. Use HTML tags to format the response, do not use any markdown symbols.`;

  console.log("prompt: ", prompt);

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
