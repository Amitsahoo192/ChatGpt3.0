import { useRef, useState } from "react";
import { uploadDocument } from "../../services/documentService.js";

function DocumentUpload({ onUpload }) {
  const fileInputRef = useRef(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  function handleButtonClick() {
    fileInputRef.current?.click();
  }


  async function handleFileChange(e) {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data =
        await uploadDocument(file);

      console.log(
        "DOCUMENT UPLOAD:",
        data
      );

      onUpload(data);

    } catch (error) {
      console.error(
        "DOCUMENT UPLOAD ERROR:",
        error
      );

      setError(error.message);

    } finally {
      setLoading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  }


  return (
    <div className="flex items-center">

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.txt,.doc,.docx"
        onChange={handleFileChange}
        className="hidden"
      />


      <button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        title="Upload document"
        className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition disabled:opacity-50"
      >
        {loading ? "..." : "＋"}
      </button>


      {error && (
        <span className="ml-2 text-xs text-red-400 max-w-[180px]">
          {error}
        </span>
      )}

    </div>
  );
}

export default DocumentUpload;