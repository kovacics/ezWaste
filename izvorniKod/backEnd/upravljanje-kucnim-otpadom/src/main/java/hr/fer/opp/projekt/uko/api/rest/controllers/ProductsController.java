package hr.fer.opp.projekt.uko.api.rest.controllers;

import hr.fer.opp.projekt.uko.exception.NotFoundException;
import hr.fer.opp.projekt.uko.api.model.Product;
import hr.fer.opp.projekt.uko.api.rest.dtos.CreateProductDTO;
import hr.fer.opp.projekt.uko.api.rest.services.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductsController {

    @Autowired
    private ProductsService productsService;

    @GetMapping("")
    public List<Product> getAllProducts() {
        return productsService.getProducts();
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable int id) {
        return productsService.getProduct(id).orElseThrow(() -> new NotFoundException("Product not found"));
    }

    @GetMapping("/name/{name}")
    public Product getProductByName(@PathVariable String name) {
        return productsService.getProductByName(name);
    }

    @PostMapping("")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductDTO productDTO) {
        Product product = productsService.createProduct(productDTO.getName(), productDTO.getWasteType());
        return new ResponseEntity<>(product, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public void updateProduct(@RequestBody CreateProductDTO product, @PathVariable int id) {
        productsService.updateProduct(product.getName(), product.getWasteType(), id);
    }

    @DeleteMapping("/{id}")
    @Secured({"ROLE_ADMIN", "ROLE_EMPLOYEE"})
    public void deleteProduct(@PathVariable int id) {
        productsService.deleteProduct(id);
    }
}
