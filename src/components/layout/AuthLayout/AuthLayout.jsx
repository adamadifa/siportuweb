import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './AuthLayout.module.css';

import logoDefault from '@/assets/images/logo.png';

const AuthLayout = ({ children, title = "Siportu", subtitle = "Welcome Back", description = "Enter your details below", logo, background }) => {
    return (
        <div className={styles.container}>
            {/* Background Image Overlay */}
            <div className={styles.bgOverlay}>
                {background && <img src={background} alt="Background" className={styles.bgImage} />}
                <div className={styles.bgGradient}></div>
            </div>

            {/* Abstract Background Elements */}
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            
            <div className={styles.header}>
                <div className={styles.topNav}>
                    <button className={styles.backButton}><FaChevronLeft /></button>
                    <div className={styles.navLink}>
                        Belum punya akun? <Link to="/register" className={styles.link}>Daftar</Link>
                    </div>
                </div>
                <div className={styles.logoContainer}>
                    <div className={styles.logoWrapper}>
                        <img src={logo || logoDefault} alt="Logo" className={styles.logo} />
                    </div>
                </div>
                <h1 className={styles.title}>{title}</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.drawerHandle}></div>
                <div className={styles.welcomeText}>
                    <h2>{subtitle}</h2>
                    <p>{description}</p>
                </div>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
