import { useState, useEffect } from "react";
import DuckShadow from "../../../../assets/Animals/Lesson2/DuckShadow.webp";
import PigShadow from "../../../../assets/Animals/Lesson2/PigShadow.webp";
import CatShadow from "../../../../assets/Animals/Lesson2/CatShadow.webp";
import CowShadow from "../../../../assets/Animals/Lesson2/CowShadow.webp";
import DogShadow from "../../../../assets/Animals/Lesson2/DogShadow.webp";
import bg from "../../../../assets/Animals/Lesson2/bg2.webp";
import catSound from "../../../../assets/Animals/Lesson2/catSound.mp3"
import cowSound from "../../../../assets/Animals/Lesson2/cowSound.mp3"
import dogSound from "../../../../assets/Animals/Lesson2/dogSound.mp3"
import pigSound from "../../../../assets/Animals/Lesson2/pigSound.mp3"
import duckSound from "../../../../assets/Animals/Lesson2/duckSound.mp3"

import { AnimatePresence } from "framer-motion";

import OneStar from "../../../../assets/Done/OneStar.webp";
import TwoStar from "../../../../assets/Done/TwoStar.webp";
import ThreeStar from "../../../../assets/Done/ThreeStar.webp";

import ReplayNBack from "../../../../components/ReplayNBack";

import { motion } from "framer-motion";
import { useWithSound } from "../../../../components/useWithSound";
import { useNavigate } from "react-router-dom";
import useSound from "use-sound";
import clickSfx from "../../../../assets/Sounds/wrong_effect.mp3";
import applause from "../../../../assets/Sounds/applause.wav";

import SoundTutorial from "../../../../assets/videos/SoundTutorial2.mp4"; 

import api from "../../../../api";

import TimesUp from "../../../../assets/Animals/Time's Up.webp";
import ReadySetGo from "../../../../assets/Animals/ReadySetGo/ReadySetGo.mp4";
import TimesUpSound from "../../../../assets/Sounds/Time'sUP.mp3";

// Define rounds
const ROUNDS = [
  { shadow: DuckShadow, answer: "Duck", choices: ["Duck", "Dog", "Pig", "Cat"] },
  { shadow: PigShadow, answer: "Pig", choices: ["Cat", "Cow", "Pig", "Duck"] },
  { shadow: CatShadow, answer: "Cat", choices: ["Cat", "Cow", "Dog", "Duck"] },
  { shadow: CowShadow, answer: "Cow", choices: ["Pig", "Cow", "Dog", "Duck"] },
  { shadow: DogShadow, answer: "Dog", choices: ["Dog", "Cat", "Duck", "Pig"] },
];


function AnimalsLesson1Activity2() {

  const [playClick] = useSound(clickSfx, { volume: 0.5 });
  const navigate = useNavigate();
  const { playSound: playApplause, stopSound: stopApplause } = useWithSound(applause);
  const { playSound: playTimeUp, stopSound: stopTimeUp } = useWithSound(TimesUpSound);

   const handleReplay = () => {
    stopApplause();
    resetGame();
  };
    const handleBack = () => {
    stopApplause();
    stopTimeUp();
  };

  // 🔊 add animal sounds
  const [playCat] = useSound(catSound, { volume: 0.7 });
  const [playCow] = useSound(cowSound, { volume: 0.7 });
  const [playDog] = useSound(dogSound, { volume: 0.7 });
  const [playPig] = useSound(pigSound, { volume: 0.9 });
  const [playDuck] = useSound(duckSound, { volume: 0.7 });

  const [roundIndex, setRoundIndex] = useState(0);
  const [isGameFinished, setGameFinished] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [count, setCount] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true);
  const handleVideoEnd = () => {setShowTutorial(false);setShowReady(true);}
  const handleSkip = () => {setShowTutorial(false); setShowReady(true);}
  const currentRound = ROUNDS[roundIndex];
  const selectedChild = JSON.parse(localStorage.getItem("selectedChild"));
  const childId = selectedChild?.id; // this is the child ID you need
  const [showReady, setShowReady] = useState(false);


  // ✅ play sound based on current round
  const handleShadowClick = () => {
    const animal = currentRound.answer.toLowerCase();
    if (animal === "cat") playCat();
    if (animal === "cow") playCow();
    if (animal === "dog") playDog();
    if (animal === "pig") playPig();
    if (animal === "duck") playDuck();
  };

 

useEffect(() => {
  if (showTutorial || isGameFinished || showReady) return;

  const interval = setInterval(() => {
    
    setCount((prev) => {
      if (prev >= 60) {
        // stop game at 60 seconds
        clearInterval(interval);
        setGameFinished(true);
        return prev; // stop incrementing
      }
      return prev + 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [showTutorial, isGameFinished, showReady]);

  const handleChoice = (choice) => {
    if (choice === currentRound.answer) {
      if (roundIndex + 1 >= ROUNDS.length) {
        setGameFinished(true);
        playApplause();
      } else {
        setRoundIndex(roundIndex + 1);
        setShowWrong(false);
      }
    } else {
      playClick();
      setShowWrong(true);
      setTimeout(() => setShowWrong(false), 800);
    }
  };

    const handleReadyEnd = () => {
  setShowReady(false);
};

   useEffect(() => {
    if (isGameFinished) {
      localStorage.setItem("lesson1Activity2Done", "true");
    }
  }, [isGameFinished]);

    useEffect(() => {
  if (isGameFinished && childId) {
    const saveRecord = async () => {
      const payload = {
        child_id: childId,
        game: "Lesson1 Activity2",
        level: 1,
        time: count
      };

      console.log("📤 Sending progress data:", payload); // ✅ Check this in console

      try {
        const response = await api.post("/api/save_progress/", payload);
        console.log("✅ Game progress saved successfully:", response.data);
      } catch (err) {
        console.error("❌ Error saving progress:", err.response?.data || err.message);
      }
    };

    saveRecord();
  }
}, [isGameFinished, childId, count]);



useEffect(() => {
  if (count === 60) {
    stopApplause();

    // Wait a short moment before playing sound, 
    // so "Time's Up" image shows first
    setTimeout(() => {
      playTimeUp();
    }, 500); // adjust delay if needed
  }
}, [count, stopApplause, playTimeUp]);




  return (<>

     {/* Tutorial Pop-Up Video */}
      <AnimatePresence mode="wait">
        {showTutorial && (
          <motion.div
            key="tutorial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black/80 flex justify-center items-center z-50"
          >
            <div className="relative w-[80%] md:w-[60%]">
              <video
                src={SoundTutorial}
                autoPlay
                onEnded={handleVideoEnd}
                playsInline
                className="rounded-2xl shadow-lg w-full border-4 border-gray-200"
              />
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 bg-white/80 text-black font-semibold px-4 py-1 rounded-lg shadow hover:bg-white transition"
              >
                Skip
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Ready Set Go Video Overlay */}
      <AnimatePresence mode="wait">
        {showReady && (
          <motion.div
            key="readysetgo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black/80 flex justify-center items-center z-50"
          >
            <video
              src={ReadySetGo}
              autoPlay
              onEnded={handleReadyEnd}
              playsInline
              className="rounded-2xl shadow-lg w-[70%] border-4 border-gray-200"
            />
          </motion.div>
        )}
      </AnimatePresence>
    <div
      className="font-[coiny] h-[100vh] w-[100vw] bg-cover bg-no-repeat flex flex-col items-center justify-center relative"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {!isGameFinished && (
        <>
          <div className="absolute top-10 right-10 text-black text-5xl 2xl:text-7xl">Time: {count}</div>

          {/* ✅ Clickable silhouette with sound */}
          <div className="flex justify-center mb-10">
            <img
              src={currentRound.shadow}
              alt="Animal Shadow"
              className="h-[300px] object-contain cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={handleShadowClick}
            />
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            {currentRound.choices.map((choice) => (
              <button
                key={choice}
                onClick={() => handleChoice(choice)}
                className={`px-6 py-3 h-15 text-xl 2xl:h-20 2xl:w-50 2xl:text-4xl rounded-lg bg-white text-black font-bold hover:bg-gray-200 transition ${
                  showWrong && choice !== currentRound.answer ? "animate-shake bg-red-300" : ""
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </>
      )}

        {/* Results */}
            {isGameFinished && count <= 15 && (
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-20">
                <motion.img
                  src={ThreeStar}
                  alt="Game Completed!"
                  className="h-[300px]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute bottom-[20%]"><ReplayNBack onReplay={handleReplay} onBack={handleBack} /></div>
              </div>
            )}
            {isGameFinished && count <= 30 && count > 15 && (
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-20">
                <motion.img
                  src={TwoStar}
                  alt="Game Completed!"
                  className="h-[300px]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute bottom-[20%]"><ReplayNBack onReplay={handleReplay} onBack={handleBack} /></div>
              </div>
            )}
            {isGameFinished && count > 30 && count != 60 && (
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 z-20">
                <motion.img
                  src={OneStar}
                  alt="Game Completed!"
                  className="h-[300px]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute bottom-[20%]"><ReplayNBack onReplay={handleReplay} onBack={handleBack} /></div>
              </div>
            )}

            {isGameFinished && count === 60 && (
              <div className="absolute inset-0 top-60 2xl:top-0 flex items-center justify-center bg-opacity-50 z-20">
                <motion.img
                  src={TimesUp}
                  alt="Game Completed!"
                  className="h-[500px] bottom-53 2xl:bottom-90 absolute"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <div className="absolute bottom-[20%]"><ReplayNBack onReplay={handleReplay} onBack={handleBack} /></div>
              </div>
            )}
    </div>
  </>);
}

export default AnimalsLesson1Activity2;
