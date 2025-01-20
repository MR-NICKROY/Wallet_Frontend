import { useState } from "react";
import axios from "axios";
import { RiSendPlaneFill, RiRefreshLine } from "react-icons/ri";
import { HiMiniChatBubbleLeftRight } from "react-icons/hi2";
import image from "../../../assets/image/3.gif";
import sound from "../../../assets/1.mp3";
const Ai = () => {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([]);
  const [isAnalyzeDisabled, setIsAnalyzeDisabled] = useState(false); // Disable state for "Analyze Transactions"
  const notification = new Audio(sound);
  const apiKey = "AIzaSyA-qbpI2XvsnwclrkEacJL7jIH4fOOD-PI";

  const handleSubmit = async () => {
    if (!prompt) return;

    const userQuestion = `You: ${prompt}`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const apiResponse = await axios.post(url, {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      });

      const result = apiResponse.data.candidates[0]?.content?.parts[0]?.text;
      notification.play();

      setResponses((prev) => [
        // Prepend new messages to show at the top
        <div key={prev.length} className="chat chat-start">
          <div className="chat-bubble bg-blue-600 text-white">
            {userQuestion}
          </div>
        </div>,
        <div key={prev.length + 1} className="chat chat-end">
          <div className="chat-bubble bg-gray-500 text-white">
            {result ? `AI: ${result}` : "AI: No response available."}
          </div>
        </div>,
        ...prev,
      ]);
    } catch (error) {
      setResponses((prev) => [
        <div key={prev.length} className="chat chat-start">
          <div className="chat-bubble bg-red-500 text-white">
            Error: {error.message}
          </div>
        </div>,
        ...prev,
      ]);
    }

    setPrompt("");
  };

  const handleTalkAboutTransactions = async () => {
    try {
      setIsAnalyzeDisabled(true); // Disable button after first click
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.user?._id;

      if (!userId) {
        throw new Error("User ID not found in localStorage.");
      }

      const response = await axios.get(
        `https://wallet-backend-silk-ten.vercel.app/api/wallet/transaction/${userId}`
      );

      const { data } = response.data;
      const { availableMoney, symbol, transactions } = data;

      const increases = transactions.filter(
        (txn) => txn.operation === "increase"
      );
      const decreases = transactions.filter(
        (txn) => txn.operation === "reduce"
      );

      const totalIncreases = increases.reduce(
        (acc, txn) => acc + txn.amount,
        0
      );
      const totalDecreases = decreases.reduce(
        (acc, txn) => acc + txn.amount,
        0
      );

      const transactionSummary = `
        Starting Balance: ${symbol}${availableMoney}
        
        Increases:
        ${increases
          .map((txn) => `${txn.category}: ${symbol}${txn.amount}`)
          .join("\n")}
        Total Increases: ${symbol}${totalIncreases}

        Decreases:
        ${decreases
          .map((txn) => `${txn.category}: ${symbol}${txn.amount}`)
          .join("\n")}
        Total Decreases: ${symbol}${totalDecreases}

        Final Balance: ${symbol}${
        availableMoney + totalIncreases - totalDecreases
      }
      `;

      const aiPrompt = `Based on this financial data, provide advice:\n${transactionSummary}`;

      const aiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            {
              parts: [{ text: aiPrompt }],
            },
          ],
        }
      );

      const aiInsights = aiResponse.data.candidates[0]?.content?.parts[0]?.text;
      notification.play();

      setResponses((prev) => [
        ...prev,
        <div key={prev.length + 1} className="chat chat-end">
          <div className="chat-bubble bg-gray-500 text-white">
            {aiInsights ? `AI: ${aiInsights}` : "AI: No response available."}
          </div>
        </div>,
      ]);
    } catch (error) {
      setResponses((prev) => [
        ...prev,
        <div key={prev.length + 1} className="chat chat-end">
          <div className="chat-bubble bg-red-500 text-white">
            Error: {error.message}
          </div>
        </div>,
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg text-black min-h-screen">
      <h1 className="text-2xl font-bold text-center mb-2">
        <img className="h-[50px]" src={image} alt="image" />
        Financial AI Assistant
      </h1>

      <div className="space-y-4">
        <div className="relative">
          <textarea
            className="w-full p-4 border rounded-md pr-12 bg-white"
            rows="4"
            placeholder="Chat with AI about your finances..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <HiMiniChatBubbleLeftRight className="absolute right-4 top-4 text-gray-400 text-xl" />
        </div>

        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
            onClick={handleSubmit}
          >
            <RiSendPlaneFill className="mr-2" />
            Ask AI
          </button>
          <button
            className={`px-4 py-2 ${
              isAnalyzeDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white rounded-md flex items-center`}
            onClick={handleTalkAboutTransactions}
            disabled={isAnalyzeDisabled} // Disable the button if `isAnalyzeDisabled` is true
          >
            <RiRefreshLine className="mr-2" />
            Analyze Transactions
          </button>
        </div>
        <hr className="h-[3px] bg-gray-500" />

        <div className="space-y-4">{responses}</div>
      </div>
    </div>
  );
};

export default Ai;
