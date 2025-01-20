import { useState, useEffect } from "react";

const CalendarApp = () => {
  const [FullCalendar, setFullCalendar] = useState(null);
  const [plugins, setPlugins] = useState([]);
  const [events, setEvents] = useState([]);

  // Dynamic imports for FullCalendar and its plugins
  useEffect(() => {
    const loadFullCalendar = async () => {
      try {
        const fullCalendarModule = await import("@fullcalendar/react");
        const dayGridPlugin = await import("@fullcalendar/daygrid");
        const timeGridPlugin = await import("@fullcalendar/timegrid");
        const interactionPlugin = await import("@fullcalendar/interaction");

        setFullCalendar(() => fullCalendarModule.default); // Properly set as a React component
        setPlugins([
          dayGridPlugin.default,
          timeGridPlugin.default,
          interactionPlugin.default,
        ]);
      } catch (error) {
        console.error("Error loading FullCalendar or its plugins:", error);
      }
    };

    loadFullCalendar();
  }, []);

  // Function to fetch transactions from the backend
  const fetchTransactions = async () => {
    try {
      const userDatas = JSON.parse(localStorage.getItem("userData"));
      const userId = userDatas?.user?._id;

      if (!userId) {
        console.error("User ID not found");
        return;
      }

      const response = await fetch(
        `https://wallet-backend-silk-ten.vercel.app/api/wallet/transaction/${userId}`
      );
      const data = await response.json();

      if (data?.data?.transactions) {
        const groupedTransactions = {};

        data.data.transactions.forEach((transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          transactionDate.setHours(0, 0, 0, 0); // Normalize to midnight

          const dateKey = transactionDate.toISOString();

          if (!groupedTransactions[dateKey]) {
            groupedTransactions[dateKey] = {
              increase: 0,
              reduce: 0,
              exchange: 0,
            };
          }

          if (transaction.operation === "increase") {
            groupedTransactions[dateKey].increase += transaction.amount;
          } else if (transaction.operation === "reduce") {
            groupedTransactions[dateKey].reduce += transaction.amount;
          } else {
            groupedTransactions[dateKey].exchange += transaction.amount;
          }
        });

        const mappedEvents = Object.keys(groupedTransactions).flatMap(
          (dateKey) => {
            const date = new Date(dateKey);

            const eventsForDate = [];

            if (groupedTransactions[dateKey].increase > 0) {
              eventsForDate.push({
                id: `${dateKey}-increase`,
                title: `Income: ${data.data.symbol}${groupedTransactions[dateKey].increase}`,
                start: date,
                color: "green",
                allDay: true,
              });
            }

            if (groupedTransactions[dateKey].reduce > 0) {
              eventsForDate.push({
                id: `${dateKey}-reduce`,
                title: `Expense: ${data.data.symbol}${groupedTransactions[dateKey].reduce}`,
                start: date,
                color: "red",
                allDay: true,
              });
            }

            if (groupedTransactions[dateKey].exchange > 0) {
              eventsForDate.push({
                id: `${dateKey}-exchange`,
                title: `Exchange: ${data.data.symbol}${groupedTransactions[dateKey].exchange}`,
                start: date,
                color: "blue",
                allDay: true,
              });
            }

            return eventsForDate;
          }
        );

        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Render Function
  if (!FullCalendar || plugins.length === 0) {
    return (
      <div className="min-h-screen flex justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 text- min-h-screen max-w-[400px] min-w-[350px] overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">My Financial Calendar</h1>
      <FullCalendar
        plugins={plugins}
        initialView="dayGridMonth"
        events={events}
        eventContent={(arg) => (
          <div className="flex items-center gap-2">
            <span>{arg.event.title}</span>
          </div>
        )}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        contentHeight="auto"
        editable={true}
        selectable={true}
      />
    </div>
  );
};

export default CalendarApp;
