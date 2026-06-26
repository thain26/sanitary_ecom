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
            <h3 className="footer-title">Bộ Sưu Tập</h3>
            <a href="#" className="footer-link">Bồn cầu thông minh Satis</a>
            <a href="#" className="footer-link">Dòng sản phẩm Aqua Ceramic</a>
            <a href="#" className="footer-link">Vòi nước Lumina</a>
          </div>

          <div>
            <h3 className="footer-title">Hỗ Trợ</h3>
            <a href="#" className="footer-link">Liên hệ</a>
            <a href="#" className="footer-link">Đăng ký bảo hành</a>
            <a href="#" className="footer-link">Hướng dẫn lắp đặt</a>
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
