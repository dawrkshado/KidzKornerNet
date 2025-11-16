import Back from "../components/Back";
import { useEffect, useState } from "react";
import api from "../api";

function ForgotPassword() {
  const [email, set_email] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); // track message type

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      setIsError(true);
      return;
    }

    try {
      const res = await api.post("/api/forgot_password/", { email });

      if (res.data.message?.toLowerCase().includes("error")) {
        setMessage(res.data.message);
        setIsError(true);
      } else {
        setMessage("An email has been sent with password reset instructions.");
        setIsError(false);
      }

      set_email(""); // clear input
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching email:", err);
      setMessage(err.response?.data?.error || "Failed to fetch email.");
      setIsError(true);
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="h-[100vh] w-[100vw] place-items-center place-content-center">
      <Back />

      {message && (
        <p
          className={`font-semibold p-3 mt-4 h-[15%] text-xl absolute rounded-lg place-items-center content-center ${
            isError ? "bg-red-500 text-white" : "bg-green-600 text-black"
          } transition-opacity duration-500`}
        >
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="h-[100vh] w-[100vw] place-items-center place-content-center"
      >
        <div className="rounded-xl h-[50%] w-[50%] bg-amber-300 flex flex-col shadow-2xl justify-center items-center gap-10 2xl:gap-15">
          <h1 className="2xl:text-2x text-xl">
            Please enter your email to change your password.
          </h1>
          <input
            type="text"
            value={email}
            onChange={(e) => set_email(e.target.value)}
            placeholder="Email"
            className="border-2 w-[50%] rounded-md h-10 2xl:h-15"
          />

          <div className="flex gap-5">
            <button
              type="submit"
              className="bg-green-500 h-10 w-20 2xl:h-15 2xl:w-25 rounded-sm transform transition hover:scale-110"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
