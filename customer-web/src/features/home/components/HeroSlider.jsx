import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Shield, Truck, Wrench, Phone } from 'lucide-react';
import './HeroSlider.css';

// Fixed service commitment slide - always shown last
const SERVICE_SLIDE = { id: 'service', type: 'service' };

const HeroSlider = ({ collections = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Build slides: collection slides + 1 fixed service slide at the end
  const slides = collections.length > 0
    ? [...collections.map(c => ({ ...c, type: 'collection' })), SERVICE_SLIDE]
    : [SERVICE_SLIDE];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="hero-slider-container">
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;

        if (slide.type === 'service') {
          return (
            <section
              key="service"
              className={`hero-slide hero-slide--service ${isActive ? 'active' : ''}`}
            >
              <div className="hero-slider-overlay hero-slider-overlay--dark" />
              <div className="container hero-content hero-content--service">
                <div className="hero-service-badge">CAM KẾT TỪ CHÚNG TÔI</div>
                <h1 className="hero-title hero-title--service">
                  Đối Tác Tin Cậy Của Mọi Không Gian Sống
                </h1>
                <p className="hero-desc">
                  Chúng tôi cam kết mang đến trải nghiệm mua sắm thiết bị vệ sinh cao cấp tốt nhất tại Việt Nam.
                </p>
                <div className="hero-service-list">
                  <div className="hero-service-item">
                    <Shield size={20} strokeWidth={1.5} />
                    <span>Đại lý ủy quyền chính thức INAX &amp; TOTO</span>
                  </div>
                  <div className="hero-service-item">
                    <Truck size={20} strokeWidth={1.5} />
                    <span>Miễn phí giao hàng toàn quốc</span>
                  </div>
                  <div className="hero-service-item">
                    <Wrench size={20} strokeWidth={1.5} />
                    <span>Bảo hành chính hãng tối đa 10 năm</span>
                  </div>
                  <div className="hero-service-item">
                    <Phone size={20} strokeWidth={1.5} />
                    <span>Hỗ trợ tư vấn 24/7 — Hotline: 1800 1234</span>
                  </div>
                </div>
                <Link to="/chinh-sach" className="btn-slider btn-slider--gold">XEM CHÍNH SÁCH</Link>
              </div>
            </section>
          );
        }

        // Collection slide
        return (
          <section
            key={slide.id}
            className={`hero-slide ${isActive ? 'active' : ''}`}
            style={{
              backgroundImage: slide.bannerUrl
                ? `url(${slide.bannerUrl})`
                : 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)'
            }}
          >
            <div className="hero-slider-overlay" />
            <div className="container hero-content">
              <div className="hero-brand">BỘ SƯU TẬP</div>
              <h1 className="hero-title">{slide.name}</h1>
              {slide.description && (
                <p className="hero-desc">{slide.description}</p>
              )}
              <Link to={`/bo-suu-tap/${slide.slug}`} className="btn-slider">
                KHÁM PHÁ BỘ SƯU TẬP
              </Link>
            </div>
          </section>
        );
      })}

      {slides.length > 1 && (
        <>
          <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous slide">
            <ChevronLeft size={24} />
          </button>
          <button className="slider-arrow next" onClick={nextSlide} aria-label="Next slide">
            <ChevronRight size={24} />
          </button>

          <div className="slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
