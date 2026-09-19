package org.launchcode.nonna.dtos;

/**
 * DTO returned to the frontend containing the final Gemini-generated message.
 */
public class NonnaMessageResponseDTO {

    private String message;

    public NonnaMessageResponseDTO() {}

    public NonnaMessageResponseDTO(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
