import { useEffect, useState, Suspense } from "react";
import { useParams } from "react-router-dom";

// Dynamically import axios
const axios = (await import("axios")).default;

// Dynamically import ApexCharts
const ApexCharts = (await import("react-apexcharts")).default;

// Dynamically import icons
const {
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
} = await import("react-icons/fa");

const ChartsInfo = () => {
  const { category } = useParams();
  const [pieChartData, setPieChartData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData.user._id;

        const response = await axios.get(
          `https://wallet-backend-silk-ten.vercel.app/api/wallet/transaction/${userId}`
        );

        const transactionData = response.data.data.transactions;
        setCurrencySymbol(response.data.data.symbol);

        let filteredTransactions = [];
        if (category === "incomes") {
          filteredTransactions = transactionData.filter(
            (transaction) => transaction.operation === "increase"
          );
        } else if (category === "expenses") {
          filteredTransactions = transactionData.filter(
            (transaction) => transaction.operation === "reduce"
          );
        } else if (category === "transfers") {
          filteredTransactions = transactionData.filter(
            (transaction) => transaction.operation === "transfer"
          );
          console.log("Filtered Transfers: ", filteredTransactions); // Check filtered data
        }

        // Aggregate transactions by category
        const aggregatedData = filteredTransactions.reduce(
          (acc, transaction) => {
            const categoryName = transaction.category;
            if (!acc[categoryName]) {
              acc[categoryName] = 0;
            }
            acc[categoryName] += transaction.amount;
            return acc;
          },
          {}
        );

        // Convert aggregated data to pie chart format
        const pieData = Object.entries(aggregatedData).map(([name, value]) => ({
          name,
          value,
        }));

        setPieChartData(pieData);
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchData();
  }, [category]);

  if (!category) {
    return <p>No category selected.</p>;
  }

  const series = pieChartData.map((data) => data.value);
  const labels = pieChartData.map((data) => data.name);
  const totalAmount = series.reduce((acc, value) => acc + value, 0);

  const chartOptions = {
    chart: {
      type: "pie",
      width: 400, // Set fixed width
      height: 400, // Set fixed height
    },
    labels: labels,
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      formatter: function (seriesName, opts) {
        const percentage = (
          (opts.w.globals.series[opts.seriesIndex] / totalAmount) *
          100
        ).toFixed(2);
        return `${seriesName} - ${percentage}%`;
      },
      offsetY: 7,
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
    },
    colors: ["#1E88E5", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A"],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return `${currencySymbol}${value.toFixed(2)} (${(
            (value / totalAmount) *
            100
          ).toFixed(2)}%)`;
        },
      },
    },
    responsive: [], // Remove any responsiveness to maintain a fixed size
  };

  const renderRecord = (record, index) => {
    const isIncome = record.operation === "increase";
    const isTransfer = record.operation === "transfer";
    let transactionAmount;

    if (isIncome) {
      transactionAmount = `+ ${currencySymbol}${record.amount}`;
    } else if (isTransfer) {
      transactionAmount = `${currencySymbol}${record.amount}`;
    } else {
      transactionAmount = `- ${currencySymbol}${record.amount}`;
    }

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
            {transactionAmount}
          </span>
          <br />
          <span className="text-gray-500 text-sm">{formattedDate}</span>
        </div>
      </div>
    );
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
      case "vehicle-expenses":
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

  return (
    <div className="text-black min-h-screen flex justify-center items-center flex-col">
      <div className="shadow-main">
        <h2 className="text-center pt-2 text-2xl font-mono font-bold">
          {category.charAt(0).toUpperCase() + category.slice(1)} Transactions
        </h2>

        {pieChartData.length > 0 ? (
          <>
            <div>
              <Suspense fallback={<div>Loading Chart...</div>}>
                <ApexCharts
                  options={chartOptions}
                  series={series}
                  type="pie"
                  width={350} // Fixed width
                  height={350} // Fixed height
                />
              </Suspense>
            </div>

            <div className="mt-10"></div>
          </>
        ) : (
          <p>No transactions found for this category.</p>
        )}

        <div className="mb-4  p-4">
          <div className="text-xl font-bold mb-2 text-center">
            {category.charAt(0).toUpperCase() + category.slice(1)} Records
            Overview
          </div>

          <div className="overflow-y-scroll no-scrollbar h-[250px]">
            {transactions.map((transaction, index) =>
              renderRecord(transaction, index)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsInfo;
