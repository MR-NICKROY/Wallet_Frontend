import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Manage = () => {
  const [transactionType, setTransactionType] = useState("expense"); // Default to "expense"
  const [amount, setAmount] = useState("0");
  const [category, setCategory] = useState("Food & Drinks"); // Default to first expense category
  const [isLoading, setIsLoading] = useState(false);
  const [icons, setIcons] = useState({});
  const nav = useNavigate();

  const notification = useRef(null);
  const notification2 = useRef(null);
  const notification3 = useRef(null);

  useEffect(() => {
    const loadAudio = async () => {
      const [sound1, sound2, sound3] = await Promise.all([
        import("../../assets/1.mp3"),
        import("../../assets/2.mp3"),
        import("../../assets/3.mp3"),
      ]);
      notification.current = new Audio(sound1.default);
      notification2.current = new Audio(sound2.default);
      notification3.current = new Audio(sound3.default);
    };

    loadAudio();
  }, []);

  const handleTransactionTypeChange = (type) => {
    setTransactionType(type);
    setCategory(
      type === "expense"
        ? expenseCategories[0].value
        : type === "income"
        ? incomeCategories[0].value
        : transferCategories[0].value
    );
    if (notification.current) notification.current.play();
  };

  const handleNumberClick = (number) => {
    setAmount((prevAmount) =>
      prevAmount === "0" ? number.toString() : prevAmount + number
    );
    if (notification3.current) notification3.current.play();
  };

  const handleBackspace = () => {
    setAmount((prevAmount) =>
      prevAmount.length === 1 ? "0" : prevAmount.slice(0, -1)
    );
    if (notification3.current) notification3.current.play();
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSaveTransaction = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.user?._id;

    if (!userId) {
      console.error("User ID is missing.");
      return;
    }

    const operation =
      transactionType === "income"
        ? "increase"
        : transactionType === "expense"
        ? "reduce"
        : "transfer";

    const payload = {
      userId,
      operation,
      amount: Number(amount),
      category,
    };

    try {
      setIsLoading(true);
      const response = await fetch(
        "https://wallet-backend-silk-ten.vercel.app/api/wallet/transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        console.log("Transaction saved successfully.");
        nav("/dashboard");
        setAmount("0");
        if (notification.current) notification.current.play();
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to save transaction:",
          errorData.message || "Unknown error."
        );
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
      if (notification2.current) notification2.current.play();
    } finally {
      setIsLoading(false);
    }
  };

  const expenseCategories = [
    { value: "Food & Drinks", label: "🍔 Food & Drinks" },
    { value: "Shopping", label: "🛒 Shopping" },
    { value: "Bills", label: "🧾 Bills" },
    { value: "Transport", label: "🚌 Transport" },
    { value: "Vehicle-Expenses", label: "🚗 Vehicle Expenses" },
    { value: "House-Expenses", label: "🏠 House Expenses" },
    { value: "Entertainment", label: "🎮 Entertainment" },
    { value: "Financial-Expenses", label: "💸 Financial Expenses" },
    { value: "Investments", label: "🐖 Investments" },
    { value: "Medical", label: "🏥 Medical" },
    { value: "Education", label: "📚 Education" },
  ];

  const incomeCategories = [
    { value: "Salary", label: "💰 Salary" },
    { value: "Business", label: "📈 Business" },
    { value: "Gifts", label: "🎁 Gifts" },
    { value: "Investments", label: "📊 Investments" },
    { value: "Freelance", label: "🖥️ Freelance" },
    { value: "Rental Income", label: "🏡 Rental Income" },
    { value: "Bonuses", label: "🎉 Bonuses" },
    { value: "Side Hustle", label: "🚀 Side Hustle" },
    { value: "Dividends", label: "📈 Dividends" },
    { value: "Other", label: "💵 Other" },
  ];

  const transferCategories = [
    { value: "Bank Transfer", label: "🏦 Bank Transfer" },
    { value: "Wallet Transfer", label: "📲 Wallet Transfer" },
    { value: "Crypto Transfer", label: "₿ Crypto Transfer" },
    { value: "Peer-to-Peer", label: "🤝 Peer-to-Peer" },
    { value: "International Transfer", label: "🌍 International Transfer" },
    { value: "Savings Transfer", label: "💼 Savings Transfer" },
    { value: "Loan Payment", label: "💳 Loan Payment" },
    { value: "Other Transfers", label: "🔄 Other Transfers" },
  ];

  const categories =
    transactionType === "expense"
      ? expenseCategories
      : transactionType === "income"
      ? incomeCategories
      : transferCategories;

  const wallet = JSON.parse(localStorage.getItem("wallet"));

  const symbol = wallet.data.symbol;
  const currency = wallet.data.currency;

  useEffect(() => {
    const loadIcons = async () => {
      const icons = await import("react-icons/fa");
      return icons;
    };

    loadIcons().then(({ FaPlus, FaMinus, FaExchangeAlt }) => {
      setIcons({ FaPlus, FaMinus, FaExchangeAlt });
    });
  }, []);

  const transactionIcon =
    transactionType === "income"
      ? icons.FaPlus && <icons.FaPlus className="text-green-500" />
      : transactionType === "expense"
      ? icons.FaMinus && <icons.FaMinus className="text-red-500" />
      : icons.FaExchangeAlt && (
          <icons.FaExchangeAlt className="text-blue-500" />
        );

  return (
    <div className="shadow-main h-screen flex justify-center items-center text-black max-[500px] min-w-[350px] overflow-x-hidden">
      <div className="bg-white rounded-lg p-10 shadow-lg">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => handleTransactionTypeChange("income")}
            className={`px-4 mr-2 py-2 rounded-lg ${
              transactionType === "income"
                ? "bg-sky-500 text-white"
                : "bg-gray-200"
            }`}
          >
            INCOME
          </button>
          <button
            onClick={() => handleTransactionTypeChange("expense")}
            className={`px-4 mr-2 py-2 rounded-lg ${
              transactionType === "expense"
                ? "bg-sky-500 text-white"
                : "bg-gray-200"
            }`}
          >
            EXPENSE
          </button>
          <button
            onClick={() => handleTransactionTypeChange("transfer")}
            className={`px-4 mr-2 py-2 rounded-lg ${
              transactionType === "transfer"
                ? "bg-sky-500 text-white"
                : "bg-gray-200"
            }`}
          >
            TRANSFER
          </button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-4xl">{transactionIcon}</span>
          <span className="text-4xl font-bold">
            {symbol} {amount} {currency}
          </span>
        </div>
        <div className="mb-4">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border rounded-lg  bg-white"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0, "<", "Save"].map((item) =>
            item === "Save" ? (
              <button
                key={item}
                onClick={handleSaveTransaction}
                disabled={isLoading}
                className="bg-green-500 text-white px-8 py-4 rounded-lg text-xl font-bold flex items-center justify-center"
              >
                {isLoading ? "Saving..." : item}
              </button>
            ) : (
              <button
                key={item}
                onClick={() => {
                  typeof item === "number"
                    ? handleNumberClick(item)
                    : item === "<"
                    ? handleBackspace()
                    : null;
                }}
                className="bg-gray-200 px-8 py-4 rounded-lg text-xl font-bold"
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Manage;
