import { useState, useEffect } from "react";
import api from "../api";
import Back from "../components/Back";

function TeacherUploadPage() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [uploads, setUploads] = useState([]);

  const fetchUploads = async () => {
    try {
      const res = await api.get("/api/files/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setUploads(res.data);
    } catch (err) {
      console.error("Error fetching uploads:", err);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Block images
    if (selectedFile.type.startsWith("image/")) {
      alert("Image uploads are not allowed. Please select a different file.");
      e.target.value = null;
      return;
    }

    setFile(selectedFile);
    setLink(""); // clear link if user selects a file
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      alert("Please enter a title before uploading!");
      return;
    }

    if (!file && !link.trim()) {
      alert("Please select a file or enter a link to upload!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      if (file) formData.append("file", file);
      if (link.trim()) formData.append("link", link);

      await api.post("/api/upload_file/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      alert("Upload successful!");
      setTitle("");
      setFile(null);
      setLink("");
      fetchUploads();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/api/delete_file/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setUploads((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed.");
    }
  };

  return (
    <>
      <div className="p-6 flex justify-center">
        <Back />
        <div className="h-[50vh] w-[50w]">
          <h2 className="text-2xl font-bold mb-4">Upload a File or Link</h2>

          <input
            type="text"
            placeholder="Enter file title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-2 py-1 rounded mr-3 mb-2"
          />

          <div className="mb-2">
            <input type="file" onChange={handleFileChange} className="mr-3" />
          </div>

          <div className="mb-4">
            <input
              type="url"
              placeholder="Or enter a link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="border px-2 py-1 rounded w-full"
              disabled={file !== null} // disable link if a file is selected
            />
          </div>

          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Upload
          </button>

          <h3 className="text-xl font-bold mt-8 mb-4">Your Uploads</h3>
         <ul className="space-y-4">
  {uploads.map((f) => (
    <li key={f.id} className="border p-3 rounded flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <strong>{f.title}</strong>
        <p className="text-sm text-gray-600">By: {f.uploader_name}</p>
        {/* Indicator */}
        <span
          className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
            f.file ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
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
        <button
          onClick={() => handleDelete(f.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

        </div>
      </div>
    </>
  );
}

export default TeacherUploadPage;
