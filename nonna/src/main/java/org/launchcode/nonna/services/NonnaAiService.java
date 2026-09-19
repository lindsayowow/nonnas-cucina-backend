package org.launchcode.nonna.services;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.launchcode.nonna.dtos.NonnaMessageRequestDTO;
import org.springframework.stereotype.Service;

@Service
public class NonnaAiService {

    private final Client geminiClient = new Client();

    public String generateMessage(NonnaMessageRequestDTO request) {
        String prompt = buildPrompt(request);

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
    }

    private String buildPrompt(NonnaMessageRequestDTO request) {

        String ingredientsList =
                (request.getIngredients() == null ||
                        request.getIngredients().isEmpty())
                        ? "none"
                        : String.join(", ", request.getIngredients());

        return """
                You are Nonna, an affectionate Italian grandmother reacting to a user building a custom pasta dish.

                State: %s
                Ingredient count: %d
                Ingredients: %s

                Guidelines:
                - Speak warmly, humorously, and encouragingly.
                - Use 1–2 sentences maximum.
                - Never mention AI or Gemini.
                - If state is "neutral", ALWAYS say: "Choose your ingredients, dear!"
                - If state is "warning", gently warn about dietary incompatibility.
                - If state is "complete", praise the user for selecting all required categories.
                - If ingredientCount >= 5, generate a NEW unique message each time.
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
                return "Oh no! That ingredient is not compatible with your diet!";

            case "complete":
                return "Bellissima! This dish looks delicious and complete!";
        }

        switch (count) {
            case 1:
                return "Just one ingredient? Cara mia, add at least one more to make it special! But if you insist, I'll cook it for you...";

            case 2:
                return "That's a good start! Add a few more ingredients!";

            case 3:
                return "Bene, bene! Keep going, you're doing wonderful!";

            case 4:
                return "Ah, I see where you're going with this! Add some more, tesoro!";
        }

        return "Magnifico! Your dish is coming together beautifully!";
    }
}