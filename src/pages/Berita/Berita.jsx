import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronRight, HiOutlineMapPin, HiOutlineNewspaper } from 'react-icons/hi2';
import styles from './Berita.module.css';
import { StudentRepository, GeneralRepository } from '../../repositories';
import logo from '../../assets/images/logo.png';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const Berita = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [newsRes, settingsRes] = await Promise.all([
                    StudentRepository.getPosts(),
                    GeneralRepository.getSettings()
                ]);

                if (newsRes && newsRes.success) {
                    setNews(newsRes.data);
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
        if (!dateString) return { day: '-', month: '-' };
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('id-ID', { month: 'short' })
        };
    };

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
                    <div className={styles.brandWrapper}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                        <span className={styles.brandName}>SIPORTU</span>
                    </div>
                </div>

                <div className={styles.pageTitleWrapper}>
                    <h1 className={styles.pageTitle}>Berita Terbaru</h1>
                    <p className={styles.pageSubtitle}>Update informasi harian untuk Anda</p>
                </div>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.newsGrid}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} height="120px" borderRadius="24px" />
                        ))}
                    </div>
                ) : (
                    <div className={styles.newsGrid}>
                        {news.map((item, index) => {
                            const date = new Date(item.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            });
                            
                            return (
                                <div
                                    key={item.id || index}
                                    className={styles.newsCard}
                                    onClick={() => navigate(`/berita-detail/${item.slug}`)}
                                >
                                    <div className={styles.imageWrapper}>
                                        {item.image && !item.imageError ? (
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                className={styles.newsImage} 
                                                onError={(e) => {
                                                    const newNews = [...news];
                                                    newNews[index].imageError = true;
                                                    setNews(newNews);
                                                }}
                                            />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <HiOutlineNewspaper size={48} />
                                            </div>
                                        )}
                                        <span className={styles.categoryBadge}>{item.category_name || 'Berita'}</span>
                                    </div>
                                    
                                    <div className={styles.newsContent}>
                                        <div className={styles.newsMeta}>
                                            <span>{date}</span>
                                            <span className={styles.dot}>•</span>
                                            <span>Oleh Admin</span>
                                        </div>
                                        
                                        <h3 className={styles.newsTitle}>{item.title}</h3>
                                        <p className={styles.newsSnippet}>
                                            {item.content && item.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                        </p>
                                        
                                        <div className={styles.cardFooter}>
                                            <div className={styles.readMore}>
                                                <span>Baca Selengkapnya</span>
                                                <HiOutlineChevronRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {news.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <HiOutlineNewspaper />
                                </div>
                                <h3>Belum ada berita</h3>
                                <p>Silakan periksa kembali nanti untuk informasi terbaru.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Berita;

