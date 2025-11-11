import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Back from "../components/Back";
import api from "../api";

import animal from "../assets/Lessons/animal.webp";
import weather from "../assets/Lessons/weather.webp";
import senses from "../assets/Lessons/senses.webp";
import reading from "../assets/Lessons/reading.webp";


function Lessons() {
  const [weatherUnlocked, setWeatherUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedChild = JSON.parse(localStorage.getItem("selectedChild"));
  const childId = selectedChild?.id;

  // ✅ Check if backend has "Lesson5 Activity2"
  useEffect(() => {
    const checkLesson5Activity2 = async () => {
      try {
        const res = await api.get(`/api/time_completions/?child=${childId}`);
        const completions = res.data.results ? res.data.results : res.data;

        const hasLesson5Activity2 = completions.some(
          (item) => item.game_level?.game_name === "Lesson5 Activity2"
        );

        setWeatherUnlocked(hasLesson5Activity2);
        console.log("Lesson5 Activity2 found:", hasLesson5Activity2);
      } catch (err) {
        console.error("Error checking Lesson5 Activity2 completion:", err);
      } finally {
        setLoading(false);
      }
    };

    if (childId) checkLesson5Activity2();
  }, [childId]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Helmet>
        <title>Lessons | KidzKorner</title>
        <meta
          name="Lessons that can be used after class"
          content="Different buttons for different lessons"
        />
      </Helmet>

      <div className="relative w-full min-h-screen">
        <Back/>
        <img
          src="/Bg/lessonbg.webp"
          alt="background"
          className="w-full h-auto block"
        />

        <div className="absolute top-5 left-5 z-10">
          <Back />
        </div>

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="h-[90%] w-[90%] grid grid-flow-col grid-rows-2 gap-15 [&>*]:content-center [&>*]:text-center [&>*]:rounded-2xl">
            
            {/* 🐾 Animals — always unlocked */}
            <Link to="/lessons/animals">
              <img
                src={animal}
                alt="Buttons for Animals"
                className="absolute left-[20%] top-[20%] w-auto h-auto hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </Link>

            

            {/* 🌤 Weather — unlocked only if Lesson5 Activity2 exists */}
            <Link to={weatherUnlocked ? "/lessons/weather" : "#"}>
              <img
                src={weather}
                alt="Buttons for weather"
                className={`absolute left-[65%] top-[20%] w-auto h-auto transition-transform duration-300 ${
                  weatherUnlocked
                    ? "hover:scale-105 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }`}
              />
            </Link>

            {/* 👃 Senses — always locked */}
            <img
              src={senses}
              alt="Buttons for senses"
              className="absolute left-[20%] top-[58%] w-auto h-auto opacity-50 cursor-not-allowed"
            />

            {/* 📖 Reading — always locked */}
            <img
              src={reading}
              alt="Buttons for reading"
              className="absolute left-[65%] top-[58%] w-auto h-auto opacity-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Lessons;
