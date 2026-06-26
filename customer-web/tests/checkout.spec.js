import { test, expect } from '@playwright/test';

test.describe('Checkout Flow E2E', () => {
  test('should display empty cart message when cart is empty', async ({ page }) => {
    // Navigate to checkout directly
    await page.goto('/thanh-toan');
    
    // Should display empty cart message
    await expect(page.locator('text=Giỏ hàng trống')).toBeVisible();
    
    // Should have a button to return to cart
    await expect(page.locator('button', { hasText: 'Quay lại giỏ hàng' })).toBeVisible();
  });

  // Note: Testing the full checkout flow requires setting up mock data 
  // or a staging backend, which is beyond this basic E2E setup.
});
