import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import sound from "../../../assets/1.mp3";

// Dynamically import icons using React.lazy
const RiGraduationCapLine = React.lazy(() =>
  import("react-icons/ri").then((module) => ({
    default: module.RiGraduationCapLine,
  }))
);
const RiSafe2Line = React.lazy(() =>
  import("react-icons/ri").then((module) => ({ default: module.RiSafe2Line }))
);
const RiHandHeartLine = React.lazy(() =>
  import("react-icons/ri").then((module) => ({
    default: module.RiHandHeartLine,
  }))
);
const RiHomeGearLine = React.lazy(() =>
  import("react-icons/ri").then((module) => ({
    default: module.RiHomeGearLine,
  }))
);
const RiCarLine = React.lazy(() =>
  import("react-icons/ri").then((module) => ({ default: module.RiCarLine }))
);

const SavingsGoalsList = () => {
  const [goals, setGoals] = useState([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [input, setInput] = useState("0");
  const [result, setResult] = useState("0");
  const userDatas = JSON.parse(localStorage.getItem("userData"));
  const userId = userDatas?.user?._id;
  const notification = new Audio(sound);

  useEffect(() => {
    // Fetch data from the backend
    const fetchGoals = async () => {
      try {
        const response = await axios.get(
          `https://wallet-backend-silk-ten.vercel.app/api/goals/${userId}`
        );
        setGoals(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, [userId]);

  const handleButtonClick = (value) => {
    if (input === "0") {
      setInput(value);
    } else {
      setInput(input + value);
    }

    // Dynamically calculate and update result as input changes
    const updatedInput = input === "0" ? value : input + value;
    setResult(updatedInput);
  };

  // Safe calculation method
  const calculateResult = (expression) => {
    try {
      // Replace 'x' with '*' for multiplication and evaluate the expression
      const sanitizedExpression = expression.replace("x", "*");
      const evaluatedResult = new Function("return " + sanitizedExpression)();
      return isNaN(evaluatedResult) ? 0 : evaluatedResult;
    } catch {
      return 0; // Default to 0 if the expression is invalid
    }
  };

  const updateGoal = async () => {
    const savedAmount = Number(result);
    if (isNaN(savedAmount) || savedAmount <= 0) {
      console.error("Invalid saved amount:", savedAmount);
      return;
    }

    try {
      // Increment the existing saved amount with the new savedAmount
      const updatedSavedAmount = selectedGoal.saved + savedAmount;

      const response = await axios.patch(
        `https://wallet-backend-silk-ten.vercel.app/api/goals/${selectedGoal._id}`,
        {
          saved: updatedSavedAmount, // Use the updated saved amount
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Goal updated successfully:", response.data);

      // Update the goal in the UI
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === selectedGoal._id
            ? { ...goal, saved: updatedSavedAmount }
            : goal
        )
      );

      // Close the calculator
      setShowCalculator(false);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const clearInput = () => {
    setInput("0");
    setResult(0); // Reset the result as well
  };

  const cancelInput = () => {
    setInput("0");
    setResult(0); // Reset the result
    setShowCalculator(false); // Close the calculator
  };

  const deleteGoal = async (goalId) => {
    try {
      // Delete the goal from the backend using the goalId
      await axios.delete(
        `https://wallet-backend-silk-ten.vercel.app/api/goals/${goalId}`
      );

      // Update the UI by removing the deleted goal
      setGoals(goals.filter((goal) => goal._id !== goalId));

      console.log("Goal deleted successfully");
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const icons = [
    RiGraduationCapLine,
    RiSafe2Line,
    RiHandHeartLine,
    RiHomeGearLine,
    RiCarLine,
  ];
  const colors = ["#3b82f6", "#a855f7", "#ef4444", "#f97316", "#14b8a6"];

  return (
    <div className="p-6 bg-white rounded-lg relative min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Savings Goals</h2>
      <p className="text-gray-600 mb-6">
        Track how much you have already saved!
      </p>

      {goals.map((goal, index) => (
        <div
          key={goal._id}
          className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition relative"
        >
          <div className="flex items-center mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors[index % colors.length] }}
            >
              {/* Suspense to handle the lazy loading of icons */}
              <Suspense fallback={<div>Loading icon...</div>}>
                {React.createElement(icons[index % icons.length], {
                  className: "text-white text-2xl",
                })}
              </Suspense>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-800">{goal.name}</h3>
              <p className="text-gray-600">
                Target: ₹{parseInt(goal.target).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                width: `${
                  (parseInt(goal.saved) / parseInt(goal.target)) * 100
                }%`,
                backgroundColor: colors[index % colors.length],
              }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-500 text-sm">
              Saved: ₹{parseInt(goal.saved).toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">
              {Math.round((parseInt(goal.saved) / parseInt(goal.target)) * 100)}
              %
            </span>
          </div>
          <p>{goal.note}</p>
          <p>Desired Date : {goal.date}</p>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-300 w-full"
            onClick={() => {
              setSelectedGoal(goal); // Set selected goal here
              setShowCalculator(true);
              notification.play();
            }}
          >
            Update
          </button>

          {/* Set selectedGoal when delete button is clicked */}
          <MdDelete
            className="text-red-500 text-3xl absolute top-1 right-2 cursor-pointer"
            onClick={() => {
              deleteGoal(goal._id);
              notification.play();
            }} // Call deleteGoal directly with goal._id
          />
        </div>
      ))}

      <Link
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-300 w-full"
        to="/saving"
        onClick={() => {
          notification.play();
        }}
      >
        CREATE GOAL
      </Link>

      {showCalculator && (
        <div className="flex flex-col items-center justify-center text-black absolute top-[10vh] left-5">
          <div className="bg-white rounded-lg shadow-lg p-4 w-80">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Calculator</h2>
            </div>
            <div className="text-right text-2xl mb-4">{input}</div>
            <div className="grid grid-cols-4 gap-2">
              {["7", "8", "9"].map((item) => (
                <button
                  key={item}
                  className="bg-gray-300 p-4 rounded-lg"
                  onClick={() => handleButtonClick(item)}
                >
                  {item}
                </button>
              ))}
              {["4", "5", "6"].map((item) => (
                <button
                  key={item}
                  className="bg-gray-300 p-4 rounded-lg"
                  onClick={() => handleButtonClick(item)}
                >
                  {item}
                </button>
              ))}
              {["1", "2", "3"].map((item) => (
                <button
                  key={item}
                  className="bg-gray-300 p-4 rounded-lg"
                  onClick={() => handleButtonClick(item)}
                >
                  {item}
                </button>
              ))}
              {["0", "+", "="].map((item) => (
                <button
                  key={item}
                  className="bg-gray-300 p-4 rounded-lg"
                  onClick={() => {
                    if (item === "=") {
                      setResult(calculateResult(input));
                    } else {
                      handleButtonClick(item);
                    }
                  }}
                >
                  {item}
                </button>
              ))}
              <button
                className="bg-gray-300 p-4 rounded-lg"
                onClick={clearInput}
              >
                C
              </button>
              <button
                className="bg-red-500 p-4 rounded-lg text-lg"
                onClick={cancelInput}
              >
                {">"}
              </button>
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-lg">Total: ₹{result}</span>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                onClick={updateGoal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsGoalsList;
