package com.sanitary.ecommerce.product;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests cho PublicApiService.
 * Kiểm tra: getBrands, getCategoryTree, searchProducts, getProductBySlug, getHomeData.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("PublicApiService Unit Tests")
class PublicApiServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductRepository productRepository;


    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private PublicApiService publicApiService;

    private Brand inaxBrand;
    private Category l1Category;
    private Category l2Category;
    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        inaxBrand = new Brand();
        inaxBrand.setId(1L);
        inaxBrand.setName("INAX");
        inaxBrand.setSlug("inax");
        inaxBrand.setActive(true);

        l1Category = new Category();
        l1Category.setId(1L);
        l1Category.setName("Bồn cầu");
        l1Category.setSlug("bon-cau");
        l1Category.setActive(true);

        l2Category = new Category();
        l2Category.setId(2L);
        l2Category.setParentId(1L);
        l2Category.setName("Bồn cầu 1 khối");
        l2Category.setSlug("bon-cau-1-khoi");
        l2Category.setActive(true);

        sampleProduct = new Product();
        sampleProduct.setId(10L);
        sampleProduct.setName("Bồn cầu INAX AC-618VN");
        sampleProduct.setSlug("bon-cau-inax-ac-618vn");
        sampleProduct.setBasePrice(new BigDecimal("45000000"));
        sampleProduct.setActive(true);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 1: getBrands - trả về danh sách thương hiệu active
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 1: getBrands - trả về đúng danh sách thương hiệu đang hoạt động")
    void getBrands_ReturnsActiveBrands() {
        // Arrange
        when(brandRepository.findByIsActiveTrue()).thenReturn(List.of(inaxBrand));

        // Act
        List<Brand> result = publicApiService.getBrands();

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("INAX");
        assertThat(result.get(0).isActive()).isTrue();
        verify(brandRepository).findByIsActiveTrue();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 2: getBrands - trả về danh sách rỗng khi không có thương hiệu
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 2: getBrands - trả về danh sách rỗng khi không có thương hiệu active")
    void getBrands_ReturnsEmptyWhenNoBrands() {
        // Arrange
        when(brandRepository.findByIsActiveTrue()).thenReturn(Collections.emptyList());

        // Act
        List<Brand> result = publicApiService.getBrands();

        // Assert
        assertThat(result).isEmpty();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 3: getCategoryTree - build đúng cấu trúc cây L1 → L2
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 3: getCategoryTree - build cây danh mục đúng cấu trúc L1 → L2")
    void getCategoryTree_BuildsCorrectHierarchy() {
        // Arrange: l1 là root, l2 là con của l1
        when(categoryRepository.findByIsActiveTrueOrderByNameAsc())
                .thenReturn(Arrays.asList(l1Category, l2Category));

        // Act
        List<Map<String, Object>> tree = publicApiService.getCategoryTree();

        // Assert
        assertThat(tree).hasSize(1); // chỉ 1 root
        Map<String, Object> root = tree.get(0);
        assertThat(root.get("name")).isEqualTo("Bồn cầu");
        assertThat(root.get("slug")).isEqualTo("bon-cau");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> children = (List<Map<String, Object>>) root.get("children");
        assertThat(children).hasSize(1);
        assertThat(children.get(0).get("name")).isEqualTo("Bồn cầu 1 khối");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 4: getCategoryTree - category không có con thì children rỗng
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 4: getCategoryTree - category lá không có con thì children là empty list")
    void getCategoryTree_LeafCategoryHasEmptyChildren() {
        // Arrange: chỉ có 1 root, không có con
        when(categoryRepository.findByIsActiveTrueOrderByNameAsc())
                .thenReturn(List.of(l1Category));

        // Act
        List<Map<String, Object>> tree = publicApiService.getCategoryTree();

        // Assert
        assertThat(tree).hasSize(1);
        @SuppressWarnings("unchecked")
        List<?> children = (List<?>) tree.get(0).get("children");
        assertThat(children).isEmpty();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 5: getProductBySlug - trả về sản phẩm khi slug hợp lệ
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 5: getProductBySlug - trả về Product đúng khi slug tồn tại")
    void getProductBySlug_ReturnsProduct_WhenSlugExists() {
        // Arrange
        when(productRepository.findBySlugAndIsActiveTrue("bon-cau-inax-ac-618vn"))
                .thenReturn(Optional.of(sampleProduct));

        // Act
        Product result = publicApiService.getProductBySlug("bon-cau-inax-ac-618vn");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Bồn cầu INAX AC-618VN");
        assertThat(result.getSlug()).isEqualTo("bon-cau-inax-ac-618vn");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 6: getProductBySlug - ném exception khi slug không tồn tại
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 6: getProductBySlug - ném RuntimeException khi slug không tồn tại")
    void getProductBySlug_ThrowsException_WhenSlugNotFound() {
        // Arrange
        when(productRepository.findBySlugAndIsActiveTrue("non-existent-slug"))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> publicApiService.getProductBySlug("non-existent-slug"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Product not found");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 7: searchProducts - không có category filter → searchWithoutCategory
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 7: searchProducts - khi slug là 'tat-ca' gọi searchProductsWithoutCategory")
    void searchProducts_WithoutCategoryFilter_WhenSlugIsTatCa() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 9);
        Page<Product> mockPage = new PageImpl<>(List.of(sampleProduct));
        when(productRepository.searchProductsWithoutCategory(
                isNull(), isNull(), isNull(), isNull(), eq(pageable)))
                .thenReturn(mockPage);

        // Act
        Page<Product> result = publicApiService.searchProducts(
                "tat-ca", null, null, null, null, pageable);

        // Assert
        assertThat(result.getContent()).hasSize(1);
        verify(productRepository).searchProductsWithoutCategory(null, null, null, null, pageable);
        verify(productRepository, never()).searchProductsWithCategory(any(), any(), any(), any(), any(), any());
    }

    // ─────────────────────────────────────────────────────────
    // TEST 8: searchProducts - có category filter → searchWithCategory
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 8: searchProducts - khi có slug hợp lệ gọi searchProductsWithCategory với sub-IDs")
    void searchProducts_WithCategoryFilter_WhenSlugIsValid() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 9);
        when(categoryRepository.findBySlugAndIsActiveTrue("bon-cau"))
                .thenReturn(Optional.of(l2Category));
        when(categoryRepository.findByIsActiveTrueOrderByNameAsc())
                .thenReturn(Arrays.asList(l1Category, l2Category));

        Page<Product> mockPage = new PageImpl<>(List.of(sampleProduct));
        when(productRepository.searchProductsWithCategory(
                isNull(), isNull(), isNull(), isNull(), anyList(), eq(pageable)))
                .thenReturn(mockPage);

        // Act
        Page<Product> result = publicApiService.searchProducts(
                "bon-cau", null, null, null, null, pageable);

        // Assert
        assertThat(result.getContent()).hasSize(1);
        verify(productRepository).searchProductsWithCategory(
                isNull(), isNull(), isNull(), isNull(), anyList(), eq(pageable));
    }

    // ─────────────────────────────────────────────────────────
    // TEST 9: searchProducts - slug không tồn tại → trả kết quả rỗng
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 9: searchProducts - khi slug danh mục không tồn tại thì không tìm được sản phẩm")
    void searchProducts_WhenCategorySlugInvalid_ReturnsEmpty() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 9);
        when(categoryRepository.findBySlugAndIsActiveTrue("invalid-slug"))
                .thenReturn(Optional.empty());

        Page<Product> emptyPage = new PageImpl<>(Collections.emptyList());
        // Slug không tồn tại → categoryIds = [-1L] → kết quả rỗng
        when(productRepository.searchProductsWithCategory(
                isNull(), isNull(), isNull(), isNull(), eq(List.of(-1L)), eq(pageable)))
                .thenReturn(emptyPage);

        // Act
        Page<Product> result = publicApiService.searchProducts(
                "invalid-slug", null, null, null, null, pageable);

        // Assert
        assertThat(result.getContent()).isEmpty();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 10: getHomeData - trả về map chứa đủ banners, categories, featuredProducts
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 10: getHomeData - trả về map chứa đủ keys: banners, categories, featuredProducts")
    void getHomeData_ContainsRequiredKeys() {
        // Arrange

        when(categoryRepository.findByParentIdIsNullAndIsActiveTrueOrderByNameAsc()).thenReturn(List.of(l1Category));
        when(productRepository.findByIsFeaturedTrueAndIsActiveTrueOrderByCreatedAtDesc())
                .thenReturn(List.of(sampleProduct));

        // Act
        Map<String, Object> result = publicApiService.getHomeData();

        // Assert
        assertThat(result).containsKeys("banners", "categories", "featuredProducts");

        @SuppressWarnings("unchecked")
        List<?> categories = (List<?>) result.get("categories");
        assertThat(categories).hasSize(1);

        @SuppressWarnings("unchecked")
        List<?> featuredProducts = (List<?>) result.get("featuredProducts");
        assertThat(featuredProducts).hasSize(1);
    }
}
