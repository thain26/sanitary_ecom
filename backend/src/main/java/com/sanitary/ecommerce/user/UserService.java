package com.sanitary.ecommerce.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;

    public User getProfileByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
    }

    @Transactional
    public User updateProfile(String email, UserProfileDto dto) {
        User user = getProfileByEmail(email);
        user.setFullName(dto.getFullName());
        user.setPhone(dto.getPhone());
        if (dto.getAvatarUrl() != null) {
            user.setAvatarUrl(dto.getAvatarUrl());
        }
        return userRepository.save(user);
    }

    public List<UserAddress> getAddresses(String email) {
        User user = getProfileByEmail(email);
        return userAddressRepository.findByUserId(user.getId());
    }

    @Transactional
    public UserAddress addAddress(String email, UserAddress address) {
        User user = getProfileByEmail(email);
        address.setUser(user);

        List<UserAddress> existingAddresses = userAddressRepository.findByUserId(user.getId());
        if (existingAddresses.isEmpty()) {
            address.setIsDefault(true);
        } else if (address.getIsDefault()) {
            resetDefaultAddresses(user.getId());
        }

        return userAddressRepository.save(address);
    }

    @Transactional
    public UserAddress updateAddress(String email, Long addressId, UserAddress updatedAddress) {
        User user = getProfileByEmail(email);
        UserAddress address = userAddressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));

        address.setRecipientName(updatedAddress.getRecipientName());
        address.setPhone(updatedAddress.getPhone());
        address.setProvince(updatedAddress.getProvince());
        address.setDistrict(updatedAddress.getDistrict());
        address.setWard(updatedAddress.getWard());
        address.setStreetDetail(updatedAddress.getStreetDetail());

        if (updatedAddress.getIsDefault() && !address.getIsDefault()) {
            resetDefaultAddresses(user.getId());
            address.setIsDefault(true);
        } else if (!updatedAddress.getIsDefault() && address.getIsDefault()) {
            // Keep default if it is the only address, or set standard
            address.setIsDefault(true); 
        }

        return userAddressRepository.save(address);
    }

    @Transactional
    public void deleteAddress(String email, Long addressId) {
        User user = getProfileByEmail(email);
        UserAddress address = userAddressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));

        boolean wasDefault = address.getIsDefault();
        userAddressRepository.delete(address);

        if (wasDefault) {
            List<UserAddress> remaining = userAddressRepository.findByUserId(user.getId());
            if (!remaining.isEmpty()) {
                UserAddress first = remaining.get(0);
                first.setIsDefault(true);
                userAddressRepository.save(first);
            }
        }
    }

    @Transactional
    public void setDefaultAddress(String email, Long addressId) {
        User user = getProfileByEmail(email);
        UserAddress address = userAddressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));

        if (!address.getIsDefault()) {
            resetDefaultAddresses(user.getId());
            address.setIsDefault(true);
            userAddressRepository.save(address);
        }
    }

    private void resetDefaultAddresses(Long userId) {
        List<UserAddress> defaults = userAddressRepository.findByUserIdAndIsDefaultTrue(userId);
        for (UserAddress addr : defaults) {
            addr.setIsDefault(false);
            userAddressRepository.save(addr);
        }
    }
}
