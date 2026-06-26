import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../../services/api';
import FormInput from '../../../components/common/FormInput';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Input Email, 2: Input OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email) {
      setErrorMsg('Vui lòng nhập email');
      return;
    }
    try {
      setLoading(true);
      await authApi.forgotPassword(email);
      setSuccessMsg('Mã OTP đã được gửi đến email của bạn');
      setStep(2);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!otp || !newPassword || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu không khớp');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword({ email, otp, newPassword });
      setSuccessMsg('Đặt lại mật khẩu thành công! Bạn sẽ được chuyển hướng đăng nhập...');
      setTimeout(() => navigate('/dang-nhap'), 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
    } finally {
      setLoading(false);
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
          <h2 style={{ fontSize: '1.75rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem 0' }}>
            {step === 1 ? 'Quên Mật Khẩu' : 'Đặt Lại Mật Khẩu'}
          </h2>
          <p className="text-muted" style={{ fontSize: '0.85rem', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.05em' }}>
            {step === 1 
              ? 'Nhập email đã đăng ký, chúng tôi sẽ gửi mã xác thực cho bạn' 
              : `Mã xác thực đã được gửi tới ${email}`}
          </p>
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

        {successMsg && (
          <div style={{
            background: '#f6fff8',
            border: '1px solid #cafbce',
            color: '#3bc94e',
            padding: '0.85rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            textAlign: 'center'
          }}>
            {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div style={{ marginBottom: '2.5rem' }}>
              <FormInput
                label="Địa chỉ Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
              />
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1.2rem',
                borderRadius: '0px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 500,
                fontFamily: 'Outfit, sans-serif',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'Đang gửi mã...' : 'Nhận Mã Xác Thực'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/dang-nhap" style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'underline', transition: 'color 0.3s', textTransform: 'uppercase', letterSpacing: '0.05em' }} onMouseOver={e => e.target.style.color = 'var(--color-accent)'} onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}>
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div style={{ marginBottom: '1.5rem' }}>
              <FormInput
                label="Mã Xác Thực (OTP)"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength="6"
                required
                style={{ borderRadius: '0px', padding: '0.85rem 1rem', letterSpacing: '0.2em', textAlign: 'center', fontWeight: 'bold' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <FormInput
                label="Mật Khẩu Mới"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                required
                style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
              />
            </div>
            <div style={{ marginBottom: '2.5rem' }}>
              <FormInput
                label="Xác Nhận Mật Khẩu"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                style={{ borderRadius: '0px', padding: '0.85rem 1rem' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1.2rem',
                borderRadius: '0px',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontWeight: 500,
                fontFamily: 'Outfit, sans-serif',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Xác Nhận Đổi Mật Khẩu'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button 
                type="button"
                onClick={() => setStep(1)}
                style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', textDecoration: 'underline', transition: 'color 0.3s', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'none', border: 'none', cursor: 'pointer' }} 
                onMouseOver={e => e.target.style.color = 'var(--color-accent)'} 
                onMouseOut={e => e.target.style.color = 'var(--color-text-muted)'}
              >
                Nhập lại Email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
