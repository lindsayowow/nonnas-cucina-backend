package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.FilterDTO;
import org.launchcode.nonna.dtos.IngredientDTO;
import org.launchcode.nonna.models.Filter;
import org.launchcode.nonna.models.Ingredient;
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

    public List<FilterDTO> getAllFilterDTOs() {
        List<Filter> filters = filterRepository.findAll();
        return filters.stream()
                .map(FilterDTO::new)
                .toList();
    }

    public FilterDTO getByFilterDTOId(int id) {
        return filterRepository.findById(id)
                .map(FilterDTO::new)
                .orElse(null);
    }

    public Filter saveFilter(Filter filter)
    {
        return filterRepository.save(filter);
    }

    public void  deleteFilterById(int id)
    {
        filterRepository.deleteById(id);
    }

    private FilterDTO convertToDTO(Filter filter) {
        return new FilterDTO(filter);
    }
}
