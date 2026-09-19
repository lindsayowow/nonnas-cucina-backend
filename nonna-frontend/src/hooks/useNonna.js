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

    if (hasAllCategories) {
      return nonnaStates.find(
        state => state.state === "complete"
      );
    }

    const countState = nonnaStates.find(
      state => state.ingredientCount === ingredientCount
    );

    if (countState) {
      return countState;
    }

    return nonnaStates.find(
      state => state.state === "happy"
    );
  }

  const nonnaState = getNonnaState();

  /*
   * These messages are instant.
   * Gemini does not need to respond before the UI changes.
   */
  function getInstantMessage() {
    if (showNonnaWarning) {
      return "Oh, tesoro! That ingredient isn't compatible with your diet. Choose another one for Nonna, please!";
    }

    switch (nonnaState.state) {
      case "neutral":
        return "Choose your ingredients, dear!";

      case "one-ingredient":
        return "Ah, just getting started, cara mia! Keep choosing ingredients and we'll make something delicious!";

      case "good-start":
        return "Bene, bene! Now we're making a good start. Keep going, tesoro!";

      case "encouraging":
        return "Ahh, now this pasta is taking shape! You're doing beautifully, cara mia!";

      case "almostThere":
        return "Almost there, tesoro! Just a little more and Nonna will be very happy!";

      case "happy": {
        const happyMessages = [
          "Bellissima! Look at all those wonderful ingredients. Now you're cooking like Nonna!",
          "Mamma mia! Look at this beautiful dish coming together, tesoro!",
          "Oh, bellissima! Now we have a real feast taking shape!",
          "Che bello! You're giving Nonna plenty to work with now!",
          "Mamma mia, tesoro! Look at all these delicious ingredients!",
          "Now THAT is a beautiful collection of ingredients, cara mia!"
        ];

        return happyMessages[
          ingredientCount % happyMessages.length
        ];
      }

      case "complete":
        return "Bellissima! You have all the ingredients you need. Nonna is very proud!";

      default:
        return "Bene, bene! Your dish is coming together beautifully!";
    }
  }

  /*
   * Update the message immediately whenever the selection changes.
   */
  useEffect(() => {
    setNonnaMessage(getInstantMessage());
  }, [
    ingredientCount,
    nonnaState.state,
    showNonnaWarning
  ]);

  /*
   * Stable representation of the current ingredients.
   */
  const ingredientNames = selectedIngredients
    .map(ingredient => ingredient.name)
    .join("|");

  /*
   * Gemini runs in the background.
   *
   * It is intentionally NOT called for every click.
   */
  useEffect(() => {
    let isCancelled = false;

    if (showNonnaWarning) {
      return () => {
        isCancelled = true;
      };
    }

    if (nonnaState.state === "neutral") {
      return () => {
        isCancelled = true;
      };
    }

    /*
     * Only ask Gemini at useful milestones.
     *
     * This prevents a request for every ingredient click.
     */
    const shouldAskGemini =
      ingredientCount === 1 ||
      ingredientCount === 3 ||
      ingredientCount === 5 ||
      nonnaState.state === "complete";

    if (!shouldAskGemini) {
      return () => {
        isCancelled = true;
      };
    }

    /*
     * Small debounce so a quick sequence of clicks doesn't
     * immediately create multiple Gemini requests.
     */
    const timeoutId = setTimeout(async () => {
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

        console.log("Nonna AI response:", message);

        if (isCancelled) {
          return;
        }

        if (message) {
          setNonnaMessage(message);
        }

      } catch (error) {
        console.error(
          "Nonna Gemini request failed:",
          error
        );

        /*
         * Do nothing here.
         *
         * The instant local Nonna message is already
         * displayed, so a Gemini failure doesn't make
         * the UI look broken.
         */
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      isCancelled = true;
    };

  }, [
    ingredientCount,
    nonnaState.state,
    showNonnaWarning,
    ingredientNames
  ]);

  return {
    nonnaState,
    nonnaMessage,
    ingredientCount
  };
}
