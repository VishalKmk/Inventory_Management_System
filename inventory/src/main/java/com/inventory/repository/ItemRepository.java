package com.inventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventory.model.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByName(String name);
}
