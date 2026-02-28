import api from "@/api/api";
import { useState } from "react";

export default function Inspiration() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  const generate = async () => {
    const res = await api.post("/inspiration", {
      prompt
    });
    setResult(res.data.data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        AI Renovation Ideas
      </h2>

      <textarea
        placeholder="Describe your renovation..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="auth-input"
      />

      <button
        onClick={generate}
        className="auth-button"
      >
        Generate
      </button>

      {result && (
        <div className="premium-card whitespace-pre-line">
          {result}
        </div>
      )}
    </div>
  );
}