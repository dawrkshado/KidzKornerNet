import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import validator from "validator";
import api from "../api"; // your axios instance

function ResetPassword() {
  const { uidb64, token } = useParams(); // <-- get from URL like /reset-password/:uidb64/:token
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [reEnterPass, setReEnterPass] = useState("");
  const [message, setMessage] = useState("");

  // Password strength validator
  const validate = (value) => {
    return validator.isStrongPassword(value, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    });
  };

  // Clear inputs
  const handleClear = () => {
    setReEnterPass("");
    setPassword("");
    setMessage("");
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== reEnterPass) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!validate(password)) {
      setMessage("Password is not strong enough. Use 8+ chars, uppercase, lowercase, number, and symbol.");
      return;
    }

    try {
      // Send new password to backend
      const res = await api.post("/api/reset_password/", {
        uidb64: uidb64,
        token: token,
        password: password,
      });

      if (res.data.message) {
        setMessage("✅ Password reset successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000); // redirect after 2s
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid or expired reset link.");
    }

    handleClear();
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-10 rounded-xl bg-amber-300 shadow-md w-[90%] max-w-md"
      >
        <h2 className="text-xl font-bold">Reset Your Password</h2>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="border-2 rounded-sm h-10 w-full px-2"
        />

        <input
          type="password"
          value={reEnterPass}
          onChange={(e) => setReEnterPass(e.target.value)}
          placeholder="Re-enter Password"
          className="border-2 rounded-sm h-10 w-full px-2"
        />

        {message && <p className="text-sm text-red-700">{message}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-500 text-white h-10 px-6 rounded-sm transform transition hover:scale-110"
          >
            Save
          </button>
          <button
            type="reset"
            onClick={handleClear}
            className="bg-red-500 text-white h-10 px-6 rounded-sm transform transition hover:scale-110"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
