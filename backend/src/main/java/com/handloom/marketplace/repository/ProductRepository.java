package com.handloom.marketplace.repository;

import com.handloom.marketplace.model.Product;
import com.handloom.marketplace.model.ProductStatus;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStatusAndStockGreaterThan(ProductStatus status, Integer stock, Sort sort);

    List<Product> findByArtisan_Id(String artisanId, Sort sort);

    long countByStatus(ProductStatus status);
}
