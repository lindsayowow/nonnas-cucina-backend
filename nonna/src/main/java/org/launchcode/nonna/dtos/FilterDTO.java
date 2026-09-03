package org.launchcode.nonna.dtos;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.launchcode.nonna.models.Filter;

@Getter
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FilterDTO {

    private int id;
    private String filterLabel;
    private String filterKey;
    private boolean excludesAllergen;

    public FilterDTO(Filter filter){
        this.id = filter.getId();
        this.filterLabel = filter.getFilterLabel();
        this.filterKey = filter.getFilterKey();
        this.excludesAllergen = filter.isExcludesAllergen();
    }

}
