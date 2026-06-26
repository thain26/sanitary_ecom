package com.sanitary.ecommerce.promotion;

import java.math.BigDecimal;

public class VoucherValidationResponse {
    private boolean valid;
    private String message;
    private BigDecimal discountAmount;
    private String code;

    public VoucherValidationResponse() {
    }

    public VoucherValidationResponse(boolean valid, String message, BigDecimal discountAmount, String code) {
        this.valid = valid;
        this.message = message;
        this.discountAmount = discountAmount;
        this.code = code;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
