import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
    HiLogout, 
    HiBell, 
    HiCreditCard, 
    HiCalendar, 
    HiCash, 
    HiBookOpen, 
    HiPresentationChartBar, 
    HiNewspaper,
    HiChevronRight
} from 'react-icons/hi';
import { 
    HiOutlineExclamationTriangle, 
    HiOutlineTrophy 
} from 'react-icons/hi2';
import { MdOutlineNewspaper } from 'react-icons/md';
import styles from './Dashboard.module.css';

// Repositories
import { StudentRepository, GeneralRepository } from '../../repositories';

// UI Components
import Skeleton from '../../components/ui/Skeleton/Skeleton';
import logo from '../../assets/images/logo.png';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [students, setStudents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [settings, setSettings] = useState(null);

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Berhasil keluar');
        navigate('/login');
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [studentRes, newsRes, settingsRes, postsRes] = await Promise.all([
                    StudentRepository.getSiswaAnak(),
                    StudentRepository.getPengumumanTerbaru(),
                    GeneralRepository.getSettings(),
                    StudentRepository.getPosts()
                ]);
                setStudents(studentRes || []);
                if (newsRes?.success) setAnnouncements(newsRes.data || []);
                if (settingsRes?.status === 'success') setSettings(settingsRes.data);
                if (postsRes?.success) setPosts(postsRes.data || []);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const menus = [
        { id: 'tagihan', label: 'Tagihan', icon: <HiCreditCard color="#0d9488" size={28} />, path: (id) => `/tagihan/${id}` },
        { id: 'presensi', label: 'Presensi', icon: <HiCalendar color="#3b82f6" size={28} />, path: (id) => `/presensi/${id}` },
        { id: 'tabungan', label: 'Tabungan', icon: <HiCash color="#f59e0b" size={28} />, path: (id) => `/tabungan/${id}` },
        { id: 'raport', label: 'Raport', icon: <HiBookOpen color="#6366f1" size={28} />, comingSoon: true },
        { id: 'laporan', label: 'Laporan', icon: <HiPresentationChartBar color="#ec4899" size={28} />, comingSoon: true },
        { id: 'berita', label: 'Berita', icon: <HiNewspaper color="#10b981" size={28} />, path: () => '/berita' },
        { id: 'pelanggaran', label: 'Pelanggaran', icon: <HiOutlineExclamationTriangle color="#f43f5e" size={28} />, comingSoon: true },
        { id: 'prestasi', label: 'Prestasi', icon: <HiOutlineTrophy color="#8b5cf6" size={28} />, comingSoon: true },
    ];

    const activeStudent = students[activeIndex];

    return (
        <div className={styles.container}>
            {/* Top Section / Hero */}
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
                    <button className={styles.logoutBtn} onClick={handleLogout} title="Keluar">
                        <HiLogout size={22} />
                    </button>
                </div>
                
                <div className={styles.welcomeText}>
                    <div className={styles.greeting}>{getTimeGreeting()},</div>
                    <h1 className={styles.userName}>{user.name || 'Orang Tua'}</h1>
                </div>
            </div>

            {/* Profile Section (Floating) */}
            <div className={styles.profileSection}>
                {loading ? (
                    <Skeleton width="100%" height="150px" borderRadius="20px" />
                ) : students.length > 0 ? (
                    <>
                        <div className={styles.profileCard} onClick={() => navigate(`/student-profile/${activeStudent?.no_pendaftaran}`)}>
                            <div className={styles.studentBasicInfo}>
                                <div className={styles.avatarWrapper}>
                                    {activeStudent?.foto ? (
                                        <img src={activeStudent.foto} alt="Avatar" className={styles.avatarImg} />
                                    ) : (
                                        <div className={styles.avatarPlaceholder}>{activeStudent?.nama_lengkap?.charAt(0)}</div>
                                    )}
                                </div>
                                <div className={styles.studentTextInfo}>
                                    <h2 className={styles.studentName}>{activeStudent?.nama_lengkap}</h2>
                                    <div className={styles.studentMeta}>
                                        <span className={styles.badge}>{activeStudent?.nama_kelas || 'Kelas'}</span>
                                        <span>•</span>
                                        <span>NIS: {activeStudent?.nis || '-'}</span>
                                    </div>
                                </div>
                                <HiChevronRight color="#94a3b8" size={28} />
                            </div>

                            <div className={styles.quickStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Unit Sekolah</span>
                                    <span className={styles.statValue}>{activeStudent?.nama_unit || '-'}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Status Kehadiran</span>
                                    <span className={styles.statValue} style={{ color: '#0d9488' }}>-</span>
                                </div>
                            </div>
                        </div>

                        {/* Dots for Multiple Students */}
                        {students.length > 1 && (
                            <div className={styles.dots}>
                                {students.map((_, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                                        onClick={() => setActiveIndex(idx)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.profileCard}>
                        <div className={styles.greeting} style={{ color: '#64748b', textAlign: 'center' }}>Data siswa tidak ditemukan</div>
                    </div>
                )}
            </div>

            {/* Menu Grid */}
            <div className={styles.sectionTitle}>
                <span>Layanan Utama</span>
            </div>
            
            <div className={styles.menuGrid}>
                {menus.map((menu) => (
                    <div 
                        key={menu.id} 
                        className={styles.menuItem}
                        onClick={() => !menu.comingSoon && navigate(menu.path(activeStudent?.id_siswa))}
                    >
                        <div className={styles.iconBox}>
                            {menu.icon}
                        </div>
                        <span className={styles.menuLabel}>{menu.label}</span>
                        {menu.comingSoon && <span className={styles.csBadge}>Soon</span>}
                    </div>
                ))}
            </div>

            {/* News Slider Section */}
            <div className={styles.sectionTitle}>
                <span>Berita Utama</span>
                <span style={{ color: '#0d9488', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/berita')}>Lainnya</span>
            </div>
            
            <div className={styles.newsSlider}>
                <div className={styles.newsScroll}>
                    {posts.length > 0 ? (
                        posts.map((item, idx) => (
                            <div key={item.id || idx} className={styles.newsSlideCard} onClick={() => navigate(`/berita-detail/${item.slug}`)}>
                                <div className={styles.newsSlideImage}>
                                    {item.image && !item.imageError ? (
                                        <img 
                                            src={item.image} 
                                            alt={item.title} 
                                            className={styles.newsSlideImg} 
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                // Find the parent and show the icon (or just use a state)
                                                // Better: use a local state to handle this
                                                const newPosts = [...posts];
                                                newPosts[idx].imageError = true;
                                                setPosts(newPosts);
                                            }}
                                        />
                                    ) : (
                                        <MdOutlineNewspaper size={40} color="#fff" />
                                    )}
                                    <div className={styles.newsSlideBadge}>Berita</div>
                                </div>
                                <div className={styles.newsSlideContent}>
                                    <h4 className={styles.newsSlideTitle}>{item.title}</h4>
                                    <div className={styles.newsSlideFooter}>
                                        <span>{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                        <HiChevronRight />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        [1, 2, 3].map((item) => (
                            <div key={item} className={styles.newsSlideCard}>
                                <div className={styles.newsSlideImage}>
                                    <Skeleton width="100%" height="100%" />
                                </div>
                                <div className={styles.newsSlideContent}>
                                    <Skeleton width="80%" height="14px" />
                                    <Skeleton width="40%" height="10px" style={{ marginTop: '8px' }} />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* News Feed Section (Pengumuman) */}
            <div className={styles.sectionTitle}>
                <span>Pengumuman</span>
                <span style={{ color: '#0d9488', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }} onClick={() => navigate('/pengumuman')}>Semua</span>
            </div>

            <div className={styles.newsList}>
                {announcements.length > 0 ? (
                    announcements.slice(0, 3).map((item, idx) => {
                        const dateParts = item.tanggal?.split(' ') || [];
                        return (
                            <div key={item.id || idx} className={styles.newsCard} onClick={() => navigate(`/pengumuman/${item.id}`)}>
                                <div className={styles.newsDate}>
                                    <span className={styles.dateDay}>{dateParts[0] || '-'}</span>
                                    <span className={styles.dateMonth}>{dateParts[1] || '-'}</span>
                                </div>
                                <div className={styles.newsContent}>
                                    <h4 className={styles.newsTitle}>{item.judul}</h4>
                                    <p className={styles.newsSnippet}>{item.isi}</p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        Belum ada pengumuman
                    </div>
                )}
            </div>
        </div>
    );
};


export default Dashboard;
