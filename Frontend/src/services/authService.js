const API_URL = "http://localhost:3000/api/auth";

export async function login(
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  localStorage.setItem(
    "token",
    data.token
  );

  return data;
}


export async function register(
  name,
  email,
  password
) {
  const response = await fetch(
    `${API_URL}/register`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Registration failed"
    );
  }

  return data;
}


export async function getMe() {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "No authentication token"
    );
  }

  const response = await fetch(
    `${API_URL}/me`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Authentication failed"
    );
  }

  return data.user;
}
export async function updateProfile(name) {
  const token =localStorage.getItem("token");
  if (!token) {
    throw new Error(
      "No authentication token"
    );
  }
  const response = await fetch(
    `${API_URL}/profile`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        name,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to update profile"
    );
  }

  return data;
}

export async function changePassword(
  currentPassword,
  newPassword
) {
  const token =
    localStorage.getItem("token");

  if (!token) {
    throw new Error(
      "No authentication token"
    );
  }

  const response = await fetch(
    `${API_URL}/password`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to change password"
    );
  }

  return data;
}


export function logout() {
  localStorage.removeItem(
    "token"
  );
}


export function getToken() {
  return localStorage.getItem(
    "token"
  );
}