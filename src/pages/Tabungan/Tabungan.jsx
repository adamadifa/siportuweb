import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Tabungan.module.css';
import { MdPlace, MdArrowBack, MdPhone, MdWifi, MdAccountBalanceWallet, MdPersonOutline, MdChevronRight } from 'react-icons/md';
import { StudentRepository, GeneralRepository } from '../../repositories';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

// Swiper Slider Components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Tabungan = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [savingsList, setSavingsList] = useState([]);
    const [totalSaldo, setTotalSaldo] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    // Fetch Data
    React.useEffect(() => {
        const fetchData = async () => {
            if (!studentId) return;
            try {
                setLoading(true);
                const [savingsRes, studentRes, settingsRes] = await Promise.all([
                    StudentRepository.getTabunganSantri(studentId).catch(err => {
                        console.error('Error fetching savings list:', err);
                        return null;
                    }),
                    StudentRepository.getSiswaById(studentId).catch(err => {
                        console.error('Error fetching student details:', err);
                        return null;
                    }),
                    GeneralRepository.getSettings().catch(err => {
                        console.error('Error fetching settings:', err);
                        return null;
                    })
                ]);

                if (savingsRes && savingsRes.success) {
                    setTotalSaldo(savingsRes.data.total_saldo);
                    setSavingsList(savingsRes.data.tabungan);
                    setRecentTransactions(savingsRes.data.transaksi_terakhir || []);
                }

                if (Array.isArray(studentRes) && studentRes.length > 0) {
                    setStudent(studentRes[0]);
                } else if (studentRes && typeof studentRes === 'object') {
                    setStudent(studentRes);
                }

                if (settingsRes?.status === 'success') setSettings(settingsRes.data);

            } catch (error) {
                console.error('Error fetching savings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    // Construct display data 
    const displayStudent = student ? {
        name: student.nama_lengkap,
        nis: student.nis,
        unit: student.nama_unit,
        year: student.tahun_ajaran,
        location: student.nama_kota,
        noHp: student.no_hp_orang_tua || '-',
    } : null;

    if (loading) {
        return (
            <div className={styles.container} style={{ padding: '20px' }}>
                <Skeleton width="100%" height="200px" borderRadius="20px" />
                <Skeleton width="100%" height="180px" borderRadius="20px" style={{ marginTop: '20px' }} />
                <Skeleton width="100%" height="180px" borderRadius="20px" style={{ marginTop: '20px' }} />
            </div>
        );
    }

    if (!displayStudent) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorCard}>
                    <div className={styles.errorIconWrapper}>
                        <MdPersonOutline size={48} />
                    </div>
                    <h2 className={styles.errorTitle}>Siswa Tidak Ditemukan</h2>
                    <p className={styles.errorText}>
                        Maaf, data profil siswa tidak berhasil dimuat atau tidak terdaftar di sistem tabungan saat ini.
                    </p>
                    <button onClick={() => navigate(-1)} className={styles.errorButton}>
                        <MdArrowBack size={18} />
                        <span>Kembali</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Unified Header */}
            <div className={styles.headerWrapper}>
                {settings?.background_login && (
                    <div className={styles.bgOverlay}>
                        <img src={settings.background_login} alt="Background" className={styles.bgImage} />
                        <div className={styles.bgGradient}></div>
                    </div>
                )}
                
                <div className={styles.topBar}>
                    <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
                        <MdArrowBack />
                    </button>
                    <h1 className={styles.pageTitle}>Tabungan Santri</h1>
                </div>

                <div className={styles.headerContent}>
                    <div className={styles.avatarWrapper}>
                        {student?.foto ? (
                            <img src={student.foto} alt="Foto" className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {(student?.nama_lengkap || '?').charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className={styles.studentInfo}>
                        <h2 className={styles.studentName}>{displayStudent.name}</h2>
                        <div className={styles.studentMeta}>
                            <span className={styles.badge}>NIS: {displayStudent.nis}</span>
                            <span className={styles.badge}>{displayStudent.unit}</span>
                            <span className={styles.badge}>{displayStudent.year}</span>
                        </div>
                        <div className={styles.locationInfo}>
                            <MdPlace size={14} /> <span>{displayStudent.location}</span>
                            <span className={styles.separator}>|</span>
                            <MdPhone size={14} /> <span>{displayStudent.noHp}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.balanceCard}>
                    <div className={styles.balanceContent}>
                        <span className={styles.balanceLabel}>Total Saldo Tabungan</span>
                        <span className={styles.balanceValue}>{formatCurrency(totalSaldo)}</span>
                    </div>
                    <div className={styles.balanceIconWrapper}>
                        <MdAccountBalanceWallet size={32} />
                    </div>
                </div>

                {savingsList.length > 0 ? (
                    <div className={styles.swiperContainer}>
                        <Swiper
                            spaceBetween={16}
                            slidesPerView={'auto'}
                            centeredSlides={false}
                            grabCursor={true}
                            slidesOffsetBefore={20}
                            slidesOffsetAfter={20}
                            className={styles.mySwiper}
                        >
                            {savingsList.map((item, index) => (
                                <SwiperSlide key={index} className={styles.swiperSlide}>
                                    <div
                                        className={styles.savingsCard}
                                        onClick={() => navigate(`/tabungan/${studentId}/${item.no_rekening}`)}
                                    >
                                        <div className={styles.cardHeader}>
                                            <div className={styles.chipIcon}></div>
                                            <MdWifi className={styles.wifiIcon} size={24} />
                                        </div>

                                        <div className={styles.cardBody}>
                                            <span className={styles.cardLabel}>SIPORTU</span>
                                            <span className={styles.accountNumber}>{item.no_rekening}</span><br></br>
                                            <span className={styles.accountName}>{item.jenis_tabungan?.jenis_tabungan}</span>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div>
                                                <span className={styles.cardType}>Tabungan</span>
                                            </div>
                                            <div className={styles.balanceContainer}>
                                                <span className={styles.balanceTitle}>SALDO</span>
                                                <span className={styles.cardBalance}>{formatCurrency(item.saldo)}</span>
                                            </div>
                                            <div className={styles.mastercardLogo}>
                                                <div className={`${styles.mcCircle} ${styles.mcRed}`}></div>
                                                <div className={`${styles.mcCircle} ${styles.mcYellow}`}></div>
                                                <span className={styles.msText}>mastercard</span>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIconWrapper}>
                            <MdAccountBalanceWallet size={36} />
                        </div>
                        <h3 className={styles.emptyTitle}>Belum Ada Tabungan</h3>
                        <p className={styles.emptyText}>
                            Siswa ini belum terdaftar di program tabungan atau belum membuka rekening tabungan.
                        </p>
                    </div>
                )}

                {/* Histori Transaksi Terakhir */}
                <div className={styles.historySection}>
                    <h3 className={styles.historyTitle}>Histori Transaksi Terakhir</h3>
                    {recentTransactions.length > 0 ? (
                        <div className={styles.historyList}>
                            {recentTransactions.map((tx, idx) => (
                                <div key={tx.no_transaksi || idx} className={styles.historyItem}>
                                    <div 
                                        className={styles.txIconWrapper} 
                                        style={{ 
                                            backgroundColor: tx.jenis_transaksi === 'S' ? '#ecfdf5' : '#fef2f2', 
                                            color: tx.jenis_transaksi === 'S' ? '#10b981' : '#f43f5e' 
                                        }}
                                    >
                                        <span className={styles.txIconSymbol}>{tx.jenis_transaksi === 'S' ? '+' : '-'}</span>
                                    </div>
                                    <div className={styles.txDetails}>
                                        <h4 className={styles.txType}>{tx.jenis_transaksi_text} - {tx.jenis_tabungan}</h4>
                                        <span className={styles.txMeta}>{tx.no_rekening} • {new Date(tx.created_at || tx.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div 
                                        className={styles.txAmount} 
                                        style={{ color: tx.jenis_transaksi === 'S' ? '#10b981' : '#f43f5e' }}
                                    >
                                        {tx.jenis_transaksi === 'S' ? '+' : '-'}{formatCurrency(tx.jumlah)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyHistory}>
                            Belum ada riwayat transaksi
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tabungan;
