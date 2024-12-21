"use client";

import { runOpenAi, runGoogleAi } from "@/app/(dialogue)/actions";
import React, { useState } from "react";
import TopicList from "@/components/topics/topic-list";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ToneList from "@/components/tones/tone-list";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { countries } from "@/components/countries/countries";

const formSchema = z.object({
  topic: z.string().min(2, {
    message: "Please select a topic!",
  }),
  customTopic: z.string(),
  tone: z.string(),
});

export default function DialogueForm({
  teamData,
  onDialogueUpdate,
  language,
}: {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  teamData: any;
  onDialogueUpdate: (lang: string) => void;
  language: string;
}) {
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [language, setLanguage] = useState("en-US");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      customTopic: "",
      tone: "Friendly and Approachable Warm",
    },
  });

  const isGenerationAllowed =
    teamData.subscriptionStatus === "trialing" ||
    teamData.subscriptionStatus === "active";

  const handleFormChange = () => {
    const { topic } = form.getValues();
    if (topic === "My custom topic") {
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
  }) => {
    const topic = data.topic;
    const customTopic = data.customTopic;
    const tone = data.tone;

    const languageSelected = countries.filter((country) => {
      if (country.code === language) {
        return country.text;
      }
    })[0].text;

    if (
      (!topic && !customTopic) ||
      (topic === "My custom topic" && !customTopic)
    ) {
      form.setError("topic", {
        type: "custom",
        message: "Please enter your topic.",
      });
      return;
    }

    // setError("");
    setLoading(true);

    setLoading(true);
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
        languageSelected as string
      );
      console.log("data: ", data);
      // setDialogue(data.text as string);
      handleDialogueUpdate(data.text as string);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogueUpdate = (data: string) => {
    onDialogueUpdate(data);
  };

  return (
    <div className="w-full md:w-3/4">
      <Form {...form}>
        <form
          onChange={handleFormChange}
          onSubmit={form.handleSubmit(handleGenerateDialogue)}
          className=" space-y-2"
        >
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic</FormLabel>
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
                    className={cn({ hidden: !showCustomTopicInput })}
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
                <FormLabel>Tone</FormLabel>
                <FormControl>
                  <ToneList onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <label>Topic</label>
          <Controller
            name="topic"
            control={control}
            defaultValue=""
            rules={{ required: "Please select a topic!" }}
            render={({ field }) => (
              <TopicList onChange={field.onChange} value={field.value} />
            )}
          /> */}

          {/* <Controller
            name="customTopic"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                onChange={onChange}
                value={value}
                className={cn({ hidden: !showCustomTopicInput })}
                placeholder={"Enter your topic"}
              />
            )}
          />

          <label>Tone</label>
          <Controller
            name="tone"
            control={control}
            defaultValue=""
            rules={{ required: "Please select a tone!" }}
            render={({ field }) => (
              <ToneList onChange={field.onChange} value={field.value} />
            )}
          />
          {errors.topic && (
            <p className="text-red-500 text-sm">
              {errors.topic.message as ReactNode}
            </p>
          )} */}
          <div className="md:fixed md:bottom-0 py-4">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400"
              disabled={loading || !isGenerationAllowed}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </form>
      </Form>
      {/* {dialogue && (
        <div className="mt-6 p-4 bg-white border rounded-lg">
          <h2 className="text-lg font-semibold">Generated Dialogue:</h2>
          <p className="mt-2 whitespace-pre-wrap">{dialogue}</p>
        </div>
      )} */}
    </div>
  );
}
