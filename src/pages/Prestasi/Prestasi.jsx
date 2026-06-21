import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiArrowLeft, HiOutlineTrophy, HiOutlineUser, HiOutlineAcademicCap, HiSquares2X2, HiListBullet } from 'react-icons/hi2';
import styles from './Prestasi.module.css';
import { StudentRepository, GeneralRepository } from '../../repositories';
import logo from '../../assets/images/logo.png';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const Prestasi = () => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    
    // UI states
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [viewMode, setViewMode] = useState('scroll'); // 'scroll' or 'grid'

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [achRes, settingsRes] = await Promise.all([
                    StudentRepository.getPrestasiSiswa({ limit: 50 }).catch(err => {
                        console.error('Error fetching achievements:', err);
                        return null;
                    }),
                    GeneralRepository.getSettings().catch(err => {
                        console.error('Error fetching settings:', err);
                        return null;
                    })
                ]);

                if (achRes && achRes.success) {
                    setAchievements(achRes.data || []);
                }
                if (settingsRes?.status === 'success') {
                    setSettings(settingsRes.data);
                }
            } catch (error) {
                console.error('Error fetching achievements:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getTingkatBadgeClass = (tingkat) => {
        const t = tingkat?.toLowerCase();
        if (t === 'nasional') return styles.badgeNasional;
        if (t === 'provinsi') return styles.badgeProvinsi;
        if (t === 'kabupaten') return styles.badgeKabupaten;
        return styles.badgeKecamatan;
    };

    // Filters list
    const filters = ['Semua', 'Nasional', 'Provinsi', 'Kabupaten', 'Kecamatan'];

    // Filter achievements
    const filteredAchievements = achievements.filter(item => {
        if (activeFilter === 'Semua') return true;
        return item.tingkat?.toLowerCase() === activeFilter.toLowerCase();
    });

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
                    <h1 className={styles.pageTitle}>Prestasi Santri</h1>
                    <p className={styles.pageSubtitle}>Kebanggaan Pondok Pesantren Al Amin</p>
                </div>
            </div>

            <div className={styles.content}>
                {/* Controls: Category scroll and view toggles */}
                <div className={styles.controlsRow}>
                    <div className={styles.filterScroll}>
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                className={`${styles.filterTab} ${activeFilter === filter ? styles.activeTab : ''}`}
                                onClick={() => setActiveFilter(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    
                    <div className={styles.toggleWrapper}>
                        <button 
                            className={`${styles.toggleBtn} ${viewMode === 'scroll' ? styles.activeToggle : ''}`}
                            onClick={() => setViewMode('scroll')}
                            title="Tampilan Alur Gulir"
                        >
                            <HiListBullet />
                        </button>
                        <button 
                            className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
                            onClick={() => setViewMode('grid')}
                            title="Tampilan Grid 2 Kolom"
                        >
                            <HiSquares2X2 />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className={styles.skeletonList}>
                        <Skeleton height="120px" borderRadius="16px" count={3} style={{ marginBottom: '12px' }} />
                    </div>
                ) : (
                    <div className={viewMode === 'scroll' ? styles.scrollContainer : styles.gridContainer}>
                        {filteredAchievements.length > 0 ? (
                            <div 
                                className={viewMode === 'scroll' ? (filteredAchievements.length >= 3 ? styles.achievementScrollGrid : styles.achievementStaticList) : styles.achievementGrid2Col}
                                style={viewMode === 'scroll' && filteredAchievements.length >= 3 ? { animationDuration: `${Math.max(filteredAchievements.length * 5, 12)}s` } : {}}
                            >
                                {/* Double achievements only for scroll animation */}
                                {(viewMode === 'scroll' && filteredAchievements.length >= 3
                                    ? [...filteredAchievements, ...filteredAchievements]
                                    : filteredAchievements
                                ).map((item, index) => (
                                    <div 
                                        key={item.id ? `${item.id}-${index}` : index} 
                                        className={viewMode === 'scroll' ? styles.achievementCardHorizontal : styles.achievementCardVertical}
                                    >
                                        <div className={viewMode === 'scroll' ? styles.imageSectionHorizontal : styles.imageSectionVertical}>
                                            {item.foto_url ? (
                                                <img src={item.foto_url} alt={item.prestasi} className={styles.achievementImage} />
                                            ) : (
                                                <div className={styles.imagePlaceholder}>
                                                    <HiOutlineTrophy size={viewMode === 'scroll' ? 32 : 40} />
                                                </div>
                                            )}
                                            <div className={getTingkatBadgeClass(item.tingkat)}>
                                                {item.tingkat}
                                            </div>
                                        </div>
                                        
                                        <div className={styles.infoSection}>
                                            <h3 className={styles.achievementTitle}>{item.prestasi}</h3>
                                            
                                            <div className={styles.metaInfo}>
                                                <div className={styles.metaItem}>
                                                    <HiOutlineUser />
                                                    <span className={styles.metaText}>{item.nama_siswa}</span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <HiOutlineAcademicCap />
                                                    <span className={styles.metaText}>{item.unit?.nama_unit || 'Al Amin'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <HiOutlineTrophy />
                                </div>
                                <h3>Belum ada data prestasi</h3>
                                <p>Silakan pilih tingkat prestasi lain atau periksa kembali nanti.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prestasi;
