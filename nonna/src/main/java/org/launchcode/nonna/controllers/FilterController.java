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

    @PostMapping
    public FilterDTO createFilter(@RequestBody Filter filter) {
        Filter saved = filterService.saveFilter(filter);
        return new FilterDTO(saved);
    }

    @PutMapping("/{id}")
    public FilterDTO updateFilter(@PathVariable Integer id, @RequestBody Filter filter) {
        Filter updated = filterService.updateFilter(id, filter);
        return new FilterDTO(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteFilter(@PathVariable int id) {
        filterService.deleteFilter(id);
    }
}
