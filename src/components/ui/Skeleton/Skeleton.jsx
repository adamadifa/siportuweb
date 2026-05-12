import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius, style, className }) => {
    return (
        <div
            className={`${styles.skeleton} ${className || ''}`}
            style={{
                width,
                height,
                borderRadius,
                ...style
            }}
        />
    );
};

export default Skeleton;
