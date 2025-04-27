interface RiskIndicatorProps {
    risk: number;
  }
  
  function RiskIndicator({ risk }: RiskIndicatorProps) {
    let color = "";
    let mensaje = "";
  
    switch (risk) {
      case 0:
        color = "bg-green-500"; // Verde fuerte
        mensaje = "Riesgo Bajo";
        break;
      case 1:
        color = "bg-yellow-400"; // Amarillo fuerte
        mensaje = "Riesgo Moderado";
        break;
      case 2:
        color = "bg-red-600"; // Rojo fuerte
        mensaje = "Riesgo Alto";
        break;
      default:
        color = "bg-gray-600"; // Gris si no hay información
        mensaje = "Sin Información";
        break;
    }
  
    return (
      <div className="flex justify-center mb-8">
        <div className={`w-full max-w-md p-6 rounded-xl text-center shadow-lg ${color} text-white`}>
          <h2 className="text-2xl font-bold">{mensaje}</h2>
        </div>
      </div>
    );
  }
  
  export default RiskIndicator;
  