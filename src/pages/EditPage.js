import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setJamaiApiKey, addRow } from "../api/api_calling";

const apiKey = process.env.REACT_APP_APIKEY;
const projectId = process.env.REACT_APP_PROJECTID;

export function EditPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [chatboxVisible, setChatboxVisible] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [chatboxPosition, setChatboxPosition] = useState({ x: 0, y: 0 });
  const [userInput, setUserInput] = useState("");
  const location = useLocation();
  const { generatedContent, rowId } = location.state || {};
  console.log("Row ID in Edit Page: ", rowId);
  const navigate = useNavigate();

  useEffect(() => {
    setJamaiApiKey(apiKey, projectId);

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

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (selectedText) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Set chatbox position near the selection
      setChatboxPosition({
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      });

      setSelectedText(selectedText);
      setChatboxVisible(true);
    }
  };

  const generateAnswer = async (inputData) => {
    let explanation = "";
    try {
      const data = await addRow("EditInformation", [inputData]);

      console.log("API response:", data);

      explanation = data.rows[0].columns.output.choices[0].message.content;
    } catch (err) {
      console.error("Error fetching explanation:", err);
      explanation = "Failed to fetch explanation.";
    }
    return explanation;
  };

  const handleChatboxSubmit = async () => {
    console.log(userInput);
    if (userInput.trim() === "") return;

    const inputData = {
      input: selectedText,
      command: userInput,
    };

    try {
      const data = await generateAnswer(inputData);

      setContent((prevContent) =>
        prevContent.map((para) =>
          para.includes(selectedText) ? para.replace(selectedText, data) : para
        )
      );

      // Reset chatbox
      setChatboxVisible(false);
      setUserInput("");
      setSelectedText("");
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const editAnswer = async () => {
    try {
      const concatenatedContent = content.join("\n");
      const inputData = {
        title: title,
        date: date,
        content: concatenatedContent,
      };
      const data = await addRow("FinalInformation", [inputData]);
      console.log("API response:", data);
      return true;
    } catch (err) {
      console.error("Error fetching explanation:", err);
    }
  };

  const handleSaveChanges = async () => {
    const saved = await editAnswer();
    if (saved) {
      navigate("/display-blog");
    } else {
      console.log("Unknown error occured while moving to next page");
    }
  };

  const handleDiscardChanges = async () => {
    const confirmDiscard = window.confirm(
      "Are you sure you want to discard the changes? These won't be saved."
    );

    if (confirmDiscard) {
      navigate("/display-blog");
    } else {
      window.close();
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex justify-center items-center px-10"
      onMouseUp={handleTextSelection} // Detect text selection on mouse release
    >
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
            <p>Loading content...</p>
          )}
        </div>
        {/* Buttons for Save and Discard */}
        <div className="flex justify-center mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleDiscardChanges}
          >
            Discard Changes
          </button>
        </div>
      </div>

      {/* Chatbox */}
      {chatboxVisible && (
        <div
          className="absolute bg-white shadow-md p-4 rounded"
          style={{
            top: chatboxPosition.y + 10, // Offset below the selection
            left: chatboxPosition.x,
          }}
        >
          <p className="mb-2">
            <strong>Edit:</strong> {selectedText}
          </p>
          <textarea
            className="w-full p-2 border rounded mb-2"
            rows={3}
            placeholder="Type your edit here..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleChatboxSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded"
            onClick={() => setChatboxVisible(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
