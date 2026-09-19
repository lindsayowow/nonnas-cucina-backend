const GEMINI_URL = "http://localhost:8080/gemini";

export async function getNonnaMessage({
  state,
  ingredientCount,
  selectedIngredients
}) {
  const ingredients = (selectedIngredients || []).map(
    ingredient => ingredient.name
  );

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      state,
      ingredientCount,
      ingredients
    })
  });

  if (!response.ok) {
    throw new Error(
      `Nonna request failed: ${response.status}`
    );
  }

  const data = await response.json();

  return data.message;
}
