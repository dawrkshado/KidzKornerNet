import { useEffect, useState } from "react";
import Back from "../components/Back";
import ArchivedChildrenBg from "../assets/TeacherHomePage/ArchivedChildrenBg.webp";
import api from "../api";

function TeacherArchivedChildren() {
  const [archivedChildren, setArchivedChildren] = useState([]);
  const [selectedYear, setSelectedYear] = useState("all");
  const [schoolYears, setSchoolYears] = useState([]);

  // Helper function to parse DD/MM/YYYY date strings
  function parseDMY(dateStr) {
    if (!dateStr) return null;
    dateStr = dateStr.trim();
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  useEffect(() => {
    const fetchArchived = async () => {
      try {
        const res = await api.get("/api/archived_children/");
        const data = res.data;
        setArchivedChildren(data);

        const years = data
          .map((child) => {
            const parsed = parseDMY(child.created_at);
            return parsed ? parsed.getFullYear() : null;
          })
          .filter((y) => y !== null);

        const uniqueSchoolYears = [...new Set(years)]
          .sort((a, b) => a - b)
          .map((y) => `${y}-${y + 1}`);

        setSchoolYears(uniqueSchoolYears);
      } catch (err) {
        console.error("Error fetching archived children:", err);
      }
    };

    fetchArchived();
  }, []);

  // Filter children based on selected school year
  const filteredChildren =
    selectedYear === "all"
      ? archivedChildren
      : archivedChildren.filter((child) => {
          const parsed = parseDMY(child.created_at);
          if (!parsed) return false;
          const year = parsed.getFullYear();
          return `${year}-${year + 1}` === selectedYear;
        });

  // Delete child
  const handleDeleteChild = async (childId, childName) => {
    if (!window.confirm(`Are you sure you want to delete ${childName}?`)) return;
    try {
      const res = await api.delete("/api/delete_child/", { data: { child_id: childId } });
      alert(res.data.message || `${childName} deleted successfully!`);
      setArchivedChildren((prev) => prev.filter((c) => c.id !== childId));
    } catch (err) {
      console.error("Error deleting child:", err);
      alert(err.response?.data?.error || "Failed to delete child.");
    }
  };


  return (
    <div
      className="h-[100vh] w-[100vw] absolute bg-cover bg-no-repeat flex justify-center"
      style={{ backgroundImage: `url(${ArchivedChildrenBg})` }}
    >
      <Back />

      <div className="h-[80%] w-[80%] absolute top-[10%] place-self-center overflow-y-auto flex flex-col gap-2">
        {/* SCHOOL YEAR SELECT */}
        <select
          className="bg-white h-10 rounded-sm p-2 w-fit text-2xl self-end"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="all">All School Years</option>
          {schoolYears.map((sy) => (
            <option key={sy} value={sy}>
              {sy}
            </option>
          ))}
        </select>

        <div className="overflow-y-auto max-h-full">
          <table className="w-full bg-amber-200 text-center">
            <thead>
              <tr className="font-bold border-2 text-2xl">
                <th className="border-2 bg-amber-400 w-[20%] p-1">Name</th>
                <th className="border-2 bg-amber-400 w-[15%] p-1">Section</th>
                <th className="border-2 bg-amber-400 w-[20%] p-1">Schedule</th>
                <th className="border-2 bg-amber-400 w-[15%] p-1">Birthday</th>
                <th className="border-2 bg-amber-400 w-[15%] p-1">Date Registered</th>
                <th className="border-2 bg-amber-400 w-[25%] p-1">Parent/Guardian</th>
                <th className="border-2 bg-amber-400 w-[15%] p-1">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredChildren.map((child) => (
                <tr key={child.id} className="text-xl">
                  <td className="border-2 p-2">{child.child_full_name}</td>
                  <td className="border-2 p-2">{child.section}</td>
                  <td className="border-2 p-2">{child.class_sched}</td>
                  <td className="border-2 p-2">{child.birth_date}</td>
                  <td className="border-2 p-2">{child.created_at}</td>
                  <td className="border-2 p-2">{child.parent_full_name}</td>
                  <td className="border-2 p-2">
                    <div className="flex flex-col justify-center items-center gap-1">
                    
                      <button
                        onClick={() => handleDeleteChild(child.id, child.child_full_name)}
                        className="bg-red-800 text-white px-4 py-1 scale-90 rounded-md hover:bg-red-700 transition transform hover:scale-100"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TeacherArchivedChildren;
