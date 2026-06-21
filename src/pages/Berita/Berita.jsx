import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineNewspaper, HiArrowLeft, HiMagnifyingGlass } from 'react-icons/hi2';
import styles from './Berita.module.css';
import { StudentRepository, GeneralRepository } from '../../repositories';
import logo from '../../assets/images/logo.png';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const Berita = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [newsRes, settingsRes] = await Promise.all([
                    StudentRepository.getPosts().catch(err => {
                        console.error('Error fetching news:', err);
                        return null;
                    }),
                    GeneralRepository.getSettings().catch(err => {
                        console.error('Error fetching settings:', err);
                        return null;
                    })
                ]);

                if (newsRes && newsRes.success) {
                    setNews(newsRes.data || []);
                }
                if (settingsRes?.status === 'success') {
                    setSettings(settingsRes.data);
                }
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Extract unique categories dynamically
    const categories = ['Semua', ...new Set(news.map(item => item.category_name || 'Berita'))];

    // Filtered news list based on category and search query
    const filteredNews = news.filter(item => {
        const matchesCategory = selectedCategory === 'Semua' || (item.category_name || 'Berita') === selectedCategory;
        const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.content?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredItem = filteredNews[0];
    const otherNews = filteredNews.slice(1);

    return (
        <div className={styles.container}>
            {/* Unified Header */}
            <div className={styles.topSection}>
                {settings?.background_login && (
                    <div className={styles.bgOverlay}>
                        <img src={settings.background_login} alt="Background" className={styles.bgImage} />
                        <div className={styles.bgGradient}></div>
                    </div>
                )}
                
                <div className={styles.header}>
                    <button className={styles.backButton} onClick={() => navigate('/dashboard')} title="Kembali">
                        <HiArrowLeft />
                    </button>
                    <div className={styles.brandWrapper}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                        <span className={styles.brandName}>SIPORTU</span>
                    </div>
                </div>

                <div className={styles.pageTitleWrapper}>
                    <h1 className={styles.pageTitle}>Berita & Informasi</h1>
                    <p className={styles.pageSubtitle}>Update terkini kegiatan sekolah dan santri</p>
                </div>
            </div>

            <div className={styles.content}>
                {/* Search Bar */}
                <div className={styles.searchBarWrapper}>
                    <HiMagnifyingGlass className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Cari berita..." 
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Category Filters */}
                {news.length > 0 && (
                    <div className={styles.categoryScroll}>
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                className={`${styles.categoryTab} ${selectedCategory === cat ? styles.activeTab : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className={styles.skeletonWrapper}>
                        <Skeleton height="260px" borderRadius="24px" style={{ marginBottom: '20px' }} />
                        <Skeleton height="100px" borderRadius="20px" count={3} style={{ marginBottom: '12px' }} />
                    </div>
                ) : (
                    <div className={styles.newsContainer}>
                        {filteredNews.length > 0 ? (
                            <>
                                {/* Featured News (Big Card) */}
                                {featuredItem && (
                                    <div 
                                        className={styles.featuredCard}
                                        onClick={() => navigate(`/berita-detail/${featuredItem.slug}`)}
                                    >
                                        <div className={styles.featuredImageWrapper}>
                                            {featuredItem.image && !featuredItem.imageError ? (
                                                <img 
                                                    src={featuredItem.image} 
                                                    alt={featuredItem.title} 
                                                    className={styles.featuredImage}
                                                    onError={() => {
                                                        const newNews = [...news];
                                                        const idx = news.findIndex(n => n.id === featuredItem.id);
                                                        if (idx !== -1) {
                                                            newNews[idx].imageError = true;
                                                            setNews(newNews);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className={styles.featuredImagePlaceholder}>
                                                    <HiOutlineNewspaper size={64} />
                                                </div>
                                            )}
                                            <span className={styles.featuredBadge}>FEATURED</span>
                                            <span className={styles.featuredCategoryBadge}>
                                                {featuredItem.category_name || 'Berita'}
                                            </span>
                                        </div>
                                        <div className={styles.featuredContent}>
                                            <div className={styles.newsMeta}>
                                                <span>{formatDate(featuredItem.created_at)}</span>
                                                <span className={styles.dot}>•</span>
                                                <span>Admin</span>
                                            </div>
                                            <h2 className={styles.featuredTitle}>{featuredItem.title}</h2>
                                            <p className={styles.featuredSnippet}>
                                                {featuredItem.content && featuredItem.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Other News Grid (2 Columns) */}
                                {otherNews.length > 0 && (
                                    <div className={styles.otherNewsSection}>
                                        <h3 className={styles.sectionTitle}>Berita Lainnya</h3>
                                        <div className={styles.newsGrid2Col}>
                                            {otherNews.map((item, index) => (
                                                <div 
                                                    key={item.id || index}
                                                    className={styles.gridCard}
                                                    onClick={() => navigate(`/berita-detail/${item.slug}`)}
                                                >
                                                    <div className={styles.gridImageWrapper}>
                                                        {item.image && !item.imageError ? (
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.title} 
                                                                className={styles.gridImage}
                                                                onError={() => {
                                                                    const newNews = [...news];
                                                                    const idx = news.findIndex(n => n.id === item.id);
                                                                    if (idx !== -1) {
                                                                        newNews[idx].imageError = true;
                                                                        setNews(newNews);
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className={styles.gridImagePlaceholder}>
                                                                <HiOutlineNewspaper size={36} />
                                                            </div>
                                                        )}
                                                        <span className={styles.gridCategoryBadge}>
                                                            {item.category_name || 'Berita'}
                                                        </span>
                                                    </div>
                                                    <div className={styles.gridContent}>
                                                        <span className={styles.gridDate}>
                                                            {formatDate(item.created_at)}
                                                        </span>
                                                        <h4 className={styles.gridTitle}>{item.title}</h4>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <HiOutlineNewspaper />
                                </div>
                                <h3>Tidak ada hasil ditemukan</h3>
                                <p>Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Berita;

