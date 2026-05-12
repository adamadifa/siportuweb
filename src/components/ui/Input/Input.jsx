import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Input.module.css';

const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    name,
    error,
    leftIcon: LeftIcon
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles.inputGroup}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputWrapper}>
                {LeftIcon && (
                    <div className={styles.leftIcon}>
                        <LeftIcon />
                    </div>
                )}
                <input
                    type={isPassword && showPassword ? 'text' : type}
                    name={name}
                    className={`${styles.input} ${error ? styles.errorBorder : ''} ${LeftIcon ? styles.hasLeftIcon : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />
                {isPassword && (
                    <button
                        type="button"
                        className={styles.iconButton}
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default Input;
