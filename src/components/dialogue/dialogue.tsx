"use client";

import { runAi } from "@/app/(dialogue)/actions";
import React, { MouseEvent, useState } from "react";

export default function Dialogue({ teamData }: any) {
  const [topic, setTopic] = useState<string | null | undefined>("");
  const [dialogue, setDialogue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isGenerationAllowed =
    teamData.subscriptionStatus === "trialing" ||
    teamData.subscriptionStatus === "active";

  console.log("teamData.subscriptionStatus: ", teamData.subscriptionStatus);

  const handleGenerateDialogue = async (e: MouseEvent) => {
    if (!topic) {
      setError("Please enter a topic.");
      return;
    }
    setError("");
    setLoading(true);

    e.preventDefault();
    setLoading(true);
    try {
      const data = await runAi(topic);
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
      <h1 className="text-2xl font-bold mb-4">Dialogue Generator</h1>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter a topic"
        value={topic as string}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button
        onClick={handleGenerateDialogue}
        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading || isGenerationAllowed}
      >
        {loading ? "Generating..." : "Generate Dialogue"}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {dialogue && (
        <div className="mt-6 p-4 bg-white border rounded-lg">
          <h2 className="text-lg font-semibold">Generated Dialogue:</h2>
          <p className="mt-2 whitespace-pre-wrap">{dialogue}</p>
        </div>
      )}
    </div>
  );
}
