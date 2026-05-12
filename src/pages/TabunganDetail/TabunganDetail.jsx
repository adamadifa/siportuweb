import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TabunganDetail.module.css';
import { MdArrowBack, MdAccountBalanceWallet, MdInput, MdOutput, MdHistory } from 'react-icons/md';
import { StudentRepository, GeneralRepository } from '../../repositories';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const TabunganDetail = () => {
    const navigate = useNavigate();
    const { studentId, accountNo } = useParams();
    const [detailData, setDetailData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [detailRes, settingsRes] = await Promise.all([
                    StudentRepository.getDetailTabunganSantri(studentId, accountNo),
                    GeneralRepository.getSettings()
                ]);
                
                if (detailRes && detailRes.success) {
                    setDetailData(detailRes.data);
                }
                if (settingsRes?.status === 'success') setSettings(settingsRes.data);
            } catch (error) {
                console.error('Error fetching tabungan detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (studentId && accountNo) {
            fetchData();
        }
    }, [studentId, accountNo]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const formatTime = (dateString) => {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleTimeString('id-ID', options);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.headerPlaceholder}>
                    <Skeleton width="100%" height="200px" borderRadius="0 0 30px 30px" />
                </div>
                <div className={styles.content}>
                    <Skeleton width="100%" height="120px" borderRadius="24px" style={{ marginBottom: '24px' }} />
                    <Skeleton width="100%" height="80px" borderRadius="20px" style={{ marginBottom: '16px' }} />
                    <Skeleton width="100%" height="80px" borderRadius="20px" style={{ marginBottom: '16px' }} />
                    <Skeleton width="100%" height="80px" borderRadius="20px" />
                </div>
            </div>
        );
    }

    if (!detailData) {
        return (
            <div className={styles.container}>
                <div className={styles.topBar} style={{ background: '#064e3b', padding: '24px 20px' }}>
                    <button onClick={() => navigate(-1)} className={styles.backButton}><MdArrowBack /></button>
                    <span className={styles.pageTitle}>Error</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.emptyState}>
                        <MdHistory size={48} style={{ marginBottom: '10px' }} />
                        <p>Data tabungan tidak ditemukan.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Unified Header */}
            <div className={styles.headerWrapper}>
                {settings?.background_login && (
                    <div className={styles.bgOverlay}>
                        <img src={settings.background_login} alt="Background" className={styles.bgImage} />
                        <div className={styles.bgGradient}></div>
                    </div>
                )}
                
                <div className={styles.topBar}>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>
                        <MdArrowBack />
                    </button>
                    <h1 className={styles.pageTitle}>{detailData.jenis_tabungan}</h1>
                </div>

                <div className={styles.headerContent}>
                    <div className={styles.accountInfo}>
                        <h2 className={styles.accountName}>{detailData.nama_anggota}</h2>
                        <div className={styles.accountNumberBadge}>{detailData.no_rekening}</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {/* Balance Summary */}
                <div className={styles.summaryCard}>
                    <div>
                        <span className={styles.balanceLabel}>Saldo Saat Ini</span>
                        <span className={styles.balanceValue}>{formatCurrency(detailData.saldo)}</span>
                    </div>
                    <div className={styles.iconWrapper}>
                        <MdAccountBalanceWallet size={28} />
                    </div>
                </div>

                {/* Transaction History */}
                <div className={styles.sectionTitle}>
                    <span>Riwayat Transaksi</span>
                    <span style={{ fontSize: '12px', fontWeight: '400', color: '#888' }}>
                        {detailData.total_transaksi} Transaksi Terakhir
                    </span>
                </div>

                <div className={styles.transactionList}>
                    {detailData.transaksi && detailData.transaksi.length > 0 ? (
                        detailData.transaksi.map((item, index) => (
                            <div key={index} className={styles.transactionItem}>
                                <div className={styles.transactionLeft}>
                                    <div className={`${styles.transactionIcon} ${item.jenis_transaksi === 'S' ? styles.iconIn : styles.iconOut}`}>
                                        {item.jenis_transaksi === 'S' ? <MdInput /> : <MdOutput />}
                                    </div>
                                    <div className={styles.transactionMeta}>
                                        <span className={styles.transactionType}>
                                            {item.jenis_transaksi_text || (item.jenis_transaksi === 'S' ? 'Setoran' : 'Penarikan')}
                                        </span>
                                        <span className={styles.transactionDate}>{formatDate(item.created_at || item.tanggal)}</span>
                                    </div>
                                </div>
                                <div className={styles.transactionRight}>
                                    <span className={`${styles.transactionAmount} ${item.jenis_transaksi === 'S' ? styles.amountIn : styles.amountOut}`}>
                                        {item.jenis_transaksi === 'S' ? '+' : '-'} {formatCurrency(item.jumlah)}
                                    </span>
                                    <span className={styles.transactionOfficer}>{item.nama_petugas}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Belum ada riwayat transaksi.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TabunganDetail;
