import archivedUsersBG from "../assets/Admin/archivedUsersBG.webp";
import ArchivedUsersText from "../assets/Admin/ArchivedUsersText.webp";
import Back from "../components/Back";
import api from "../api";
import { useEffect, useState } from "react";

function ArchivedUsers() {
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");

  // 🔥 Delete User Function (copied from ManageAcc)
  const handleDeleteUser = async (userId, username) => {
    try {
      const infoRes = await api.get(`/api/users/${userId}/delete-info/`);
      const deletionInfo = infoRes.data;

      let warningMessage = `⚠️ WARNING: Deleting user "${username}" will PERMANENTLY delete:\n\n`;

      if (deletionInfo.children_count > 0) {
        warningMessage += `• ${deletionInfo.children_count} child/children\n`;
        if (deletionInfo.time_completions_count > 0) {
          warningMessage += `  → ${deletionInfo.time_completions_count} game progress records\n`;
        }
      }

      if (deletionInfo.uploaded_files_count > 0) {
        warningMessage += `• ${deletionInfo.uploaded_files_count} uploaded file(s)\n`;
      }

      if (!deletionInfo.has_related_data) {
        warningMessage += `• No related data found\n`;
      }

      warningMessage += `\nThis action CANNOT be undone!\n\nAre you sure you want to proceed?`;

      if (!window.confirm(warningMessage)) return;
    } catch (err) {
      if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
        return;
      }
    }

    try {
      await api.delete(`/api/users/${userId}/delete/`);
      setArchivedUsers(prev => prev.filter(u => u.id !== userId));
      setFilteredUsers(prev => prev.filter(u => u.id !== userId));
      alert(`User "${username}" deleted successfully!`);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  };

  useEffect(() => {
    const fetchArchivedUsers = async () => {
      try {
        const res = await api.get("/api/users/archived/");
        const users = res.data;

        setArchivedUsers(users);
        setFilteredUsers(users);

        const yearsSet = new Set();
        users.forEach(user => {
          if (user.date_joined) {
            const [d, m, y] = user.date_joined.split("/");
            yearsSet.add(parseInt(y, 10));
          }
        });

        const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
        setSchoolYears(sortedYears.map(year => `${year}-${year + 1}`));

      } catch (err) {
        console.error(err);
      }
    };

    fetchArchivedUsers();
  }, []);


  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);

    if (year === "all") {
      setFilteredUsers(archivedUsers);
    } else {
      const startYear = parseInt(year.split("-")[0], 10);

      const filtered = archivedUsers.filter(user => {
        if (!user.date_joined) return false;
        const [d, m, y] = user.date_joined.split("/");
        return parseInt(y, 10) === startYear;
      });

      setFilteredUsers(filtered);
    }
  };

  return (
    <div
      className="h-[100vh] w-[100vw] absolute bg-cover bg-no-repeat flex justify-center overflow-hidden"
      style={{ backgroundImage: `url(${archivedUsersBG})` }}
    >
      <Back />
      <div className="absolute 2xl:top-5 right-5">
        <img className="h-30 w-65 2xl:h-45 2xl:w-100" src={ArchivedUsersText} alt="" />
      </div>

      <div className="h-[90%] w-[80%] absolute top-[20%] overflow-y-auto flex flex-col gap-2">
        
        {/* Dropdown */}
        <select
          className="bg-white h-10 rounded-sm p-2 text-2xl self-end"
          value={selectedYear}
          onChange={handleYearChange}
        >
          <option value="all">All Years</option>
          {schoolYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Table */}
        <table className="w-full bg-amber-200 text-center border-collapse border">
          <thead>
            <tr>
              <th className="border-2 bg-amber-400 p-2">Username</th>
              <th className="border-2 bg-amber-400 p-2">First Name</th>
              <th className="border-2 bg-amber-400 p-2">Last Name</th>
              <th className="border-2 bg-amber-400 p-2">Email</th>
              <th className="border-2 bg-amber-400 p-2">Role</th>
              <th className="border-2 bg-amber-400 p-2">Schedule</th>
              <th className="border-2 bg-amber-400 p-2">Date Joined</th>

              {/* 🔥 Add Actions Column */}
              <th className="border-2 bg-amber-400 p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="border-2 p-2">{user.username}</td>
                <td className="border-2 p-2">{user.first_name || "N/A"}</td>
                <td className="border-2 p-2">{user.last_name || "N/A"}</td>
                <td className="border-2 p-2">{user.email || "N/A"}</td>
                <td className="border-2 p-2">{user.role_name || "N/A"}</td>
                <td className="border-2 p-2">{user.class_sched || "N/A"}</td>
                <td className="border-2 p-2">{user.date_joined}</td>

                {/* 🔥 DELETE BUTTON HERE */}
                <td className="border-2 p-2">
                  <button
                    onClick={() => handleDeleteUser(user.id, user.username)}
                    className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-500 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="8" className="border-2 p-4 text-xl">No users found.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default ArchivedUsers;
