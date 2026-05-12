import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineTrophy, HiOutlineUser, HiOutlineAcademicCap, HiOutlineTrophy as HiTrophyIcon } from 'react-icons/hi2';
import styles from './Prestasi.module.css';
import { StudentRepository, GeneralRepository } from '../../repositories';
import logo from '../../assets/images/logo.png';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const Prestasi = () => {
    const navigate = useNavigate();
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [achRes, settingsRes] = await Promise.all([
                    StudentRepository.getPrestasiSiswa({ limit: 50 }),
                    GeneralRepository.getSettings()
                ]);

                if (achRes && achRes.success) {
                    setAchievements(achRes.data);
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
                    <h1 className={styles.pageTitle}>Prestasi Santri</h1>
                    <p className={styles.pageSubtitle}>Kebanggaan Pondok Pesantren Al Amin</p>
                </div>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.achievementGrid}>
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} height="140px" borderRadius="24px" />
                        ))}
                    </div>
                ) : (
                    <div className={styles.scrollContainer}>
                        <div className={styles.achievementGrid}>
                            {/* Double the items for seamless loop */}
                            {[...achievements, ...achievements].map((item, index) => (
                                <div key={item.id ? `${item.id}-${index}` : index} className={styles.achievementCard}>
                                    <div className={styles.imageSection}>
                                        {item.foto_url ? (
                                            <img src={item.foto_url} alt={item.prestasi} className={styles.achievementImage} />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <HiTrophyIcon size={40} />
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
                                                <span>{item.nama_siswa}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <HiOutlineAcademicCap />
                                                <span>{item.unit?.nama_unit}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {achievements.length === 0 && (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>
                                        <HiTrophyIcon />
                                    </div>
                                    <h3>Belum ada data prestasi</h3>
                                    <p>Terus berjuang dan ukir prestasi terbaikmu!</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prestasi;

