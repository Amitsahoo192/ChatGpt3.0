import { useState } from "react";

function DocumentUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e) {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("document", file);

      const response = await fetch(
        "http://localhost:3000/upload-document",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      console.log("UPLOAD RESULT:", data);

      onUpload(data);

    } catch (error) {
      console.error(
        "FILE UPLOAD ERROR:",
        error
      );

      alert("Failed to upload PDF.");

    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <label
      className={`
        cursor-pointer
        w-10 h-10
        rounded-xl
        flex items-center justify-center
        bg-neutral-800
        hover:bg-neutral-700
        transition
        ${uploading ? "opacity-50 cursor-not-allowed" : ""}
      `}
      title="Upload PDF"
    >
      {uploading ? "..." : "📎"}

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="hidden"
        disabled={uploading}
      />
    </label>
  );
}

export default DocumentUpload;