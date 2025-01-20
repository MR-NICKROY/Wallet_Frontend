import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dynamic import for axios
const axios = (await import("axios")).default;

// Dynamically import the sound file
const sound = (await import("../../../assets/1.mp3")).default;

const goalOptions = [
  { id: 1, name: "🚗 New Vehicle" },
  { id: 2, name: "🏠 New Home" },
  { id: 3, name: "📖 Education" },
  { id: 4, name: "💖 Health Care" },
  { id: 5, name: "🌇 Holiday Trip" },
  { id: 6, name: "💰 Emergency Fund" },
  { id: 7, name: "📽️ Star Project" },
  { id: 8, name: "🤝 Charity" },
  { id: 9, name: "✈️ Travel Abroad" },
  { id: 10, name: "🛒 Shopping" },
  { id: 11, name: "🧑‍💻 Investment" },
  { id: 12, name: "💸 Startup" },
  { id: 13, name: "💡 Bright Idea" },
  { id: 14, name: "🎁 Gifts" },
  { id: 15, name: "📕 Books" },
  { id: 16, name: "🎮 Gaming Console" },
  { id: 17, name: "🏏 Sports Trophy" },
  { id: 18, name: "📷 Photography" },
  { id: 19, name: "🖼️ Art Supplies" },
  { id: 20, name: "📔 Other" },
];

const SavingsGoalForm = () => {
  const [goalName, setGoalName] = useState(goalOptions[0].name);
  const [targetAmount, setTargetAmount] = useState(0);
  const [savedAlready, setSavedAlready] = useState(0);
  const [desiredDate, setDesiredDate] = useState(
    new Date().toISOString().split("T")[0] // Default to today's date
  );
  const notification = new Audio(sound); // Now using dynamic import for sound
  const nav = useNavigate();
  // Get the user ID from localStorage
  const userDatas = JSON.parse(localStorage.getItem("userData"));
  const userId = userDatas?.user?._id;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the POST request
    const goalData = {
      userId: userId,
      name: goalName,
      target: targetAmount,
      saved: savedAlready,
      date: desiredDate,
    };

    try {
      // Send data to the backend
      const response = await axios.post(
        "https://wallet-backend-silk-ten.vercel.app/api/goals",
        goalData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Goal created successfully:", response.data);
      nav("/saving-tracker");
      notification.play();
      // Redirect to the goal tracking page or show a success message
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  return (
    <div className="p-4 rounded-lg h-screen">
      {/* Goal Name Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="goalName"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Goal Name
        </label>
        <select
          id="goalName"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black bg-white"
        >
          {goalOptions.map((goal) => (
            <option key={goal.id} value={goal.name}>
              {goal.name}
            </option>
          ))}
        </select>
      </div>

      {/* Target Amount */}
      <div className="mb-4 relative">
        <label
          htmlFor="targetAmount"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Target Amount
        </label>
        <input
          type="number"
          id="targetAmount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black bg-white"
        />
      </div>

      {/* Saved Already */}
      <div className="mb-4 relative">
        <label
          htmlFor="savedAlready"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Saved Already
        </label>
        <input
          type="number"
          id="savedAlready"
          value={savedAlready}
          onChange={(e) => setSavedAlready(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black bg-white"
        />
      </div>

      {/* Desired Date */}
      <div className="mb-4 relative">
        <label
          htmlFor="desiredDate"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Desired Date
        </label>
        <input
          type="date"
          id="desiredDate"
          value={desiredDate}
          onChange={(e) => setDesiredDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black bg-white"
        />
      </div>

      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-300"
        onClick={handleSubmit}
      >
        CREATE NEW GOAL
      </button>
    </div>
  );
};

export default SavingsGoalForm;
