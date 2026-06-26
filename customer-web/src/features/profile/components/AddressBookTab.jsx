import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { userApi } from '../../../services/api';
import { Plus, Edit, Trash } from 'lucide-react';
import FormInput from '../../../components/common/FormInput';

const AddressBookTab = () => {
  const [addresses, setAddresses] = useState([]);
  const { register, handleSubmit, formState: { errors: formErrors }, reset, setValue, watch } = useForm({
    defaultValues: {
      recipientName: '',
      phone: '',
      province: '',
      district: '',
      ward: '',
      streetDetail: '',
      isDefault: false
    }
  });

  const watchIsDefault = watch('isDefault');
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [addrError, setAddrError] = useState('');

  const fetchAddresses = async () => {
    try {
      const data = await userApi.getAddresses();
      setAddresses(data);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const onSubmitForm = async (data) => {
    setAddrError('');
    try {
      if (editingAddrId) {
        await userApi.updateAddress(editingAddrId, data);
      } else {
        await userApi.addAddress(data);
      }
      setShowAddrForm(false);
      setEditingAddrId(null);
      reset({
        recipientName: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        streetDetail: '',
        isDefault: false
      });
      fetchAddresses();
    } catch (err) {
      setAddrError(err.response?.data?.message || err.message || 'Lỗi lưu địa chỉ.');
    }
  };

  const handleEditAddr = (addr) => {
    setEditingAddrId(addr.id);
    reset({
      recipientName: addr.recipientName,
      phone: addr.phone,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      streetDetail: addr.streetDetail,
      isDefault: addr.isDefault
    });
    setShowAddrForm(true);
  };

  const handleDeleteAddr = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await userApi.deleteAddress(id);
      fetchAddresses();
    } catch (err) {
      alert('Không thể xóa địa chỉ này.');
    }
  };

  const handleSetDefaultAddr = async (id) => {
    try {
      await userApi.setDefaultAddress(id);
      fetchAddresses();
    } catch (err) {
      alert('Không thể đặt làm mặc định.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)', margin: 0 }}>Sổ địa chỉ</h2>
        {!showAddrForm && (
          <button
            onClick={() => {
              setEditingAddrId(null);
              reset({
                recipientName: '',
                phone: '',
                province: '',
                district: '',
                ward: '',
                streetDetail: '',
                isDefault: false
              });
              setShowAddrForm(true);
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--color-primary)', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            <Plus size={14} /> Thêm địa chỉ mới
          </button>
        )}
      </div>

      {showAddrForm && (
        <div style={{ border: '1px solid var(--color-border)', padding: '1.5rem', background: 'var(--color-bg)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>{editingAddrId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3>
          
          {addrError && (
            <div style={{ padding: '0.75rem 1rem', border: '1px solid #fbcaca', color: '#c93b3b', background: '#fff6f6', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {addrError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmitForm)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <FormInput
                label="Tên người nhận"
                type="text"
                {...register('recipientName', { required: 'Vui lòng nhập tên người nhận.' })}
                error={formErrors.recipientName?.message}
                required
                style={{ borderRadius: '0px', padding: '0.75rem' }}
              />
              <FormInput
                label="Số điện thoại nhận hàng"
                type="text"
                {...register('phone', { 
                  required: 'Vui lòng nhập số điện thoại.',
                  pattern: {
                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                    message: 'Số điện thoại không hợp lệ.'
                  }
                })}
                error={formErrors.phone?.message}
                required
                style={{ borderRadius: '0px', padding: '0.75rem' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <FormInput
                label="Tỉnh/Thành phố"
                type="text"
                placeholder="vd: Hà Nội"
                {...register('province', { required: 'Vui lòng nhập Tỉnh/Thành phố.' })}
                error={formErrors.province?.message}
                required
                style={{ borderRadius: '0px', padding: '0.75rem' }}
              />
              <FormInput
                label="Quận/Huyện"
                type="text"
                placeholder="vd: Cầu Giấy (Tùy chọn)"
                {...register('district')}
                error={formErrors.district?.message}
                style={{ borderRadius: '0px', padding: '0.75rem' }}
              />
              <FormInput
                label="Phường/Xã"
                type="text"
                placeholder="vd: Dịch Vọng (Tùy chọn)"
                {...register('ward')}
                error={formErrors.ward?.message}
                style={{ borderRadius: '0px', padding: '0.75rem' }}
              />
            </div>

            <FormInput
              label="Số nhà, tên đường"
              type="text"
              placeholder="vd: Số 15, Ngõ 20 Trần Thái Tông"
              {...register('streetDetail', { required: 'Vui lòng nhập địa chỉ cụ thể.' })}
              error={formErrors.streetDetail?.message}
              required
              style={{ borderRadius: '0px', padding: '0.75rem' }}
            />

            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="isDefault"
                {...register('isDefault')}
                style={{ cursor: 'pointer' }}
              />
              <label htmlFor="isDefault" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>Đặt làm địa chỉ mặc định</label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Lưu địa chỉ</button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddrForm(false)} style={{ padding: '0.6rem 1.5rem', fontSize: '0.8rem' }}>Huỷ</button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '2rem 0' }}>Bạn chưa lưu địa chỉ giao hàng nào.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              style={{
                border: `1px solid ${addr.isDefault ? 'var(--color-accent)' : 'var(--color-border)'}`,
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                backgroundColor: addr.isDefault ? '#fffcf9' : '#fff'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>{addr.recipientName}</strong>
                  {addr.isDefault && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', border: '1px solid var(--color-accent)', padding: '0.1rem 0.4rem', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mặc định</span>
                  )}
                </div>
                <p style={{ fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>Số điện thoại: {addr.phone}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0 }}>
                  {addr.streetDetail}, {addr.ward}, {addr.district}, {addr.province}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handleEditAddr(addr)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
                    title="Sửa địa chỉ"
                  >
                    <Edit size={14} /> Sửa
                  </button>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleDeleteAddr(addr.id)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}
                      title="Xoá địa chỉ"
                    >
                      <Trash size={14} /> Xoá
                    </button>
                  )}
                </div>
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefaultAddr(addr.id)}
                    style={{ background: 'transparent', border: '1px solid var(--color-border)', padding: '0.25rem 0.5rem', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'Be Vietnam Pro, sans-serif' }}
                  >
                    Thiết lập mặc định
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressBookTab;
