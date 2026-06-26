package com.sanitary.ecommerce.admin.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AdminDashboardStatsDto {
    private BigDecimal totalRevenue;
    private long totalOrders;
    private long totalCustomers;
    private long totalProducts;
    private Map<String, Long> orderStatusCounts;
    private List<ProductSummary> topProducts;
    private List<ProductSummary> lowStockProducts;
    private List<MonthlyRevenue> monthlyRevenue;

    // Getters and Setters

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Map<String, Long> getOrderStatusCounts() {
        return orderStatusCounts;
    }

    public void setOrderStatusCounts(Map<String, Long> orderStatusCounts) {
        this.orderStatusCounts = orderStatusCounts;
    }

    public List<ProductSummary> getTopProducts() {
        return topProducts;
    }

    public void setTopProducts(List<ProductSummary> topProducts) {
        this.topProducts = topProducts;
    }

    public List<ProductSummary> getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(List<ProductSummary> lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public List<MonthlyRevenue> getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(List<MonthlyRevenue> monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public static class ProductSummary {
        private Long id;
        private String name;
        private String modelCode;
        private int stock;
        private int soldCount;
        private BigDecimal basePrice;
        private BigDecimal salePrice;

        public ProductSummary() {}

        public ProductSummary(Long id, String name, String modelCode, int stock, int soldCount, BigDecimal basePrice, BigDecimal salePrice) {
            this.id = id;
            this.name = name;
            this.modelCode = modelCode;
            this.stock = stock;
            this.soldCount = soldCount;
            this.basePrice = basePrice;
            this.salePrice = salePrice;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getModelCode() {
            return modelCode;
        }

        public void setModelCode(String modelCode) {
            this.modelCode = modelCode;
        }

        public int getStock() {
            return stock;
        }

        public void setStock(int stock) {
            this.stock = stock;
        }

        public int getSoldCount() {
            return soldCount;
        }

        public void setSoldCount(int soldCount) {
            this.soldCount = soldCount;
        }

        public BigDecimal getBasePrice() {
            return basePrice;
        }

        public void setBasePrice(BigDecimal basePrice) {
            this.basePrice = basePrice;
        }

        public BigDecimal getSalePrice() {
            return salePrice;
        }

        public void setSalePrice(BigDecimal salePrice) {
            this.salePrice = salePrice;
        }
    }

    public static class MonthlyRevenue {
        private String month;
        private BigDecimal revenue;

        public MonthlyRevenue() {}

        public MonthlyRevenue(String month, BigDecimal revenue) {
            this.month = month;
            this.revenue = revenue;
        }

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public BigDecimal getRevenue() {
            return revenue;
        }

        public void setRevenue(BigDecimal revenue) {
            this.revenue = revenue;
        }
    }
}
