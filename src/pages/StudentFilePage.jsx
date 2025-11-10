import { useEffect, useState } from "react";
import api from "../api";

function StudentFilesPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api.get("/api/files/",{
          headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Error loading files:", err);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="h-[100vh] w-[100vw] justify-items-center overflow-x-hidden">
    <div className=" p-6 w-[50%] mt-[5%] bg-amber-300 rounded-2xl shadow-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Files</h2>
     <ul className="space-y-4 ">
  {files.map((f) => (
    <li key={f.id} className="border p-3 rounded flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <strong>{f.title}</strong>
        <p className="text-sm text-gray-600">By: {f.uploader_name}</p>
        {/* Indicator */}
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
            f.file ? "bg-green-200 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {f.file ? "File" : "Link"}
        </span>
      </div>
      <div className="mt-2 md:mt-0 flex items-center gap-2">
        <a
      /*href={f.file ? `http://127.0.0.1:8000${f.file}` : f.link}*/ href={f.file ? `api.kidzkorner.site${f.file}` : f.link}
  target="_blank"
  rel="noreferrer"
  className="text-blue-600 underline"
>
  {f.file ? "Download File" : "View Link"}
</a>

      </div>
    </li>
  ))}
</ul>
    </div>
    </div>
  );
}

export default StudentFilesPage;
