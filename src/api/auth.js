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

export async function searchDoctors(query) {
  const response = await fetch(`https://localhost:7015/api/auth/search-doctors?query=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error("No matching doctors found.");
  }
  return await response.json();
}

export async function registerPatient(data) {
  const response = await fetch("https://localhost:7015/api/auth/patient-register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }
  return await response.text();
}

export async function loginPatient(data) {
  const response = await fetch("https://localhost:7015/api/auth/patient-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(await response.text());
  return await response.json(); // 👈 changed from `.text()` to `.json()`
}

export async function loginDoctor(data) {
  const response = await fetch("https://localhost:7015/api/auth/doctor-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(await response.text());
  return await response.json(); // 👈 changed here too
}

