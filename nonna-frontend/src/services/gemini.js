// Spring Boot endpoint that handles Gemini requests.
const GEMINI_URL = "http://localhost:8080/gemini";

export async function getNonnaMessage({
  state,
  ingredientCount,
  selectedIngredients
}) {
  // Convert ingredients to names.
  const ingredients = (selectedIngredients || []).map(
    ingredient => ingredient.name
  );

  // Send request to Spring Boot
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

  // If  error, try to read response body
  if (!response.ok) {
    let errorDetails = "";

    try {
      // Attempt to read backend error text for debugging
      errorDetails = await response.text();
    } catch {
      errorDetails = "";
    }

    throw new Error(
      `Nonna request failed: ${response.status}${
        errorDetails ? ` - ${errorDetails}` : ""
      }`
    );
  }

  // Convert successful response 
  const data = await response.json();

  // Return  message generated.
  return data.message;
}
