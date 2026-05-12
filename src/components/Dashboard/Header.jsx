import React from 'react';
import { MdLogout } from 'react-icons/md';
import styles from '../../pages/Dashboard/Dashboard.module.css';

import logo from '../../assets/images/logo.png';

const Header = ({ user, title, onLogout }) => {
    // Determine the name to display (Parent or generic)
    const displayName = user.name || 'Bapak / Ibu';

    return (
        <div className={styles.headerContainer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={logo} alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <div>
                    <div className={styles.greeting}>Assalamualaikum,</div>
                    <h1 className={styles.userName}>{displayName}</h1>
                </div>
            </div>
            {/* Logout button removed or kept? User just said "add logo". Keeping logout for now. */}
            <button className={styles.logoutBtn} onClick={onLogout} aria-label="Logout">
                <MdLogout />
            </button>
        </div>
    );
};

export default Header;
