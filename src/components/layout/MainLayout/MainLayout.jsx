
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import styles from './MainLayout.module.css';

const MainLayout = () => {
    return (
        <div className={styles.layoutContainer}>
            <main className={styles.content}>
                <Outlet />
            </main>
            <BottomNavigation />
        </div>
    );
};

export default MainLayout;
