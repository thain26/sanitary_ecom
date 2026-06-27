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
                <div className="hero-service-badge">AQUALUX PROMISE</div>
                <h1 className="hero-title hero-title--service">
                  Bảo Chứng Chất Lượng & Niềm Tin
                </h1>
                <p className="hero-desc hero-desc--service">
                  Hơn cả việc cung cấp thiết bị vệ sinh cao cấp, chúng tôi trao gửi sự an tâm tuyệt đối cho không gian sống của bạn.
                </p>
                
                <div className="hero-service-grid">
                  <div className="hero-service-card">
                    <div className="hero-service-icon"><Shield size={28} strokeWidth={1.2} /></div>
                    <h3>Chính Hãng 100%</h3>
                    <p>Đại lý ủy quyền phân phối cấp 1 của INAX & TOTO</p>
                  </div>
                  <div className="hero-service-card">
                    <div className="hero-service-icon"><Truck size={28} strokeWidth={1.2} /></div>
                    <h3>Giao Hàng Toàn Quốc</h3>
                    <p>Vận chuyển nhanh chóng, an toàn đến tận công trình</p>
                  </div>
                  <div className="hero-service-card">
                    <div className="hero-service-icon"><Wrench size={28} strokeWidth={1.2} /></div>
                    <h3>Bảo Hành 10 Năm</h3>
                    <p>Dịch vụ hậu mãi tận tâm, đổi trả dễ dàng, linh hoạt</p>
                  </div>
                  <div className="hero-service-card">
                    <div className="hero-service-icon"><Phone size={28} strokeWidth={1.2} /></div>
                    <h3>Hỗ Trợ 24/7</h3>
                    <p>Chuyên gia tư vấn kỹ thuật luôn sẵn sàng hỗ trợ bạn</p>
                  </div>
                </div>
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
