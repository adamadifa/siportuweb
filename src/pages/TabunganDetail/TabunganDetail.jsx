import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './TabunganDetail.module.css';
import { MdArrowBack, MdAccountBalanceWallet, MdArrowDownward, MdArrowUpward, MdHistory, MdWifi } from 'react-icons/md';
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
                    StudentRepository.getDetailTabunganSantri(studentId, accountNo).catch(err => {
                        console.error('Error fetching detail:', err);
                        return null;
                    }),
                    GeneralRepository.getSettings().catch(err => {
                        console.error('Error fetching settings:', err);
                        return null;
                    })
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

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.headerWrapper} style={{ paddingBottom: '70px' }}>
                    <div className={styles.topBar}>
                        <button className={styles.backButton} style={{ opacity: 0.5 }}><MdArrowBack /></button>
                        <h1 className={styles.pageTitle}>Memuat Detail...</h1>
                    </div>
                    <div className={styles.headerContent}>
                        <Skeleton width="100%" height="200px" borderRadius="20px" />
                    </div>
                </div>
                <div className={styles.content}>
                    <Skeleton width="160px" height="20px" style={{ marginBottom: '16px', marginTop: '16px' }} />
                    <Skeleton width="100%" height="76px" borderRadius="16px" count={3} style={{ marginBottom: '12px' }} />
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
                    <h1 className={styles.pageTitle}>Detail Rekening</h1>
                </div>

                <div className={styles.headerContent}>
                    {/* Modern ATM/Savings Card */}
                    <div className={styles.creditCard}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardBrand}>SIPORTU CARD</span>
                            <div className={styles.chipWrapper}>
                                <div className={styles.cardChip}></div>
                                <MdWifi className={styles.wifiIcon} size={22} />
                            </div>
                        </div>

                        <div className={styles.cardBody}>
                            <span className={styles.balanceLabel}>SALDO TABUNGAN</span>
                            <span className={styles.balanceValue}>{formatCurrency(detailData.saldo)}</span>
                        </div>

                        <div className={styles.cardFooter}>
                            <div className={styles.cardMetaLeft}>
                                <span className={styles.metaLabel}>NOMOR REKENING</span>
                                <span className={styles.accountNumber}>{detailData.no_rekening}</span>
                            </div>
                            <div className={styles.cardMetaRight}>
                                <span className={styles.metaLabel}>JENIS</span>
                                <span className={styles.accountType}>{detailData.jenis_tabungan}</span>
                            </div>
                        </div>
                        
                        <div className={styles.cardOwnerName}>
                            {detailData.nama_anggota}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {/* Transaction History */}
                <div className={styles.sectionTitle}>
                    <span>Riwayat Transaksi</span>
                    <span className={styles.transactionCount}>
                        {detailData.total_transaksi} Transaksi Terakhir
                    </span>
                </div>

                <div className={styles.transactionList}>
                    {detailData.transaksi && detailData.transaksi.length > 0 ? (
                        detailData.transaksi.map((item, index) => (
                            <div key={index} className={styles.transactionItem}>
                                <div className={styles.transactionLeft}>
                                    <div 
                                        className={styles.transactionIcon} 
                                        style={{ 
                                            backgroundColor: item.jenis_transaksi === 'S' ? '#ecfdf5' : '#fef2f2', 
                                            color: item.jenis_transaksi === 'S' ? '#10b981' : '#f43f5e' 
                                        }}
                                    >
                                        {item.jenis_transaksi === 'S' ? <MdArrowDownward /> : <MdArrowUpward />}
                                    </div>
                                    <div className={styles.transactionMeta}>
                                        <span className={styles.transactionType}>
                                            {item.jenis_transaksi_text || (item.jenis_transaksi === 'S' ? 'Setoran' : 'Penarikan')}
                                        </span>
                                        <span className={styles.transactionDate}>{formatDate(item.created_at || item.tanggal)}</span>
                                    </div>
                                </div>
                                <div className={styles.transactionRight}>
                                    <span 
                                        className={styles.transactionAmount} 
                                        style={{ color: item.jenis_transaksi === 'S' ? '#10b981' : '#f43f5e' }}
                                    >
                                        {item.jenis_transaksi === 'S' ? '+' : '-'} {formatCurrency(item.jumlah)}
                                    </span>
                                    {item.nama_petugas && (
                                        <span className={styles.transactionOfficer}>Petugas: {item.nama_petugas}</span>
                                    )}
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
