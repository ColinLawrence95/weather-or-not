import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./ShowWeather.css";
import { FaCity } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

interface WeatherResponse {
    location: {
        name: string;
        localtime: string;
    };
    current: {
        temperature: number;
        weather_descriptions: string[];
        weather_icons: string[];
        wind_speed: number;
        humidity: number;
    };
}

const image: React.CSSProperties = {
    maxWidth: "80vw",
};

const shape: React.CSSProperties = {
    strokeWidth: 10,
    strokeLinecap: "round",
    fill: "transparent",
};

const ShowWeather: React.FC = () => {
    const [city, setCity] = useState<string>("");
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(
        null
    );
    const fetchWeather = async (cityName: string) => {
        try {
            const response = await axios.get(
                import.meta.env.VITE_BACKEND_TEST,
                {
                    params: {
                        query: cityName,
                    },
                }
            );

            if (
                response.data &&
                response.data.location &&
                response.data.current
            ) {
                setWeatherData(response.data);
            } else {
                toast.error("No Weather Data Found")
                setWeatherData(null);
            }
        } catch (err) {
            toast.error("Failed to fetch weather data.")
            console.error(err);
            setWeatherData(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!city.trim()) {
            toast.warn("Please enter a city!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
            });
            return;
        }
        fetchWeather(city);
    };
    const draw = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: (i: number) => {
            const delay = i * 0.5;
            return {
                pathLength: 1,
                opacity: 1,
                transition: {
                    pathLength: {
                        delay,
                        type: "spring",
                        duration: 3,
                        bounce: 0,
                    },
                    opacity: { delay, duration: 0.01 },
                },
            };
        },
    };
    return (
        <div className="show-weather-container">
            <motion.svg
                className="show-weather-svg"
                width="600"
                height="600"
                viewBox="0 0 600 600"
                initial="hidden"
                animate="visible"
                style={image}
            >
                <motion.rect
                    width="600"
                    height="600"
                    x="0"
                    y="0"
                    rx="19"
                    stroke="#4290f5"
                    variants={draw}
                    custom={1.5}
                    style={shape}
                />
            </motion.svg>

            <motion.div
                className="show-weather-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
            >
                <form className="show-weather-form" onSubmit={handleSubmit}>
                    <div className="show-weather-input-icons">
                        <FaCity size="4rem" style={{ marginRight: "10px" }} />
                        <input
                            id="show-weather-city-input"
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Please Enter a City"
                        />
                        <FaCity size="4rem" style={{ marginLeft: "10px" }} />
                    </div>
                    <motion.button
                        id="show-weather-button"
                        type="submit"
                        whileTap={{
                            scale: 0.9,
                            transition: {
                                type: "spring",
                                stiffness: 100,
                                damping: 10,
                            },
                        }}
                    >
                        How's the Weather?
                    </motion.button>
                </form>
                {weatherData && (
                    <motion.div
                        className="show-weather-data"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <h2 id="show-weather-city-title">
                            {weatherData.location.name}
                        </h2>
                        <p>Temperature: {weatherData.current.temperature}°C</p>
                        <p>
                            Condition:{" "}
                            {weatherData.current.weather_descriptions[0]}
                        </p>
                        <img
                            src={weatherData.current.weather_icons[0]}
                            alt="Weather icon"
                        />
                        <p>Wind Speed: {weatherData.current.wind_speed} km/h</p>
                        <p>Humidity: {weatherData.current.humidity}%</p>
                        <p>Local Time: {weatherData.location.localtime}</p>
                    </motion.div>
                )}
            </motion.div>
            <ToastContainer />
        </div>
    );
};

export default ShowWeather;
