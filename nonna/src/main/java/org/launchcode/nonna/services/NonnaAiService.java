package org.launchcode.nonna.services;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.launchcode.nonna.dtos.NonnaMessageRequestDTO;
import org.springframework.stereotype.Service;

@Service
public class NonnaAiService {

    private final Client geminiClient = new Client();

    // Generates Nonna's message via Gemini, falling back to a local
    // hand-written message if the call fails for any reason (network error,
    // rate limit, invalid key, blank response) -- this is an enhancement,
    // not something the UI should ever hard-fail on.
    public String generateMessage(NonnaMessageRequestDTO request) {

        String prompt = buildPrompt(request);

        try {
            GenerateContentResponse response =
                    geminiClient.models.generateContent(
                            "gemini-3.5-flash",
                            prompt,
                            null
                    );

            String text = response.text();

            if (text == null || text.isBlank()) {
                return fallbackMessage(request);
            }

            return text.trim();
        } catch (Exception e) {
            // Gemini call itself failed (network, quota, auth, etc.) --
            // previously this propagated as an unhandled exception instead
            // of using the fallback message that exists specifically for
            // this purpose.
            return fallbackMessage(request);
        }
    }

    private String buildPrompt(NonnaMessageRequestDTO request) {

        String ingredientsList =
                (request.getIngredients() == null ||
                        request.getIngredients().isEmpty())
                        ? "none"
                        : String.join(", ", request.getIngredients());

        return """
                You are Nonna, an affectionate, funny, and encouraging Italian grandmother helping a user build a custom pasta dish.

                State: %s
                Ingredient count: %d
                Ingredients: %s

                Your job is to react naturally to the user's current pasta selections.

                INGREDIENT PROGRESSION:
                - 0 ingredients: The user has not started yet. Encourage them to choose ingredients.
                - 1 ingredient: The user has made a small start. Encourage them to keep building the dish.
                - 2 ingredients: The dish is beginning to come together. Give warm encouragement.
                - 3 ingredients: The dish is taking shape. Encourage the user to keep going.
                - 4 ingredients: The dish is almost there. Encourage them to add the final ingredients.
                - 5 or more ingredients: The user has made a substantial selection. Celebrate their creativity and make the response feel fresh and unique.
                - complete: The user has selected all required ingredient categories. Celebrate the finished dish enthusiastically.
                - warning: The user selected an ingredient that is excluded by their dietary preferences. Clearly but gently warn them that the ingredient is not compatible and encourage them to choose another ingredient.

                IMPORTANT RULES:
                - Speak like a warm, affectionate Italian grandmother.
                - Be playful, encouraging, and occasionally use Italian expressions such as "cara mia", "tesoro", "bene", "bravissima", or "bellissima".
                - Use 1–2 sentences maximum.
                - Keep every response short enough to fit naturally inside a speech bubble.
                - Never mention AI, Gemini, prompts, programming, or being a language model.
                - Never list the user's ingredients unless it sounds natural to do so.
                - Generate a fresh response based on the current ingredient count and ingredients.
                - Do not use the exact same response repeatedly when the user's selections change.

                STATE-SPECIFIC RULES:

                If state is "neutral":
                ALWAYS respond exactly:
                "Choose your ingredients, dear!"

                If state is "warning":
                Clearly communicate that the selected ingredient is not compatible with the user's dietary preferences.
                Be gentle rather than judgmental.
                Encourage the user to choose another ingredient.

                Example style:
                "Oh, tesoro! That ingredient isn't compatible with your diet. Choose another one for Nonna, please!"

                If state is "complete":
                Enthusiastically praise the user for selecting all required ingredient categories and creating a complete pasta dish.

                If state is "progress":
                Use the ingredient count to determine the appropriate reaction:
                - 1 = small start
                - 2 = good start
                - 3 = building momentum
                - 4 = almost there
                - 5+ = celebrate the creative selection

                For ingredientCount >= 5:
                ALWAYS create a new and varied message rather than relying on a fixed response.

                Do not claim the dish is complete unless state is "complete".

                Do not warn the user unless state is "warning".

                Return ONLY the message Nonna should say to the user.
                """.formatted(
                request.getState(),
                request.getIngredientCount(),
                ingredientsList
        );
    }

    private String fallbackMessage(NonnaMessageRequestDTO request) {

        String state = request.getState();
        int count = request.getIngredientCount();

        switch (state) {

            case "neutral":
                return "Choose your ingredients, dear!";

            case "warning":
                return "Oh, tesoro! That ingredient isn't compatible with your diet. Choose another one for Nonna, please!";

            case "complete":
                return "Bellissima! You have all the ingredients you need. Nonna is very proud!";

            case "progress":
                switch (count) {

                    case 1:
                        return "Ah, just getting started, cara mia! Keep choosing ingredients and we'll make something delicious!";

                    case 2:
                        return "Bene, bene! Now we're making a good start. Keep going, tesoro!";

                    case 3:
                        return "Ahh, now this pasta is taking shape! You're doing beautifully, cara mia!";

                    case 4:
                        return "Almost there, tesoro! Just a little more and Nonna will be very happy!";

                    default:
                        return "Bellissima! Look at all those wonderful ingredients. Now you're cooking like Nonna!";
                }

            default:
                return "Bene, bene! Your dish is coming together beautifully!";
        }
    }
}