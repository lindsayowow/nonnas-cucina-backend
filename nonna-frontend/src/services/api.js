const API_BASE = "http://localhost:8080";

export async function getAllDishes() {
  const response = await fetch(`${API_BASE}/dishes`);
  return response.json();
}

export async function getDishById(id) {
  const response = await fetch(`${API_BASE}/dishes/${id}`);
  return response.json();
}

export async function getFavoriteDishes() {
  const dishes = await getAllDishes();
  return dishes.filter(dish => 
    dish.isFavorite === true ||
      dish.isFavorite === 1 ||
      dish.isFavorite === "true" ||
      dish.is_favorite === true ||
      dish.is_favorite === 1 ||
      dish.is_favorite === "true");

}
