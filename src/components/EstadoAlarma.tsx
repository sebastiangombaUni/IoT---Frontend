interface EstadoAlarmaProps {
  activa: boolean;
  onApagar: () => void;
}

function EstadoAlarma({ activa, onApagar }: EstadoAlarmaProps) {
  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      <div
        className={`px-6 py-3 rounded-xl text-lg font-semibold ${
          activa ? "bg-red-600 text-white" : "bg-green-600 text-white"
        }`}
      >
        {activa ? "ALARMA ACTIVADA" : "ALARMA APAGADA"}
      </div>

      {activa && (
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg"
          onClick={onApagar}
        >
          Apagar Alarma
        </button>
      )}
    </div>
  );
}

export default EstadoAlarma;
