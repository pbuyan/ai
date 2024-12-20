"use client";

import { runOpenAi, runGoogleAi } from "@/app/(dialogue)/actions";
import React, { type ReactNode, useState } from "react";
import TopicList from "@/components/topics/topic-list";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function DialogueForm({ teamData, onDialogueUpdate }: any) {
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);
  // const [dialogue, setDialogue] = useState("");
  const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState("");
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      topic: "",
      customTopic: "",
    },
  });

  const isGenerationAllowed =
    teamData.subscriptionStatus === "trialing" ||
    teamData.subscriptionStatus === "active";

  const handleFormChange = () => {
    const { topic } = getValues();
    if (topic === "My custom topic") {
      setShowCustomTopicInput(true);
      return;
    }
    setValue("customTopic", "");
    setShowCustomTopicInput(false);
  };

  const handleGenerateDialogue = async (data: {
    topic: string;
    customTopic: string;
  }) => {
    const topic = data.topic;
    const customTopic = data.customTopic;

    if (
      (!topic && !customTopic) ||
      (topic === "My custom topic" && !customTopic)
    ) {
      setError("topic", {
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

    console.log("topicSelected: ", topicSelected);
    try {
      const data = await runGoogleAi(topicSelected);
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
    <div className="w-full">
      <form
        onChange={handleFormChange}
        onSubmit={handleSubmit(handleGenerateDialogue)}
        className=" space-y-4"
      >
        <h1 className="text-2xl font-bold mb-4">Dialogue Generator</h1>
        <Controller
          name="topic"
          control={control}
          defaultValue=""
          rules={{ required: "Please select a topic!" }}
          render={({ field }) => (
            <TopicList onChange={field.onChange} value={field.value} />
          )}
        />

        <Controller
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
        {errors.topic && (
          <p className="text-red-500 text-sm">
            {errors.topic.message as ReactNode}
          </p>
        )}
        <div className="md:fixed md:bottom-0 py-4">
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading || !isGenerationAllowed}
          >
            {loading ? "Generating..." : "Generate Dialogue"}
          </button>
        </div>
      </form>
      {/* {dialogue && (
        <div className="mt-6 p-4 bg-white border rounded-lg">
          <h2 className="text-lg font-semibold">Generated Dialogue:</h2>
          <p className="mt-2 whitespace-pre-wrap">{dialogue}</p>
        </div>
      )} */}
    </div>
  );
}
