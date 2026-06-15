import "./index.css";
import { useState, useEffect } from "react";

// 🟢 FIX 1: Function ko component ke bracket se BAHIR aur sab se upar kar diya
// Standard function syntax use kiya hai taake hoisting ka koi rona na rahe
function getWeatherIconName(code) {
  // 0 = Bilkul saaf aasman (File: sunny.png)
  if (code === 0) return "sunny";

  // 1, 2 = Halka baadel aur dhoop (File: cloudy_s_sunny.png)
  if (code >= 1 && code <= 2) return "cloudy_s_sunny";

  // 3 = Mukammal baadal (File: cloudy.png)
  if (code === 3) return "cloudy";

  // 45, 48 = Dhund (File: fog.png)
  if (code >= 45 && code <= 48) return "fog";

  // 51 se 67 = Barish (File: rain.png)
  if (code >= 51 && code <= 67) return "rain";

  // 71 se 77 = Barf bari (File: snow.png)
  if (code >= 71 && code <= 77) return "snow";

  // 80 se 82 = Tez barish (File: rain_heavy.png)
  if (code >= 80 && code <= 82) return "rain_heavy";

  // 95 se 99 = Toofan aur garaj chamak (File: thunderstorms.png)
  if (code >= 95 && code <= 99) return "thunderstorms";

  // Safe side backup
  return "cloudy";
}

export default function WeatherApp() {
  // 🎯 Saari States
  const [inputCity, setInputCity] = useState("");
  const [city, setCity] = useState("Faisalabad");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🛰️ Fetch Function
  const fetchWeather = async (cityName) => {
    setLoading(true);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=en&format=json`,
      );
      const geoData = await geoRes.json();

      if (!geoData.results) {
        alert("City not found check for typos");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,visibility,weather_code`,
      );
      const weatherData = await weatherRes.json();

      setWeather({
        name: name,
        temp: Math.round(weatherData.current.temperature_2m),
        humidity: weatherData.current.relative_humidity_2m,
        wind: Math.round(weatherData.current.wind_speed_10m),
        visibility: Math.round(weatherData.current.visibility / 1000),
        code: weatherData.current.weather_code, // Live weather code
      });
    } catch (error) {
      console.error("data lane main masla hai", error);
    }
    setLoading(false);
  };

  // 🔥 useEffect for Initial Load
  useEffect(() => {
    fetchWeather(city);
  }, []);

  // 🔍 Form Submit Handler
  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputCity.trim()) return;
    setCity(inputCity);
    fetchWeather(inputCity);
    setInputCity("");
  };

  return (
    <div className="bg-zinc-950 min-h-screen w-full relative flex flex-col items-center justify-start pt-10 overflow-hidden font-sans">
      {/* 🔵 TOP GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-linear-to-br from-blue-600/30 to-indigo-950/10 rounded-full h-80 w-80 blur-3xl pointer-events-none z-0"></div>

      {/* 🟣 BOTTOM GLOW */}
      <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 bg-linear-to-tr from-purple-600/20 to-fuchsia-950/5 rounded-full h-96 w-96 blur-3xl pointer-events-none z-0"></div>

      {/* Input Field Section */}
      <div className="w-full max-w-md px-4 z-10 relative mb-6">
        <form
          onSubmit={handleSearch}
          className="flex items-center justify-center gap-3 w-full"
        >
          <input
            type="text"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Search for city here..."
            className="text-slate-200 flex-1 h-12 rounded-full border border-white/10 pl-5 pr-4 backdrop-blur-md bg-white/5 shadow-lg focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-500"
          />
          <button
            type="submit"
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/15 active:scale-90 flex items-center justify-center cursor-pointer shadow-lg group transition-all duration-200"
          >
            <i className="fa-solid fa-magnifying-glass text-slate-300 text-sm group-hover:text-blue-400 transition-colors"></i>
          </button>
        </form>
      </div>

      {/* ⚡ CONDITIONAL RENDERING */}
      {loading ? (
        <div className="z-10 text-slate-400 font-mono text-sm mt-20 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p>Mausam dhoonda ja raha hai...</p>
        </div>
      ) : weather ? (
        <>
          {/* Main Weather Card */}
          <div className="w-full max-w-md px-4 z-10 relative mb-6">
            <div className="border border-white/10 bg-white/5 backdrop-blur-2xl rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Cloud Image Box */}
              <div className="w-32 h-32 border border-white/10 rounded-2xl flex items-center justify-center p-2 bg-black/20 shadow-inner">
                <img
                  src={`/set-1/${getWeatherIconName(weather.code)}.png`}
                  alt="Weather Condition"
                  className="w-24 h-24 object-contain animate-pulse"
                  onError={(e) => {
                    e.target.src = "/set-1/cloudy.png";
                  }}
                />
              </div>
              {/* Temperature & City Info */}
              <div className="text-center sm:text-right flex-1">
                <p className="text-7xl font-black text-slate-200 tracking-tighter">
                  {weather.temp}
                  <span className="text-blue-400 text-5xl">°C</span>
                </p>
                <p className="text-slate-200 font-extrabold text-3xl mt-1 tracking-tight">
                  {weather.name}
                </p>
                <p className="text-xs text-blue-400 font-mono tracking-widest uppercase mt-1">
                  Live
                </p>
              </div>
            </div>
          </div>

          {/* Niche Wale Teen Cards */}
          <div className="flex gap-4 sm:gap-6 mt-2 z-10 relative px-4 w-full max-w-md justify-center">
            <div className="h-40 w-28 sm:w-32 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-4 flex flex-col justify-between shadow-xl hover:border-white/20 transition-all duration-300">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Humidity
              </span>
              <span className="text-2xl font-black text-blue-400">
                {weather.humidity}%
              </span>
            </div>
            <div className="h-40 w-28 sm:w-32 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-4 flex flex-col justify-between shadow-xl hover:border-white/20 transition-all duration-300">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Wind
              </span>
              <span className="text-2xl font-black text-purple-400">
                {weather.wind}
                <span className="text-xs font-normal">km/h</span>
              </span>
            </div>
            <div className="h-40 w-28 sm:w-32 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-4 flex flex-col justify-between shadow-xl hover:border-white/20 transition-all duration-300">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                Visibility
              </span>
              <span className="text-2xl font-black text-fuchsia-400">
                {weather.visibility}
                <span className="text-xs font-normal">km</span>
              </span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-slate-400 z-10 mt-10">Koi data nahi mila.</p>
      )}
    </div>
  );
}
