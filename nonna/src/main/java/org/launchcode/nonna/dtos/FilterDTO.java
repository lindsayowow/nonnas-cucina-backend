package org.launchcode.nonna.dtos;

import org.launchcode.nonna.models.Filter;

public class FilterDTO {

    private int id;
    private String filterName;

    public FilterDTO(){}

    public FilterDTO(int id, String filterName) {
        this.id = id;
        this.filterName = filterName;
    }

    public FilterDTO(Filter filter){
        this.id = filter.getId();
        this.filterName = filter.getFilterName();
    }

    public int getId() {
        return id;
    }

    public String getFilterName() {
        return filterName;
    }

}
