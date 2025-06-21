export async function registerDoctor(data) {
  const response = await fetch("https://localhost:7015/api/auth/doctor-register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text(); // or .json() if backend sends JSON errors
    throw new Error(error);
  }

  return await response.text();
}
