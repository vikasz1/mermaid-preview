import React, { useState } from "react";
import MermaidPreview from "./MermaidPreview";
import "./UploadVideo.css";

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState("en");
  const [transcriptionResult, setTranscriptionResult] = useState(null);
  const [googleTranscriptionResult, setGoogleTranscriptionResult] =
    useState(null);
  const [mermaidCode, setMermaidCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMermaid, setIsGeneratingMermaid] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleDefaultTranscription = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const response = await fetch("http://localhost:5007/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setTranscriptionResult(result);
    } catch (error) {
      console.error("Error with transcription:", error);
      alert("Failed to transcribe video");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleTranscription = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language);

    try {
      const response = await fetch("/transcribe_google", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setGoogleTranscriptionResult(result);
    } catch (error) {
      console.error("Error with Google transcription:", error);
      alert("Failed to transcribe video with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateMermaid = async () => {
    if (!transcriptionResult) {
      alert("Please transcribe a video first");
      return;
    }

    setIsGeneratingMermaid(true);

    try {
    const mermaidResponse = await fetch("http://127.0.0.1:3010/mermaid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transcript: transcriptionResult.transcript }),
    });

    if (!mermaidResponse.ok) {
      throw new Error(`HTTP error! status: ${mermaidResponse.status}`);
    }

    const mermaidBlob = await mermaidResponse.blob();
    const mermaidText = await mermaidBlob.text();
    console.log(mermaidText);
    setMermaidCode(mermaidText);
    } catch (error) {
      console.error("Error generating mermaid diagram:", error);
      alert("Failed to generate mermaid diagram");
    } finally {
      setIsGeneratingMermaid(false);
    }
  };

  // Format the transcript for display - breaks into paragraphs and removes extra spaces
  const formatTranscript = (text) => {
    if (!text) return "";
    return text
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\.\s+/g, ".\n\n")
      .replace(/\!\s+/g, "!\n\n")
      .replace(/\?\s+/g, "?\n\n");
  };

  return (
    <div className="upload-video-container">
      <h1 className="title">Video Transcription Tool</h1>

      <div className="upload-controls">
        <div className="input-group">
          <label className="form-label" htmlFor="file">
            Choose video file:
          </label>
          <input
            className="form-input"
            type="file"
            id="file"
            onChange={handleFileChange}
          />
        </div>

        <div className="input-group">
          <label className="form-label" htmlFor="language">
            Language:
          </label>
          <input
            className="form-input"
            type="text"
            id="language"
            value={language}
            onChange={handleLanguageChange}
            placeholder="en"
            required
          />
        </div>

        <div className="button-group">
          <button
            className="action-button"
            onClick={handleDefaultTranscription}
            disabled={isLoading || !file}
          >
            {isLoading ? "Processing..." : "Transcribe"}
          </button>

          <button
            className="action-button google"
            onClick={handleGoogleTranscription}
            disabled={isLoading || !file}
          >
            {isLoading ? "Processing..." : "Google Transcribe"}
          </button>
        </div>
      </div>

      {file && (
        <div className="file-info">
          Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
        </div>
      )}

      {transcriptionResult && (
        <div className="result-container">
          <h2>Transcription Result</h2>
          <div className="result-header">
            <strong>Filename:</strong> {transcriptionResult.filename}
          </div>
          <div className="transcript-content">
            <h3>Transcript:</h3>
            <p className="transcript-text">
              {formatTranscript(transcriptionResult.transcript)}
            </p>
          </div>
          <details>
            <summary>Raw JSON Response</summary>
            <pre className="result-json">
              {JSON.stringify(transcriptionResult, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {googleTranscriptionResult && (
        <div className="result-container">
          <h2>Google Transcription Result</h2>
          <div className="result-header">
            <strong>Filename:</strong> {googleTranscriptionResult.filename}
          </div>
          <div className="transcript-content">
            <h3>Transcript:</h3>
            <p className="transcript-text">
              {formatTranscript(googleTranscriptionResult.transcript)}
            </p>
          </div>
          <details>
            <summary>Raw JSON Response</summary>
            <pre className="result-json">
              {JSON.stringify(googleTranscriptionResult, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {transcriptionResult && (
        <div className="mermaid-controls">
          <button
            className="action-button"
            onClick={handleGenerateMermaid}
            disabled={isGeneratingMermaid}
          >
            {isGeneratingMermaid
              ? "Generating Mermaid..."
              : "Generate Mermaid Diagram"}
          </button>
        </div>
      )}

      {mermaidCode && (
        <div className="mermaid-preview-container">
          <h2>Mermaid Diagram</h2>
          <MermaidPreview code={mermaidCode} />
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
