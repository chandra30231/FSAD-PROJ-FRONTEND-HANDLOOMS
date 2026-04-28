package com.handloom.marketplace.controller;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/public")
    public List<ApiDtos.ProductResponse> getPublicProducts() {
        return productService.getPublicProducts();
    }

    @GetMapping("/{productId}")
    public ApiDtos.ProductResponse getProduct(@PathVariable Long productId) {
        return productService.getProductById(productId);
    }

    @GetMapping("/artisan/{artisanId}")
    public List<ApiDtos.ProductResponse> getArtisanProducts(@PathVariable String artisanId) {
        return productService.getArtisanProducts(artisanId);
    }

    @PostMapping("/artisan/{artisanId}")
    public ApiDtos.ProductResponse createProduct(@PathVariable String artisanId, @Valid @RequestBody ApiDtos.ProductRequest request) {
        return productService.createProduct(artisanId, request);
    }

    @PutMapping("/artisan/{artisanId}/{productId}")
    public ApiDtos.ProductResponse updateProduct(
            @PathVariable String artisanId,
            @PathVariable Long productId,
            @Valid @RequestBody ApiDtos.ProductRequest request
    ) {
        return productService.updateProduct(artisanId, productId, request);
    }

    @DeleteMapping("/artisan/{artisanId}/{productId}")
    public ApiDtos.MessageResponse deleteProduct(@PathVariable String artisanId, @PathVariable Long productId) {
        return productService.deleteProduct(artisanId, productId);
    }
}
