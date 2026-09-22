package org.launchcode.nonna.controllers;

import org.launchcode.nonna.dtos.FilterDTO;
import org.launchcode.nonna.models.Filter;
import org.launchcode.nonna.services.FilterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/filters")
public class FilterController {

    private final FilterService filterService;

    public FilterController(FilterService filterService) {
        this.filterService = filterService;
    }

    @GetMapping
    public List<FilterDTO> getAllFilters() {
        return filterService.getAllFilterDTOs();
    }

    @GetMapping("/{id}")
    public FilterDTO getByFilterDTOId(@PathVariable int id) {
        return filterService.getByFilterDTOId(id);
    }

    @PostMapping  // Save a new filter entity to the database - future admin use
    public FilterDTO createFilter(@RequestBody Filter filter) {
        Filter saved = filterService.saveFilter(filter);
        return new FilterDTO(saved);
    }

    @PutMapping("/{id}")          // Update an existing filter with new values - future admin use
    public FilterDTO updateFilter(@PathVariable Integer id, @RequestBody Filter filter) {
        Filter updated = filterService.updateFilter(id, filter);
        return new FilterDTO(updated);
    }

    @DeleteMapping("/{id}")         // Remove filter from the database by ID - future admin use
    public void deleteFilter(@PathVariable int id) {
        filterService.deleteFilter(id);
    }
}
