import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { lazy, Suspense } from "react";

// Dynamic import for ApexCharts and BarChart
const ApexCharts = lazy(() => import("react-apexcharts"));
const BarChart = lazy(() => import("./Components/BarChart"));

// React Icons
import {
  FaUtensils,
  FaShoppingCart,
  FaArrowUp,
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaBus,
  FaCar,
  FaHome,
  FaGamepad,
  FaChartLine,
  FaPiggyBank,
  FaWallet,
} from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { BsFiletypeXlsx } from "react-icons/bs";
import { MdLogout, MdOutlineSavings, MdOutlineMenuOpen } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { IoIosAdd } from "react-icons/io";

// Assets
import sound from "../../assets/1.mp3";
import sound2 from "../../assets/2.mp3";

const Dashboard = () => {
  const notification = new Audio(sound);
  const notification2 = new Audio(sound2);
  const nav = useNavigate();
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [availableMoney, setAvailableMoney] = useState(0);
  const [currency, setCurrency] = useState("");
  const [symbol, setSymbol] = useState("");
  const [balanceTrendData, setBalanceTrendData] = useState([]);
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData.user._id;
        const response = await axios.get(
          `https://wallet-backend-silk-ten.vercel.app/api/wallet/transaction/${userId}`
        );
        localStorage.setItem("wallet", JSON.stringify(response.data));

        const { availableMoney, currency, symbol, transactions } =
          response.data.data;
        setUserData(userData);
        setAvailableMoney(availableMoney);
        setCurrency(currency);
        setSymbol(symbol);
        setTransactions(transactions);

        const balanceTrend = [];
        let runningBalance = 0;

        transactions.forEach((txn) => {
          if (txn.operation === "increase") {
            runningBalance += txn.amount;
          } else if (
            txn.operation === "reduce" ||
            txn.operation === "transfer"
          ) {
            runningBalance -= txn.amount;
          }
          balanceTrend.push({
            date: new Date(txn.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            }),
            balance: runningBalance,
          });
        });

        setBalanceTrendData(balanceTrend);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    if (userData) {
      const gender = userData?.user?.gender;
      const username = userData?.user?.fullname;
      if (gender && username) {
        const avatarUrl =
          gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=${username}`
            : gender === "female"
            ? `https://avatar.iran.liara.run/public/girl?username=${username}`
            : "";
        setAvatar(avatarUrl);
      }
    }
  }, [userData]);

  const handleLogout = () => {
    notification2.play();
    localStorage.removeItem("userData");
    localStorage.removeItem("transactions");
    nav("/auth");
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "food & drinks":
        return <FaUtensils />;
      case "shopping":
        return <FaShoppingCart />;
      case "income":
        return <FaArrowUp />;
      case "transfer":
        return <FaExchangeAlt />;
      case "bills":
        return <FaFileInvoiceDollar />;
      case "transport":
        return <FaBus />;
      case "vehical-expenses":
        return <FaCar />;
      case "house-expenses":
        return <FaHome />;
      case "entertainment":
        return <FaGamepad />;
      case "financial-expenses":
        return <FaChartLine />;
      case "investments":
        return <FaPiggyBank />;
      default:
        return <FaWallet />;
    }
  };

  const renderRecord = (record, index) => {
    const isIncome = record.operation === "increase";
    const isTransfer = record.operation === "transfer";
    const transactionAmount = isIncome
      ? `+ ${symbol}${record.amount}`
      : isTransfer
      ? `${symbol}${record.amount}`
      : `- ${symbol}${record.amount}`;

    const amountColor = isIncome
      ? "text-green-500"
      : isTransfer
      ? "text-blue-500"
      : "text-red-500";
    const iconColor = isIncome
      ? "bg-green-500"
      : isTransfer
      ? "bg-blue-500"
      : "bg-red-500";

    const uniqueKey = `transaction-${record._id || index}-${new Date(
      record.createdAt
    ).getTime()}`;
    const formattedDate = new Date(record.createdAt).toLocaleDateString(
      "en-IN",
      { day: "numeric", month: "short", year: "numeric" }
    );

    return (
      <div
        key={uniqueKey}
        className="flex items-center justify-between border-b py-2"
      >
        <div className="flex items-center">
          <div
            className={`${iconColor} rounded-full w-8 h-8 flex items-center justify-center text-white mr-2`}
          >
            {getCategoryIcon(record.category)}
          </div>
          <div>
            <span>{record.category}</span>
            <br />
            <span className="text-gray-500 text-sm">Cash</span>
          </div>
        </div>
        <div>
          <span className={`font-bold ${amountColor}`}>
            {transactionAmount} {record.symbol || record.currency}
          </span>
          <br />
          <span className="text-gray-500 text-sm">{formattedDate}</span>
        </div>
      </div>
    );
  };

  const userDatas = JSON.parse(localStorage.getItem("userData"));
  const name = userDatas?.user?.fullname;
  const email = userDatas?.user?.email;

  return (
    <div className="text-black flex justify-center items-center">
      <div className="drawer relative w-[400px] shadow-main overflow-x-hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content relative">
          <label
            htmlFor="my-drawer"
            className="btn bg-transparent drawer-button absolute top-[100px] right-[-18px] z-10 w-[80px] border-none text-green-500 shadow-none hover:bg-transparent"
          >
            <MdOutlineMenuOpen
              className="text-5xl"
              onClick={() => notification.play()}
            />
          </label>

          <div className="relative">
            <div className="p-2 mb-4 bg-green-500  flex justify-between">
              <div>
                <p className="text-white">Available Cash</p>
                <p className="text-white text-2xl">
                  {symbol} {availableMoney.toLocaleString()} {currency}
                </p>
              </div>
              <div>
                <div className="flex">
                  <img
                    className="w-[40px] h-[40px] mr-2 rounded-full"
                    src={avatar}
                    alt="avatar"
                  />
                  <p className="text-white text-2xl">{name}</p>
                </div>
                <p className="text-white">{email}</p>
              </div>
            </div>

            <Suspense fallback={<div></div>}>
              <BarChart />
            </Suspense>

            <div className="mb-4  p-4 rounded-md shadow-main">
              <div className="text-xl font-bold mb-2">
                Last records overview
              </div>
              {transactions.length > 0 ? (
                <div className="h-[450px] overflow-y-scroll no-scrollbar">
                  {transactions
                    .slice()
                    .reverse()
                    .map((transaction, index) =>
                      renderRecord(transaction, index)
                    )}
                </div>
              ) : (
                <div className="min-h-screen flex justify-center items-center">
                  <div className="grid h-full max-h-[300px] min-h-[160px] w-full max-w-xs animate-pulse place-items-center rounded-lg bg-gray-300">
                    <span className="loading loading-ring loading-lg">
                      <path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"></path>
                    </span>
                    <p>No transaction data available</p>
                  </div>
                </div>
              )}
            </div>

            <Suspense fallback={<div>Loading balance trend...</div>}>
              <div className="mb-4 p-4 flex flex-col items-center text-center shadow-main w-full max-w-screen min-w-screen rounded-md">
                <div className="text-xl font-bold mb-2">Balance Trend</div>
                {balanceTrendData.length > 0 ? (
                  <ApexCharts
                    options={{
                      chart: {
                        type: "area",
                        zoom: { enabled: false },
                      },
                      xaxis: {
                        categories: balanceTrendData.map((data) => data.date),
                      },
                      yaxis: {
                        title: { text: "Balance" },
                      },
                      fill: {
                        opacity: 0.5,
                      },
                      responsive: [
                        {
                          breakpoint: 640,
                          options: {
                            chart: {
                              width: "100%",
                            },
                          },
                        },
                        {
                          breakpoint: 1024,
                          options: {
                            chart: {
                              width: "90%",
                            },
                          },
                        },
                        {
                          breakpoint: 1280,
                          options: {
                            chart: {
                              width: "80%",
                            },
                          },
                        },
                      ],
                    }}
                    series={[
                      {
                        name: "Balance",
                        data: balanceTrendData.map((data) => data.balance),
                      },
                    ]}
                    type="area"
                    className="w-full"
                  />
                ) : (
                  <div className="min-h-screen flex justify-center items-center">
                    <div className="grid h-full max-h-[300px] min-h-[160px] w-full max-w-xs animate-pulse place-items-center rounded-lg bg-gray-300">
                      <span className="loading loading-ring loading-lg">
                        <path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"></path>
                      </span>
                      <p>No balance trend data available</p>
                    </div>
                  </div>
                )}
              </div>
            </Suspense>
          </div>
        </div>

        <div className="drawer-side z-">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu text-base-content min-h-full w-70 p-4 bg-transparent backdrop-blur-lg">
            <div className="text-center text-4xl mb-10">Wallet App 👜</div>
            <li>
              <Link
                className="p-3 text-2xl rounded-md flex items-center justify-between text-white mb-3 border-[2px]"
                to="/manage"
                onClick={() => notification.play()}
              >
                <span>Update Cash Flow</span>
                <IoIosAdd className="text-2xl" />
              </Link>
            </li>
            <li>
              <Link
                className="p-3 text-2xl  rounded-md flex items-center justify-between text-white mb-3 border-[2px]"
                to="/saving-tracker"
                onClick={() => notification.play()}
              >
                <span>Saving Tracker</span>
                <MdOutlineSavings className="text-2xl" />
              </Link>
            </li>
            <li>
              <Link
                className="p-3 text-2xl rounded-md flex items-center justify-between text-white mb-3 border-[2px]"
                to="/calendar"
                onClick={() => notification.play()}
              >
                <span>Calendar </span>
                <SlCalender className="text-2xl" />
              </Link>
            </li>
            <li>
              <Link
                className="p-3 text-2xl rounded-md flex items-center justify-between text-white mb-3 border-[2px]"
                to="/sheet"
                onClick={() => notification.play()}
              >
                <span>XLSX Format </span>
                <BsFiletypeXlsx className="text-2xl" />
              </Link>
            </li>
            <li>
              <Link
                className="p-3 text-2xl rounded-md flex items-center justify-between text-white mb-3 border-[2px]"
                to="/ai"
                onClick={() => notification.play()}
              >
                <span>Talk To AI </span>
                <GiBrain className="text-2xl" />
              </Link>
            </li>
            <li>
              <button
                className="p-3 text-2xl rounded-md flex items-center justify-between text-white mb-3 border-[2px]"
                onClick={handleLogout}
              >
                <span>Logout</span>
                <MdLogout className="text-2xl" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
