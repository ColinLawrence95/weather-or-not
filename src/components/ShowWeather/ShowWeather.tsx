import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./ShowWeather.css";
import { FaCity } from "react-icons/fa";
import { IoIosNuclear } from "react-icons/io";
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
const prodApi = import.meta.env.VITE_BACKEND_API;
const testApi = import.meta.env.VITE_BACKEND_TEST;

const ShowWeather: React.FC = () => {
    const [city, setCity] = useState<string>("");
    const [weatherData, setWeatherData] = useState<WeatherResponse | null>(
        null
    );
    const [isTest, setIsTest] = useState<boolean>(true);

    const handleClick = () => {
        setIsTest((prev) => !prev);
    };

    const fetchWeather = async (cityName: string) => {
        const whatApi = isTest ? testApi : prodApi;

        try {
            const response = await axios.get(whatApi, {
                params: {
                    query: cityName,
                },
            });

            if (
                response.data &&
                response.data.location &&
                response.data.current
            ) {
                setWeatherData(response.data);
            } else {
                toast.error("No Weather Data Found");
                setWeatherData(null);
            }
        } catch (err) {
            toast.error("Failed to fetch weather data.");
            console.error(err);
            console.log(whatApi);
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
                <button
                    id="show-weather-toggle-api"
                    onClick={handleClick}
                    style={{
                        border: `7px solid ${isTest ? "green" : "red"}`,
                    }}
                >
                    {isTest ? (
                        "TEST API"
                    ) : (
                        <>
                            <IoIosNuclear size={20} /> LIVE API{" "}
                            <IoIosNuclear size={20} />
                        </>
                    )}
                </button>
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
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.5 }}
                    >
                        <h2 id="show-weather-city-title">
                            {weatherData.location.name}
                        </h2>
                             <img
                                src={weatherData.current.weather_icons[0]}
                                alt="Weather icon"
                                style={{ borderRadius: "12px" }}
                            />
                        <div className="show-weather-condition-temp">
                            <h3 id="show-weather-info-condition">
                                {weatherData.current.weather_descriptions[0]}
                            </h3>
                       
                            <h3 id="show-weather-info">
                                {weatherData.current.temperature}°C
                            </h3>
                        </div>
                        <h3 id="show-weather-info">
                            Wind Speed: {weatherData.current.wind_speed} km/h
                        </h3>
                        <h3 id="show-weather-info">
                            Humidity: {weatherData.current.humidity}%
                        </h3>
                        <h3 id="show-weather-info">
                            Local Time: {weatherData.location.localtime}
                        </h3>
                    </motion.div>
                )}
            </motion.div>
            <ToastContainer />
        </div>
    );
};

export default ShowWeather;
