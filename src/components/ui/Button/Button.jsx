import React from 'react';
import styles from './Button.module.css';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    onClick,
    icon,
    className = ''
}) => {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${className}`}
            onClick={onClick}
        >
            {icon && <span className={styles.icon}>{icon}</span>}
            {children}
        </button>
    );
};

export default Button;
