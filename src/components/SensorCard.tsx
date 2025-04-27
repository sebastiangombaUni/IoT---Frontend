interface SensorCardProps {
    title: string;
    value: number | string;
    unit: string;
    isDanger: boolean;
  }
  
  function SensorCard({ title, value, unit, isDanger }: SensorCardProps) {
    const displayValue =
      typeof value === "number" && title.toLowerCase().includes("temperatura")
        ? value.toFixed(1)
        : value;
  
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center justify-center transition hover:scale-105">
        <h3 className="text-lg font-semibold mb-2 text-gray-300">{title}</h3>
        <div className={`text-4xl font-bold ${isDanger ? "text-red-500" : "text-blue-400"}`}>
          {displayValue} {unit}
        </div>
      </div>
    );
  }
  
  export default SensorCard;
  