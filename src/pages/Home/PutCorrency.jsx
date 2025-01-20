import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added useNavigate for navigation after successful API call

const CashBalanceSetup = () => {
  const [cash, setCash] = useState("0");
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for lazy loading
  const [error, setError] = useState(""); // Error state
  const [FaCheck, setFaCheck] = useState(null);
  const [RiCoinsLine, setRiCoinsLine] = useState(null);
  const [RiCloseLine, setRiCloseLine] = useState(null);
  const [notification, setNotification] = useState(null);
  const [notification2, setNotification2] = useState(null);
  const [notification3, setNotification3] = useState(null);
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const loadDependencies = async () => {
      // Dynamically import icons
      const { FaCheck } = await import("react-icons/fa");
      const { RiCoinsLine, RiCloseLine } = await import("react-icons/ri");
      const sound1 = (await import("../../assets/1.mp3")).default;
      const sound2 = (await import("../../assets/2.mp3")).default;
      const sound3 = (await import("../../assets/3.mp3")).default;

      setFaCheck(() => FaCheck);
      setRiCoinsLine(() => RiCoinsLine);
      setRiCloseLine(() => RiCloseLine);
      setNotification(new Audio(sound1));
      setNotification2(new Audio(sound2));
      setNotification3(new Audio(sound3));
    };

    loadDependencies();
  }, []);

  const handleChange = (e) => {
    setCash(e.target.value);
    notification3.play();
  };

  const handleButtonClick = (value) => {
    notification3.play();
    if (cash === "0") {
      setCash(value);
    } else {
      setCash((prevCash) => prevCash + value);
    }
  };

  const handleClear = () => {
    setCash("0");
    notification3.play();
  };

  // Fetch currencies and flags
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();

        const currenciesData = data
          .map((country) => {
            const currencies = country.currencies
              ? Object.keys(country.currencies)
              : [];
            return currencies.map((currencyCode) => ({
              code: currencyCode,
              symbol: country.currencies[currencyCode]?.symbol || "",
              flag: country.flags.png, // Flag image URL
            }));
          })
          .flat();

        setCurrencies(currenciesData);
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  // Lazy load more currencies when scrolling to the bottom
  const loadMoreCurrencies = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && !loading) {
      setLoading(true);
      setTimeout(() => {
        setCurrencies((prevCurrencies) => [
          ...prevCurrencies,
          ...prevCurrencies.slice(0, 10),
        ]);
        setLoading(false);
      }, 1000);
    }
  };

  // Remove duplicates by currency code
  const uniqueCurrencies = Array.from(
    new Map(currencies.map((item) => [item.code, item])).values()
  );

  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.user._id;

  // Handle submission to the backend
  const handleSubmit = async () => {
    if (!selectedCurrency || cash === "0") {
      setError("Please select a currency and set a valid cash balance.");
      return;
    }

    setError(""); // Clear error state
    try {
      const [symbol, code] = [
        selectedCurrency.slice(0, 1),
        selectedCurrency.slice(1),
      ]; // Extract symbol and code
      const payload = {
        userId: userId, // Replace with the actual userId
        availableMoney: parseFloat(cash),
        currency: code,
        symbol: symbol,
      };

      const response = await fetch(
        "https://wallet-backend-silk-ten.vercel.app/api/wallet/initialize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        notification.play();
        navigate("/dashboard"); // Navigate to dashboard on success
      } else {
        notification2.play();
        const errorData = await response.json();
        console.error("Error:", errorData);
        setError(errorData.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to initialize cash balance. Please try again.");
    }
  };

  // Ensure icons are loaded before rendering
  if (!FaCheck || !RiCoinsLine || !RiCloseLine)
    return (
      <div className="min-h-screen flex justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );

  return (
    <div className=" h-screen flex items-center justify-center text-black">
      <div className="bg-white rounded-lg p-10 w-96 shadow-main">
        <div className="flex justify-center mb-6">
          <div className="bg-cyan-400 rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-yellow-400 text-4xl">
              <RiCoinsLine />
            </span>
          </div>
        </div>

        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold">Set up your cash balance</h2>
          <p className="text-gray-500 text-sm">
            How much cash do you have in your physical wallet?
          </p>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {/* Custom Currency Selector */}
        <div className="flex items-center justify-center mb-4 relative z-">
          <div className="border border-gray-300 rounded-md p-2 w-full cursor-pointer z-20">
            <div
              className="flex justify-between items-center"
              onClick={() =>
                setSelectedCurrency((prev) => (prev === "" ? "Show" : ""))
              }
            >
              <span>{selectedCurrency || "Select Currency"}</span>
              <span className="ml-2">🔽</span>
            </div>

            {selectedCurrency === "Show" && (
              <div
                className="absolute left-0 top-full mt-2 w-full bg-white border border-gray-300 rounded-md  no-scrollbar"
                style={{ height: "50vh", overflowY: "auto" }}
                onScroll={loadMoreCurrencies} // Trigger loading more on scroll
              >
                {uniqueCurrencies.map(({ code, flag, symbol }) => (
                  <div
                    key={symbol + code}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer "
                    onClick={() => {
                      setSelectedCurrency(symbol + code);
                    }}
                  >
                    <img src={flag} alt={code} className="w-6 h-4 mr-2" />
                    <span>
                      {code} - {symbol}
                    </span>
                  </div>
                ))}
                {loading && (
                  <div className="text-center p-2 text-gray-500">
                    Loading more...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cash input */}
        <div className="flex items-center justify-center mb-8 z-10">
          <input
            type="text"
            value={cash}
            onChange={handleChange}
            className="text-3xl font-semibold mr-2 w-[50%] text-center border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500   text-black bg-white"
          />
          <button className="ml-5 text-black">
            <RiCloseLine
              className="text-2xl"
              onClick={() => {
                handleClear();
              }}
            />
          </button>
        </div>

        {/* Number keypad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              className="bg-gray-200 rounded-full w-16 h-16 text-2xl font-medium text-gray-600 flex items-center justify-center"
              onClick={() => handleButtonClick(num.toString())}
            >
              {num}
            </button>
          ))}
          <button
            className="bg-gray-200 rounded-full w-16 h-16 text-2xl font-medium text-gray-600 flex items-center justify-center"
            onClick={() => handleButtonClick(".")}
          >
            .
          </button>
          <button
            className="bg-gray-200 rounded-full w-16 h-16 text-2xl font-medium text-gray-600 flex items-center justify-center"
            onClick={() => handleButtonClick("0")}
          >
            0
          </button>
          <button
            className="bg-green-500 rounded-full w-16 h-16 text-2xl font-medium text-white flex items-center justify-center"
            onClick={handleSubmit}
          >
            <FaCheck />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashBalanceSetup;
