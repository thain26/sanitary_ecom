import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../cart/store/useCartStore';
import { useAuthStore } from '../../auth/store/authStore';
import useUiStore from '../../../store/useUiStore';
import { orderApi, publicApi, userApi } from '../../../services/api';
import { Check, X } from 'lucide-react';
import BackButton from '../../../components/common/BackButton';
import FormInput from '../../../components/common/FormInput';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const Checkout = () => {
  const { cart, sessionId, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { openLoginPrompt } = useUiStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit: hookFormSubmit, formState: { errors: formErrors }, setValue, watch } = useForm({
    defaultValues: {
      customerName: user?.fullName || '',
      customerPhone: user?.phone || '',
      shippingAddress: '',
      note: '',
      paymentMethod: 'COD'
    }
  });

  const watchPaymentMethod = watch('paymentMethod');

  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('manual');

  useEffect(() => {
    if (user) {
      userApi.getAddresses()
        .then(data => {
          setAddresses(data);
          const defaultAddr = data.find(a => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id.toString());
            setValue('customerName', defaultAddr.recipientName);
            setValue('customerPhone', defaultAddr.phone);
            setValue('shippingAddress', `${defaultAddr.streetDetail}, ${defaultAddr.ward ? defaultAddr.ward + ', ' : ''}${defaultAddr.district ? defaultAddr.district + ', ' : ''}${defaultAddr.province}`);
          }
        })
        .catch(err => console.error("Failed to load addresses", err));
    }
  }, [user]);

  const handleAddressSelect = (e) => {
    const val = e.target.value;
    setSelectedAddressId(val);
    if (val !== 'manual') {
      const addr = addresses.find(a => a.id.toString() === val);
      if (addr) {
        setValue('customerName', addr.recipientName);
        setValue('customerPhone', addr.phone);
        setValue('shippingAddress', `${addr.streetDetail}, ${addr.ward ? addr.ward + ', ' : ''}${addr.district ? addr.district + ', ' : ''}${addr.province}`);
      }
    } else {
      setValue('customerName', '');
      setValue('customerPhone', '');
      setValue('shippingAddress', '');
    }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = item.price || item.product?.salePrice || item.product?.basePrice || 0;
    return sum + (price * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0', minHeight: '50vh' }}>
        <p>Giỏ hàng trống.</p>
        <button className="btn btn-outline" onClick={() => navigate('/gio-hang')} style={{ marginTop: '2rem' }}>Quay lại giỏ hàng</button>
      </div>
    );
  }

  const onSubmitForm = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };
      if (appliedVoucher) {
        payload.voucherCode = appliedVoucher;
      }
      const res = await orderApi.checkout(sessionId, payload);
      clearCart();
      navigate('/dat-hang-thanh-cong?code=' + res.orderCode);
    } catch (error) {
      console.error("Checkout failed", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ marginTop: '2rem', marginBottom: '6rem' }}>
      <BackButton />

      <h1 className="title-section">Thanh Toán</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
        {/* Form */}
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Thông Tin Giao Hàng
          </h3>
          <form onSubmit={hookFormSubmit(onSubmitForm)}>
            {user && addresses.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Sổ địa chỉ</label>
                <select
                  value={selectedAddressId}
                  onChange={handleAddressSelect}
                  style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '2px', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="manual">Địa chỉ khác</option>
                  {addresses.map(addr => (
                    <option key={addr.id} value={addr.id.toString()}>
                      {addr.recipientName} - {addr.phone} ({addr.streetDetail}, {addr.province})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <FormInput
              label="Họ và tên"
              type="text"
              {...register('customerName', { required: 'Vui lòng nhập họ và tên.' })}
              error={formErrors.customerName?.message}
              required
            />

            <FormInput
              label="Số điện thoại"
              type="tel"
              {...register('customerPhone', { 
                required: 'Vui lòng nhập số điện thoại.',
                pattern: {
                  value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                  message: 'Số điện thoại không hợp lệ.'
                }
              })}
              error={formErrors.customerPhone?.message}
              required
            />

            <FormInput
              label="Địa chỉ giao hàng (Số nhà, đường, xã/phường, quận/huyện, tỉnh/thành phố)"
              type="text"
              {...register('shippingAddress', { required: 'Vui lòng nhập địa chỉ giao hàng.' })}
              error={formErrors.shippingAddress?.message}
              required
            />

            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Ghi chú đơn hàng</label>
              <textarea {...register('note')} rows="3" style={{ width: '100%', padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '4px', outline: 'none', resize: 'vertical' }}></textarea>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Phương Thức Thanh Toán
            </h3>

            <button type="button" style={{ padding: '1rem', border: watchPaymentMethod === 'COD' ? '1px solid var(--color-primary)' : '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: watchPaymentMethod === 'COD' ? 'rgba(194, 160, 119, 0.05)' : '#fff', marginBottom: '1rem', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'left' }} onClick={() => setValue('paymentMethod', 'COD')}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input type="radio" checked={watchPaymentMethod === 'COD'} readOnly style={{ marginRight: '0.5rem', accentColor: 'var(--color-primary)' }} />
                <strong>Thanh toán khi nhận hàng (COD)</strong>
              </div>
              <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', paddingLeft: '1.5rem', margin: 0 }}>
                Bạn chỉ phải thanh toán khi nhận được hàng.
              </p>
            </button>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} disabled={loading}>
              {loading ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', border: '1px solid var(--color-border)', alignSelf: 'start' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>Đơn Hàng Của Bạn</h3>

          <div style={{ marginBottom: '2rem' }}>
            {items.map(item => {
              const product = item.product;
              const price = item.price || product?.salePrice || product?.basePrice || 0;
              return (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>{product?.name} <span style={{ color: 'var(--color-primary)' }}>x{item.quantity}</span></span>
                  <span style={{ fontWeight: 500 }}>{formatPrice(price * item.quantity)}</span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
            <span>Tạm tính</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {/* Voucher Section */}
          <div style={{ marginBottom: '1.5rem', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1.5rem 0' }}>
            <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '0.9rem', fontWeight: 500, textTransform: 'uppercase' }}>Mã giảm giá</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={voucherCodeInput}
                onChange={(e) => setVoucherCodeInput(e.target.value)}
                placeholder="Nhập mã giảm giá"
                disabled={appliedVoucher !== null}
                style={{ flex: 1, padding: '0.8rem', border: '1px solid var(--color-border)', borderRadius: '2px', outline: 'none' }}
              />
              {appliedVoucher ? (
                <button
                  type="button"
                  onClick={() => {
                    setAppliedVoucher(null);
                    setVoucherCodeInput('');
                    setDiscountAmount(0);
                    setVoucherError('');
                  }}
                  style={{ padding: '0 1rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Hủy mã này"
                >
                  <X size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    if (!voucherCodeInput.trim()) return;
                    setVoucherError('');
                    try {
                      const res = await publicApi.validateVoucher(voucherCodeInput.trim(), subtotal);
                      if (res.valid) {
                        setAppliedVoucher(res.code);
                        setDiscountAmount(res.discountAmount);
                      } else {
                        if (res.message === "Vui lòng đăng nhập để sử dụng mã giảm giá.") {
                          openLoginPrompt();
                        } else {
                          setVoucherError(res.message);
                        }
                      }
                    } catch (err) {
                      setVoucherError('Lỗi kiểm tra mã giảm giá.');
                    }
                  }}
                  style={{ padding: '0 1.5rem', background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase' }}
                >
                  Áp dụng
                </button>
              )}
            </div>
            {voucherError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{voucherError}</div>}
            {appliedVoucher && <div style={{ color: '#22c55e', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Check size={14} /> Áp dụng mã thành công!</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
            <span>Phí giao hàng</span>
            <span>Miễn phí</span>
          </div>

          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#22c55e' }}>
              <span>Giảm giá</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 500, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <span>Tổng cộng</span>
            <span style={{ color: 'var(--color-primary)' }}>{formatPrice(Math.max(0, subtotal - discountAmount))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
