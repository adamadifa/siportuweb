import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    MdArrowBack, 
    MdPerson, 
    MdSchool, 
    MdFamilyRestroom, 
    MdLocationOn 
} from 'react-icons/md';
import styles from './StudentProfile.module.css';
import { StudentRepository, GeneralRepository } from '../../repositories';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const StudentProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const [studentRes, settingsRes] = await Promise.all([
                    StudentRepository.getSiswaByNoPendaftaran(id),
                    GeneralRepository.getSettings()
                ]);
                
                const studentData = Array.isArray(studentRes) ? studentRes[0] : studentRes;
                setStudent(studentData);
                if (settingsRes?.status === 'success') setSettings(settingsRes.data);
            } catch (error) {
                console.error('Error fetching student detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Skeleton width="42px" height="42px" borderRadius="14px" />
                    <Skeleton width="140px" height="24px" />
                </div>
                <div className={styles.profileHeaderSkeleton}>
                    <Skeleton width="100%" height="200px" borderRadius="16px" />
                </div>
                {[1, 2, 3].map((i) => (
                    <div key={i} className={styles.section}>
                        <Skeleton width="150px" height="24px" style={{ marginBottom: '20px' }} />
                        {[1, 2, 3].map((j) => (
                            <div key={j} className={styles.infoRow}>
                                <Skeleton width="100px" height="16px" />
                                <Skeleton width="140px" height="16px" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    if (!student) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <p>Data siswa tidak ditemukan</p>
                    <button className={styles.backBtnText} onClick={() => navigate(-1)}>Kembali</button>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

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
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        <MdArrowBack />
                    </button>
                    <h1 className={styles.pageTitle}>Profil Siswa</h1>
                </div>

                <div className={styles.profileHero}>
                    <div className={styles.heroContent}>
                        <div className={styles.avatarWrapper}>
                            {student.foto ? (
                                <img src={student.foto} alt="Foto" className={styles.avatarImg} />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {(student.nama_lengkap || '?').charAt(0)}
                                </div>
                            )}
                        </div>
                        <h2 className={styles.studentName}>{student.nama_lengkap}</h2>
                        <div className={styles.studentMeta}>
                            <span className={styles.nisBadge}>NIS: {student.nis}</span>
                            <span className={styles.unitBadge}>{student.nama_unit}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Sections */}
            <div className={styles.sectionsWrapper}>
                {/* Data Pribadi */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconBox}><MdPerson /></div>
                        <h3>Data Pribadi</h3>
                    </div>
                    <div className={styles.infoList}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Nama Lengkap</span>
                            <span className={styles.value}>{student.nama_lengkap}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>NISN</span>
                            <span className={styles.value}>{student.nisn || '-'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Tempat, Tgl Lahir</span>
                            <span className={styles.value}>{student.tempat_lahir}, {formatDate(student.tanggal_lahir)}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Jenis Kelamin</span>
                            <span className={styles.value}>{student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Anak Ke-</span>
                            <span className={styles.value}>{student.anak_ke} dari {student.jumlah_saudara} bersaudara</span>
                        </div>
                    </div>
                </div>

                {/* Data Akademik */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconBox}><MdSchool /></div>
                        <h3>Data Akademik</h3>
                    </div>
                    <div className={styles.infoList}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>No. Pendaftaran</span>
                            <span className={styles.value}>{student.no_pendaftaran}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Tingkat / Kelas</span>
                            <span className={styles.value}>{student.tingkat} / {student.nama_kelas || '-'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Tahun Ajaran</span>
                            <span className={styles.value}>{student.tahun_ajaran}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Tahun Masuk</span>
                            <span className={styles.value}>{student.tahun_masuk}</span>
                        </div>
                    </div>
                </div>

                {/* Data Orang Tua */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconBox}><MdFamilyRestroom /></div>
                        <h3>Data Orang Tua</h3>
                    </div>
                    <div className={styles.infoList}>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Nama Ayah</span>
                            <span className={styles.value}>{student.nama_ayah || '-'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>Nama Ibu</span>
                            <span className={styles.value}>{student.nama_ibu || '-'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.label}>No. HP</span>
                            <span className={styles.value}>{student.no_hp_orang_tua || '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Alamat */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.iconBox}><MdLocationOn /></div>
                        <h3>Alamat Domisili</h3>
                    </div>
                    <div className={styles.addressBlock}>
                        <p className={styles.addressText}>{student.alamat}</p>
                        <p className={styles.cityText}>{student.nama_kota}, {student.kode_pos}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;

