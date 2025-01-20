import React, { useState, useEffect, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Dynamic import for the icon
const FaShieldAlt = React.lazy(() =>
  import("react-icons/fa").then((module) => ({ default: module.FaShieldAlt }))
);

// Dynamic imports for sounds
const soundPath1 = () => import("../../assets/1.mp3");
const soundPath2 = () => import("../../assets/2.mp3");

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [notification, setNotification] = useState(null);
  const [notification2, setNotification2] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    // Load sounds dynamically
    const loadSounds = async () => {
      const sound1 = await soundPath1();
      const sound2 = await soundPath2();
      setNotification(new Audio(sound1.default));
      setNotification2(new Audio(sound2.default));
    };
    loadSounds();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password, fullName, gender);

    if (!email || !password || !fullName || !gender) {
      alert("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "https://wallet-backend-silk-ten.vercel.app/api/user/signup",
        {
          email,
          password,
          fullname: fullName, // Match backend key
          gender,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("userData", JSON.stringify(response.data));
      const token = response.data.token;
      document.cookie = `token=${token}; path=/;`;

      if (notification) notification.play();
      nav("/currency");
    } catch (error) {
      if (notification2) notification2.play();
      if (error.response) {
        console.error("Error signing up:", error.response.data);
      } else {
        console.error("Error signing up:", error.message);
      }
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
      <div className="flex items-center justify-center min-h-screen ">
        <div className="bg-white shadow-main rounded-lg pr-8 pl-8 pt-10 pb-2 w-[400px]">
          <div className="flex justify-center mb-4">
            <FaShieldAlt className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Welcome!</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                type="text"
                autoComplete="on"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full text-black bg-white"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full  text-black bg-white"
              />
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full  text-black bg-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="mb-2">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full  text-black bg-white"
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
            >
              Sign Up
            </button>
          </form>
          <div className="text-center mt-4">
            <p>
              Already have an account?{" "}
              <Link
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
                to="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default SignUp;
