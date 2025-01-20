import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Suspense } from "react";

// Dynamic imports for icons
const AiOutlineMail = React.lazy(() =>
  import("react-icons/ai").then((module) => ({ default: module.AiOutlineMail }))
);
const FiEye = React.lazy(() =>
  import("react-icons/fi").then((module) => ({ default: module.FiEye }))
);
const FiEyeOff = React.lazy(() =>
  import("react-icons/fi").then((module) => ({ default: module.FiEyeOff }))
);

// Dynamic imports for sounds
const soundPath1 = () => import("../../assets/1.mp3");
const soundPath2 = () => import("../../assets/2.mp3");

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const [notification, setNotification] = useState(null);
  const [notification2, setNotification2] = useState(null);

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

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://wallet-backend-silk-ten.vercel.app/api/user/login`,
        { email, password },
        {
          withCredentials: true,
        }
      );

      // Save the JSON data in localStorage
      if (response.ok && notification) {
        notification.play();
        nav("/dashboard");
      }
      localStorage.setItem("userData", JSON.stringify(response.data));

      // Set the token in cookies
      const token = response.data.token;
      document.cookie = `token=${token}; path=/;`;

      // Navigate to the dashboard
      nav("/dashboard");
    } catch (err) {
      if (notification2) notification2.play();

      console.error("Error logging in:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg p-8 w-[400px] shadow-main">
          <div className="flex justify-center mb-6">
            <AiOutlineMail size={64} color="#4CAF50" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-center">Welcome back!</h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    autoComplete="on"
                    id="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black bg-white"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="on"
                    placeholder="min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black bg-white"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FiEye size={20} color="#6B7280" />
                    ) : (
                      <FiEyeOff size={20} color="#6B7280" />
                    )}
                  </div>
                </div>
              </div>

              {/* Display Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
              >
                LOG IN
              </button>
            </div>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <p>
              Forgot Password?{" "}
              <Link
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
                onClick={() => {
                  if (notification) notification.play();
                }}
                to="/forgot-password"
              >
                Forgot Password?
              </Link>
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>
              Do not have an account?{" "}
              <Link
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
                onClick={() => {
                  if (notification) notification.play();
                }}
                to="/sign-up"
              >
                SIGN UP
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LoginForm;
