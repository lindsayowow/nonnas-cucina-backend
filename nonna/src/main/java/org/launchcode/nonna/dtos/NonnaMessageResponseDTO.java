package org.launchcode.nonna.dtos;

/**
 * Response DTO returned to the frontend containing Nonna's message.
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
