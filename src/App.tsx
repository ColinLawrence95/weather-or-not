import { motion } from "framer-motion";
import ShowWeather from "./components/ShowWeather/ShowWeather";
import { SiAccuweather } from "react-icons/si";
import { TiWeatherSnow } from "react-icons/ti";
import { TiWeatherStormy } from "react-icons/ti";
import { TiWeatherDownpour } from "react-icons/ti";
import "./App.css";

function App() {
    const titleIcons = [TiWeatherDownpour, TiWeatherSnow, TiWeatherStormy, SiAccuweather]
    const RandomIcon = titleIcons[Math.floor(Math.random() * titleIcons.length)];


    return (
        <>
            <motion.h1
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: -25 }}
                transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 5,
                    bounce: 1,
                    delay: 2.0,
                }}
            >
                <RandomIcon style={{marginRight: "10px"}}/>
                Weather or Not
                <RandomIcon style={{marginLeft: "10px"}}/>
                
            </motion.h1>

            <ShowWeather />
        </>
    );
}

export default App;
