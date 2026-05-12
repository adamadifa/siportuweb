import React, { useState } from 'react';
import styles from '../../pages/Dashboard/Dashboard.module.css';
import ProfileCard from './ProfileCard';

const ProfileSlider = ({ students, attendanceData = {}, onSlideChange }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (e) => {
        const slider = e.target;
        const scrollPosition = slider.scrollLeft;
        const width = slider.offsetWidth;
        // Calculate active index based on scroll position
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);

        if (onSlideChange && students[index]) {
            onSlideChange(index);
        }
    };

    if (!students || students.length === 0) {
        return null;
    }

    // If only one student, render just the card
    if (students.length === 1) {
        return <ProfileCard student={students[0]} attendance={attendanceData[students[0].id_siswa]} />;
    }

    return (
        <div className={styles.sliderWrapper}> {/* Wrapper for positioning dots */}
            <div
                className={styles.sliderContainer}
                onScroll={handleScroll}
            >
                {students.map((student, index) => (
                    <div key={student.id_siswa || index} className={styles.slide}>
                        <ProfileCard
                            student={student}
                            attendance={attendanceData[student.id_siswa]}
                        />
                    </div>
                ))}
            </div>

            <div className={styles.dotsContainer}>
                {students.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.dot} ${index === activeIndex ? styles.activeDot : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfileSlider;
