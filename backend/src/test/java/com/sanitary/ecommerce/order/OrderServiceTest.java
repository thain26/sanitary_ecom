package com.sanitary.ecommerce.order;

import com.sanitary.ecommerce.order.dto.CheckoutRequest;
import com.sanitary.ecommerce.product.Product;
import com.sanitary.ecommerce.product.ProductRepository;
import com.sanitary.ecommerce.promotion.FlashSaleProduct;
import com.sanitary.ecommerce.promotion.FlashSaleProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests cho OrderService.
 * Kiểm tra: tạo đơn hàng, hủy đơn hàng, tra cứu đơn hàng, Flash Sale logic.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
@DisplayName("OrderService Unit Tests")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private FlashSaleProductRepository flashSaleProductRepository;

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private OrderService orderService;

    private Product mockProduct;
    private CheckoutRequest validRequest;

    @BeforeEach
    void setUp() {
        // Clear security context để đảm bảo test chạy như guest
        SecurityContextHolder.clearContext();

        // Tạo sản phẩm mock
        mockProduct = new Product();
        mockProduct.setId(1L);
        mockProduct.setName("Bồn cầu INAX AC-618VN");
        mockProduct.setModelCode("AC-618VN");
        mockProduct.setBasePrice(new BigDecimal("45000000"));
        mockProduct.setSalePrice(null);
        mockProduct.setStock(10);
        mockProduct.setSoldCount(0);

        // Tạo request checkout hợp lệ
        validRequest = new CheckoutRequest();
        validRequest.setRecipientName("Nguyễn Văn A");
        validRequest.setPhone("0901234567");
        validRequest.setProvince("Hà Nội");
        validRequest.setDistrict("Cầu Giấy");
        validRequest.setWard("Dịch Vọng");
        validRequest.setStreetDetail("123 Đường ABC");

        CheckoutRequest.Item item = new CheckoutRequest.Item();
        item.setProductId(1L);
        item.setQuantity(2);
        validRequest.setItems(List.of(item));

        // Mock generateOrderCode: không trùng lần đầu
        when(orderRepository.findByOrderCode(anyString())).thenReturn(Optional.empty());
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
    }

    // ─────────────────────────────────────────────────────────
    // TEST 1: Tạo đơn hàng thành công với giá basePrice
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 1: Tạo đơn hàng thành công - sử dụng basePrice khi không có salePrice")
    void createOrder_Success_WithBasePrice() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(productRepository.decrementStock(1L, 2)).thenReturn(1);
        when(flashSaleProductRepository.findActiveFlashSaleProducts(eq(1L), any(ZonedDateTime.class)))
                .thenReturn(Collections.emptyList());

        // Act
        Order result = orderService.createOrder(validRequest);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo("PENDING");
        assertThat(result.getPaymentMethod()).isEqualTo("COD");
        assertThat(result.getPaymentStatus()).isEqualTo("UNPAID");
        // subtotal = 45,000,000 * 2 = 90,000,000
        assertThat(result.getSubtotal()).isEqualByComparingTo(new BigDecimal("90000000"));
        assertThat(result.getTotal()).isEqualByComparingTo(new BigDecimal("90000000"));
        assertThat(result.getItems()).hasSize(1);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 2: Tạo đơn hàng thất bại - giỏ hàng trống
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 2: Tạo đơn hàng thất bại - giỏ hàng không có sản phẩm nào")
    void createOrder_Fail_WhenCartIsEmpty() {
        // Arrange
        validRequest.setItems(Collections.emptyList());

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(validRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Giỏ hàng không được để trống");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 3: Tạo đơn hàng thất bại - sản phẩm không đủ tồn kho
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 3: Tạo đơn hàng thất bại - số lượng đặt vượt quá tồn kho")
    void createOrder_Fail_WhenStockInsufficient() {
        // Arrange: yêu cầu 15 cái nhưng kho chỉ có 10
        mockProduct.setStock(5);
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));

        CheckoutRequest.Item item = new CheckoutRequest.Item();
        item.setProductId(1L);
        item.setQuantity(10); // stock = 5, quantity = 10 => insufficient
        validRequest.setItems(List.of(item));

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(validRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("không đủ số lượng trong kho");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 4: Áp dụng giá Flash Sale khi có chương trình khuyến mãi
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 4: Đặt hàng áp dụng đúng giá Flash Sale")
    void createOrder_AppliesFlashSalePrice() {
        // Arrange: Flash Sale giá 30,000,000 (giảm từ 45,000,000)
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(productRepository.decrementStock(1L, 2)).thenReturn(1);

        FlashSaleProduct fsp = new FlashSaleProduct();
        fsp.setSalePrice(new BigDecimal("30000000"));
        fsp.setQuantityLimit(10);
        fsp.setSoldCount(0);
        when(flashSaleProductRepository.findActiveFlashSaleProducts(eq(1L), any(ZonedDateTime.class)))
                .thenReturn(List.of(fsp));
        when(flashSaleProductRepository.save(any(FlashSaleProduct.class))).thenReturn(fsp);

        // Act
        Order result = orderService.createOrder(validRequest);

        // Assert: subtotal = 30,000,000 * 2 = 60,000,000
        assertThat(result.getSubtotal()).isEqualByComparingTo(new BigDecimal("60000000"));
        assertThat(result.getItems().get(0).getPrice()).isEqualByComparingTo(new BigDecimal("30000000"));
        verify(flashSaleProductRepository).save(fsp);
        // soldCount của Flash Sale phải tăng thêm 2
        assertThat(fsp.getSoldCount()).isEqualTo(2);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 5: Hủy đơn hàng thành công + hoàn trả tồn kho
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 5: Hủy đơn hàng PENDING thành công - tồn kho được hoàn trả")
    void cancelOrder_Success_RestoresStock() {
        // Arrange
        mockProduct.setStock(8);
        mockProduct.setSoldCount(2);

        OrderItem item = new OrderItem();
        item.setProduct(mockProduct);
        item.setQuantity(2);

        Order order = new Order();
        order.setId(1L);
        order.setUserId(10L);
        order.setStatus("PENDING");
        order.addItem(item);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        Order result = orderService.cancelOrder(1L, 10L);

        // Assert
        assertThat(result.getStatus()).isEqualTo("CANCELLED");
        assertThat(mockProduct.getStock()).isEqualTo(10); // 8 + 2
        assertThat(mockProduct.getSoldCount()).isEqualTo(0); // max(0, 2 - 2)
        verify(productRepository).save(mockProduct);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 6: Hủy đơn hàng thất bại - đơn không ở trạng thái PENDING
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 6: Không thể hủy đơn hàng đã CONFIRMED")
    void cancelOrder_Fail_WhenStatusNotPending() {
        // Arrange
        Order order = new Order();
        order.setId(1L);
        order.setUserId(10L);
        order.setStatus("CONFIRMED"); // đã được xác nhận, không thể hủy

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act & Assert
        assertThatThrownBy(() -> orderService.cancelOrder(1L, 10L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("CHỜ XỬ LÝ (PENDING)");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 7: Hủy đơn hàng thất bại - đơn không thuộc về user
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 7: Hủy đơn hàng thất bại - đơn không thuộc về tài khoản")
    void cancelOrder_Fail_WhenOrderNotBelongsToUser() {
        // Arrange: order thuộc user 10 nhưng user 99 cố hủy
        Order order = new Order();
        order.setId(1L);
        order.setUserId(10L);
        order.setStatus("PENDING");

        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act & Assert
        assertThatThrownBy(() -> orderService.cancelOrder(1L, 99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("không thuộc về tài khoản");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 8: Tra cứu đơn hàng theo orderCode - thành công
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 8: Tra cứu đơn hàng theo mã đơn - thành công")
    void trackOrder_Success() {
        // Arrange
        Order order = new Order();
        order.setOrderCode("ORD-20260604-00001");
        when(orderRepository.findByOrderCode("ORD-20260604-00001")).thenReturn(Optional.of(order));

        // Act
        Order result = orderService.trackOrder("ORD-20260604-00001");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getOrderCode()).isEqualTo("ORD-20260604-00001");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 9: Tra cứu đơn hàng - không tìm thấy mã đơn
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 9: Tra cứu đơn hàng với mã không tồn tại - ném RuntimeException")
    void trackOrder_Fail_WhenNotFound() {
        // Arrange
        when(orderRepository.findByOrderCode("INVALID-CODE")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> orderService.trackOrder("INVALID-CODE"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Không tìm thấy đơn hàng với mã");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 10: Flash Sale hết số lượng giới hạn - ném exception
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 10: Đặt hàng Flash Sale thất bại - số lượng Flash Sale đã hết")
    void createOrder_Fail_WhenFlashSaleQuantityExhausted() {
        // Arrange: Flash Sale chỉ còn 1 nhưng user đặt 2
        when(productRepository.findById(1L)).thenReturn(Optional.of(mockProduct));
        when(productRepository.decrementStock(1L, 2)).thenReturn(1);

        FlashSaleProduct fsp = new FlashSaleProduct();
        fsp.setSalePrice(new BigDecimal("30000000"));
        fsp.setQuantityLimit(3);
        fsp.setSoldCount(2); // chỉ còn 1 (3 - 2 = 1), nhưng user đặt 2

        when(flashSaleProductRepository.findActiveFlashSaleProducts(eq(1L), any(ZonedDateTime.class)))
                .thenReturn(List.of(fsp));

        // Act & Assert
        assertThatThrownBy(() -> orderService.createOrder(validRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("chương trình Flash Sale không đủ số lượng");
    }
}
