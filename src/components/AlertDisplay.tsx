interface AlertDisplayProps {
    risk: number;
  }
  
  function AlertDisplay({ risk }: AlertDisplayProps) {
    if (risk === 3) {
      return (
        <div className="bg-red-600 text-white font-bold p-4 rounded-xl text-center mb-6 shadow-md">
          ¡Incendio Detectado!
        </div>
      );
    }
  
    if (risk === 2) {
      return (
        <div className="bg-yellow-500 text-gray-900 font-semibold p-4 rounded-xl text-center mb-6 shadow-md">
          Precaución: Condiciones Moderadas
        </div>
      );
    }
  
    return (
      <div className="bg-green-600 text-white font-semibold p-4 rounded-xl text-center mb-6 shadow-md">
        Todo en condiciones normales
      </div>
    );
  }
  
  export default AlertDisplay;
  