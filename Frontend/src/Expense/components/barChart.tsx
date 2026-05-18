import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type DataType = {
  month: string;
  total: number;
};

export default function ExpenseChart({ data }: { data: DataType[] }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 700,
        margin: "20px auto",
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
