import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { publicApi } from '../../../services/api';
import useCartStore from '../../cart/store/useCartStore';
import useToastStore from '../../../store/useToastStore';
import ProductCard from '../components/ProductCard';
import { ChevronRight, ChevronDown, Menu } from 'lucide-react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const priceRanges = [
  { label: 'TẤT CẢ GIÁ', min: null, max: null },
  { label: 'DƯỚI 3 TRIỆU', min: 0, max: 3000000 },
  { label: 'TỪ 3 - 10 TRIỆU', min: 3000000, max: 10000000 },
  { label: 'TỪ 10 - 30 TRIỆU', min: 10000000, max: 30000000 },
  { label: 'TRÊN 30 TRIỆU', min: 30000000, max: 999999999 }
];

const ProductList = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q');
  const addToCart = useCartStore(state => state.addToCart);
  const navigate = useNavigate();

  // States
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [categories, setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);

  // Filters State
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [sortOrder, setSortOrder] = useState('createdAt,desc');
  const [page, setPage] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch categories tree and brands on mount
  useEffect(() => {
    publicApi.getCategories()
      .then(res => {
        setCategories(res || []);
      })
      .catch(err => console.error("Failed to load categories tree", err));

    publicApi.getBrands()
      .then(res => {
        setBrandsList(res || []);
      })
      .catch(err => console.error("Failed to load brands", err));

    // Initial attention grabber for megamenu
    const timer1 = setTimeout(() => setIsMenuOpen(true), 800);
    const timer2 = setTimeout(() => setIsMenuOpen(false), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // Trigger loading products on slug/keyword change or filters change
  useEffect(() => {
    fetchProducts();
  }, [slug, keyword, selectedBrand, selectedPriceIdx, sortOrder, page]);

  // Reset page when search or category changes
  useEffect(() => {
    setPage(0);
    setSelectedBrand('');
    setSelectedPriceIdx(0);
    setSortOrder('createdAt,desc');
  }, [slug, keyword]);

  const fetchProducts = () => {
    setLoading(true);
    const range = priceRanges[selectedPriceIdx];
    const params = {
      categorySlug: slug || 'tat-ca',
      brandId: selectedBrand || null,
      minPrice: range.min,
      maxPrice: range.max,
      keyword: keyword || null,
      page: page,
      size: 9,
      sort: sortOrder
    };

    publicApi.getProducts(params)
      .then(res => {
        if (res.content) {
          setProducts(res.content);
          setTotalPages(res.totalPages);
          setTotalElements(res.totalElements);
        } else {
          setProducts(res || []);
          setTotalPages(1);
          setTotalElements(res?.length || 0);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products", err);
        setProducts([]);
        setLoading(false);
      });
  };

  // Determine active L1 and L2 categories
  let activeParentId = null;
  let activeChildId = null;

  if (slug && categories.length > 0) {
    const matchedParent = categories.find(p => p.slug === slug);
    if (matchedParent) {
      activeParentId = matchedParent.id;
    } else {
      for (const parent of categories) {
        const matchedChild = parent.children?.find(c => c.slug === slug);
        if (matchedChild) {
          activeParentId = parent.id;
          activeChildId = matchedChild.id;
          break;
        }
      }
    }
  }

  // Default to first parent category if none is active (e.g. tat-ca or search page)
  if (!activeParentId && categories.length > 0) {
    activeParentId = categories[0].id;
  }

  const activeParent = categories.find(p => p.id === activeParentId);

  const getCategoryName = () => {
    if (keyword) return 'Tìm kiếm';
    if (!slug || slug === 'tat-ca') return 'Tất Cả Sản Phẩm';

    const findCategoryName = (list) => {
      for (const cat of list) {
        if (cat.slug === slug) return cat.name;
        if (cat.children && cat.children.length > 0) {
          const found = findCategoryName(cat.children);
          if (found) return found;
        }
      }
      return null;
    };

    const name = findCategoryName(categories);
    return name || 'Sản Phẩm';
  };

  const showToast = useToastStore(state => state.showToast);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in container" style={{ paddingBottom: '5rem' }}>

      {/* Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem 0', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'Be Vietnam Pro, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        <Link to="/" style={{ color: 'inherit' }}>Trang chủ</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-primary)' }}>
          {getCategoryName()}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Megamenu Container */}
        <div className="megamenu-container">
          <button className="megamenu-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span>DANH MỤC SẢN PHẨM <ChevronDown size={16} style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} /></span>
          </button>
        </div>

        <span style={{ fontSize: '1.25rem', fontWeight: 300, color: 'var(--color-border-hover)' }}>/</span>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 300, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1, color: 'var(--color-accent)' }}>
            {keyword ? `KẾT QUẢ CHO: "${keyword}"` : getCategoryName()}
          </h1>
          <p className="text-muted" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            TÌM THẤY {totalElements} SẢN PHẨM
          </p>
        </div>
      </div>

      <div className={`megamenu-dropdown ${isMenuOpen ? 'open' : ''}`}>
        {/* Column 1: Brand */}
        <div className="megamenu-col brand-col">
          <div className="megamenu-col-title">
            <button 
              onClick={() => setSelectedBrand('')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit', padding: 0, letterSpacing: 'inherit', textTransform: 'inherit' }}
            >
              Thương Hiệu
            </button>
          </div>
          <div className="brand-list-wrapper">
            {brandsList.map(b => (
              <button
                key={b.id}
                onClick={() => {
                  if (selectedBrand === b.id.toString()) {
                    setSelectedBrand('');
                  } else {
                    setSelectedBrand(b.id.toString());
                  }
                }}
                className={`megamenu-brand-btn ${selectedBrand === b.id.toString() ? 'active' : ''}`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid (Dynamic) */}
        <div className="megamenu-col category-col" style={{ flex: 1 }}>
          <div className="megamenu-col-title">
            <Link to="/danh-muc/tat-ca">Thiết Bị Vệ Sinh</Link>
          </div>
          <div className="megamenu-subgrid">
            {(() => {
              const topLevelCategories = categories.filter(c => !c.parentId && c.slug !== 'thiet-bi-ve-sinh');
              return topLevelCategories.map(parent => (
                <div key={parent.id} className="megamenu-section">
                  <Link to={`/danh-muc/${parent.slug}`} className="megamenu-section-title">
                    {parent.name}
                  </Link>
                  <Link to={`/danh-muc/${parent.slug}`} className={`megamenu-section-link ${slug === parent.slug ? 'active' : ''}`}>
                    Tất cả
                  </Link>
                  {parent.children?.map(child => (
                    <Link
                      key={child.id}
                      to={`/danh-muc/${child.slug}`}
                      className={`megamenu-section-link ${slug === child.slug ? 'active' : ''}`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Spacer to avoid layout jumps if needed, though drawer handles it */}

      {/* Top filter toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1.25rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        {/* Price Filter */}
        <div className="top-filter-item">
          <span className="top-filter-label">MỨC GIÁ:</span>
          <select
            value={selectedPriceIdx}
            onChange={(e) => setSelectedPriceIdx(Number(e.target.value))}
            className="top-filter-select"
          >
            {priceRanges.map((range, idx) => (
              <option key={idx} value={idx}>{range.label}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="top-filter-item">
          <span className="top-filter-label">SẮP XẾP:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="top-filter-select"
          >
            <option value="createdAt,desc">MỚI NHẤT</option>
            <option value="basePrice,asc">GIÁ: THẤP ĐẾN CAO</option>
            <option value="basePrice,desc">GIÁ: CAO ĐẾN THẤP</option>
            <option value="soldCount,desc">BÁN CHẠY NHẤT</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {(selectedPriceIdx !== 0) && (
          <button
            onClick={() => {
              setSelectedPriceIdx(0);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              fontFamily: 'Be Vietnam Pro, sans-serif',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
              marginLeft: 'auto',
              padding: '0.25rem 0.5rem'
            }}
          >
            XÓA BỘ LỌC
          </button>
        )}
      </div>

      <div className="shop-layout">

        {/* Products Grid & Pagination */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {loading ? (
            <div style={{ padding: '5rem', textAlign: 'center', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Đang tải sản phẩm...
            </div>
          ) : (
            <>
              <div className="product-grid" style={{ marginBottom: 0 }}>
                {products.length === 0 ? (
                  <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--color-text-muted)', width: '100%', gridColumn: '1 / -1' }}>
                    Không tìm thấy sản phẩm nào phù hợp với bộ lọc đã chọn.
                  </div>
                ) : (
                  products.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={addToCart}
                    />
                  ))
                )}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid var(--color-border)',
                      background: '#fff',
                      cursor: page === 0 ? 'not-allowed' : 'pointer',
                      color: page === 0 ? 'var(--color-text-muted)' : 'var(--color-text)',
                      fontFamily: 'Be Vietnam Pro, sans-serif'
                    }}
                  >
                    Trước
                  </button>

                  {(() => {
                    const pages = [];
                    if (totalPages <= 7) {
                      for (let i = 0; i < totalPages; i++) pages.push(i);
                    } else {
                      if (page <= 3) {
                        for (let i = 0; i < 5; i++) pages.push(i);
                        pages.push('...');
                        pages.push(totalPages - 1);
                      } else if (page >= totalPages - 4) {
                        pages.push(0);
                        pages.push('...');
                        for (let i = totalPages - 5; i < totalPages; i++) pages.push(i);
                      } else {
                        pages.push(0);
                        pages.push('...');
                        pages.push(page - 1);
                        pages.push(page);
                        pages.push(page + 1);
                        pages.push('...');
                        pages.push(totalPages - 1);
                      }
                    }
                    return pages.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => p !== '...' && handlePageChange(p)}
                        disabled={p === '...'}
                        style={{
                          padding: '0.5rem 1rem',
                          border: p === '...' ? 'none' : '1px solid',
                          borderColor: page === p ? 'var(--color-primary)' : 'var(--color-border)',
                          background: p === '...' ? 'transparent' : page === p ? 'var(--color-primary)' : '#fff',
                          color: page === p ? '#fff' : 'var(--color-text)',
                          cursor: p === '...' ? 'default' : 'pointer',
                          fontWeight: page === p ? 'bold' : 'normal',
                          fontFamily: 'Be Vietnam Pro, sans-serif'
                        }}
                      >
                        {p === '...' ? '...' : p + 1}
                      </button>
                    ));
                  })()}

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages - 1}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid var(--color-border)',
                      background: '#fff',
                      cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
                      color: page === totalPages - 1 ? 'var(--color-text-muted)' : 'var(--color-text)',
                      fontFamily: 'Be Vietnam Pro, sans-serif'
                    }}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList;

