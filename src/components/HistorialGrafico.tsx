import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  } from 'recharts';
  
  function HistorialGrafico({ data }: { data: any[] }) {
    return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
            <YAxis />
            <Tooltip labelFormatter={(t) => new Date(t).toLocaleTimeString()} />
            <Legend />
            <Line type="monotone" dataKey="temperatura" stroke="#ef4444" name="Temp °C" />
            <Line type="monotone" dataKey="gas" stroke="#3b82f6" name="Gas ppm" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  export default HistorialGrafico;
  