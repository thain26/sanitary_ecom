import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ color: '#fff', marginBottom: '1.5rem', marginTop: '-0.3rem' }}>
              AQUA<span style={{ color: 'var(--color-accent)', marginLeft: '6px' }}>LUX</span>
            </div>
            <p className="footer-text" style={{ maxWidth: '400px' }}>
              Nâng tầm trải nghiệm hàng ngày với thiết bị vệ sinh cao cấp. Sự giao thoa hoàn hảo giữa công nghệ và nghệ thuật.
            </p>
          </div>

          <div>
            <h3 className="footer-title">Showroom</h3>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem' }}>
              <MapPin size={18} color="var(--color-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <p className="footer-text" style={{ margin: 0 }}>155 Nguyễn Văn Trỗi, Hà Đông, Hà Nội</p>
            </div>
          </div>

          <div>
            <h3 className="footer-title">Hỗ Trợ</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Phone size={18} color="var(--color-accent)" />
              <p className="footer-text" style={{ margin: 0 }}>Hotline: 1900 1234</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
              <Mail size={18} color="var(--color-accent)" />
              <p className="footer-text" style={{ margin: 0 }}>Email: aqualux@gmail.com</p>
            </div>
            <a href="#" className="footer-link" style={{ display: 'inline-block' }}>Chính sách bảo hành</a>
          </div>
        </div>

        <div className="footer-bottom">
          &copy; 2026 AQUA LUX. Thiết bị vệ sinh cao cấp.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
