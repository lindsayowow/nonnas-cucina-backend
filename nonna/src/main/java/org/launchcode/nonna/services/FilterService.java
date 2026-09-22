package org.launchcode.nonna.services;

import org.launchcode.nonna.dtos.FilterDTO;
import org.launchcode.nonna.models.Filter;
import org.launchcode.nonna.repositories.FilterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FilterService {

    private final FilterRepository filterRepository;

    public FilterService(FilterRepository filterRepository) {
        this.filterRepository = filterRepository;
    }

    // READ all filter entities from the database
    public List<FilterDTO> getAllFilterDTOs() {
        List<Filter> filters = filterRepository.findAll();

        // Convert each Filter into a FilterDTO
        return filters.stream()
                .map(FilterDTO::new)
                .toList();
    }

    // READ -- single filter by id and convert to DTO if present
    public FilterDTO getByFilterDTOId(int id) {
        return filterRepository.findById(id)
                .map(FilterDTO::new)
                .orElse(null);
    }

    // CREATE new filter - admin function - future use
    public Filter saveFilter(Filter filter) {
        return filterRepository.save(filter);
    }

    // UPDATE filter - admin future use
    public Filter updateFilter(Integer id, Filter updatedFilter) {
        Filter existing = filterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filter not found"));

        // Apply updates to the filter - admin future use
        existing.setFilterLabel(updatedFilter.getFilterLabel());
        existing.setFilterKey(updatedFilter.getFilterKey());
        existing.setExcludesAllergen(updatedFilter.isExcludesAllergen());

        // Save filter to the database - admin only future use
        return filterRepository.save(existing);
    }

    // DELETE filter by id- future admin use
    public void deleteFilter(int id) {
        filterRepository.deleteById(id);
    }
}
