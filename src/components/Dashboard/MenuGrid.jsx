import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdPayment,
    MdAssignmentTurnedIn,
    MdSavings,
    MdBook,
    MdAssessment,
    MdNotifications
} from 'react-icons/md';
import styles from '../../pages/Dashboard/Dashboard.module.css';

const MenuGrid = ({ activeStudentId }) => {
    const menus = [
        { icon: <MdPayment />, label: 'Tagihan', styleClass: styles.tagihanIcon, path: activeStudentId ? `/tagihan/${activeStudentId}` : '/tagihan' },
        { icon: <MdAssignmentTurnedIn />, label: 'Presensi', styleClass: styles.presensiIcon },
        { icon: <MdSavings />, label: 'Tabungan', styleClass: styles.tabunganIcon, path: activeStudentId ? `/tabungan/${activeStudentId}` : '/tabungan' },
        { icon: <MdBook />, label: 'Raport', styleClass: styles.raportIcon, comingSoon: true },
        { icon: <MdAssessment />, label: 'Laporan', styleClass: styles.laporanIcon, comingSoon: true },
        { icon: <MdNotifications />, label: 'Pengumuman', styleClass: styles.pengumumanIcon },
    ];

    const navigate = useNavigate();

    const handleNavigation = (menu) => {
        if (!menu.comingSoon && menu.path) {
            navigate(menu.path);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.menuGrid}>
                {menus.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.menuItem} ${item.comingSoon ? styles.menuItemRelative : ''}`}
                        onClick={() => handleNavigation(item)}
                        style={{ cursor: item.comingSoon ? 'default' : 'pointer' }}
                    >
                        <div className={`${styles.iconWrapper} ${item.styleClass}`}>
                            {item.icon}
                        </div>
                        <div className={styles.menuLabel}>{item.label}</div>
                        {item.comingSoon && (
                            <div className={styles.comingSoon}>Coming Soon</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuGrid;
