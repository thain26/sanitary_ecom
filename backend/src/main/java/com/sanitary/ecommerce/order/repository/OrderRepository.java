package com.sanitary.ecommerce.order.repository;
import com.sanitary.ecommerce.order.entity.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderCode(String orderCode);
    
    Page<Order> findByStatusAndOrderCodeContainingIgnoreCase(String status, String orderCode, Pageable pageable);
    Page<Order> findByStatus(String status, Pageable pageable);
    Page<Order> findByOrderCodeContainingIgnoreCase(String orderCode, Pageable pageable);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByStatusOrderByCreatedAtDesc(String status);

    @Query("SELECT SUM(o.total) FROM Order o WHERE o.status = 'DELIVERED'")
    BigDecimal sumDeliveredRevenue();

    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> countByStatus();

    @Query(value = "SELECT TO_CHAR(created_at, 'YYYY-MM') as month, SUM(total) as revenue FROM orders WHERE status = 'DELIVERED' GROUP BY 1 ORDER BY 1", nativeQuery = true)
    List<Object[]> monthlyRevenue();
}
