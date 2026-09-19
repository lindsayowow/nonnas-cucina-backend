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

    // READ -- all filters, as DTOs
    public List<FilterDTO> getAllFilterDTOs() {
        List<Filter> filters = filterRepository.findAll();
        return filters.stream()
                .map(FilterDTO::new)
                .toList();
    }

    // READ -- single filter by id, as a DTO
    public FilterDTO getByFilterDTOId(int id) {
        return filterRepository.findById(id)
                .map(FilterDTO::new)
                .orElse(null);
    }

    // CREATE
    public Filter saveFilter(Filter filter) {
        return filterRepository.save(filter);
    }

    // UPDATE
    public Filter updateFilter(Integer id, Filter updatedFilter) {
        Filter existing = filterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Filter not found"));

        existing.setFilterLabel(updatedFilter.getFilterLabel());
        existing.setFilterKey(updatedFilter.getFilterKey());
        existing.setExcludesAllergen(updatedFilter.isExcludesAllergen());

        return filterRepository.save(existing);
    }

    // DELETE
    public void deleteFilter(int id) {
        filterRepository.deleteById(id);
    }
}