const API_URL =
  "https://nexora-aqr7.onrender.com/api/chats";


function getAuthHeaders() {
  const token =
    localStorage.getItem("token");

  return {
    Authorization:
      `Bearer ${token}`,
  };
}


export async function getChats() {
  const response = await fetch(
    API_URL,
    {
      headers: getAuthHeaders(),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to load chats"
    );
  }

  return data;
}


export async function sendMessage(
  chatId,
  messages,
  documentId
) {
  const response = await fetch(
    API_URL,
    {
      method: "POST",

      headers: {
        ...getAuthHeaders(),

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        chatId,
        messages,
        documentId:
          documentId || null,
      }),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to generate response"
    );
  }

  return data;
}


export async function deleteChat(
  chatId
) {
  const response = await fetch(
    `${API_URL}/${chatId}`,
    {
      method: "DELETE",

      headers:
        getAuthHeaders(),
    }
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to delete chat"
    );
  }

  return data;
}