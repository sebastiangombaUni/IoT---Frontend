import { useEffect, useState, useRef } from "react";
import SensorCard from "./components/SensorCard";
import AlertDisplay from "./components/AlertDisplay";
import Tabs from "./components/tabs";
import HistorialGrafico from "./components/HistorialGrafico";
import RiskIndicator from "./components/RiskIndicator";

// Ahora usando CORS Proxy para evitar el error de CORS
const BACKEND_URL = 'https://corsproxy.io/?https://backend-iot2-divine-cloud-2666.fly.dev';

// Tipo de datos de sensores
interface SensorData {
  temperatura: number;
  gas: number;
  llama: boolean;
  humo: boolean;
  timestamp: string;
}

function App() {
  const [data, setData] = useState<SensorData>({
    temperatura: 0,
    gas: 0,
    llama: false,
    humo: false,
    timestamp: new Date().toISOString(),
  });

  const [historial, setHistorial] = useState<SensorData[]>([]);
  const [historialGrafica, setHistorialGrafica] = useState<SensorData[]>([]);
  const [alarmaActiva, setAlarmaActiva] = useState(true);
  const [riskLevel, setRiskLevel] = useState<number>(0);

  const [tempTreshold, setTempTreshold] = useState(25.5);
  const [gasTreshold, setGasTreshold] = useState(400);
  const [alarmsEnabled, setAlarmsEnabled] = useState(true);
  const [dataPointingInterval, setDataPointingInterval] = useState(100);

  const historialRef = useRef<SensorData[]>([]);

  const actualizarHistorial = () => {
    fetch(`${BACKEND_URL}/sensors/20`)
      .then(res => res.json())
      .then((lista: { CreatedAt: string; Temperature: number; Gas: number; Flame: boolean }[]) => {
        const historicoAdaptado = lista.map(item => ({
          temperatura: item.Temperature,
          gas: item.Gas,
          llama: item.Flame,
          humo: item.Gas > 300,
          timestamp: item.CreatedAt,
        }));

        setHistorialGrafica(historicoAdaptado);
      })
      .catch(error => {
        console.error('Error al obtener historial:', error);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${BACKEND_URL}/sensor`)
        .then(res => res.json())
        .then((nuevoDato: { CreatedAt: string; Temperature: number; Gas: number; Flame: boolean }) => {
          const sensorData: SensorData = {
            temperatura: nuevoDato.Temperature,
            gas: nuevoDato.Gas,
            llama: nuevoDato.Flame,
            humo: nuevoDato.Gas > 300,
            timestamp: nuevoDato.CreatedAt,
          };

          setData(sensorData);
          setHistorial(prev => [...prev.slice(-19), sensorData]);
        })
        .catch(error => {
          console.error('Error al obtener datos del sensor:', error);
        });

      fetch(`${BACKEND_URL}/risk`)
        .then(res => res.json())
        .then((riskData: { CreatedAt: string; Risk: number }) => {
          setRiskLevel(riskData.Risk);
        })
        .catch(error => {
          console.error('Error al obtener riesgo:', error);
        });

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    historialRef.current = historial;
  }, [historial]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      actualizarHistorial();
    }, 60000);

    return () => clearInterval(intervalo);
  }, []);

  const guardarConfiguracion = () => {
    fetch(`${BACKEND_URL}/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TempTreshold: tempTreshold,
        GasTreshold: gasTreshold,
        AlarmsEnabled: alarmsEnabled,
        DataPointingInterval: dataPointingInterval,
      }),
    })
      .then(response => {
        if (response.ok) {
          alert("Configuración guardada exitosamente.");
        } else {
          alert("Error al guardar configuración.");
        }
      })
      .catch(error => {
        console.error("Error al guardar configuración:", error);
        alert("Error de red al guardar configuración.");
      });
  };

  const apagarAlarmaDesdeBackend = () => {
    fetch(`${BACKEND_URL}/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TempTreshold: tempTreshold,
        GasTreshold: gasTreshold,
        AlarmsEnabled: false,
        DataPointingInterval: dataPointingInterval,
      }),
    })
      .then(response => {
        if (response.ok) {
          setAlarmaActiva(false);
          setAlarmsEnabled(false);
          alert("Alarma apagada exitosamente.");
        } else {
          alert("Error al apagar alarma.");
        }
      })
      .catch(error => {
        console.error("Error al apagar alarma:", error);
        alert("Error de red al apagar alarma.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-6xl">
        <h1 className="text-4xl font-bold text-center mb-8">Monitor de Incendios - Cerros de Bogotá</h1>

        <RiskIndicator risk={riskLevel} />

        <Tabs labels={["Sensores en tiempo real", "Historial y gráfico"]}>
          <>
            <AlertDisplay risk={riskLevel} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <SensorCard title="Temperatura" value={data.temperatura} unit="°C" isDanger={data.temperatura > tempTreshold} />
              <SensorCard title="Gas" value={data.gas} unit="ppm" isDanger={data.gas > gasTreshold} />
              <SensorCard title="Llama" value={data.llama ? "Sí" : "No"} unit="" isDanger={data.llama} />
              <SensorCard title="Humo" value={data.humo ? "Sí" : "No"} unit="" isDanger={data.humo} />
            </div>

            <div className="mt-10 flex flex-col items-center gap-6">
              <div
                className={`px-6 py-3 rounded-xl text-lg font-semibold ${
                  alarmaActiva ? "bg-red-600 text-white" : "bg-green-600 text-white"
                }`}
              >
                {alarmaActiva ? "ALARMA ACTIVADA" : "ALARMA APAGADA"}
              </div>

              {alarmaActiva && (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg"
                  onClick={apagarAlarmaDesdeBackend}
                >
                  Apagar Alarma
                </button>
              )}

              <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-md mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Configuración de Límites</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-1">Temperatura Límite (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempTreshold}
                      onChange={(e) => setTempTreshold(parseFloat(e.target.value))}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Gas Límite (ppm)</label>
                    <input
                      type="number"
                      value={gasTreshold}
                      onChange={(e) => setGasTreshold(parseInt(e.target.value))}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={alarmsEnabled}
                      onChange={(e) => setAlarmsEnabled(e.target.checked)}
                      className="w-5 h-5"
                    />
                    <label className="text-gray-300">Alarmas Activadas</label>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-1">Intervalo de Muestreo (ms)</label>
                    <input
                      type="number"
                      value={dataPointingInterval}
                      onChange={(e) => setDataPointingInterval(parseInt(e.target.value))}
                      className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={guardarConfiguracion}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all duration-200"
                  >
                    Guardar Configuración
                  </button>
                </div>
              </div>
            </div>
          </>
          <>
            <div className="mb-4">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
                onClick={actualizarHistorial}
              >
                Actualizar Gráfica Manualmente
              </button>
            </div>

            <HistorialGrafico data={historialGrafica} />

            <h2 className="text-2xl font-semibold mt-8 mb-4">Historial Reciente</h2>

            <div className="overflow-x-auto rounded-lg shadow">
              <table className="w-full text-sm text-left text-gray-300 bg-gray-800">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                  <tr>
                    <th className="p-3">Hora</th>
                    <th className="p-3">Temperatura (°C)</th>
                    <th className="p-3">Gas (ppm)</th>
                    <th className="p-3">Llama</th>
                    <th className="p-3">Humo</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((item, i) => (
                    <tr key={i} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="p-3">{new Date(item.timestamp).toLocaleTimeString()}</td>
                      <td className="p-3">{item.temperatura}</td>
                      <td className="p-3">{item.gas}</td>
                      <td className="p-3">{item.llama ? "Sí" : "No"}</td>
                      <td className="p-3">{item.humo ? "Sí" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
