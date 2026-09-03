package org.launchcode.nonna.dtos;


import org.launchcode.nonna.models.Category;

public class CategoryDTO {

    private int id;
    private String categoryName;
    private String categoryMap;

    public CategoryDTO() {}

    public CategoryDTO(int id, String categoryName, String categoryMap) {
        this.id = id;
        this.categoryName = categoryName;
        this.categoryMap = categoryMap;
    }

    public CategoryDTO(Category category){
        this.id = category.getId();
        this.categoryName = category.getCategoryName();
        this.categoryMap = category.getCategoryMap();
    }

    public int getId() {return id;}

    public String getCategoryName() {return categoryName;}

    public String getCategoryMap() {return categoryMap;}

}
