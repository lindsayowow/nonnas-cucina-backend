import { useEffect, useState } from "react";
import nonnaStates from "../data/nonna.json";
import { getNonnaMessage } from "../services/gemini";

export default function useNonna({
  selectedIngredients,
  showNonnaWarning
}) {
  const [nonnaMessage, setNonnaMessage] = useState(
    "Choose your ingredients, dear!"
  );

  const ingredientCount = selectedIngredients.length;

  function getNonnaState() {

    // Warning takes priority over everything.
    if (showNonnaWarning) {
      return nonnaStates.find(
        state => state.state === "warning"
      );
    }

    // These are the categories required for a complete dish.
    const requiredCategories = [
      "protein",
      "veggie",
      "noodle",
      "sauce",
      "topping"
    ];

    const selectedCategories = new Set(
      selectedIngredients.map(
        ingredient => ingredient.category
      )
    );

    const hasAllCategories =
      requiredCategories.every(
        category => selectedCategories.has(category)
      );

    // Complete takes priority over the normal count progression.
    if (hasAllCategories) {
      return nonnaStates.find(
        state => state.state === "complete"
      );
    }

    // Otherwise use the numeric ingredient progression
    // from nonna.json.
    const countState = nonnaStates.find(
      state => state.ingredientCount === ingredientCount
    );

    if (countState) {
      return countState;
    }

    // 6+ ingredients uses the happy state.
    return nonnaStates.find(
      state => state.state === "happy"
    );
  }

  const nonnaState = getNonnaState();

  useEffect(() => {

    let isCancelled = false;

    async function fetchMessage() {

      // 0 ingredients.
      if (nonnaState.state === "neutral") {
        setNonnaMessage(
          "Choose your ingredients, dear!"
        );
        return;
      }

      // Excluded ingredient.
      if (nonnaState.state === "warning") {
        setNonnaMessage(
          "Oh, tesoro! That ingredient isn't compatible with your diet. Choose another one for Nonna, please!"
        );
        return;
      }

      // All required categories selected.
      const backendState =
        nonnaState.state === "complete"
          ? "complete"
          : "progress";

      console.log("Sending to Nonna:", {
        state: backendState,
        ingredientCount,
        ingredients: selectedIngredients.map(
          ingredient => ingredient.name
        )
      });

      try {

        const message = await getNonnaMessage({
          state: backendState,
          ingredientCount,
          selectedIngredients
        });

        console.log("Nonna response:", message);

        if (!isCancelled) {
          setNonnaMessage(
            message ||
            "Bene, bene! Your dish is coming together beautifully!"
          );
        }

      } catch (error) {

        console.error(
          "Nonna Gemini request failed:",
          error
        );

        if (!isCancelled) {
          setNonnaMessage(
            "Nonna is having trouble talking to the kitchen!"
          );
        }
      }
    }

    fetchMessage();

    return () => {
      isCancelled = true;
    };

  }, [
    nonnaState.state,
    ingredientCount,
    selectedIngredients
  ]);

  return {
    nonnaState,
    nonnaMessage,
    ingredientCount
  };
}
