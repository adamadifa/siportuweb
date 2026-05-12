import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Presensi.module.css';
import { MdArrowBack, MdAccessTime, MdCalendarToday, MdSchool, MdPerson, MdInfoOutline } from 'react-icons/md';
import { StudentRepository, GeneralRepository } from '../../repositories';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const Presensi = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('harian');

    const [harianData, setHarianData] = useState([]);
    const [harianRekap, setHarianRekap] = useState(null);
    const [harianLoading, setHarianLoading] = useState(false);

    const [mapelData, setMapelData] = useState([]);
    const [mapelLoading, setMapelLoading] = useState(false);

    useEffect(() => {
        const fetchStudentInfo = async () => {
            if (!studentId) return;
            try {
                setLoading(true);
                const [studentData, settingsRes] = await Promise.all([
                    StudentRepository.getSiswaById(studentId),
                    GeneralRepository.getSettings()
                ]);

                if (studentData) {
                    setStudent(Array.isArray(studentData) ? studentData[0] : studentData);
                }
                if (settingsRes?.status === 'success') {
                    setSettings(settingsRes.data);
                }
            } catch (error) {
                console.error('Error fetching student info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentInfo();
    }, [studentId]);

    useEffect(() => {
        const fetchHarian = async () => {
            if (!student || !student.no_pendaftaran) return;
            try {
                setHarianLoading(true);
                const res = await StudentRepository.getPresensiHarian(student.no_pendaftaran);
                if (res.success) {
                    setHarianData(res.data);
                    setHarianRekap(res.rekap);
                }
            } catch (error) {
                console.error('Error fetching harian:', error);
            } finally {
                setHarianLoading(false);
            }
        };

        const fetchMapel = async () => {
            if (!studentId) return;
            try {
                setMapelLoading(true);
                const res = await StudentRepository.getPresensiMapel(studentId);
                if (res.success) {
                    setMapelData(res.data);
                }
            } catch (error) {
                console.error('Error fetching mapel:', error);
            } finally {
                setMapelLoading(false);
            }
        };

        if (student) {
            if (activeTab === 'harian') fetchHarian();
            else fetchMapel();
        }
    }, [student, studentId, activeTab]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return {
            day: date.getDate(),
            month: date.toLocaleString('id-ID', { month: 'short' }),
            full: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        };
    };

    const getStatusLabel = (status) => {
        const labels = {
            'h': 'Hadir',
            'i': 'Izin',
            's': 'Sakit',
            'a': 'Alpha'
        };
        return labels[status.toLowerCase()] || status;
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.headerWrapper}>
                    <Skeleton width="100%" height="150px" borderRadius="0 0 30px 30px" />
                </div>
                <div className={styles.recapGrid} style={{ marginTop: '20px' }}>
                    <Skeleton height="80px" borderRadius="16px" />
                    <Skeleton height="80px" borderRadius="16px" />
                    <Skeleton height="80px" borderRadius="16px" />
                    <Skeleton height="80px" borderRadius="16px" />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
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
                    <h1 className={styles.pageTitle}>Data Presensi</h1>
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
                        <h2>{student?.nama_lengkap}</h2>
                        <div className={styles.studentMeta}>
                            <span className={styles.badge}>NIS: {student?.nis}</span>
                            <span className={styles.badge}>{student?.nama_unit}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'harian' ? styles.activeTab : styles.inactiveTab}`}
                    onClick={() => setActiveTab('harian')}
                >
                    Harian
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'mapel' ? styles.activeTab : styles.inactiveTab}`}
                    onClick={() => setActiveTab('mapel')}
                >
                    Mata Pelajaran
                </button>
            </div>

            {/* Recap Harian */}
            {activeTab === 'harian' && harianRekap && (
                <div className={styles.recapGrid}>
                    <div className={`${styles.recapCard} ${styles.h}`}>
                        <span className={styles.recapLabel}>Hadir</span>
                        <span className={styles.recapValue}>{harianRekap.h}</span>
                    </div>
                    <div className={`${styles.recapCard} ${styles.i}`}>
                        <span className={styles.recapLabel}>Izin</span>
                        <span className={styles.recapValue}>{harianRekap.i}</span>
                    </div>
                    <div className={`${styles.recapCard} ${styles.s}`}>
                        <span className={styles.recapLabel}>Sakit</span>
                        <span className={styles.recapValue}>{harianRekap.s}</span>
                    </div>
                    <div className={`${styles.recapCard} ${styles.a}`}>
                        <span className={styles.recapLabel}>Alpha</span>
                        <span className={styles.recapValue}>{harianRekap.a}</span>
                    </div>
                </div>
            )}

            {/* List Section */}
            <div className={styles.contentSection}>
                {activeTab === 'harian' ? (
                    <div className={styles.listWrapper}>
                        {harianLoading ? (
                            <Skeleton height="80px" borderRadius="20px" count={3} />
                        ) : harianData.length > 0 ? (
                            harianData.map((item, idx) => {
                                const date = formatDate(item.tanggal);
                                return (
                                    <div key={idx} className={styles.presensiCard}>
                                        <div className={styles.dateBox}>
                                            <span className={styles.dayNum}>{date.day}</span>
                                            <span className={styles.monthLabel}>{date.month}</span>
                                        </div>
                                        <div className={styles.presensiInfo}>
                                            <div className={styles.presensiMain}>
                                                <span className={styles.subjectName}>Presensi Harian</span>
                                                <span className={`${styles.statusTag} ${item.status.toLowerCase()}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </div>
                                            <div className={styles.presensiMeta}>
                                                <div className={styles.metaItem}>
                                                    <MdAccessTime />
                                                    <span>{item.jam_in || '--:--'} - {item.jam_out || '--:--'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={styles.emptyState}>
                                <MdCalendarToday className={styles.emptyIcon} />
                                <p className={styles.emptyText}>Belum ada data presensi bulan ini.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={styles.listWrapper}>
                        {mapelLoading ? (
                            <Skeleton height="100px" borderRadius="20px" count={3} />
                        ) : mapelData.length > 0 ? (
                            mapelData.map((item, idx) => {
                                const date = formatDate(item.tanggal);
                                return (
                                    <div key={idx} className={styles.presensiCard}>
                                        <div className={styles.dateBox}>
                                            <span className={styles.dayNum}>{date.day}</span>
                                            <span className={styles.monthLabel}>{date.month}</span>
                                        </div>
                                        <div className={styles.presensiInfo}>
                                            <div className={styles.presensiMain}>
                                                <span className={styles.subjectName}>{item.nama_mata_pelajaran}</span>
                                                <span className={`${styles.statusTag} ${item.status.toLowerCase()}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </div>
                                            <div className={styles.presensiMeta}>
                                                <div className={styles.metaItem}>
                                                    <MdPerson />
                                                    <span>{item.nama_guru}</span>
                                                </div>
                                            </div>
                                            <div className={styles.presensiMeta} style={{ marginTop: '4px' }}>
                                                <div className={styles.metaItem}>
                                                    <MdAccessTime />
                                                    <span>{item.jam_mulai.substring(0, 5)} - {item.jam_selesai.substring(0, 5)}</span>
                                                </div>
                                            </div>
                                            {item.materi && (
                                                <div className={styles.presensiMeta} style={{ marginTop: '4px', fontStyle: 'italic' }}>
                                                    <div className={styles.metaItem}>
                                                        <MdInfoOutline />
                                                        <span className="truncate max-w-[150px]">{item.materi}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={styles.emptyState}>
                                <MdSchool className={styles.emptyIcon} />
                                <p className={styles.emptyText}>Belum ada data presensi mata pelajaran.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Presensi;
