import { useState, useEffect } from "react";
import { DndContext, useDraggable, useDroppable, pointerWithin } from "@dnd-kit/core";
import BG from "../../../../assets/Animals/Lesson5/bg.webp";
import Hamster from "../../../../assets/Animals/Lesson5/hamster.webp";
import Tiger from "../../../../assets/Animals/Lesson5/tiger.webp";
import Lion from "../../../../assets/Animals/Lesson4/Lion.webp";
import Elephant from "../../../../assets/Animals/Lesson4/Elephant.webp";
import Cat from "../../../../assets/Animals/Lesson3/Cat.webp";
import Dog from "../../../../assets/Animals/Lesson1/Dog.webp";
import petDroppable from "../../../../assets/Animals/Lesson5/petDroppable.webp";
import WildDroppable from "../../../../assets/Animals/Lesson5/wildDroppable.webp";
import OneStar from "../../../../assets/Done/OneStar.webp";
import TwoStar from "../../../../assets/Done/TwoStar.webp";
import ThreeStar from "../../../../assets/Done/ThreeStar.webp";
import ReplayNBack from "../../../../components/ReplayNBack";
import backgroundMusic from "../../../../assets/Sounds/background.mp3";
import { motion, AnimatePresence } from "framer-motion";
import applause from "../../../../assets/Sounds/applause.wav";
import { useWithSound } from "../../../../components/useWithSound";
import { useNavigate } from "react-router-dom";
import api from "../../../../api";
import useSound from "use-sound";
import wrongSound from "../../../../assets/Sounds/wrong_effect.mp3";

import ReadySetGo from "../../../../assets/Animals/ReadySetGo/ReadySetGo.mp4";

// Activate tutorial video import
import TutorialVideo from "../../../../assets/videos/Pet or Wild act1 Tutorial.mp4";
import TimesUp from "../../../../assets/Animals/Time's Up.webp";
function Droppable({ id, placedShape, shape }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    opacity: isOver ? "0.5" : "1",
    zIndex: isOver ? "10" : "1",
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-center h-100 w-100"
    >
      {placedShape ? placedShape : shape}
    </div>
  );
}

function Draggable({ id, disabled = false, shape }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    disabled,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!disabled ? attributes : {})}
      {...(!disabled ? listeners : {})}
    >
      {shape}
    </div>
  );
}

const PROGRESS_KEY = "alphabetMediumProgress";

function saveProgress(level) {
  const progress = JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {
    level1: false,
    level2: false,
  };
  progress[level] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function AnimalsLesson5Activity1() {
  const navigate = useNavigate();
  const { playSound: playApplause, stopSound: stopApplause } = useWithSound(applause);
  const [dropped, setDropped] = useState([]);
  const [count, setCount] = useState(1);
  const [showTutorial, setShowTutorial] = useState(true); // ← tutorial state added
  const selectedChild = JSON.parse(localStorage.getItem("selectedChild"));
  const childId = selectedChild?.id; // this is the child ID you need
  const [playWrong] = useSound(wrongSound, { volume: 1.0 });
  const [showReady, setShowReady] = useState(false);

  const animalTypes = {
    dog: "pet",
    hamster: "pet",
    cat: "pet",
    tiger: "wild",
    elephant: "wild",
    lion: "wild",
  };

  function handleDragEnd(event) {
    if (event.over) {
      const draggedId = event.active.id;
      const droppedId = event.over.id;
      if (animalTypes[draggedId] === droppedId && !dropped.includes(draggedId)) {
        setDropped((prev) => [...prev, draggedId]);
      }
      else {
      // ❌ Wrong drop → play wrong sound
      playWrong();
    }
    }
  }

  const isGameFinished = dropped.length === 6 || count >= 60;

  useEffect(() => {
    const bgSound = new Audio(backgroundMusic);
    bgSound.loop = true;
    bgSound.volume = 0.3;
    bgSound.play().catch((err) => {
      console.log("Autoplay blocked by browser (user interaction required):", err);
    });
    return () => {
      bgSound.pause();
      bgSound.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    let soundTimeout;
    if (isGameFinished) {
      playApplause();
      saveProgress("level1");
      soundTimeout = setTimeout(() => {
        stopApplause();
      }, 8000);
    }
    return () => {
      clearTimeout(soundTimeout);
      stopApplause();
    };
  }, [isGameFinished, playApplause, stopApplause]);

  // Timer
   useEffect(() => {
  if (showTutorial || isGameFinished || showReady) return;
    if (isGameFinished) return;
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [showTutorial, isGameFinished, showReady]);


  const resetGame = () => {
    setDropped([]);
    setCount(0);
    setShowTutorial(true); // reset tutorial if replay
  };

  const handleReplay = () => {
    stopApplause();
    resetGame();
  };

  
  const handleSkipTutorial = () => {
    setShowTutorial(false);
    setShowReady(true);
  };
  const handleTutorialEnd = () => {
    setShowTutorial(false);
    setShowReady(true);
  };

    const handleReadyEnd = () => {
  setShowReady(false);
};


  const handleBack = () => {
    stopApplause();
  };
    useEffect(() => {
  if (isGameFinished && childId) {
    const saveRecord = async () => {
      const payload = {
        child_id: childId,
        game: "Lesson5 Activity2",
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

  return (
    <>
      {/* Tutorial Pop-up Video */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            key="tutorialPopup"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/80 flex justify-center items-center z-50"
          >
            <div className="relative w-[85%] md:w-[60%]">
              <video
                src={TutorialVideo}
                autoPlay
                onEnded={handleTutorialEnd}
                playsInline
                className="w-full rounded-2xl border-4 border-white shadow-lg"
              />
              <button
                onClick={handleSkipTutorial}
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

      {/* Main Game Screen */}
      {!showTutorial && (
        <div
          className="flex h-[100vh] w-[100vw] [&>*]:flex absolute font-[coiny] overflow-hidden bg-bottom bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${BG})` }}
        >
          <div className="absolute top-10 right-10 text-black text-5xl 2xl:text-7xl">Time: {count}</div>
          <DndContext onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
            {/* Droppables */}
            <div className="flex absolute top-60 gap-20 2xl:gap-50 2xl:top-80 items-center justify-center w-[100vw] h-[40vw]">
              <Droppable
                id="pet"
                shape={<img src={petDroppable} alt="Pet animals" className="h-[70%] 2xl:h-[100%] object-contain" />}
                placedShape={
                  dropped.some((id) => animalTypes[id] === "pet") && (
                    <img src={petDroppable} alt="Pet animals" className="h-[70%] object-contain" />
                  )
                }
              />
              <Droppable
                id="wild"
                shape={<img src={WildDroppable} alt="Wild animals" className="h-[70%] 2xl:h-[100%] object-contain" />}
                placedShape={
                  dropped.some((id) => animalTypes[id] === "wild") && (
                    <img src={WildDroppable} alt="Wild animals" className="h-[70%] object-contain" />
                  )
                }
              />
            </div>

            {/* Draggables */}
            <div className="flex absolute gap-6 w-[100vw] justify-center items-center z-10 top-30">
              {!dropped.includes("dog") && <Draggable id="dog" shape={<img src={Dog} alt="Dog" className="h-40 w-40 2xl:h-70 2xl:w-70 object-contain" />} />}
              {!dropped.includes("tiger") && <Draggable id="tiger" shape={<img src={Tiger} alt="Tiger" className="h-40 w-40 2xl:h-70 2xl:w-70 object-contain" />} />}
              {!dropped.includes("hamster") && <Draggable id="hamster" shape={<img src={Hamster} alt="Hamster" className="h-40 w-40 2xl:h-70 2xl:w-70 object-contain" />} />}
              {!dropped.includes("elephant") && <Draggable id="elephant" shape={<img src={Elephant} alt="Elephant" className="h-40 w-40 2xl:h-70 2xl:w-70 object-contain" />} />}
              {!dropped.includes("lion") && <Draggable id="lion" shape={<img src={Lion} alt="Lion" className="h-40 w-40 2xl:h-70 2xl:w-70 object-contain" />} />}
              {!dropped.includes("cat") && <Draggable id="cat" shape={<img src={Cat} alt="Cat" className="h-40 w-40 2xl:h-70 2xl:w-70 object-contain" />} />}
            </div>

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
          </DndContext>
        </div>
      )}
    </>
  );
}

export default AnimalsLesson5Activity1;


