
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdHome, MdPerson, MdNotifications, MdEmojiEvents } from 'react-icons/md';
import styles from './BottomNavigation.module.css';

const BottomNavigation = () => {
    return (
        <nav className={styles.bottomNav}>
            <NavLink
                to="/dashboard"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <MdHome size={24} />
                <span>Beranda</span>
            </NavLink>

            <NavLink
                to="/berita"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <MdNotifications size={24} />
                <span>Berita</span>
            </NavLink>

            <NavLink
                to="/prestasi"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <MdEmojiEvents size={24} />
                <span>Prestasi</span>
            </NavLink>

            <NavLink
                to="/akun"
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
                <MdPerson size={24} />
                <span>Akun</span>
            </NavLink>
        </nav>
    );
};

export default BottomNavigation;
