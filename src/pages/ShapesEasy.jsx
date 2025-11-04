import React, { useState, useEffect } from "react";
import Back from "../components/Back";
import Easy1 from "../assets/Shapes/ShapesEasy/Easy1.webp";
import Easy2 from "../assets/Shapes/ShapesEasy/Easy2.webp";
import Easy3 from "../assets/Shapes/ShapesEasy/Easy3.webp";
import { Link } from "react-router-dom";
import backgroundMusic from "../assets/Sounds/background.mp3";
import useSound from "use-sound";
import clickSfx from "../assets/Sounds/button_click.mp3";

function ShapesEasy() {
  const [playClick] = useSound(clickSfx, { volume: 0.5 });
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const bgSound = new Audio(backgroundMusic);
    bgSound.loop = true;
    bgSound.volume = 0.2;

    bgSound.play().catch((err) => {
      console.log("Autoplay blocked. User must interact to enable sound.", err);
    });

    return () => {
      bgSound.pause();
      bgSound.currentTime = 0;
    };
  }, []);

  const levels = [
    { id: "level1", image: Easy1, left: "15%", bottom: "6%" },
    { id: "level2", image: Easy2, left: "42%", bottom: "40%" },
    { id: "level3", image: Easy3, left: "65%", bottom: "6%" },
  ];

  const handleResetConfirmed = () => {
    setShowResetModal(false);
    playClick();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const promptReset = () => {
    playClick();
    setShowResetModal(true);
  };

  return (
    <>
      <div className="absolute flex justify-around overflow-y-hidden h-[100vh] w-[100vw]">
        <div className="absolute top-0 left-0 w-full z-10"></div>
        <div className="absolute top-12.5 left-0 h-15 w-30 z-10">
          <Back />
        </div>

        <div className="absolute top-[5px] left-[1350px] z-20">
       
        </div>

        {showResetModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100 duration-300">
              <h2 className="text-xl text-green-600 mb-4">
                Reset Game Confirmation
              </h2>
              <p className="mb-6 text-gray-700">
                Are you sure you want to reset the game?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    playClick();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetConfirmed}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg transition"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccessToast && (
          <div className="fixed top-20 right-5 z-50">
            <div className="bg-red-500 text-white p-4 rounded-lg shadow-xl flex items-center space-x-3 transition-opacity duration-300">
              <span className="text-2xl">🎉</span>
              <p>Game reset button clicked!</p>
            </div>
          </div>
        )}

        <img
          src="/Bg/Shapes/shapesEasyBg.webp"
          alt=""
          className="h-[100vh] w-[100vw] absolute"
        />

        {levels.map((lvl) => (
          <Link key={lvl.id} to={lvl.id} onClick={playClick}>
            <img
              src={lvl.image}
              alt={`Button to go to ${lvl.id}`}
              className="absolute h-[40%] w-[20%] hover:opacity-85 motion-preset-pulse-sm motion-duration-2000"
              style={{ left: lvl.left, bottom: lvl.bottom }}
            />
          </Link>
        ))}
      </div>
    </>
  );
}

export default ShapesEasy;
