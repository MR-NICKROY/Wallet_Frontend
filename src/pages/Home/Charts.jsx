import ApexCharts from "react-apexcharts";

const AllCharts = () => {
  const lineChartOptions = {
    chart: { type: "line" },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    colors: ["#FF5733", "#33FF57"],
  };

  const areaChartOptions = {
    chart: { type: "area" },
    xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"] },
    colors: ["#FF6347", "#FFD700"],
  };

  const barChartOptions = {
    chart: { type: "bar" },
    xaxis: { categories: ["A", "B", "C", "D", "E"] },
    colors: ["#00BFFF", "#FF6347", "#FFD700", "#4CAF50"],
  };

  const scatterChartOptions = {
    chart: { type: "scatter" },
    xaxis: { categories: ["A", "B", "C", "D", "E"] },
    colors: ["#FF5733", "#33FF57"],
  };

  const bubbleChartOptions = {
    chart: { type: "bubble" },
    xaxis: { categories: ["A", "B", "C", "D", "E"] },
    colors: ["#FF6347", "#FFD700"],
  };

  const pieChartOptions = {
    chart: { type: "pie" },
    labels: ["Apple", "Banana", "Orange", "Grapes"],
    colors: ["#FF5733", "#33FF57", "#FF6347", "#FFD700"],
  };

  const donutChartOptions = {
    chart: { type: "donut" },
    labels: ["Category 1", "Category 2", "Category 3", "Category 4"],
    colors: ["#FF6347", "#FFD700", "#4CAF50", "#00BFFF"],
  };

  const radarChartOptions = {
    chart: { type: "radar" },
    xaxis: {
      categories: ["Math", "Science", "History", "English", "Geography"],
    },
    colors: ["#FF5733", "#33FF57"],
  };

  const radialBarChartOptions = {
    chart: { type: "radialBar" },
    colors: ["#FF5733", "#33FF57"],
    labels: ["Math", "Science", "History", "English"],
  };

  const heatmapChartOptions = {
    chart: { type: "heatmap" },
    colors: ["#FF5733", "#33FF57", "#FF6347"],
  };

  const boxplotChartOptions = {
    chart: { type: "boxPlot" },
    colors: ["#FF5733", "#33FF57"],
  };

  const candlestickChartOptions = {
    chart: { type: "candlestick" },
    colors: ["#FF5733", "#33FF57"],
  };

  const polarAreaChartOptions = {
    chart: { type: "polarArea" },
    colors: ["#FF5733", "#33FF57", "#FF6347"],
    labels: ["North", "East", "South", "West"],
  };

  const treemapChartOptions = {
    chart: { type: "treemap" },
    colors: ["#FF5733", "#33FF57"],
  };

  const chartData = {
    line: [
      {
        name: "Series 1",
        data: [34, 44, 54, 21, 12, 43],
      },
      {
        name: "Series 2",
        data: [23, 33, 43, 53, 63, 73],
      },
    ],
    area: [
      {
        name: "Series 1",
        data: [34, 44, 54, 21, 12, 43],
      },
    ],
    bar: [
      {
        name: "Series 1",
        data: [45, 52, 38, 24, 33],
      },
    ],
    scatter: [
      {
        name: "Series 1",
        data: [
          { x: 1, y: 2 },
          { x: 2, y: 3 },
          { x: 3, y: 4 },
        ],
      },
    ],
    bubble: [
      {
        name: "Series 1",
        data: [
          { x: 1, y: 2, z: 10 },
          { x: 2, y: 3, z: 20 },
          { x: 3, y: 4, z: 30 },
        ],
      },
    ],
    pie: [44, 55, 41, 37],
    donut: [30, 20, 50, 25],
    radar: [
      {
        name: "Series 1",
        data: [60, 70, 80, 90, 100],
      },
      {
        name: "Series 2",
        data: [40, 50, 60, 70, 80],
      },
    ],
    radialBar: [60, 70, 80, 90],
    heatmap: [
      {
        name: "Heatmap",
        data: [
          { x: "A", y: 10, value: 30 },
          { x: "B", y: 20, value: 60 },
          { x: "C", y: 30, value: 90 },
          { x: "D", y: 40, value: 100 },
          { x: "E", y: 50, value: 110 },
        ],
      },
    ],
    boxplot: [
      { x: "Category 1", y: [23, 35, 50, 70, 95] },
      { x: "Category 2", y: [30, 40, 60, 80, 100] },
    ],
    candlestick: [
      { x: new Date(2025, 0, 1), y: [51, 58, 52, 57] },
      { x: new Date(2025, 0, 2), y: [53, 60, 54, 59] },
    ],
    polarArea: [30, 40, 45, 50],
    treemap: [
      { x: "Category 1", y: 30 },
      { x: "Category 2", y: 40 },
    ],
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">Line Chart</h3>
        <ApexCharts
          options={lineChartOptions}
          series={chartData.line}
          type="line"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">Area Chart</h3>
        <ApexCharts
          options={areaChartOptions}
          series={chartData.area}
          type="area"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">Bar Chart</h3>
        <ApexCharts
          options={barChartOptions}
          series={chartData.bar}
          type="bar"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">
          Scatter Chart
        </h3>
        <ApexCharts
          options={scatterChartOptions}
          series={chartData.scatter}
          type="scatter"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">Bubble Chart</h3>
        <ApexCharts
          options={bubbleChartOptions}
          series={chartData.bubble}
          type="bubble"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">Pie Chart</h3>
        <ApexCharts
          options={pieChartOptions}
          series={chartData.pie}
          type="pie"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">Donut Chart</h3>
        <ApexCharts
          options={donutChartOptions}
          series={chartData.donut}
          type="donut"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">Radar Chart</h3>
        <ApexCharts
          options={radarChartOptions}
          series={chartData.radar}
          type="radar"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">
          Radial Bar Chart
        </h3>
        <ApexCharts
          options={radialBarChartOptions}
          series={chartData.radialBar}
          type="radialBar"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">
          Heatmap Chart
        </h3>
        <ApexCharts
          options={heatmapChartOptions}
          series={chartData.heatmap}
          type="heatmap"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">
          Boxplot Chart
        </h3>
        <ApexCharts
          options={boxplotChartOptions}
          series={chartData.boxplot}
          type="boxPlot"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">
          Candlestick Chart
        </h3>
        <ApexCharts
          options={candlestickChartOptions}
          series={chartData.candlestick}
          type="candlestick"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">
          Polar Area Chart
        </h3>
        <ApexCharts
          options={polarAreaChartOptions}
          series={chartData.polarArea}
          type="polarArea"
          height={350}
        />
      </div>

      <div className="chart-container bg-white shadow-md rounded-lg p-4">
        <h3 className="text-center text-xl font-semibold mb-4">
          Treemap Chart
        </h3>
        <ApexCharts
          options={treemapChartOptions}
          series={chartData.treemap}
          type="treemap"
          height={350}
        />
      </div>
    </div>
  );
};

export default AllCharts;
