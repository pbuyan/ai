"use client";

import { runOpenAi, runGoogleAi } from "@/app/(dialogue)/actions";
import React, { MouseEvent, ReactNode, useState } from "react";
import TopicList from "@/components/topics/topic-list";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Dialogue({ teamData }: any) {
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);
  const [dialogue, setDialogue] = useState("");
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

  const handleGenerateDialogue = async (data: any) => {
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
      setDialogue(data.text as string);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-md mx-auto">
      <form
        onChange={handleFormChange}
        onSubmit={handleSubmit(handleGenerateDialogue)}
        className="p-6 bg-white shadow-lg rounded-md w-96 space-y-4"
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
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading || !isGenerationAllowed}
        >
          {loading ? "Generating..." : "Generate Dialogue"}
        </button>
      </form>
      {dialogue && (
        <div className="mt-6 p-4 bg-white border rounded-lg">
          <h2 className="text-lg font-semibold">Generated Dialogue:</h2>
          <p className="mt-2 whitespace-pre-wrap">{dialogue}</p>
        </div>
      )}
    </div>
  );
}
