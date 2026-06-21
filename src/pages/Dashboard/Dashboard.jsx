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
    HiChevronRight,
    HiOutlineBookmark,
    HiBookmark,
    HiLocationMarker
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

    // Load bookmarked posts from localStorage to persist user interactions
    const [bookmarkedPosts, setBookmarkedPosts] = useState(() => {
        const saved = localStorage.getItem('bookmarked_posts');
        return saved ? JSON.parse(saved) : [];
    });

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const formatDate = (date) => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

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

    const toggleBookmark = (postId, e) => {
        e.stopPropagation(); // Stop navigation to detail page
        let updated;
        if (bookmarkedPosts.includes(postId)) {
            updated = bookmarkedPosts.filter(id => id !== postId);
            toast.success('Berita dihapus dari penanda', {
                icon: '🗑️',
            });
        } else {
            updated = [...bookmarkedPosts, postId];
            toast.success('Berita disimpan ke penanda', {
                icon: '🔖',
            });
        }
        setBookmarkedPosts(updated);
        localStorage.setItem('bookmarked_posts', JSON.stringify(updated));
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
        { id: 'tagihan', label: 'Tagihan', icon: <HiCreditCard size={24} />, color: '#0d9488', bg: '#f0fdfa', path: (id) => `/tagihan/${id}` },
        { id: 'presensi', label: 'Presensi', icon: <HiCalendar size={24} />, color: '#3b82f6', bg: '#eff6ff', path: (id) => `/presensi/${id}` },
        { id: 'tabungan', label: 'Tabungan', icon: <HiCash size={24} />, color: '#f59e0b', bg: '#fef9c3', path: (id) => `/tabungan/${id}` },
        { id: 'raport', label: 'Raport', icon: <HiBookOpen size={24} />, color: '#6366f1', bg: '#e0e7ff', comingSoon: true },
        { id: 'laporan', label: 'Laporan', icon: <HiPresentationChartBar size={24} />, color: '#ec4899', bg: '#fce7f3', comingSoon: true },
        { id: 'berita', label: 'Berita', icon: <HiNewspaper size={24} />, color: '#10b981', bg: '#ecfdf5', path: () => '/berita' },
        { id: 'pelanggaran', label: 'Pelanggaran', icon: <HiOutlineExclamationTriangle size={24} />, color: '#f43f5e', bg: '#fef2f2', comingSoon: true },
        { id: 'prestasi', label: 'Prestasi', icon: <HiOutlineTrophy size={24} />, color: '#8b5cf6', bg: '#f3e8ff', comingSoon: true },
    ];

    const activeStudent = students[activeIndex];

    return (
        <div className={styles.container}>
            {/* Top Dark Section */}
            <div className={styles.topSection}>
                {settings?.background_login && (
                    <div className={styles.bgOverlay}>
                        <img src={settings.background_login} alt="Background" className={styles.bgImage} />
                        <div className={styles.bgGradient}></div>
                    </div>
                )}

                {/* Header: User Profile & Notification */}
                <div className={styles.header}>
                    <div className={styles.userProfileInfo}>
                        <div className={styles.parentAvatar}>
                            {user.name ? user.name.charAt(0).toUpperCase() : 'O'}
                        </div>
                        <div className={styles.greetingWrapper}>
                            <span className={styles.greetingText}>{user.name || 'Wali Murid'}</span>
                            <div className={styles.locationWrapper}>
                                <HiLocationMarker size={12} className={styles.locationIcon} />
                                <span className={styles.locationText}>
                                    Wali Murid
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.headerActions}>
                        <button
                            className={styles.notificationBtn}
                            onClick={() => navigate('/pengumuman')}
                            title="Pengumuman & Notifikasi"
                        >
                            <HiBell size={20} />
                            {announcements.length > 0 && <span className={styles.bellBadge}></span>}
                        </button>
                        <button className={styles.logoutBtn} onClick={handleLogout} title="Keluar">
                            <HiLogout size={20} />
                        </button>
                    </div>
                </div>

                {/* Digital Clock Section */}
                <div className={styles.clockContainer}>
                    <div className={styles.clockTime}>{formatTime(time)}</div>
                    <div className={styles.clockDate}>{formatDate(time)}</div>
                </div>
            </div>

            {/* White Content Wrapper (Rounded top curving upwards) */}
            <div className={styles.contentWrapper}>
                {/* Student ID Card Section (Carousel/Floating) */}
                <div className={styles.profileSection}>
                    {loading ? (
                        <Skeleton width="100%" height="130px" borderRadius="20px" />
                    ) : students.length > 0 ? (
                        <>
                            <div className={styles.studentCard} onClick={() => navigate(`/student-profile/${activeStudent?.no_pendaftaran}`)}>
                                <div className={styles.studentCardBody}>
                                    <div className={styles.studentAvatarWrapper}>
                                        {activeStudent?.foto ? (
                                            <img src={activeStudent.foto} alt="Foto Siswa" className={styles.studentAvatarImg} />
                                        ) : (
                                            <div className={styles.studentAvatarPlaceholder}>
                                                {activeStudent?.nama_lengkap?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.studentDetails}>
                                        <h2 className={styles.studentName}>{activeStudent?.nama_lengkap}</h2>
                                        <div className={styles.studentMetaInfo}>
                                            <span className={styles.metaBadge}>{activeStudent?.nama_kelas || 'Kelas'}</span>
                                            <span className={styles.metaText}>{activeStudent?.nama_unit || 'Unit'}</span>
                                        </div>
                                        <span className={styles.studentNis}>NIS: {activeStudent?.nis || '-'}</span>
                                    </div>
                                    <HiChevronRight className={styles.cardArrow} size={22} />
                                </div>
                            </div>

                            {/* Dots for Multiple Students */}
                            {students.length > 1 && (
                                <div className={styles.dots}>
                                    {students.map((_, idx) => (
                                        <button
                                            key={idx}
                                            className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                                            onClick={() => setActiveIndex(idx)}
                                            aria-label={`Siswa ke-${idx + 1}`}
                                        >
                                            {idx + 1}
                                        </button>
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

                {/* Menu Grid (Layanan Utama) */}
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Layanan Utama</span>
                </div>

                <div className={styles.menuGrid}>
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            className={styles.menuItem}
                            onClick={() => !menu.comingSoon && navigate(menu.path(activeStudent?.id_siswa))}
                        >
                            <div
                                className={styles.iconBox}
                                style={{ backgroundColor: menu.bg, color: menu.color }}
                            >
                                {menu.icon}
                            </div>
                            <span className={styles.menuLabel}>{menu.label}</span>
                            {menu.comingSoon && <span className={styles.csBadge}>Soon</span>}
                        </div>
                    ))}
                </div>

                {/* News Grid Section (Berita & Kegiatan) */}
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Berita & Kegiatan</span>
                    <span className={styles.seeAllLink} onClick={() => navigate('/berita')}>Semua</span>
                </div>

                <div className={styles.newsGrid}>
                    {posts.length > 0 ? (
                        posts.slice(0, 4).map((item, idx) => (
                            <div key={item.id || idx} className={styles.newsGridCard} onClick={() => navigate(`/berita-detail/${item.slug}`)}>
                                <div className={styles.newsCardImageWrapper}>
                                    {item.image && !item.imageError ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className={styles.newsCardImg}
                                            onError={() => {
                                                const newPosts = [...posts];
                                                newPosts[idx].imageError = true;
                                                setPosts(newPosts);
                                            }}
                                        />
                                    ) : (
                                        <div className={styles.newsCardImageFallback}>
                                            <MdOutlineNewspaper size={36} color="#ffffff" />
                                        </div>
                                    )}
                                    <div className={styles.newsCardBadge}>Pendidikan</div>
                                    <button
                                        className={`${styles.bookmarkBtn} ${bookmarkedPosts.includes(item.id) ? styles.activeBookmark : ''}`}
                                        onClick={(e) => toggleBookmark(item.id, e)}
                                        title="Simpan Berita"
                                    >
                                        {bookmarkedPosts.includes(item.id) ? (
                                            <HiBookmark size={16} />
                                        ) : (
                                            <HiOutlineBookmark size={16} />
                                        )}
                                    </button>
                                </div>
                                <div className={styles.newsCardContent}>
                                    <span className={styles.newsCardDate}>
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <h4 className={styles.newsCardTitle}>{item.title}</h4>
                                </div>
                            </div>
                        ))
                    ) : (
                        loading ? (
                            [1, 2].map((item) => (
                                <div key={item} className={styles.newsGridCard}>
                                    <div className={styles.newsCardImageWrapper}>
                                        <Skeleton width="100%" height="120px" borderRadius="16px" />
                                    </div>
                                    <div className={styles.newsCardContent}>
                                        <Skeleton width="40%" height="10px" style={{ marginTop: '8px' }} />
                                        <Skeleton width="90%" height="14px" style={{ marginTop: '8px' }} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.emptyState}>Tidak ada berita ditemukan</div>
                        )
                    )}
                </div>

                {/* News Feed Section (Pengumuman) */}
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionTitle}>Pengumuman</span>
                    <span className={styles.seeAllLink} onClick={() => navigate('/pengumuman')}>Semua</span>
                </div>

                <div className={styles.announcementList}>
                    {announcements.length > 0 ? (
                        announcements.slice(0, 3).map((item, idx) => {
                            const dateParts = item.tanggal?.split(' ') || [];
                            return (
                                <div key={item.id || idx} className={styles.announcementCard} onClick={() => navigate(`/pengumuman/${item.id}`)}>
                                    <div className={styles.announcementDate}>
                                        <span className={styles.dateDay}>{dateParts[0] || '-'}</span>
                                        <span className={styles.dateMonth}>{dateParts[1] || 'Mei'}</span>
                                    </div>
                                    <div className={styles.announcementContent}>
                                        <h4 className={styles.announcementTitle}>{item.judul}</h4>
                                        <p className={styles.announcementSnippet}>{item.isi}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        loading ? (
                            <Skeleton width="100%" height="70px" count={2} style={{ marginBottom: '10px' }} />
                        ) : (
                            <div className={styles.emptyState}>Tidak ada pengumuman ditemukan</div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
