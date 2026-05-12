import React from 'react';
import { MdHome, MdSearch, MdAdd, MdDescription, MdPerson } from 'react-icons/md';
import styles from '../../pages/Dashboard/Dashboard.module.css';

const BottomNav = () => {
    return (
        <div className={styles.bottomNav}>
            <div className={`${styles.navItem} ${styles.navItemActive}`}>
                <MdHome />
            </div>
            <div className={styles.navItem}>
                <MdSearch />
            </div>
            <div className={styles.addButton}>
                <MdAdd size={24} />
            </div>
            <div className={styles.navItem}>
                <MdDescription />
            </div>
            <div className={styles.navItem}>
                <MdPerson />
            </div>
        </div>
    );
};

export default BottomNav;
