import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineMegaphone, HiOutlineCalendar, HiOutlineChevronRight } from 'react-icons/hi2';
import styles from './Pengumuman.module.css';
import { StudentRepository, GeneralRepository } from '../../repositories';
import logo from '../../assets/images/logo.png';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const Pengumuman = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [annRes, settingsRes] = await Promise.all([
                    StudentRepository.getPengumumanTerbaru(),
                    GeneralRepository.getSettings()
                ]);

                if (annRes && annRes.success) {
                    setAnnouncements(annRes.data);
                }
                if (settingsRes?.status === 'success') {
                    setSettings(settingsRes.data);
                }
            } catch (error) {
                console.error('Error fetching announcements:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBack = () => {
        navigate('/dashboard');
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
                    <button onClick={handleBack} className={styles.backButton}>
                        <HiOutlineArrowLeft />
                    </button>
                    <div className={styles.brandWrapper}>
                        <img src={logo} alt="Logo" className={styles.logo} />
                        <span className={styles.brandName}>SIPORTU</span>
                    </div>
                </div>

                <div className={styles.pageTitleWrapper}>
                    <h1 className={styles.pageTitle}>Pengumuman Resmi</h1>
                    <p className={styles.pageSubtitle}>Informasi penting dari sekolah</p>
                </div>
            </div>

            <div className={styles.content}>
                {loading ? (
                    <div className={styles.annList}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} height="100px" borderRadius="20px" style={{ marginBottom: '12px' }} />
                        ))}
                    </div>
                ) : (
                    <div className={styles.annList}>
                        {announcements.map((item, index) => (
                            <div
                                key={item.id || index}
                                className={styles.annCard}
                                onClick={() => navigate(`/pengumuman/${item.id}`)}
                            >
                                <div className={styles.annIcon}>
                                    <HiOutlineMegaphone />
                                </div>
                                <div className={styles.annInfo}>
                                    <div className={styles.annMeta}>
                                        <HiOutlineCalendar size={12} />
                                        <span>{item.tanggal}</span>
                                        <span className={styles.category}>{item.kategori}</span>
                                    </div>
                                    <h3 className={styles.annTitle}>{item.judul}</h3>
                                </div>
                                <HiOutlineChevronRight className={styles.arrow} />
                            </div>
                        ))}

                        {announcements.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <HiOutlineMegaphone />
                                </div>
                                <h3>Tidak ada pengumuman</h3>
                                <p>Belum ada informasi terbaru untuk saat ini.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Pengumuman;
