const API_URL =
  "http://localhost:3000/upload-document";


export async function uploadDocument(
  file
) {
  const token =
    localStorage.getItem("token");

  const formData =
    new FormData();

  formData.append(
    "document",
    file
  );

  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },

      body: formData,
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Document upload failed"
    );
  }

  return data;
}