package org.launchcode.nonna.dtos;

import org.launchcode.nonna.models.Filter;

public class FilterDTO {

    private int id;
    private String filterLabel;
    private String filterKey;

    public FilterDTO(){}

    public FilterDTO(int id, String filterLabel,  String filterKey) {
        this.id = id;
        this.filterLabel = filterLabel;
        this.filterKey = filterKey;
    }

    public FilterDTO(Filter filter){
        this.id = filter.getId();
        this.filterLabel = filter.getFilterLabel();
        this.filterKey = filter.getFilterKey();
    }

    public int getId() {
        return id;
    }

    public String getFilterLabel() {
        return filterLabel;
    }

    public String getFilterKey() {
        return filterKey;
    }

}
