import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaMoneyBillAlt,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
} from "react-icons/fa";

// Dynamically import sound
const sound = (await import("../../../assets/1.mp3")).default;

// Dynamically import ApexCharts
const ApexCharts = (await import("react-apexcharts")).default;

export default function BarChart() {
  const [expensesData, setExpensesData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [transferData, setTransferData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const nav = useNavigate();
  const notification = new Audio(sound);

  useEffect(() => {
    const fetchWalletData = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData.user._id;

      try {
        const response = await axios.get(
          `https://wallet-backend-silk-ten.vercel.app/api/wallet/transaction/${userId}`
        );
        const walletData = response.data.data;

        // Process transactions
        const transactions = walletData.transactions;

        // Filter transactions by type
        const expenses = transactions.filter(
          (transaction) => transaction.operation === "reduce"
        );
        const income = transactions.filter(
          (transaction) => transaction.operation === "increase"
        );
        const transfers = transactions.filter(
          (transaction) => transaction.operation === "transfer"
        );

        setExpensesData(expenses);
        setIncomeData(income);
        setTransferData(transfers);

        // Set currency symbol
        setCurrencySymbol(walletData.symbol);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, []);

  // Calculate totals
  const incomeTotal = incomeData.reduce((sum, entry) => sum + entry.amount, 0);
  const expenseTotal = expensesData.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );
  const transferTotal = transferData.reduce(
    (sum, entry) => sum + entry.amount,
    0
  );

  if (!incomeData.length && !expensesData.length && !transferData.length) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="grid h-full max-h-[300px] min-h-[160px] w-full max-w-xs animate-pulse place-items-center rounded-lg bg-gray-300">
          <span className="loading loading-ring loading-lg"></span>
          <p className="p-0 m-0">No transaction data available</p>
          <p>Click on Menu and Update Cash Flow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[400px] min-w-[350px]">
      <div className="mb-4 p-4 flex flex-col items-center text-center shadow-main rounded-md">
        <div className="text-xl font-bold mb-2">Your Cash Flow</div>
        <Suspense
          fallback={
            <div className="min-h-screen flex justify-center">
              <span className="loading loading-dots loading-lg"></span>
            </div>
          }
        >
          <ApexCharts
            options={{
              chart: { type: "bar", height: 350 },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "80%",
                  distributed: true,
                },
              },
              dataLabels: { enabled: false },
              xaxis: {
                categories: ["Income", "Expenses", "Transfers"],
                labels: {
                  style: {
                    fontSize: "14px",
                    colors: ["green", "red", "blue"],
                  },
                },
              },
              yaxis: { title: { text: `Amount (${currencySymbol})` } },
              colors: ["green", "red", "blue"],
              legend: { position: "bottom" },
            }}
            series={[
              {
                name: "Cash Flow",
                data: [incomeTotal, expenseTotal, transferTotal],
              },
            ]}
            type="bar"
            height={400}
          />
        </Suspense>
        <div className="flex items-center mt-4 text-sm">
          <div
            className="flex items-center mx-1 sm:mx-3 cursor-pointer"
            onClick={() => {
              nav("/charts-info/incomes");
              notification.play();
            }}
          >
            <FaArrowUp className="text-green-500 sm:mr-1" size={20} />
            <span>
              {currencySymbol}
              {incomeTotal.toLocaleString()}
            </span>
          </div>
          <div
            className="flex items-center mx-1 sm:mx-3 cursor-pointer"
            onClick={() => {
              nav("/charts-info/expenses");
              notification.play();
            }}
          >
            <FaArrowDown className="text-red-500 sm:mr-1" size={20} />
            <span>
              {currencySymbol}
              {expenseTotal.toLocaleString()}
            </span>
          </div>
          <div
            className="flex items-center mx-1 sm:mx-3 cursor-pointer"
            onClick={() => {
              nav("/charts-info/transfers");
              notification.play();
            }}
          >
            <FaExchangeAlt className="text-blue-500 sm:mr-1" size={20} />
            <span>
              {currencySymbol}
              {transferTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center mx-1 sm:mx-3">
            <FaMoneyBillAlt className="text-yellow-500 sm:mr-1" size={20} />
            <span>
              {currencySymbol}
              {(incomeTotal - expenseTotal).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
