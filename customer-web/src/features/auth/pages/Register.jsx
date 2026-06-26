import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import FormInput from '../../../components/common/FormInput';

const Register = () => {
  const { register: formRegister, handleSubmit: hookFormSubmit, formState: { errors: formErrors }, watch } = useForm();
  
  const [errorMsg, setErrorMsg] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const watchPassword = watch('password');

  const register = useAuthStore(state => state.register);
  const navigate = useNavigate();

  const onSubmitForm = async (data) => {
    setFormLoading(true);
    setErrorMsg('');
    try {
      await register({ 
        email: data.email, 
        password: data.password, 
        fullName: data.fullName, 
        phone: data.phone 
      });
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem 1rem' }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: '#ffffff',
        border: '1px solid var(--color-border)',
        padding: '3rem 2.5rem',
        borderRadius: '0px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem 0' }}>Đăng Ký Tài Khoản</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trở thành thành viên của chúng tôi</p>
        </div>

        {errorMsg && (
          <div style={{
            background: '#fff6f6',
            border: '1px solid #fbcaca',
            color: '#c93b3b',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            textAlign: 'center'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={hookFormSubmit(onSubmitForm)}>
          <FormInput
            label="Họ và tên"
            type="text"
            {...formRegister('fullName', { required: 'Vui lòng nhập họ và tên.' })}
            placeholder="Nguyễn Văn A"
            error={formErrors.fullName?.message}
            required
            style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
          />

          <FormInput
            label="Số điện thoại"
            type="tel"
            {...formRegister('phone', { 
              required: 'Vui lòng nhập số điện thoại.',
              pattern: {
                value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                message: 'Số điện thoại không hợp lệ.'
              }
            })}
            placeholder="09XXXXXXXX"
            error={formErrors.phone?.message}
            required
            style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
          />

          <FormInput
            label="Địa chỉ Email"
            type="email"
            {...formRegister('email', { required: 'Vui lòng nhập địa chỉ email.' })}
            placeholder="name@example.com"
            error={formErrors.email?.message}
            required
            style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
          />

          <FormInput
            label="Mật khẩu"
            type="password"
            {...formRegister('password', { 
              required: 'Vui lòng nhập mật khẩu.',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải từ 6 ký tự.'
              }
            })}
            placeholder="••••••••"
            error={formErrors.password?.message}
            required
            style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
          />

          <div style={{ marginBottom: '2rem' }}>
            <FormInput
              label="Nhập lại mật khẩu"
              type="password"
              {...formRegister('confirmPassword', { 
                required: 'Vui lòng nhập lại mật khẩu.',
                validate: value => value === watchPassword || 'Mật khẩu nhập lại không trùng khớp.'
              })}
              placeholder="••••••••"
              error={formErrors.confirmPassword?.message}
              required
              style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={formLoading}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'var(--color-text)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '0px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 500,
              cursor: formLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '1.5rem'
            }}
            onMouseOver={(e) => { if (!formLoading) e.target.style.backgroundColor = 'var(--color-primary)'; }}
            onMouseOut={(e) => { if (!formLoading) e.target.style.backgroundColor = 'var(--color-text)'; }}
          >
            {formLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" style={{ color: 'var(--color-text)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid var(--color-text)' }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
