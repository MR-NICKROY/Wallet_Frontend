import React, { useEffect, useRef, Suspense } from "react";
import { Link } from "react-router-dom";

// Lazy-load icons
const BsCoin = React.lazy(() =>
  import("react-icons/bs").then((module) => ({ default: module.BsCoin }))
);
const ImCoinDollar = React.lazy(() =>
  import("react-icons/im").then((module) => ({ default: module.ImCoinDollar }))
);
const TbCoinEuroFilled = React.lazy(() =>
  import("react-icons/tb").then((module) => ({
    default: module.TbCoinEuroFilled,
  }))
);

// Dynamic import for sound
const soundPath = () => import("../../assets/1.mp3");

const Intro = () => {
  const typedRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    // Load the sound dynamically
    const loadSound = async () => {
      const soundModule = await soundPath();
      notificationRef.current = new Audio(soundModule.default);
    };
    loadSound();

    // Initialize Typed.js dynamically
    const loadTyped = async () => {
      const TypedLibrary = (await import("typed.js")).default;

      const options = {
        strings: [
          "Build healthy financial habits. Control unnecessary expenses.",
          "Build your financial life. Make the right financial decisions.",
          "Track and follow what matters to you.",
          "Track and analyze spending immediately.",
        ],
        typeSpeed: 70,
        backSpeed: 20,
        backDelay: 1500,
        loop: true, // Infinite loop
      };

      if (typedRef.current) {
        const typedInstance = new TypedLibrary(typedRef.current, options);

        // Cleanup on unmount
        return () => {
          typedInstance.destroy();
        };
      }
    };

    loadTyped();
  }, []);

  const playSound = () => {
    if (notificationRef.current) {
      notificationRef.current.play();
    }
  };

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex justify-center">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      }
    >
      <div className="bg-white font-sans min-h-screen flex flex-col items-center justify-center py-12">
        {/* Background Blobs */}
        <div className="relative">
          <div className="bg-[#e0f2fe] rounded-full w-64 h-64 absolute -top-12 -left-12 blur-xl"></div>
          <div className="bg-[#e0f2fe] rounded-full w-48 h-48 absolute -bottom-8 -right-8 blur-xl"></div>
          <div className="relative z-10">
            {/* Finance Cards */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-dashed border-gray-200 grid grid-cols-2 gap-4 w-64">
              <div className="bg-gray-300 p-4 rounded-lg flex items-center justify-center">
                <span className="text-gray-700 font-bold">BANK</span>
              </div>
              <div className="bg-green-300 p-4 rounded-lg flex items-center justify-center">
                <BsCoin className="text-2xl text-green-700" />
              </div>
              <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-center">
                <ImCoinDollar className="text-2xl text-gray-600" />
              </div>
              <div className="bg-yellow-300 p-4 rounded-lg flex items-center justify-center">
                <TbCoinEuroFilled className="text-2xl text-yellow-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mt-8 mb-4 text-center">
          Your Finances in One Place
        </h1>

        {/* Typing Animation */}
        <p className="text-gray-600 text-center mb-8">
          <span ref={typedRef}></span>
        </p>

        {/* Start Button */}
        <Link
          to="/auth"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={playSound}
        >
          START NOW
        </Link>
      </div>
    </Suspense>
  );
};

export default Intro;
