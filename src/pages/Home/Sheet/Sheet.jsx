import { useEffect, useState } from "react";
import axios from "axios";
import DataGrid from "react-data-grid";
import "react-data-grid/lib/styles.css";
import * as XLSX from "xlsx";

const TransactionGrids = () => {
  const [expenses, setExpenses] = useState([]);
  const [profits, setProfits] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [symbol, setSymbol] = useState("");

  const columns = [
    {
      key: "createdAt",
      name: "Date",
      width: 80,
    },
    {
      key: "category",
      name: "Category",
      width: 130,
    },
    {
      key: "amount",
      name: "Amount",
      width: 90,
      formatter: ({ row }) => row.amount.toLocaleString(),
    },
  ];

  const fetchTransactions = async () => {
    try {
      const userDatas = JSON.parse(localStorage.getItem("userData"));
      const userId = userDatas?.user?._id;

      if (!userId) {
        console.error("User ID not found in localStorage");
        return;
      }

      const response = await axios.get(
        `https://wallet-backend-silk-ten.vercel.app/api/wallet/transaction/${userId}`
      );
      setSymbol(response.data.data.symbol);
      console.log(symbol);
      if (response.data?.data?.transactions) {
        const transactions = response.data.data.transactions.map(
          (transaction) => ({
            id: Math.random().toString(36).substr(2, 9),
            category: transaction.category,
            amount: transaction.amount,
            operation:
              transaction.operation === "reduce"
                ? "Expenses"
                : transaction.operation === "increase"
                ? "Profit"
                : "Transfer",
            createdAt: new Date(transaction.createdAt).toLocaleDateString(),
          })
        );

        setExpenses(transactions.filter((t) => t.operation === "Expenses"));
        setProfits(transactions.filter((t) => t.operation === "Profit"));
        setTransfers(transactions.filter((t) => t.operation === "Transfer"));
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const calculateTotal = (transactions) => {
    return transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString();
  };

  const handleDownload = (data, title) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);
    XLSX.writeFile(workbook, `${title.toLowerCase()}_transactions.xlsx`);
  };

  const GridSection = ({ title, data, color, bgColor }) => (
    <div className=" rounded-lg overflow-hidden shadow-main bg-white w-[300px]">
      <div className={`p-4 ${bgColor}`}>
        <div className="flex justify-between items-center">
          <h2 className={`text-xl font-bold ${color}`}>{title}</h2>
          <div className="flex items-center gap-4 flex-col-reverse">
            <p className={`font-semibold ${color}`}>
              Total: {symbol}
              {calculateTotal(data)}
            </p>
            <button
              onClick={() => handleDownload(data, title)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      </div>
      <div style={{ width: "100%", height: "300px" }}>
        <DataGrid
          columns={columns}
          rows={data}
          style={{
            height: "100%",
            width: "100%",
          }}
          className="rdg-light no-scrollbar"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-center text-3xl font-bold mb-8 text-gray-800">
        Transaction Summary
      </h1>

      <div className="flex flex-col items-center gap-6">
        <GridSection
          title="Expenses"
          data={expenses}
          color="text-red-600"
          bgColor="bg-red-50"
        />

        <GridSection
          title="Profits"
          data={profits}
          color="text-green-600"
          bgColor="bg-green-50"
        />

        <GridSection
          title="Transfers"
          data={transfers}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
      </div>
    </div>
  );
};

export default TransactionGrids;
