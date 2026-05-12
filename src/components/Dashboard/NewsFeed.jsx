import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPlace, MdNotificationsActive } from 'react-icons/md';
import styles from '../../pages/Dashboard/Dashboard.module.css';

const NewsFeed = ({ data }) => {
    const navigate = useNavigate(); // Add this line

    const formatDate = (dateString) => {
        const parts = dateString.split(' ');
        return {
            day: parts[0] || '-',
            month: parts[1] || '-',
            year: parts[2] || '-'
        };
    };
    return (
        <div className={styles.wrapper}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}>
                    <MdNotificationsActive size={20} color="#F9A825" /> Pengumuman
                </div>
                <a href="#" className={styles.seeAll}>Lihat Semua</a>
            </div>

            <div className={styles.newsList}>
                {data && data.length > 0 ? (
                    data.map((item, index) => {
                        const { day, month, year } = formatDate(item.tanggal);
                        return (
                            <div
                                key={item.id || index}
                                className={styles.newsCard}
                                onClick={() => navigate(`/pengumuman/${item.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={styles.dateBox}>
                                    <div className={styles.dateDay}>{day}</div>
                                    <div className={styles.dateMonth}>{month}</div>
                                    <div className={styles.dateYear}>{year}</div>
                                </div>

                                <div className={styles.newsContent}>
                                    <div className={styles.newsTag}>{item.kategori}</div>
                                    <div className={styles.newsTitle}>{item.judul}</div>
                                    <div className={styles.location}>
                                        <MdPlace size={12} /> {item.lokasi}
                                    </div>
                                    <div className={styles.newsExcerpt}>{item.isi}</div>
                                    <div style={{ marginTop: '5px', fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>
                                        Baca selengkapnya
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', color: '#999', padding: '20px', fontSize: '12px' }}>
                        Belum ada pengumuman terbaru.
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsFeed;
