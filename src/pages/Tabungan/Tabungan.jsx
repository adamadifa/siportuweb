import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Tabungan.module.css';
import { MdPlace, MdArrowBack, MdPhone, MdWifi, MdAccountBalanceWallet } from 'react-icons/md';
import { StudentRepository, GeneralRepository } from '../../repositories';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const Tabungan = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [savingsList, setSavingsList] = useState([]);
    const [totalSaldo, setTotalSaldo] = useState(0);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    // Fetch Data
    React.useEffect(() => {
        const fetchData = async () => {
            if (!studentId) return;
            try {
                setLoading(true);
                const [savingsRes, studentRes, settingsRes] = await Promise.all([
                    StudentRepository.getTabunganSantri(studentId),
                    StudentRepository.getSiswaById(studentId),
                    GeneralRepository.getSettings()
                ]);

                if (savingsRes && savingsRes.success) {
                    setTotalSaldo(savingsRes.data.total_saldo);
                    setSavingsList(savingsRes.data.tabungan);
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
            <div className={styles.container} style={{ padding: '20px', textAlign: 'center' }}>
                <p>Data siswa tidak ditemukan.</p>
                <button onClick={() => navigate(-1)} className={styles.backButton} style={{ color: '#333', background: '#e0e0e0', width: 'auto', padding: '10px 20px', margin: '10px auto' }}>
                    Kembali
                </button>
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

                <div className={styles.savingsList}>
                    {savingsList.length > 0 ? (
                        savingsList.map((item, index) => (
                            <div
                                key={index}
                                className={styles.savingsCard}
                                onClick={() => navigate(`/tabungan/${studentId}/${item.no_rekening}`)}
                                style={{ cursor: 'pointer' }}
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
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            Belum ada rekening tabungan.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tabungan;
