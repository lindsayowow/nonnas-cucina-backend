const API_BASE = "http://localhost:8080";

export async function getAllDishes() {
  const response = await fetch(`${API_BASE}/dishes`);
  return response.json();
}

export async function getDishById(id) {
  const response = await fetch(`${API_BASE}/dishes/${id}`);
  return response.json();
}
