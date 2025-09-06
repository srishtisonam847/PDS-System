import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface ChartComponentProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  title: string;
  height?: number;
}

export default function ChartComponent({ type, data, title, height = 300 }: ChartComponentProps) {
  const colors = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rice" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="wheat" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="sugar" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="kerosene" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="shop" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="rice" fill="#10b981" />
              <Bar dataKey="wheat" fill="#f59e0b" />
              <Bar dataKey="sugar" fill="#3b82f6" />
              <Bar dataKey="kerosene" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="shadow-sm border border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}
