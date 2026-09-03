package org.launchcode.nonna.dtos;


import lombok.Getter;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.launchcode.nonna.models.Category;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class CategoryDTO {

    private int id;
    private String categoryName;
    private String categoryMap;

    public CategoryDTO(Category category){
        this.id = category.getId();
        this.categoryName = category.getCategoryName();
        this.categoryMap = category.getCategoryMap();
    }
}

