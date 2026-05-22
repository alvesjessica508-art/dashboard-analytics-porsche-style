import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Search, Filter, X } from "lucide-react";

// EXEMPLO DE DADOS
// depois você troca pelo JSON vindo do Excel
const rawData = [
  {
    city: "Seattle",
    model: "Macan S",
    payMethod: "Transferência",
    modelYear: 2024,
    period: "Jan",
    sales: 32,
  },
  {
    city: "Seattle",
    model: "911 Turbo S",
    payMethod: "Financiamento",
    modelYear: 2024,
    period: "Fev",
    sales: 22,
  },
  {
    city: "Austin",
    model: "Cayenne Coupe",
    payMethod: "PIX",
    modelYear: 2023,
    period: "Mar",
    sales: 40,
  },
  {
    city: "Boston",
    model: "Taycan 4S",
    payMethod: "Cartão",
    modelYear: 2024,
    period: "Abr",
    sales: 28,
  },
];

export default function App() {
  const [searchModel, setSearchModel] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedPayment, setSelectedPayment] =
    useState("Todos");

  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const modelMatch =
        item.model
          .toLowerCase()
          .includes(searchModel.toLowerCase());

      const cityMatch =
        item.city
          .toLowerCase()
          .includes(searchCity.toLowerCase());

      const yearMatch =
        selectedYear === "Todos" ||
        item.modelYear === Number(selectedYear);

      const paymentMatch =
        selectedPayment === "Todos" ||
        item.payMethod === selectedPayment;

      return (
        modelMatch &&
        cityMatch &&
        yearMatch &&
        paymentMatch
      );
    });
  }, [
    searchModel,
    searchCity,
    selectedYear,
    selectedPayment,
  ]);

  const salesByCity = useMemo(() => {
    const grouped = {};

    filteredData.forEach((item) => {
      grouped[item.city] =
        (grouped[item.city] || 0) + item.sales;
    });

    return Object.entries(grouped).map(
      ([city, sales]) => ({
        city,
        sales,
      })
    );
  }, [filteredData]);

  const paymentData = useMemo(() => {
    const grouped = {};

    filteredData.forEach((item) => {
      grouped[item.payMethod] =
        (grouped[item.payMethod] || 0) +
        item.sales;
    });

    return Object.entries(grouped).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [filteredData]);

  const trendData = useMemo(() => {
    const grouped = {};

    filteredData.forEach((item) => {
      grouped[item.period] =
        (grouped[item.period] || 0) +
        item.sales;
    });

    return Object.entries(grouped).map(
      ([period, sales]) => ({
        period,
        sales,
      })
    );
  }, [filteredData]);

  const totalSales = filteredData.reduce(
    (acc, item) => acc + item.sales,
    0
  );

  const topCity =
    salesByCity.sort(
      (a, b) => b.sales - a.sales
    )[0]?.city || "-";

  const topModel =
    filteredData.sort(
      (a, b) => b.sales - a.sales
    )[0]?.model || "-";

  return (
    <div className="min-h-screen bg-[#111111] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-80 bg-[#1B1B1B] border-r border-zinc-800 p-6">
        <div className="flex items-center gap-2 mb-8">
          <Filter size={20} />
          <h1 className="text-xl font-light">
            Filtros
          </h1>
        </div>

        {/* Buscar Modelo */}
        <div className="mb-5">
          <label className="text-sm text-zinc-400">
            Buscar Modelo
          </label>

          <div className="relative mt-2">
            <Search
              size={18}
              className="absolute top-3 left-3 text-zinc-500"
            />

            <input
              type="text"
              placeholder="Macan, 911..."
              value={searchModel}
              onChange={(e) =>
                setSearchModel(e.target.value)
              }
              className="w-full bg-zinc-900 rounded-xl pl-10 p-3 border border-zinc-700"
            />
          </div>
        </div>

        {/* Buscar Cidade */}
        <div className="mb-5">
          <label className="text-sm text-zinc-400">
            Buscar Cidade
          </label>

          <input
            type="text"
            placeholder="Seattle..."
            value={searchCity}
            onChange={(e) =>
              setSearchCity(e.target.value)
            }
            className="w-full bg-zinc-900 rounded-xl p-3 mt-2 border border-zinc-700"
          />
        </div>

        {/* Year */}
        <select
          className="w-full bg-zinc-900 p-3 rounded-xl mb-4"
          onChange={(e) =>
            setSelectedYear(e.target.value)
          }
        >
          <option>Todos</option>
          <option>2023</option>
          <option>2024</option>
        </select>

        {/* Payment */}
        <select
          className="w-full bg-zinc-900 p-3 rounded-xl"
          onChange={(e) =>
            setSelectedPayment(
              e.target.value
            )
          }
        >
          <option>Todos</option>
          <option>PIX</option>
          <option>Transferência</option>
          <option>Cartão</option>
          <option>Financiamento</option>
        </select>

        <button
          className="mt-6 w-full bg-white text-black rounded-xl p-3 font-medium"
          onClick={() => {
            setSearchModel("");
            setSearchCity("");
            setSelectedYear("Todos");
            setSelectedPayment("Todos");
          }}
        >
          Limpar filtros
        </button>
      </aside>

      {/* CONTEÚDO */}
      <main className="flex-1 p-8 bg-[#151515]">
        <h1 className="text-4xl font-light mb-8">
          Car Sales Intelligence
        </h1>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          <Card
            title="Total Vendas"
            value={totalSales}
          />
          <Card
            title="Cidade Líder"
            value={topCity}
          />
          <Card
            title="Modelo Líder"
            value={topModel}
          />
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-2 gap-5">
          <ChartCard title="Vendas por Cidade">
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <BarChart data={salesByCity}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Métodos de Pagamento">
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  outerRadius={100}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Evolução de Vendas">
            <ResponsiveContainer
              width="100%"
              height={300}
            >
              <AreaChart data={trendData}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Area dataKey="sales" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-[#1E1E1E] rounded-3xl p-6 border border-zinc-800">
      <p className="text-zinc-400 text-sm">
        {title}
      </p>
      <h2 className="text-3xl mt-3 font-light">
        {value}
      </h2>
    </div>
  );
}

function ChartCard({
  title,
  children,
}) {
  return (
    <div className="bg-[#1E1E1E] rounded-3xl p-6 border border-zinc-800">
      <h2 className="text-xl font-light mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}