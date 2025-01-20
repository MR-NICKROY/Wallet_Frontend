import { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios"; // Import Axios
import sound from "../../assets/1.mp3";
import sound2 from "../../assets/2.mp3";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const notification = new Audio(sound);
  const notification2 = new Audio(sound2);
  const nav = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handlePasswordChange = async () => {
    if (!email || !password) {
      alert("Please fill in both email and new password fields.");
      notification2.play(); // Play error sound
      return;
    }

    try {
      const response = await axios.post(
        "https://wallet-backend-silk-ten.vercel.app/api/user/change-password",
        { email, password }
      );

      if (response.status === 200) {
        nav("/dashboard");
        notification.play(); // Play success sound
      }
    } catch (error) {
      console.error("Error changing password:", error);
      notification2.play(); // Play error sound
      alert(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen shadow-lg">
      <div className="bg-white rounded-lg p-8 w-[400px] shadow-main">
        <div className="flex justify-center mb-6">
          <AiOutlineMail size={64} color="#4CAF50" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password!
        </h2>
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
                value={email} // Bind email state
                onChange={(e) => setEmail(e.target.value)} // Update email state
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500  text-black bg-white"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="pb-5">
            <label
              htmlFor="password"
              className="block text-gray-700 font-bold mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="min. 6 characters"
                value={password} // Bind password state
                onChange={(e) => setPassword(e.target.value)} // Update password state
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500  text-black bg-white"
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

          {/* Submit Button */}
          <button
            onClick={handlePasswordChange} // Trigger API call
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
          >
            Get New Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
