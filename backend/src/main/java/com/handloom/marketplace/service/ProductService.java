package com.handloom.marketplace.service;

import com.handloom.marketplace.dto.ApiDtos;
import com.handloom.marketplace.model.Product;
import com.handloom.marketplace.model.ProductStatus;
import com.handloom.marketplace.model.UserAccount;
import com.handloom.marketplace.model.UserRole;
import com.handloom.marketplace.repository.ProductRepository;
import com.handloom.marketplace.repository.UserAccountRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserAccountRepository userAccountRepository;

    public ProductService(ProductRepository productRepository, UserAccountRepository userAccountRepository) {
        this.productRepository = productRepository;
        this.userAccountRepository = userAccountRepository;
    }

    // ✅ PUBLIC PRODUCTS
    @Transactional(readOnly = true)
    public List<ApiDtos.ProductResponse> getPublicProducts() {
        return productRepository
                .findByStatusAndStockGreaterThan(ProductStatus.ACTIVE, 0, Sort.by("id"))
                .stream()
                .map(this::mapToDto)   // ✅ FIXED
                .toList();
    }

    // ✅ GET BY ID
    @Transactional(readOnly = true)
    public ApiDtos.ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));
        return mapToDto(product);  // ✅ FIXED
    }

    // ✅ ARTISAN PRODUCTS
    @Transactional(readOnly = true)
    public List<ApiDtos.ProductResponse> getArtisanProducts(String artisanId) {
        return productRepository.findByArtisan_Id(artisanId, Sort.by("id"))
                .stream()
                .map(this::mapToDto)  // ✅ FIXED
                .toList();
    }

    // ✅ CREATE
    @Transactional
    public ApiDtos.ProductResponse createProduct(String artisanId, ApiDtos.ProductRequest request) {
        UserAccount artisan = getArtisan(artisanId);

        Product product = new Product(
                request.name().trim(),
                request.price(),
                request.region().trim(),
                artisan,
                normalizeImage(request.image()),
                request.category().trim(),
                request.description().trim(),
                request.stock(),
                ProductStatus.fromValue(request.status())
        );

        return mapToDto(productRepository.save(product)); // ✅ FIXED
    }

    // ✅ UPDATE
    @Transactional
    public ApiDtos.ProductResponse updateProduct(String artisanId, Long productId, ApiDtos.ProductRequest request) {
        getArtisan(artisanId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));

        if (!product.getArtisan().getId().equals(artisanId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can update only your own products.");
        }

        product.setName(request.name().trim());
        product.setPrice(request.price());
        product.setRegion(request.region().trim());
        product.setImage(normalizeImage(request.image()));
        product.setCategory(request.category().trim());
        product.setDescription(request.description().trim());
        product.setStock(request.stock());
        product.setStatus(ProductStatus.fromValue(request.status()));

        return mapToDto(productRepository.save(product)); // ✅ FIXED
    }

    // ✅ DELETE
    @Transactional
    public ApiDtos.MessageResponse deleteProduct(String artisanId, Long productId) {
        getArtisan(artisanId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));

        if (!product.getArtisan().getId().equals(artisanId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can delete only your own products.");
        }

        productRepository.delete(product);
        return new ApiDtos.MessageResponse(true, "Product deleted successfully.");
    }

    // ✅ SAFE DTO MAPPING (MOST IMPORTANT FIX)
    private ApiDtos.ProductResponse mapToDto(Product p) {
        return new ApiDtos.ProductResponse(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getRegion(),
                p.getArtisan().getName(),   // safe inside transaction
                p.getArtisan().getId(),
                p.getImage(),
                p.getCategory(),
                p.getDescription(),
                p.getStock(),
                p.getStatus().name()
        );
    }

    private UserAccount getArtisan(String artisanId) {
        UserAccount artisan = userAccountRepository.findById(artisanId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Artisan not found."));

        if (artisan.getRole() != UserRole.ARTISAN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The selected user is not an artisan.");
        }

        return artisan;
    }

    private String normalizeImage(String image) {
        String value = image == null ? "" : image.trim();
        return value.isBlank()
                ? "https://placehold.co/600x450?text=Handloom+Product"
                : value;
    }
}