import { useEffect, useState } from "react";

interface WeatherData {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

export default function WeatherForecast() {
    const [data, setData] = useState<WeatherData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/weatherforecast") // proxy verso il backend .NET
            .then((res) => {
                if (!res.ok) throw new Error("Errore nella chiamata API");
                return res.json();
            })
            .then((result) => setData(result))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>

            {loading ? (
                <p>Caricamento...</p>
            ) : (
                <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-gray-700 text-gray-200">
                            <th className="px-4 py-2 text-left">Data</th>
                            <th className="px-4 py-2 text-left">Temp. (°C)</th>
                            <th className="px-4 py-2 text-left">Temp. (°F)</th>
                            <th className="px-4 py-2 text-left">Descrizione</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((w, i) => (
                            <tr key={i} className="border-t border-gray-700 hover:bg-gray-700">
                                <td className="px-4 py-2">{new Date(w.date).toLocaleDateString()}</td>
                                <td className="px-4 py-2">{w.temperatureC}</td>
                                <td className="px-4 py-2">{w.temperatureF}</td>
                                <td className="px-4 py-2">{w.summary}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
