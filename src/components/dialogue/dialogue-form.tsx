"use client";

import { runOpenAi, runGoogleAi } from "@/app/(dialogue)/actions";
import React, { useState } from "react";
import TopicList from "@/components/topics/topic-list";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn, getLanguageName } from "@/lib/utils";
import ToneList from "@/components/tones/tone-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LevelList from "@/components/level/level-list";
import LanguageSelect from "../languages/language-list";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Please select a topic!",
  }),
  customTopic: z.string(),
  tone: z.string(),
  level: z.string(),
  language: z.string(),
});

export default function DialogueForm({
  teamData,
  onDialogueUpdate,
  onGenerateClick,
  language,
  generating,
  onTranslatedDialiogUpdate,
  onLanguageUpdate,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  teamData: any;
  language: string;
  generating: boolean;
  onDialogueUpdate: (lang: string) => void;
  onGenerateClick: (isGenerating: boolean) => void;
  onTranslatedDialiogUpdate: (dialog: string) => void;
  onLanguageUpdate: (lang: string) => void;
}) {
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      customTopic: "",
      tone: "Friendly and Approachable Warm",
      level: "intermediate",
      language,
    },
  });

  const isGenerationAllowed =
    teamData.subscriptionStatus === "trialing" ||
    teamData.subscriptionStatus === "active";

  const handleFormChange = () => {
    const { topic } = form.getValues();
    console.log("topic: ", topic);
    if (topic === "Custom My custom topic") {
      setShowCustomTopicInput(true);
      return;
    }
    form.setValue("customTopic", "");
    setShowCustomTopicInput(false);
  };

  const handleGenerateDialogue = async (data: {
    topic: string;
    customTopic: string;
    tone: string;
    level: string;
  }) => {
    const topic = data.topic;
    const customTopic = data.customTopic;
    const tone = data.tone;
    const level = data.level;

    const languageSelected = getLanguageName(language);

    if (
      (!topic && !customTopic) ||
      (topic === "Custom My custom topic" && !customTopic)
    ) {
      form.setError("customTopic", {
        type: "custom",
        message: "Please enter your topic.",
      });
      return;
    }

    onGenerateClick(true);
    handleDialogueUpdate("");

    let topicSelected = "";
    if (customTopic) {
      topicSelected = customTopic;
    } else {
      topicSelected = topic;
    }

    try {
      const data = await runGoogleAi(
        topicSelected,
        tone,
        languageSelected as string,
        level
      );
      handleDialogueUpdate(data.text as string);
    } catch (err) {
      console.error(err);
    } finally {
      onGenerateClick(false);
    }
  };

  const handleDialogueUpdate = (data: string) => {
    onDialogueUpdate(data);
    onTranslatedDialiogUpdate("");
  };

  const handleLanguageChange = (lang: string) => {
    onLanguageUpdate(lang);
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onChange={handleFormChange}
          onSubmit={form.handleSubmit(handleGenerateDialogue)}
          className="space-y-6 h-full"
        >
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold">Topic</FormLabel>
                <FormControl>
                  <TopicList onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customTopic"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    onChange={field.onChange}
                    value={field.value}
                    className={cn("py-6", { hidden: !showCustomTopicInput })}
                    placeholder={"Enter your topic"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold">Tone</FormLabel>
                <FormControl>
                  <ToneList onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md font-semibold">Level</FormLabel>
                <FormControl>
                  <LevelList onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={() => (
              <FormItem>
                <FormLabel className="text-md font-semibold">
                  Language
                </FormLabel>
                <FormControl>
                  <LanguageSelect
                    value={language}
                    onChange={handleLanguageChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end py-4 content-end sticky bottom-0">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
              disabled={generating || !isGenerationAllowed}
            >
              <Play className="h-5 w-5" />
              {generating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
