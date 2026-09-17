const API_BASE = "http://localhost:8080";

export async function getAllDishes(token) {
  const response = await fetch(`${API_BASE}/dishes`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!response.ok) {
    console.error("Failed to fetch dishes:", response.status);
    return [];
  }

  return response.json();
}

export async function getDishById(id, token) {
  const response = await fetch(`${API_BASE}/dishes/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!response.ok) {
    console.error("Failed to fetch dish:", response.status);
    return null;
  }

  return response.json();
}

export async function getFavoriteDishes(token) {
  const dishes = await getAllDishes(token);
  return dishes.filter(dish =>
    dish.isFavorite === true ||
      dish.isFavorite === 1 ||
      dish.isFavorite === "true" ||
      dish.is_favorite === true ||
      dish.is_favorite === 1 ||
      dish.is_favorite === "true");
}