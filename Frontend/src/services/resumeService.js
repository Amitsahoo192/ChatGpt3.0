const API_URL = "https://nexora-aqr7.onrender.com/api/resume/analyze";

export async function analyzeResume(file) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Resume analysis failed."
    );
  }

  return data;
}