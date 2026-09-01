package org.launchcode.nonna.dtos;


import org.launchcode.nonna.models.Category;

public class CategoryDTO {

    private int id;
    private String categoryName;

    public CategoryDTO() {}

    public CategoryDTO(int id, String categoryName) {
        this.id = id;
        this.categoryName = categoryName;
    }

    public CategoryDTO(Category category){
        this.id = category.getId();
        this.categoryName = category.getCategoryName();
    }

    public int getId() {return id;}

    public String getCategoryName() {return categoryName;}

}
