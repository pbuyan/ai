"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const geminiAIConfig = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function runOpenAi(topic: string, tone: string, language: string) {
	if (!topic) {
		return { error: "Topic is required" };
	}

	const openAIConfig = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	try {
		console.log(
			"prompt Open: ",
			`You are an AI that generates short dialogues between two people on a given topic using ${tone} tone and in language with code: "${language}".`,
		);
		const completion = await openAIConfig.chat.completions.create({
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

export async function runGoogleAi(topic: string, tone: string, language: string, level: string) {
	const model = geminiAIConfig.getGenerativeModel({
		model: "gemini-1.5-flash",
	});

	const generationConfig = {
		temperature: 1,
		topP: 0.95,
		topK: 64,
		maxOutputTokens: 8192,
		responseMimeType: "text/plain",
	};

	const prompt = `You are an AI that generates short dialogues in ${language} between two people on a given topic. Generate a ${level} level dialogue in ${language} on the topic:
    ${topic}. Response should be in the format: "<p><b>Person A:</b> Some text.</p><p><b>Person B:</b> Some text</p>". Replace "Person A" and "Person B" with real names and use ${tone} tone. Do not provide translations. Use HTML tags to format the response, do not use any markdown symbols.`;

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

export async function runGoogleAiTranslate(dialogue: string, language: string, translationLanguage: string) {
	const model = geminiAIConfig.getGenerativeModel({
		model: "gemini-1.5-flash",
	});
	const prompt = `You are an AI translator. Your task it to take this ${dialogue} string, that contains HTML tags and traslate from ${language} language to ${translationLanguage} language. Keep HTML markup, do not use any markdown symbols.`;

	try {
		const result = await model.generateContent(prompt);
		return { text: result.response.text() };
	} catch (error) {
		console.error(error);
		return { error: "Failed to translate dialogue" };
	}
}

export async function usegeCount() {
	return "1";
}
