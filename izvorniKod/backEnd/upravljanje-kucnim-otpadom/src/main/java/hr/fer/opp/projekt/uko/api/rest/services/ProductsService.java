package hr.fer.opp.projekt.uko.api.rest.services;

import hr.fer.opp.projekt.uko.api.model.enums.WasteType;
import hr.fer.opp.projekt.uko.api.dao.ProductsRepository;
import hr.fer.opp.projekt.uko.api.model.Product;
import hr.fer.opp.projekt.uko.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;
import java.util.Optional;

@Service
public class ProductsService {

    @Autowired
    private ProductsRepository productsRepository;

    public List<Product> getProducts() {
        return productsRepository.findAll();
    }

    public Optional<Product> getProduct(int id) {
        return productsRepository.findById(id);
    }

    public Product getProductByName(String name) {
        return productsRepository.findByNameIgnoreCase(name);
    }

    public void deleteProduct(int id) {
        productsRepository.deleteById(id);
    }

    public Product createProduct(String name, WasteType wasteType) {
        Assert.hasText(name, "Name must be given");
        Assert.notNull(wasteType, "Waste type must be given");

        return productsRepository.save(new Product(name, wasteType));
    }

    public Product updateProduct(String name, WasteType wasteType, int id) {
        Assert.hasText(name, "Name must be given");
        Assert.notNull(wasteType, "Waste type must be given");

        Product toUpdate = productsRepository.findById(id).orElseThrow(()->new BadRequestException("Product doesn't exist"));
        toUpdate.setName(name);
        toUpdate.setWasteType(wasteType);
        return productsRepository.save(toUpdate);
    }
}
