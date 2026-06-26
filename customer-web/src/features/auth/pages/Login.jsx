import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import FormInput from '../../../components/common/FormInput';

const Login = () => {
  const { register, handleSubmit: hookFormSubmit, formState: { errors: formErrors } } = useForm();
  
  const [errorMsg, setErrorMsg] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const onSubmitForm = async (data) => {
    setFormLoading(true);
    setErrorMsg('');
    try {
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '2rem 1rem' }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: '#ffffff',
        border: '1px solid var(--color-border)',
        padding: '3rem 2.5rem',
        borderRadius: '0px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem 0' }}>Đăng Nhập</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chào mừng quay trở lại</p>
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
            label="Địa chỉ Email"
            type="email"
            {...register('email', { required: 'Vui lòng nhập địa chỉ email.' })}
            placeholder="name@example.com"
            error={formErrors.email?.message}
            required
            style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
          />

          <div style={{ marginBottom: '2.5rem' }}>
            <FormInput
              label="Mật khẩu"
              type="password"
              {...register('password', { required: 'Vui lòng nhập mật khẩu.' })}
              placeholder="••••••••"
              error={formErrors.password?.message}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1rem' }}>
              <Link to="/quen-mat-khau" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'underline', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--color-accent)'} onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>Quên mật khẩu?</Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '1.2rem',
              borderRadius: '0px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 500,
              fontFamily: 'Outfit, sans-serif',
              opacity: formLoading ? 0.7 : 1,
              cursor: formLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {formLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" style={{ color: 'var(--color-text)', fontWeight: 500, textDecoration: 'none', borderBottom: '1px solid var(--color-text)' }}>
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
