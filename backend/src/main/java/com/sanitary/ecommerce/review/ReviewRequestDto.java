package com.sanitary.ecommerce.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReviewRequestDto {

    @NotNull(message = "Sản phẩm không được để trống")
    private Long productId;

    private Long orderItemId; // Có thể null nếu review không từ đơn hàng, nhưng để verify thì nên có

    @NotNull(message = "Điểm đánh giá không được để trống")
    @Min(value = 1, message = "Đánh giá thấp nhất là 1 sao")
    @Max(value = 5, message = "Đánh giá cao nhất là 5 sao")
    private Integer rating;

    @NotBlank(message = "Nội dung đánh giá không được để trống")
    private String content;

    private List<String> images;
}
