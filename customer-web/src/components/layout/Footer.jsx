const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{color: '#fff', marginBottom: '1.5rem'}}>
              AQUA<span style={{color: 'var(--color-accent)', marginLeft: '6px'}}>LUX</span>
            </div>
            <p className="footer-text" style={{maxWidth: '400px'}}>
              Nâng tầm trải nghiệm hàng ngày với thiết bị vệ sinh cao cấp. Sự giao thoa hoàn hảo giữa công nghệ và nghệ thuật.
            </p>
          </div>
          
          <div>
            <h3 className="footer-title">Showroom</h3>
            <p className="footer-text" style={{marginBottom: '0.8rem'}}>155 Nguyễn Văn Trỗi</p>
            <p className="footer-text">Phường 11, Phú Nhuận, TP.HCM</p>
          </div>

          <div>
            <h3 className="footer-title">Hỗ Trợ</h3>
            <p className="footer-text" style={{marginBottom: '0.8rem'}}>Hotline: 1800 1234</p>
            <p className="footer-text" style={{marginBottom: '0.8rem'}}>Email: aqualux@gmail.com</p>
            <a href="#" className="footer-link">Chính sách bảo hành</a>
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
