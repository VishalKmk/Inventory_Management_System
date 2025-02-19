package com.inventory.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventory.model.Item;
import com.inventory.repository.ItemRepository;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
    }

    public Item createItem(Item item) {
        if (itemRepository.existsByName(item.getName())) {
            throw new RuntimeException("Item with this name already exists");
        }
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item item) {
        Item existingItem = getItemById(id);
        existingItem.setName(item.getName());
        existingItem.setDescription(item.getDescription());
        existingItem.setQuantity(item.getQuantity());
        existingItem.setPrice(item.getPrice());
        existingItem.setMinimumQuantity(item.getMinimumQuantity());
        existingItem.setReorderQuantity(item.getReorderQuantity());
        return itemRepository.save(existingItem);
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }
}
