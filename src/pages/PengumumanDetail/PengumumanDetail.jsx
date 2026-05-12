import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineMapPin, HiOutlineTag } from 'react-icons/hi2';
import styles from './PengumumanDetail.module.css';
import { StudentRepository, GeneralRepository } from '../../repositories';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const PengumumanDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [annRes, settingsRes] = await Promise.all([
                    StudentRepository.getDetailPengumuman(id),
                    GeneralRepository.getSettings()
                ]);

                if (annRes && annRes.success) {
                    setAnnouncement(annRes.data);
                } else {
                    setError('Gagal memuat detail pengumuman');
                }
                if (settingsRes?.status === 'success') {
                    setSettings(settingsRes.data);
                }
            } catch (err) {
                console.error('Error fetching announcement detail:', err);
                setError('Terjadi kesalahan saat memuat data');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.topSection}>
                    <div className={styles.header}>
                        <button onClick={handleBack} className={styles.backButton}>
                            <HiOutlineArrowLeft />
                        </button>
                    </div>
                </div>
                <div className={styles.errorState}>
                    <p>{error}</p>
                    <button onClick={() => navigate('/dashboard')} className={styles.btnHome}>
                        Kembali ke Dashboard
                    </button>
                </div>
            </div>
        );
    }

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
                    <span className={styles.pageTitle}>Detail Pengumuman</span>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.detailCard}>
                    {loading ? (
                        <>
                            <Skeleton width="80%" height="32px" style={{ marginBottom: '20px' }} />
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
                                <Skeleton width="100px" height="24px" borderRadius="12px" />
                                <Skeleton width="100px" height="24px" borderRadius="12px" />
                            </div>
                            <Skeleton width="100%" height="16px" count={8} style={{ marginBottom: '10px' }} />
                        </>
                    ) : (
                        announcement && (
                            <>
                                <div className={styles.categoryBadge}>{announcement.kategori}</div>
                                <h1 className={styles.announcementTitle}>{announcement.judul}</h1>

                                <div className={styles.metaInfo}>
                                    <div className={styles.metaItem}>
                                        <HiOutlineCalendar />
                                        <span>{announcement.tanggal}</span>
                                    </div>
                                    {announcement.lokasi && (
                                        <div className={styles.metaItem}>
                                            <HiOutlineMapPin />
                                            <span>{announcement.lokasi}</span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.divider}></div>

                                <div 
                                    className={styles.announcementBody}
                                    dangerouslySetInnerHTML={{ __html: announcement.isi }}
                                ></div>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PengumumanDetail;

