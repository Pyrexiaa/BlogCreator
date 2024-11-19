import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function DisplayPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const { state } = useLocation();
  const generatedContent = state;

  console.log(generatedContent);

  useEffect(() => {
    const regex = /Title:\s*(.*)\s*Date:\s*(.*)\s*Content:\s*(.*)/s;

    const match = generatedContent.match(regex);

    if (match) {
      const [, extractedTitle, extractedDate, extractedContent] = match;

      setTitle(extractedTitle.trim());
      setDate(extractedDate.trim());

      const paragraphs = extractedContent
        .split("\n")
        .map((para) => para.trim())
        .filter(Boolean);

      setContent(paragraphs);
    }
  }, [generatedContent]); // Only run when generatedContent changes

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-10">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center mb-4">Blog Details</h1>

        <p className="mb-2">
          <strong>Title:</strong> {title}
        </p>
        <p className="mb-2">
          <strong>Date:</strong> {date}
        </p>

        <div className="content">
          <strong>Content: </strong>
          {content.length > 0 ? (
            content.map((paragraph, index) => (
              <div key={index} className="paragraph mb-4">
                <p>{paragraph}</p>
              </div>
            ))
          ) : (
            <p>Loading content...</p> // Display a loading message until content is set
          )}
        </div>
      </div>
    </div>
  );
}
