import { useState, useEffect } from "react";
import CreateUserBG from "../assets/Admin/CreateUSER.webp";
import api from "../api";
import validator from "validator"

function CreateAcc() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); 
  const [roles, setRoles] = useState([]); 
  const [message, setMessage] = useState("");
  const [teacherRole, setTeacherRole] = useState("");
const [schedule, setSchedule] = useState(""); // string for selected value\;
  const [loading, setLoading] = useState(true);



      useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/users/");
        setTeacherRole(res.data);     
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert(err.response?.data?.error || "Failed to fetch users.");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);



  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/api/roles/");
        setRoles(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setMessage("");
    setRole("");
    setSchedule("");
  };



  
const validate = (value) => {
  // Check for consecutive numbers like 1234 or 9876
  const hasConsecutiveNumbers = /(0123|1234|2345|3456|4567|5678|6789|9876|8765|7654|6543|5432|4321|3210)/.test(value);

  if (hasConsecutiveNumbers) {
    return { valid: false, message: "Password cannot contain consecutive numbers like 1234 or 9876." };
  }

  // Check if password is strong
  const isStrong = validator.isStrongPassword(value, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

  if (!isStrong) {
    return { valid: false, message: "Password is not strong enough. Use at least 8 characters with uppercase, lowercase, number, and symbol." };
  }

  // If both checks pass
  return { valid: true, message: "" };
};



  const handleSubmit = async (e) => {
  e.preventDefault();

  const result = validate(password);
  if (!result.valid) {
    setMessage(result.message);
    setTimeout(() => setMessage(""), 5000);
    return;
  }

  // Count total teachers
  const teacherCount = teacherRole.filter((u) => u.role_name === "Teacher").length;

  if (role === "Teacher" && teacherCount >= 2) {
    setMessage("Only 2 teachers are allowed in the system.");
    return;
  }

  // 🔥 CHECK IF SCHEDULE IS ALREADY USED BY ANOTHER TEACHER
  if (role === "Teacher") {
    const duplicateSchedule = teacherRole.some(
      (u) => u.role_name === "Teacher" && u.class_sched === schedule
    );

    if (duplicateSchedule) {
      setMessage("A teacher is already assigned to this schedule.");
      return;
    }
  }

  try {
    const response = await api.post("/api/register/", {
      username,
      password,
      confirm_password: confirmPassword,
      email,
      first_name: firstName,
      last_name: lastName,
      role,
      class_sched: schedule,
    });

    setMessage(response.data.message);
    alert("Account created successfully!");
    handleClear();
  } catch (error) {
    console.error(error);
    setMessage(error.response?.data?.error || "Something went wrong.");
  }
};


  if (loading) { 
    return <div className="h-[100vh] w-[100vw] bg-white text-blue-400">Loading...</div>;
  }

  return (
    <div
      className="flex justify-center items-center h-[100%] w-[100wh] bg-cover"
      style={{ backgroundImage: `url(${CreateUserBG})` }}
    >
      <div className="bg-amber-300 p-5 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-4 w-[400px]">
        <h2 className="text-xl font-bold">Create New User</h2>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="m-3">
            <label className="block mb-1">First Name:</label>
            <input
              required
              value={firstName}
              onChange={(e) => {
                const value = e.target.value;
                const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
                const capitalized = onlyLetters.charAt(0).toUpperCase() + onlyLetters.slice(1);
                setFirstName(capitalized);
              }}
              className="w-full p-2 rounded-md border capitalize"
            />
          </div>

          <div className="m-3">
            <label className="block mb-1">Last Name:</label>
            <input
              required
              type="text"
              value={lastName}
              onChange={(e) => {
                const value = e.target.value;
                const onlyLetters = value.replace(/[^a-zA-Z\s]/g, "");
                const capitalized = onlyLetters.charAt(0).toUpperCase() + onlyLetters.slice(1);
                setLastName(capitalized);
              }}
              className="w-full p-2 rounded-md border capitalize"
            />
          </div>

          <div className="m-3">
            <label className="block mb-1">Username</label>
            <input
              required
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 rounded-md border"
            />
          </div>

          <div className="m-3">
            <label className="block mb-1">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md border"
            />
          </div>

          <div className="m-3">
            <label className="block mb-1">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}

              className="w-full p-2 rounded-md border"
            />
          </div>

          <div className="m-3">
            <label className="block mb-1">Confirm Password</label>
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 rounded-md border"
            />
          </div>



<div className="m-3">
            <label className="block mb-1">Role:</label>
           <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="w-full p-2 rounded-md border"
>
  <option value="" disabled>
    --Select Role--
  </option>

  {roles.map((r, index) => (
      <option key={index} value={r}>
        {r}
      </option>
    ))}
</select>
</div>

<div className="m-3">
  <label className="block mb-1">Schedule:</label>
  <select
    required={role === "Teacher"} // <-- make required only if role is Teacher
    value={schedule}
    onChange={(e) => setSchedule(e.target.value)}
    className={`w-full p-2 rounded-md border ${role !== "Teacher" ? "cursor-not-allowed text-gray-600" : ""}`}
    disabled={role !== "Teacher"} // <-- enable only if role is Teacher
  >
    <option value="" disabled>
      --Select Schedule--
    </option>
    <option value="8:00 AM to 11:00 AM">Morning: 8:00 AM to 11:00 AM</option>
    <option value="11:00 AM to 1:00 PM">Noon: 11:00 AM to 1:00 PM</option>
  </select>
</div>




          <div className="flex gap-4 justify-center mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Register
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </form>

        {message && <p className="text-red-600 text-center mt-2">{message}</p>}
      </div>
    </div>
  );
}

export default CreateAcc;
