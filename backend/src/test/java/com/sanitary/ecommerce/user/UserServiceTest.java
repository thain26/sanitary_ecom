package com.sanitary.ecommerce.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests cho UserService.
 * Kiểm tra: getProfile, updateProfile, addAddress, deleteAddress, setDefaultAddress.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserAddressRepository userAddressRepository;

    @InjectMocks
    private UserService userService;

    private User mockUser;
    private UserAddress mockAddress;

    @BeforeEach
    void setUp() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("user@test.com");
        mockUser.setFullName("Nguyễn Văn A");
        mockUser.setPhone("0901234567");
        mockUser.setRole("CUSTOMER");
        mockUser.setStatus("ACTIVE");

        mockAddress = new UserAddress();
        mockAddress.setId(10L);
        mockAddress.setUser(mockUser);
        mockAddress.setRecipientName("Nguyễn Văn A");
        mockAddress.setPhone("0901234567");
        mockAddress.setProvince("Hà Nội");
        mockAddress.setDistrict("Cầu Giấy");
        mockAddress.setWard("Dịch Vọng");
        mockAddress.setStreetDetail("123 Đường ABC");
        mockAddress.setIsDefault(false);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 1: getProfileByEmail - trả về User khi email tồn tại
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 1: getProfileByEmail - trả về User khi email hợp lệ")
    void getProfileByEmail_ReturnsUser_WhenEmailExists() {
        // Arrange
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));

        // Act
        User result = userService.getProfileByEmail("user@test.com");

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("user@test.com");
        assertThat(result.getFullName()).isEqualTo("Nguyễn Văn A");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 2: getProfileByEmail - ném exception khi email không tồn tại
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 2: getProfileByEmail - ném RuntimeException khi email không tồn tại")
    void getProfileByEmail_ThrowsException_WhenEmailNotFound() {
        // Arrange
        when(userRepository.findByEmail("notfound@test.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.getProfileByEmail("notfound@test.com"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Người dùng không tồn tại");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 3: updateProfile - cập nhật fullName và phone thành công
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 3: updateProfile - cập nhật đúng tên và số điện thoại của user")
    void updateProfile_UpdatesUserFields_Successfully() {
        // Arrange
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UserProfileDto dto = new UserProfileDto();
        dto.setFullName("Nguyễn Văn B");
        dto.setPhone("0987654321");

        // Act
        User result = userService.updateProfile("user@test.com", dto);

        // Assert
        assertThat(result.getFullName()).isEqualTo("Nguyễn Văn B");
        assertThat(result.getPhone()).isEqualTo("0987654321");
        verify(userRepository).save(mockUser);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 4: addAddress - địa chỉ đầu tiên tự động set isDefault = true
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 4: addAddress - địa chỉ đầu tiên được tự động đặt làm địa chỉ mặc định")
    void addAddress_SetsAsDefault_WhenFirstAddress() {
        // Arrange
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        when(userAddressRepository.findByUserId(1L)).thenReturn(Collections.emptyList()); // chưa có địa chỉ
        when(userAddressRepository.save(any(UserAddress.class))).thenAnswer(inv -> inv.getArgument(0));

        UserAddress newAddress = new UserAddress();
        newAddress.setRecipientName("Test");
        newAddress.setPhone("0900000001");
        newAddress.setProvince("TP.HCM");
        newAddress.setDistrict("Quận 1");
        newAddress.setWard("Bến Nghé");
        newAddress.setStreetDetail("1 Nguyễn Huệ");
        newAddress.setIsDefault(false);

        // Act
        UserAddress result = userService.addAddress("user@test.com", newAddress);

        // Assert
        assertThat(result.getIsDefault()).isTrue(); // phải được set thành default vì là địa chỉ đầu tiên
    }

    // ─────────────────────────────────────────────────────────
    // TEST 5: addAddress - khi có địa chỉ mặc định mới → reset địa chỉ cũ
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 5: addAddress - thêm địa chỉ mặc định mới thì địa chỉ cũ bị bỏ default")
    void addAddress_ResetsOldDefault_WhenNewAddressIsDefault() {
        // Arrange
        UserAddress existingDefault = new UserAddress();
        existingDefault.setId(5L);
        existingDefault.setIsDefault(true);
        existingDefault.setUser(mockUser);

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        when(userAddressRepository.findByUserId(1L)).thenReturn(List.of(existingDefault));
        when(userAddressRepository.findByUserIdAndIsDefaultTrue(1L)).thenReturn(List.of(existingDefault));
        when(userAddressRepository.save(any(UserAddress.class))).thenAnswer(inv -> inv.getArgument(0));

        UserAddress newDefault = new UserAddress();
        newDefault.setRecipientName("New Default");
        newDefault.setPhone("0900000002");
        newDefault.setProvince("Đà Nẵng");
        newDefault.setDistrict("Hải Châu");
        newDefault.setWard("Thanh Bình");
        newDefault.setStreetDetail("2 Trần Phú");
        newDefault.setIsDefault(true); // muốn đặt làm mặc định

        // Act
        userService.addAddress("user@test.com", newDefault);

        // Assert: địa chỉ cũ phải bị set isDefault = false
        assertThat(existingDefault.getIsDefault()).isFalse();
        verify(userAddressRepository, atLeastOnce()).save(existingDefault);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 6: deleteAddress - xóa địa chỉ thường thành công
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 6: deleteAddress - xóa địa chỉ không mặc định thành công")
    void deleteAddress_Success_WhenNotDefault() {
        // Arrange
        mockAddress.setIsDefault(false);
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        when(userAddressRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(mockAddress));
        doNothing().when(userAddressRepository).delete(mockAddress);

        // Act
        userService.deleteAddress("user@test.com", 10L);

        // Assert
        verify(userAddressRepository).delete(mockAddress);
        // Không cần reset default vì địa chỉ bị xóa không phải default
        verify(userAddressRepository, never()).findByUserId(anyLong());
    }

    // ─────────────────────────────────────────────────────────
    // TEST 7: deleteAddress - xóa địa chỉ mặc định → địa chỉ còn lại được set default
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 7: deleteAddress - khi xóa địa chỉ mặc định thì địa chỉ tiếp theo lên thay")
    void deleteAddress_SetsNewDefault_WhenDefaultAddressDeleted() {
        // Arrange
        mockAddress.setIsDefault(true); // đây là địa chỉ mặc định

        UserAddress nextAddress = new UserAddress();
        nextAddress.setId(20L);
        nextAddress.setUser(mockUser);
        nextAddress.setIsDefault(false);

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        when(userAddressRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(mockAddress));
        doNothing().when(userAddressRepository).delete(mockAddress);
        when(userAddressRepository.findByUserId(1L)).thenReturn(List.of(nextAddress));
        when(userAddressRepository.save(nextAddress)).thenReturn(nextAddress);

        // Act
        userService.deleteAddress("user@test.com", 10L);

        // Assert: địa chỉ còn lại phải được set làm mặc định
        assertThat(nextAddress.getIsDefault()).isTrue();
        verify(userAddressRepository).save(nextAddress);
    }

    // ─────────────────────────────────────────────────────────
    // TEST 8: deleteAddress - ném exception khi địa chỉ không thuộc user
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 8: deleteAddress - ném exception khi ID địa chỉ không thuộc về user")
    void deleteAddress_ThrowsException_WhenAddressNotBelongsToUser() {
        // Arrange
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        when(userAddressRepository.findByIdAndUserId(999L, 1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.deleteAddress("user@test.com", 999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Địa chỉ không tồn tại");
    }

    // ─────────────────────────────────────────────────────────
    // TEST 9: setDefaultAddress - đặt địa chỉ làm mặc định thành công
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 9: setDefaultAddress - đặt địa chỉ không mặc định thành địa chỉ mặc định")
    void setDefaultAddress_Success() {
        // Arrange
        mockAddress.setIsDefault(false); // hiện không phải default

        UserAddress oldDefault = new UserAddress();
        oldDefault.setId(5L);
        oldDefault.setIsDefault(true);
        oldDefault.setUser(mockUser);

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        when(userAddressRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(mockAddress));
        when(userAddressRepository.findByUserIdAndIsDefaultTrue(1L)).thenReturn(List.of(oldDefault));
        when(userAddressRepository.save(any(UserAddress.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        userService.setDefaultAddress("user@test.com", 10L);

        // Assert
        assertThat(mockAddress.getIsDefault()).isTrue();
        assertThat(oldDefault.getIsDefault()).isFalse();
    }

    // ─────────────────────────────────────────────────────────
    // TEST 10: getAddresses - trả về đúng danh sách địa chỉ của user
    // ─────────────────────────────────────────────────────────
    @Test
    @DisplayName("TEST 10: getAddresses - trả về đúng danh sách địa chỉ của người dùng")
    void getAddresses_ReturnsUserAddresses() {
        // Arrange
        UserAddress addr1 = new UserAddress();
        addr1.setId(1L);
        addr1.setUser(mockUser);
        addr1.setIsDefault(true);

        UserAddress addr2 = new UserAddress();
        addr2.setId(2L);
        addr2.setUser(mockUser);
        addr2.setIsDefault(false);

        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(mockUser));
        when(userAddressRepository.findByUserId(1L)).thenReturn(List.of(addr1, addr2));

        // Act
        List<UserAddress> result = userService.getAddresses("user@test.com");

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result.stream().anyMatch(UserAddress::getIsDefault)).isTrue();
    }
}
