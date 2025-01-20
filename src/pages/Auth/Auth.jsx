import React, { Suspense } from "react";
import { Link } from "react-router-dom";

// Dynamic imports for icons
const FaShieldAlt = React.lazy(() =>
  import("react-icons/fa").then((module) => ({ default: module.FaShieldAlt }))
);
const FaEnvelope = React.lazy(() =>
  import("react-icons/fa").then((module) => ({ default: module.FaEnvelope }))
);
const BiLogIn = React.lazy(() =>
  import("react-icons/bi").then((module) => ({ default: module.BiLogIn }))
);

// Dynamic import for sound
const soundPath = () => import("../../assets/1.mp3");

export default function Auth() {
  const notificationRef = React.useRef(null);

  React.useEffect(() => {
    // Load sound dynamically
    const loadSound = async () => {
      const soundModule = await soundPath();
      notificationRef.current = new Audio(soundModule.default);
    };
    loadSound();
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg p-8 w-[400px] shadow-main">
          <div className="flex justify-center mb-6">
            <FaShieldAlt className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">
            Sign up below to create a secure account
          </h2>
          <div className="space-y-4">
            <Link
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center"
              to="/login"
              onClick={playSound}
            >
              <BiLogIn className="w-6 h-6 mr-2" />
              Login
            </Link>
            <Link
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center"
              to="/sign-up"
              onClick={playSound}
            >
              <FaEnvelope className="w-6 h-6 mr-2" />
              SIGN UP USING EMAIL
            </Link>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>
              By signing up or connecting with the services above you agree to
              our{" "}
              <a className="text-blue-500 hover:text-blue-600">
                Terms of Services
              </a>{" "}
              and acknowledge our{" "}
              <a className="text-blue-500 hover:text-blue-600">
                Privacy Policy
              </a>{" "}
              describing how we handle your personal data.
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
