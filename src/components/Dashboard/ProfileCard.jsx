import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';
import styles from '../../pages/Dashboard/Dashboard.module.css';

const ProfileCard = ({ student, attendance }) => {
    const navigate = useNavigate();

    // Map API data to display fields
    // Priority: API field -> Old prop field -> Default
    const name = student?.nama_lengkap || student?.name || 'Siswa';
    const id = student?.id_siswa || student?.id || '0';
    const nis = student?.nis || '-';
    const className = student?.nama_kelas || student?.class || '-';
    const unit = student?.nama_unit || student?.unit || '-';

    // Attendance data might be separate or part of student, keeping as prop for now
    const checkIn = attendance?.checkIn || '-';
    const checkOut = attendance?.checkOut || '-';

    const handleCardClick = () => {
        if (id) {
            navigate(`/student-profile/${id}`);
        }
    };

    return (
        <div className={styles.wrapper} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                    <div className={styles.avatarCircle}>
                        {student.foto ? (
                            <img src={student.foto} alt={name} className={styles.avatarImage} />
                        ) : (
                            name.charAt(0)
                        )}
                    </div>
                    <div className={styles.arrowIcon}>
                        <MdChevronRight size={24} />
                    </div>
                </div>

                <div className={styles.studentName}>{name}</div>

                <div className={styles.tagContainer}>
                    <div className={styles.tag}>ID: {nis}</div>
                    <div className={styles.tag}>Kelas: {className}</div>
                    <div className={styles.tag}>Unit: {unit}</div>
                </div>

                <div className={styles.attendanceBox}>
                    <div className={styles.attendanceTitle}>Presensi Hari Ini</div>
                    <div className={styles.attendanceTime}>
                        Masuk: {checkIn} <span className={styles.outTime}>Pulang: {checkOut}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
