import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../auth/store/authStore';
import FormInput from '../../../components/common/FormInput';

const ProfileInfoTab = () => {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);

  const { register, handleSubmit, formState: { errors: formErrors }, reset } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      avatarUrl: user?.avatarUrl || ''
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        phone: user.phone || '',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user, reset]);

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  const handleProfileUpdate = async (data) => {
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });
    try {
      await updateProfile(data);
      setProfileMsg({ type: 'success', text: 'Cập nhật thông tin tài khoản thành công.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Cập nhật thông tin thất bại.' });
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        Thông tin cá nhân
      </h2>
      
      {profileMsg.text && (
        <div style={{
          padding: '0.85rem 1rem',
          border: '1px solid',
          borderColor: profileMsg.type === 'success' ? '#c2e7c2' : '#fbcaca',
          color: profileMsg.type === 'success' ? '#2b752b' : '#c93b3b',
          background: profileMsg.type === 'success' ? '#f4fff4' : '#fff6f6',
          marginBottom: '1.5rem',
          fontSize: '0.9rem'
        }}>
          {profileMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit(handleProfileUpdate)} style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Địa chỉ Email</label>
          <input
            type="text"
            value={user?.email || ''}
            disabled
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '0px',
              fontSize: '0.95rem',
              background: '#f5f5f5',
              cursor: 'not-allowed',
              color: 'var(--color-text-muted)'
            }}
          />
        </div>

        <FormInput
          label="Họ và tên"
          type="text"
          {...register('fullName', { required: 'Vui lòng nhập họ và tên.' })}
          error={formErrors.fullName?.message}
          required
          style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
        />

        <FormInput
          label="Số điện thoại"
          type="text"
          {...register('phone', { 
            pattern: {
              value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
              message: 'Số điện thoại không hợp lệ.'
            }
          })}
          placeholder="Chưa cập nhật"
          error={formErrors.phone?.message}
          style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
        />

        <div style={{ marginBottom: '2rem' }}>
          <FormInput
            label="Đường dẫn ảnh đại diện (Avatar URL)"
            type="text"
            {...register('avatarUrl')}
            placeholder="https://example.com/avatar.jpg"
            error={formErrors.avatarUrl?.message}
            style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
          />
        </div>

        <button
          type="submit"
          disabled={profileLoading}
          className="btn btn-primary"
          style={{ minWidth: '180px' }}
        >
          {profileLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  );
};

export default ProfileInfoTab;
