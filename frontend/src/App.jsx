// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import {
  Leaf, Ship, Package, Mail, Phone, CheckCircle,
  ArrowRight, Menu, X, MessageCircle
} from 'lucide-react';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Refs for uncontrolled forms
  const productFormRef = useRef(null);
  const contactFormRef = useRef(null);

  // Keep track of last-focused input to preserve focus if it gets stolen
  const lastFocusedRef = useRef(null);

  // Gallery / Lightbox state
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Focus-preserve effect: if active element becomes body/null, try to refocus lastFocusedRef
  useEffect(() => {
    const restoreFocus = () => {
      const active = document.activeElement;
      if ((active === document.body || active === null) && lastFocusedRef.current && typeof lastFocusedRef.current.focus === 'function') {
        setTimeout(() => {
          try { lastFocusedRef.current.focus(); } catch (err) { /* ignore */ }
        }, 0);
      }
    };

    window.addEventListener('focusin', () => { /* keep focus tracking live */ });
    window.addEventListener('blur', restoreFocus);
    window.addEventListener('keydown', restoreFocus);

    return () => {
      window.removeEventListener('blur', restoreFocus);
      window.removeEventListener('keydown', restoreFocus);
    };
  }, []);

  useEffect(() => {
    const titles = {
      home: 'Destiny Global Import Export - Organic Cow Dung Products Exporter',
      about: 'About Us - Destiny Global Import Export | Sustainable Solutions',
      products: 'Our Products - Organic Pellets, Compost & Powder | Destiny Global',
      contact: 'Contact Us - Destiny Global Import Export',
      'product-detail': selectedProduct ? `${selectedProduct.name} - Destiny Global` : 'Product Details'
    };
    
    document.title = titles[currentPage] || 'Destiny Global Import Export';
    
    const descriptions = {
      home: 'Leading exporter of premium organic cow dung pellets, compost, and powder from India. Sustainable biomass energy and organic fertilizers.',
      products: 'Browse our range of organic cow dung products: pellets for biomass energy, compost for organic farming, and powder for soil enrichment.',
      about: 'Learn about Destiny Global Import Export - pioneers in sustainable agricultural exports from India to the world.',
      contact: 'Get in touch with Destiny Global Import Export for bulk orders, inquiries, and partnerships.'
    };
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && descriptions[currentPage]) {
      metaDesc.setAttribute('content', descriptions[currentPage]);
    }
  }, [currentPage, selectedProduct]);

  const products = [
    {
      id: 'pellets',
      name: 'Organic Cow Dung Pellets',
      category: 'Renewable Energy',
      shortDesc: 'Premium biomass pellets for sustainable energy',
      description: 'Manufactured using advanced compression technology, these pellets are easy to store, transport, and use for sustainable energy and agriculture.',
      image: '/Pellet1.png',
      images: ['/Pellet1.png', '/Pellet2.png', '/Pellet3.png', '/Pellet4.png'],
      features: [
        'High calorific value for energy generation',
        'Smoke-free and odorless combustion',
        'Slow-release nutrient delivery',
        'Long shelf life and easy storage',
        'Carbon-neutral renewable energy source',
        'Reduces waste and promotes circular economy'
      ],
      applications: [
        'Biomass Power Plants',
        'Industrial Boilers and Furnaces',
        'Residential Heating Systems',
        'Organic Farming as Fertilizer',
        'Rural Cooking Fuel Alternative'
      ],
      specifications: {
        'Calorific Value': '3500-4000 kcal/kg',
        'Moisture Content': '8-10%',
        'Ash Content': '15-20%',
        'Pellet Diameter': '6-8 mm',
        'Pellet Length': '10-30 mm',
        'Density': '650-750 kg/m³',
        'Nitrogen (N)': '2.0-2.5%'
      }
    },
    {
      id: 'compost',
      name: 'Cow Dung Compost',
      category: 'Organic Farming',
      shortDesc: 'Eco-friendly soil for lasting crops',
      description: 'Our fully decomposed cow dung compost is a natural soil conditioner that enhances soil fertility and promotes healthy plant growth.',
      image: '/Compost1.png',
      images: ['/Compost1.png', '/Compost2.png', '/Compost3.png', '/Compost4.png'],
      features: [
        'Rich in NPK (Nitrogen, Phosphorus, Potassium)',
        'Improves soil structure and water retention',
        'Enhances microbial activity in soil',
        'pH balanced for optimal plant growth',
        'Free from harmful chemicals and pathogens',
        '100% organic and eco-friendly'
      ],
      applications: [
        'Agriculture and Crop Production',
        'Home Gardening and Landscaping',
        'Nursery and Greenhouse Cultivation',
        'Soil Reclamation and Erosion Control',
        'Organic Farming Certification'
      ],
      specifications: {
        'Organic Matter': '40-45%',
        'Nitrogen (N)': '1.5-2.0%',
        'Phosphorus (P)': '0.8-1.2%',
        'Potassium (K)': '1.2-1.5%',
        'Moisture Content': '15-20%',
        'pH Level': '6.5-7.5',
        'C:N Ratio': '15:1 to 20:1'
      }
    },
    {
      id: 'powder',
      name: 'Cow Dung Powder',
      category: 'Organic Farming',
      shortDesc: 'Dry powdered manure — easy to store & mix',
      description: 'Finely dried and sieved cow dung powder — ideal as a soil amendment, potting mix additive, and organic fertilizer when blended or composted.',
      image: '/Powder1.png',
      images: ['/Powder1.png', '/Powder2.png', '/Powder3.png', '/Powder4.png'],
      features: [
        'Fine particle size for easy mixing into soil and potting media',
        'Low moisture for long shelf life and lightweight transport',
        'Improves soil structure and increases water retention',
        'Slow nutrient release and supports beneficial microbes',
        'Suitable for bagging, blending and commercial fertilizer production',
        '100% organic with no chemical additives'
      ],
      applications: [
        'Potting mixes and seedling beds',
        'Commercial fertilizer blending',
        'Top-dressing for potted plants',
        'Soil amendment in nurseries',
        'Pre-plant soil conditioning'
      ],
      specifications: {
        'Particle Size': '< 2 mm (sieved)',
        'Moisture Content': '6-10%',
        'Organic Matter': '60-65%',
        'Nitrogen (N)': '1.2-1.8%',
        'Phosphorus (P)': '0.6-1.0%',
        'Potassium (K)': '0.8-1.3%',
        'pH Level': '6.5-7.2'
      }
    },
    {
      id: 'batti',
      name: 'Sandalwood Cow Dung Incense Sticks (Batti)',
      category: 'Spiritual & Wellness',
      shortDesc: 'Sacred incense sticks for Pooja, Havan and relaxation',
      description: 'Handcrafted cow dung incense sticks infused with pure sandalwood fragrance. Perfect for daily worship, meditation, havan ceremonies, and creating a peaceful atmosphere. Made from natural cow dung and aromatic herbs.',
      image: '/Batti1.png',
      images: ['/Batti1.png', '/Batti2.png', '/Batti3.png', '/Batti4.png'],
      features: [
        'Infused with premium sandalwood fragrance',
        'Made from pure, organic cow dung',
        'Long-lasting aroma for spiritual ambiance',
        'Smoke-free and non-toxic burning',
        'Ideal for daily pooja rituals and meditation',
        'Creates calming and purifying atmosphere'
      ],
      applications: [
        'Daily Pooja and Prayer Rituals',
        'Havan and Religious Ceremonies',
        'Meditation and Yoga Sessions',
        'Home Fragrance and Relaxation',
        'Temple and Spiritual Gatherings',
        'Stress Relief and Aromatherapy'
      ],
      specifications: {
        'Stick Length': '20-25 cm',
        'Burning Time': '45-60 minutes per stick',
        'Fragrance': 'Sandalwood',
        'Weight per Stick': '8-10 grams',
        'Base Material': '100% Organic Cow Dung',
        'Packaging': 'Box of 20/50/100 sticks',
        'Shelf Life': '2 years'
      }
    },
    {
      id: 'cake',
      name: 'Traditional Cow Dung Cakes',
      category: 'Spiritual & Traditional',
      shortDesc: 'Sacred cakes for Pooja, Havan and auspicious occasions',
      description: 'Pure, hand-molded cow dung cakes perfect for religious ceremonies, weddings, and indoor havan. These traditional cakes are eco-friendly, smokeless when properly burned, and considered highly auspicious in Hindu rituals.',
      image: '/Cake1.png',
      images: ['/Cake1.png', '/Cake2.png', '/Cake3.png', '/Cake4.png'],
      features: [
        'Handcrafted from pure cow dung',
        'Ideal for auspicious occasions like marriages',
        'Suitable for indoor havan ceremonies',
        'Smokeless and low-ash burning',
        'Traditional and eco-friendly fuel',
        'Creates sacred and purifying atmosphere'
      ],
      applications: [
        'Wedding Ceremonies and Rituals',
        'Indoor Havan and Yagna',
        'Festival Celebrations (Diwali, Holi)',
        'Griha Pravesh (House Warming)',
        'Daily Pooja and Religious Functions',
        'Traditional Cooking in Rural Areas'
      ],
      specifications: {
        'Diameter': '10-15 cm',
        'Thickness': '2-3 cm',
        'Weight per Cake': '200-300 grams',
        'Moisture Content': '8-12%',
        'Burning Time': '60-90 minutes per cake',
        'Packaging': 'Pack of 10/25/50 cakes',
        'Shelf Life': '1-2 years (when stored properly)'
      }
    }
  ];

  // Generic submit handler that reads values from an uncontrolled form (formRef)
  const handleSubmitFromRef = async (e, formRef) => {
    e.preventDefault();
    if (!formRef || !formRef.current) {
      setFormError('Form reference is missing.');
      return;
    }

    // Collect values
    const fd = new FormData(formRef.current);
    const payload = Object.fromEntries(fd.entries());

    // If product selected, prefer selectedProduct.name
    if (selectedProduct) payload.product = selectedProduct.name;

    // Basic validation
    if (!payload.name || !payload.email || !payload.phone || !payload.message) {
      setFormError('Please fill all required fields');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormSubmitted(true);
        formRef.current.reset();
        setTimeout(() => setFormSubmitted(false), 5000);
      } else {
        setFormError(data.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      setFormError('Cannot connect to server. Please check if the backend is running on port 5001.');
    } finally {
      setFormLoading(false);
    }
  };

  // Small utility for inputs to update lastFocusedRef
  const onInputFocus = (e) => {
    lastFocusedRef.current = e.target;
  };

  // Open modal with a specific index
  const openGalleryAt = (index) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
  };

  // Prev / Next with wrap
  const galleryPrev = () => {
    if (!selectedProduct) return;
    setGalleryIndex(i => (i - 1 + selectedProduct.images.length) % selectedProduct.images.length);
  };
  const galleryNext = () => {
    if (!selectedProduct) return;
    setGalleryIndex(i => (i + 1) % selectedProduct.images.length);
  };

  // Auto-advance every 5s while modal open
  useEffect(() => {
    if (!galleryOpen) return;
    const id = setInterval(() => {
      galleryNext();
    }, 4000);
    return () => clearInterval(id);
  }, [galleryOpen, selectedProduct, galleryIndex]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (!galleryOpen) return;
      if (e.key === 'ArrowLeft') galleryPrev();
      if (e.key === 'ArrowRight') galleryNext();
      if (e.key === 'Escape') setGalleryOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [galleryOpen, selectedProduct, galleryIndex]);

  const Header = () => (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo" onClick={() => setCurrentPage('home')} role="button" tabIndex={0}>
            <img src="/logo.png" alt="Destiny Global" className="logo-img" />
          </div>

          <nav className="nav-desktop">
            <button type="button" onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>Home</button>
            <button type="button" onClick={() => setCurrentPage('about')} className={currentPage === 'about' ? 'active' : ''}>About Us</button>
            <button type="button" onClick={() => setCurrentPage('products')} className={currentPage === 'products' ? 'active' : ''}>Products</button>
            <button type="button" onClick={() => setCurrentPage('contact')} className={currentPage === 'contact' ? 'active' : ''}>Contact Us</button>
          </nav>

          <button type="button" className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="nav-mobile">
            <button type="button" onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}>Home</button>
            <button type="button" onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }}>About Us</button>
            <button type="button" onClick={() => { setCurrentPage('products'); setMobileMenuOpen(false); }}>Products</button>
            <button type="button" onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }}>Contact Us</button>
          </nav>
        )}
      </div>
    </header>
  );

  const Footer = () => (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
          <div className="footer-logo" onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="Destiny Global" className="logo-img" style={{ width: '50px', height: '50px' }} />
            <div>
              <h3>DESTINY GLOBAL</h3>
              <p>Import Export</p>
            </div>
          </div>
            <p className="footer-desc">Pioneering sustainable export solutions from India to the world</p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <button type="button" onClick={() => setCurrentPage('home')}>Home</button>
            <button type="button" onClick={() => setCurrentPage('about')}>About Us</button>
            <button type="button" onClick={() => setCurrentPage('products')}>Products</button>
            <button type="button" onClick={() => setCurrentPage('contact')}>Contact Us</button>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <div className="footer-contact">
              <Phone className="icon" />
              <p>+91 8200391265</p>
            </div>
            <div className="footer-contact">
              <Mail className="icon" />
              <a href="mailto:support@destinyglobalimportexport.com">support@destinyglobalimportexport.com</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Connect With Us</h4>
            <a href="https://wa.me/918200391265" target="_blank" rel="noopener noreferrer" className="footer-link">
              <MessageCircle className="icon" />
              <span>WhatsApp Us</span>
            </a>
            <a href="mailto:support@destinyglobalimportexport.com" className="footer-link">
              <Mail className="icon" />
              <span>Email Sales</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Destiny Global Import Export. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  const HomePage = () => (
    <div className="page">
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <img src="/logo.png" alt="Destiny Global Logo" className="hero-logo" />
          <h1>DESTINY GLOBAL</h1>
          <p className="hero-subtitle">Import Export</p>
          <p className="hero-desc">Connecting Markets, Delivering Excellence Worldwide</p>
          <div className="hero-buttons">
            <button type="button" onClick={() => setCurrentPage('products')} className="btn-primary">
              View Products <ArrowRight />
            </button>
            <button type="button" onClick={() => setCurrentPage('contact')} className="btn-secondary">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <section className="products-preview">
        <div className="container">
          <h2>Our Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <div className="product-content">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.shortDesc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(product);
                      setCurrentPage('product-detail');
                    }}
                    className="btn-gradient"
                  >
                    View Details <ArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const AboutPage = () => (
    <div className="page about-page">
      <section className="about-hero">
        <div className="container">
          <h1>About Destiny Global</h1>
          <p>Pioneering sustainable export solutions from India to the world 🌍</p>
        </div>
      </section>

      <section className="journey">
        <div className="container">
          <h2>Our Journey</h2>
          <div className="journey-content">
            <p>Destiny Global Import Export was founded with a vision to transform agricultural by-products into sustainable, high-value resources. We specialize in exporting premium-quality cow dung derivatives—compost, slurry, pellets, powder and liquid extracts—to international markets.</p>
            <p>Our products empower organic farmers worldwide while promoting circular economy principles. By converting waste into wealth, we reduce carbon footprints through green logistics and renewable integration.</p>
          </div>
        </div>
      </section>
    </div>
  );

  const ProductsPage = () => (
    <div className="page products-page">
      <div className="container">
        <div className="page-header">
          <h1>Our Products</h1>
          <p>Premium organic products for sustainable agriculture and energy</p>
        </div>

        <div className="products-grid-large">
          {products.map(product => (
            <div key={product.id} className="product-card-large">
              <img src={product.image} alt={product.name} />
              <div className="product-content">
                <span className="product-category">{product.category}</span>
                <h2>{product.name}</h2>
                <p>{product.shortDesc}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProduct(product);
                    setCurrentPage('product-detail');
                  }}
                  className="btn-gradient"
                >
                  View Full Details <ArrowRight />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ProductDetailPage = () => {
    if (!selectedProduct) return null;

    return (
      <div className="page product-detail-page">
        <div className="back-nav">
          <div className="container">
            <button type="button" onClick={() => setCurrentPage('products')} className="back-btn">
              <ArrowRight className="rotate-180" /> Back to Products
            </button>
          </div>
        </div>

        <div className="container">
          <div className="product-header">
            <h1>{selectedProduct.name}</h1>
            <p>{selectedProduct.description}</p>
          </div>

          <div className="product-gallery">
            <h2>Product Gallery</h2>
            <div className="gallery-grid">
              {selectedProduct.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${selectedProduct.name} ${idx + 1}`}
                  onClick={() => openGalleryAt(idx)}
                />
              ))}
            </div>
          </div>

          <div className="product-features">
            <h2>Key Features</h2>
            <div className="features-list">
              {selectedProduct.features.map((feature, idx) => (
                <div key={idx} className="feature-item">
                  <CheckCircle />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="two-column-sections">
            <div className="col applications-col">
              <h2>Applications</h2>
              <div className="applications-list">
                {selectedProduct.applications.map((app, idx) => (
                  <span key={idx} className="application-tag">{app}</span>
                ))}
              </div>
            </div>

            <div className="col specs-col">
              <h2>Technical Specifications</h2>
              <div className="specs-table">
                {Object.entries(selectedProduct.specifications).map(([key, value], idx) => (
                  <div key={idx} className={`spec-row ${idx % 2 === 0 ? 'even' : 'odd'}`}>
                    <span className="spec-key">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="enquiry-form-section">
            <h2>Product Enquiry</h2>
            {formSubmitted ? (
              <div className="form-success">
                <CheckCircle />
                <h3>Thank You!</h3>
                <p>Your enquiry has been submitted. We'll get back to you soon.</p>
              </div>
            ) : (
              <form
                ref={productFormRef}
                className="enquiry-form"
                onSubmit={(e) => handleSubmitFromRef(e, productFormRef)}
              >
                {formError && (
                  <div className="form-error" style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #ef4444',
                    color: '#991b1b',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    {formError}
                  </div>
                )}
                <div className="form-grid">
                  <input type="text" name="name" placeholder="Your Name *" required onFocus={onInputFocus} />
                  <input type="email" name="email" placeholder="Email Address *" required onFocus={onInputFocus} />
                  <input type="tel" name="phone" placeholder="Phone Number *" required onFocus={onInputFocus} />
                  <input type="text" name="company" placeholder="Company Name" onFocus={onInputFocus} />
                  <input type="text" name="country" placeholder="Country" onFocus={onInputFocus} />
                </div>
                <textarea name="message" placeholder="Your Message *" required rows="4" onFocus={onInputFocus} />
                <input type="hidden" name="product" value={selectedProduct ? selectedProduct.name : ''} />
                <button type="submit" className="btn-submit" disabled={formLoading}>
                  {formLoading ? 'Submitting...' : 'Submit Enquiry'} <ArrowRight />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Gallery Modal / Lightbox */}
        {galleryOpen && selectedProduct && (
          <div className="gallery-modal" role="dialog" aria-modal="true">
            <div className="gallery-modal-backdrop" onClick={() => setGalleryOpen(false)} />
            <div className="gallery-modal-content">
              <button className="modal-close" onClick={() => setGalleryOpen(false)} aria-label="close">✕</button>

              <button className="modal-nav modal-prev" onClick={galleryPrev} aria-label="previous image">‹</button>

              <div className="modal-image-wrap">
                <img src={selectedProduct.images[galleryIndex]} alt={`${selectedProduct.name} ${galleryIndex + 1}`} />
                <div className="modal-caption">{selectedProduct.name} — {galleryIndex + 1} / {selectedProduct.images.length}</div>
              </div>

              <button className="modal-nav modal-next" onClick={galleryNext} aria-label="next image">›</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ContactPage = () => (
    <div className="page contact-page">
      <div className="container">
        <div className="page-header">
          <h1>Get In Touch</h1>
          <p>Ready to start your global trade journey?</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-item">
              <Phone />
              <div>
                <h4>Phone</h4>
                <p>+91 8200391265</p>
              </div>
            </div>
            <div className="contact-item">
              <Mail />
              <div>
                <h4>Email</h4>
                <p>support@destinyglobalimportexport.com</p>
              </div>
            </div>
            <div className="contact-item">
              <MessageCircle />
              <div>
                <h4>WhatsApp</h4>
                <a href="https://wa.me/918200391265" target="_blank" rel="noopener noreferrer">
                  +91 8200391265
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {formSubmitted ? (
              <div className="form-success">
                <CheckCircle />
                <h3>Thank You!</h3>
                <p>Your message has been sent. We'll contact you soon.</p>
              </div>
            ) : (
              <form
                ref={contactFormRef}
                className="contact-form"
                onSubmit={(e) => handleSubmitFromRef(e, contactFormRef)}
              >
                {formError && (
                  <div className="form-error" style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #ef4444',
                    color: '#991b1b',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    {formError}
                  </div>
                )}
                <input type="text" name="name" placeholder="Your Name *" required onFocus={onInputFocus} />
                <input type="email" name="email" placeholder="Email Address *" required onFocus={onInputFocus} />
                <input type="tel" name="phone" placeholder="Phone Number *" required onFocus={onInputFocus} />
                <input type="text" name="product" placeholder="Product Interest" onFocus={onInputFocus} />
                <textarea name="message" placeholder="Your Message *" required rows="4" onFocus={onInputFocus} />
                <button type="submit" className="btn-submit" disabled={formLoading}>
                  {formLoading ? 'Submitting...' : 'Send Message'} <ArrowRight />
                </button>
                </form>
            )}
            </div>
        </div>
        </div>
    </div>
    );
    return (
    <div className="App">
      <Header />

      {currentPage === 'home' && <HomePage />}
      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'products' && <ProductsPage />}
      {currentPage === 'product-detail' && <ProductDetailPage />}
      {currentPage === 'contact' && <ContactPage />}

      <Footer />
    </div>
    );
}
export default App;