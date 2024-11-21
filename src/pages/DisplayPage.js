import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setJamaiApiKey, getActionTableRows } from "../api/api_calling";
// import { Header } from "../components/Header";
// import { Sidebar } from "../components/Sidebar";

const apiKey = process.env.REACT_APP_APIKEY;
const projectId = process.env.REACT_APP_PROJECTID;

const getContent = async () => {
  try {
    const data = await getActionTableRows("FinalInformation");
    console.log("API response:", data);
    return data;
  } catch (err) {
    console.error("Error fetching explanation:", err);
  }
};

export function DisplayPage() {
  const navigate = useNavigate();

  const [contentList, setContentList] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling
  const [socialMediaContent, setSocialMediaContent] = useState(null);

  useEffect(() => {
    const initializeContent = async () => {
      try {
        setJamaiApiKey(apiKey, projectId); // Ensure the API key is set
        const data = await getContent("FinalInformation");
        const transformedData = data.map((item) => ({
          ID: item.ID,
          "Updated At": item["Updated At"],
          title: item.title.value,
          date: item.date.value,
          content: item.content.value,
          instagram: item.instagram.value,
          facebook: item.facebook.value,
          linkedin: item.linkedin.value,
          cost: item.cost.value,
        }));
        const sortedTransformedData = transformedData.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setContentList(sortedTransformedData);
        console.log(contentList);
        setSelectedContent(sortedTransformedData[0]);
      } catch (err) {
        setError("Failed to fetch content. Please try again.");
        console.error("Error fetching content:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeContent(); // Call the async function
  });

  const handleSelectContent = (content) => {
    setSelectedContent(content);
    setSocialMediaContent(null);
  };

  const handleShare = (platform) => {
    if (selectedContent) {
      let paragraphs = "";
      if (selectedContent[platform.toLowerCase()]) {
        paragraphs = selectedContent[platform.toLowerCase()]
          .split("\n")
          .map((para) => para.trim())
          .filter(Boolean);
      }

      setSocialMediaContent({
        platform,
        content: paragraphs, // Assuming content has keys like 'instagram', 'facebook', etc.
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-md">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold p-4 border-gray-200">LifePages</h2>
          <button
            className="p-2 m-4 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600"
            onClick={() => navigate("/")}
          >
            Add Post
          </button>
        </div>

        <ul className="divide-y divide-gray-200">
          {loading ? (
            <li className="p-4 text-gray-600">Loading...</li>
          ) : error ? (
            <li className="p-4 text-red-500">{error}</li>
          ) : (
            contentList.map((item, index) => (
              <li
                key={index}
                className={`p-4 cursor-pointer ${
                  selectedContent === item
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => handleSelectContent(item)}
              >
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.date}</p>
              </li>
            ))
          )}
        </ul>
        {/* Travel Planner Button */}
        <div className="p-4 mt-auto">
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
            onClick={() => navigate("/travel-planner")}
          >
            Travel Planner
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {loading ? (
          <div className="text-center">
            <div className="loader mb-4"></div>
            <p className="text-gray-600 text-lg">Loading content...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : selectedContent ? (
          <div className="bg-white p-8 rounded shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {selectedContent.title}
            </h1>
            <p className="text-sm text-gray-500 mb-6">{selectedContent.date}</p>
            <p className="text-gray-700 mb-6">{selectedContent.content}</p>
            {/* Social Media and Estimate Cost Buttons */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex gap-4">
                {["Instagram", "Facebook", "LinkedIn"].map((platform) => (
                  <button
                    key={platform}
                    className={`px-4 py-2 rounded text-white ${
                      platform === "Instagram"
                        ? "bg-pink-500"
                        : platform === "Facebook"
                        ? "bg-blue-600"
                        : platform === "LinkedIn"
                        ? "bg-blue-700"
                        : "bg-blue-400"
                    }`}
                    onClick={() => handleShare(platform)}
                  >
                    Share to {platform}
                  </button>
                ))}
              </div>

              {/* Estimate Cost Button */}
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow-md hover:bg-yellow-600"
                onClick={() => handleShare("cost")}
              >
                Estimate Cost
              </button>
            </div>
            {/* Social Media Generated Content */}
            {socialMediaContent && socialMediaContent.platform && (
              <div className="mt-8 p-6 bg-gray-50 border rounded shadow">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Generated Content for {socialMediaContent.platform}
                </h2>
                {socialMediaContent.content.length > 0 ? (
                  socialMediaContent.content.map((paragraph, index) => (
                    <div key={index} className="paragraph mb-4">
                      <p className="text-gray-700">{paragraph}</p>
                    </div>
                  ))
                ) : (
                  <p>Loading content...</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">
            Select a post from the sidebar to view its details.
          </p>
        )}
      </main>
    </div>
  );
}
