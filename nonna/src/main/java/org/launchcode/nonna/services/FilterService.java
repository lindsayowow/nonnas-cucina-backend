package org.launchcode.nonna.services;

import org.launchcode.nonna.models.Filter;
import org.launchcode.nonna.repositories.FilterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FilterService {

    public final FilterRepository filterRepository;
    public FilterService(FilterRepository filterRepository)
    {
        this.filterRepository = filterRepository;
    }

    public List<Filter> getAllFilters()
    {
        return filterRepository.findAll();
    }

    public Filter getFilterById(int id)
    {
        return filterRepository.findById(id).orElse(null);
    }

    public Filter saveFilter(Filter filter)
    {
        return filterRepository.save(filter);
    }

    public void  deleteFilterById(int id)
    {
        filterRepository.deleteById(id);
    }
}
