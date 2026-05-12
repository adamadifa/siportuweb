import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Tagihan.module.css';
import { MdPlace, MdCalendarToday, MdPerson, MdDiscount, MdSwapHoriz, MdCheckCircleOutline, MdArrowBack, MdPhone, MdClose, MdDescription, MdAttachMoney, MdQrCode } from 'react-icons/md';
import { StudentRepository, GeneralRepository } from '../../repositories';
import Skeleton from '../../components/ui/Skeleton/Skeleton';
import logo from '../../assets/images/logo.png';
import QRCode from 'react-qr-code';

const Tagihan = () => {
    const navigate = useNavigate();
    const { studentId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    const [units, setUnits] = useState([]);
    const [selectedUnitId, setSelectedUnitId] = useState('');

    const [billsData, setBillsData] = useState([]);
    const [billsLoading, setBillsLoading] = useState(false);

    const [sppModalOpen, setSppModalOpen] = useState(false);
    const [sppData, setSppData] = useState([]);
    const [sppLoading, setSppLoading] = useState(false);
    const [selectedSppBill, setSelectedSppBill] = useState(null);

    const [paymentHistory, setPaymentHistory] = useState([]);
    const [paymentHistoryLoading, setPaymentHistoryLoading] = useState(false);
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [historyDetailData, setHistoryDetailData] = useState([]);
    const [historyDetailLoading, setHistoryDetailLoading] = useState(false);

    const [activeTab, setActiveTab] = useState('detail');

    // Fetch Student Data and Units
    React.useEffect(() => {
        const fetchStudentData = async () => {
            if (!studentId) return;
            try {
                setLoading(true);

                // Fetch Student Data, Units, and Settings
                const [data, unitsData, settingsRes] = await Promise.all([
                    StudentRepository.getSiswaById(studentId),
                    StudentRepository.getUnitsBySiswa(studentId),
                    GeneralRepository.getSettings()
                ]);

                console.log('API Response (Student):', data);
                if (settingsRes?.status === 'success') setSettings(settingsRes.data);

                let currentStudent = null;
                if (Array.isArray(data) && data.length > 0) {
                    currentStudent = data[0];
                    setStudent(data[0]);
                } else if (data && typeof data === 'object') {
                    currentStudent = data;
                    setStudent(data);
                }

                // Units logic
                if (Array.isArray(unitsData)) {
                    setUnits(unitsData);
                    if (currentStudent && currentStudent.nama_unit) {
                        const matchedUnit = unitsData.find(u => u.nama_unit === currentStudent.nama_unit);
                        if (matchedUnit) setSelectedUnitId(matchedUnit.no_pendaftaran);
                    }
                }

            } catch (error) {
                console.error('Error fetching details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentId]);

    // Fetch Payment History
    React.useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (!studentId) return;
            try {
                setPaymentHistoryLoading(true);
                const data = await StudentRepository.getHistoriBayarByIdSiswa(studentId);
                console.log('API Response (Payment History):', data);
                if (Array.isArray(data)) {
                    setPaymentHistory(data);
                } else {
                    setPaymentHistory([]);
                }
            } catch (error) {
                console.error('Error fetching payment history:', error);
            } finally {
                setPaymentHistoryLoading(false);
            }
        };

        if (activeTab === 'payment') {
            fetchPaymentHistory();
        }
    }, [studentId, activeTab]);

    // Fetch Bills when selectedUnitId changes
    React.useEffect(() => {
        const fetchBills = async () => {
            if (!selectedUnitId) return;
            try {
                setBillsLoading(true);
                const data = await StudentRepository.getBiayaSiswaByNoPendaftaran(selectedUnitId);
                console.log('API Response (Bills):', data);
                if (Array.isArray(data)) {
                    setBillsData(data);
                } else {
                    setBillsData([]);
                }
            } catch (error) {
                console.error('Error fetching bills:', error);
            } finally {
                setBillsLoading(false);
            }
        };

        fetchBills();
    }, [selectedUnitId]);

    const handleBillClick = async (bill) => {
        // Check if bill is SPP (B07)
        if (bill.kode_jenis_biaya && (bill.kode_jenis_biaya.includes('B07') || bill.jenis_biaya?.toLowerCase().includes('spp'))) {
            setSelectedSppBill(bill);
            setSppModalOpen(true);
            setSppLoading(true);
            try {
                // Use bill.kode_biaya and selectedUnitId (no_pendaftaran)
                const data = await StudentRepository.getRencanaSppByKodeBiaya(bill.kode_biaya, selectedUnitId);
                console.log('API Response (SPP Plan):', data);
                if (Array.isArray(data)) {
                    setSppData(data);
                } else {
                    setSppData([]);
                }
            } catch (error) {
                console.error('Error fetching SPP plan:', error);
                setSppData([]);
            } finally {
                setSppLoading(false);
            }
        }
    };

    const handleHistoryClick = async (item) => {
        setSelectedHistoryItem(item);
        setHistoryModalOpen(true);
        setHistoryDetailLoading(true);

        try {
            const data = await StudentRepository.getDetailHistoriBayar(item.no_bukti);
            console.log('API Response (Payment Detail):', data);
            if (Array.isArray(data)) {
                setHistoryDetailData(data);
            } else {
                setHistoryDetailData([]);
            }
        } catch (error) {
            console.error('Error fetching payment detail:', error);
            setHistoryDetailData([]);
        } finally {
            setHistoryDetailLoading(false);
        }
    };

    const getMonthName = (monthNumber) => {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return months[monthNumber - 1] || '';
    };

    // Calculate SPP Totals
    const totalSppTagihan = sppData.reduce((acc, item) => acc + (Number(item.jumlah) || 0), 0);

    // Logic: Status "1" = Paid (Lunas), "0" = Unpaid (Belum Lunas)
    const totalSppBayar = sppData.reduce((acc, item) => {
        return acc + (Number(item.realisasi) || 0)
    }, 0);

    const totalSppSisa = totalSppTagihan - totalSppBayar;

    const getBillTypeClass = (jenisBiaya) => {
        const lowerType = jenisBiaya?.toLowerCase() || '';
        if (lowerType.includes('pendaftaran')) return styles.typePendaftaran;
        if (lowerType.includes('bangunan') || lowerType.includes('sarana')) return styles.typeInfaq;
        return styles.typeInfaq; // Default
    };

    // Construct display data from fetched object or use fallback
    const displayStudent = student ? {
        name: student.nama_lengkap,
        nis: student.nis,
        unit: student.nama_unit,
        year: student.tahun_ajaran,
        location: student.nama_kota,
        noHp: student.no_hp_orang_tua || '-',
    } : null;

    const formatCurrency = (amount) => {
        const value = Number(amount) || 0;
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    if (loading) {
        return (
            <div className={styles.container} style={{ padding: '20px' }}>
                <Skeleton width="100%" height="200px" borderRadius="20px" />
                <Skeleton width="100%" height="100px" style={{ marginTop: '20px' }} />
                <Skeleton width="100%" height="100px" style={{ marginTop: '20px' }} />
            </div>
        );
    }

    if (!displayStudent) {
        return (
            <div className={styles.container} style={{ padding: '20px', textAlign: 'center' }}>
                <p>Data siswa tidak ditemukan.</p>
                <button onClick={() => navigate(-1)} className={styles.tabButton} style={{ marginTop: '10px' }}>
                    Kembali
                </button>
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
                    <button className={styles.backButton} onClick={() => navigate('/dashboard')}>
                        <MdArrowBack />
                    </button>
                    <h1 className={styles.pageTitle}>Rincian Tagihan</h1>
                </div>

                <div className={styles.headerContent}>
                    <div className={styles.avatarWrapper}>
                        {student?.foto ? (
                            <img src={student.foto} alt="Foto" className={styles.avatarImg} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {(student?.nama_lengkap || '?').charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className={styles.studentInfo}>
                        <h2 className={styles.studentName}>{displayStudent.name}</h2>
                        <div className={styles.studentMeta}>
                            <span className={styles.badge}>NIS: {displayStudent.nis}</span>
                            <span className={styles.badge}>{displayStudent.unit}</span>
                            <span className={styles.badge}>{displayStudent.year}</span>
                        </div>
                        <div className={styles.locationInfo}>
                            <MdPlace size={14} /> <span>{displayStudent.location}</span>
                            <span className={styles.separator}>|</span>
                            <MdPhone size={14} /> <span>{displayStudent.noHp}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabContainer}>
                <button
                    className={`${styles.tabButton} ${activeTab === 'detail' ? styles.activeTab : styles.inactiveTab}`}
                    onClick={() => setActiveTab('detail')}
                >
                    Detail Biaya
                </button>
                <button
                    className={`${styles.tabButton} ${activeTab === 'payment' ? styles.activeTab : styles.inactiveTab}`}
                    onClick={() => setActiveTab('payment')}
                >
                    Pembayaran
                </button>
            </div>

            {/* Filter */}
            <div className={styles.filterSection}>
                <select
                    className={styles.dropdown}
                    value={selectedUnitId}
                    onChange={(e) => setSelectedUnitId(e.target.value)}
                >
                    {units.length > 0 ? (
                        units.map((unit) => (
                            <option key={unit.no_pendaftaran} value={unit.no_pendaftaran}>
                                {unit.nama_unit}
                            </option>
                        ))
                    ) : (
                        <option value="">Memuat unit...</option>
                    )}
                </select>
            </div>

            {/* Bill List */}
            {activeTab === 'detail' && (
                <div className={styles.billList}>
                    {billsLoading ? (
                        <>
                            <Skeleton width="100%" height="150px" borderRadius="15px" style={{ marginBottom: '15px' }} />
                            <Skeleton width="100%" height="150px" borderRadius="15px" />
                        </>
                    ) : billsData.length > 0 ? (
                        billsData.map((bill, index) => (
                            <div
                                key={index}
                                className={styles.billCard}
                                onClick={() => handleBillClick(bill)}
                                style={{ cursor: bill.kode_biaya && (bill.kode_biaya.includes('B07') || bill.nama_biaya?.toLowerCase().includes('spp')) ? 'pointer' : 'default' }}
                            >
                                <div className={styles.billHeader}>
                                    <span className={styles.billCode}>Kode: {bill.kode_biaya}</span>
                                    <span className={`${styles.billTypeTag} ${getBillTypeClass(bill.jenis_biaya)}`}>
                                        {bill.jenis_biaya}
                                    </span>
                                </div>
                                <div className={styles.billAmount}>
                                    {formatCurrency(bill.jumlah || bill.nominal || 0)}
                                </div>

                                <div className={styles.billDetails}>
                                    <div className={styles.detailRow}>
                                        <div className={styles.detailLabel}>
                                            <MdDiscount className={`${styles.detailIcon} ${styles.potongan}`} />
                                            <span>Potongan</span>
                                        </div>
                                        <div className={`${styles.detailValue} ${styles.valPotongan}`}>
                                            {formatCurrency(bill.jumlah_potongan)}
                                        </div>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <div className={styles.detailLabel}>
                                            <MdSwapHoriz className={`${styles.detailIcon} ${styles.mutasi}`} />
                                            <span>Mutasi</span>
                                        </div>
                                        <div className={`${styles.detailValue} ${styles.valMutasi}`}>
                                            {formatCurrency(bill.jumlah_mutasi)}
                                        </div>
                                    </div>
                                    <div className={styles.detailRow}>
                                        <div className={styles.detailLabel}>
                                            <MdCheckCircleOutline className={`${styles.detailIcon} ${styles.bayar}`} />
                                            <span>Bayar</span>
                                        </div>
                                        <div className={`${styles.detailValue} ${styles.valBayar}`}>
                                            {formatCurrency(bill.jmlbayar)}
                                        </div>
                                    </div>
                                    <div className={`${styles.detailRow} ${styles.sisaRow}`}>
                                        <div className={styles.detailLabel}>
                                            <span>Sisa Tagihan</span>
                                        </div>
                                        <div className={`${styles.detailValue} ${styles.valSisa}`}>
                                            {formatCurrency((Number(bill.jumlah || bill.nominal) || 0) - (Number(bill.jumlah_potongan) || 0) - (Number(bill.jumlah_mutasi) || 0) - (Number(bill.jmlbayar) || 0))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            Tidak ada data tagihan.
                        </div>
                    )}
                </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'payment' && (
                <div className={styles.paymentList}>
                    {paymentHistoryLoading ? (
                        <>
                            <Skeleton width="100%" height="120px" borderRadius="16px" style={{ marginBottom: '15px' }} />
                            <Skeleton width="100%" height="120px" borderRadius="16px" />
                        </>
                    ) : paymentHistory.length > 0 ? (
                        paymentHistory.map((item, index) => (
                            <div key={index} className={styles.paymentCard} onClick={() => handleHistoryClick(item)} style={{ cursor: 'pointer' }}>
                                <div className={styles.paymentHeader}>
                                    <div className={styles.paymentIdGroup}>
                                        <MdDescription size={20} />
                                        <span>{item.no_bukti}</span>
                                    </div>
                                    <div className={styles.paymentDate}>
                                        <MdCalendarToday size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                        {item.tanggal}
                                    </div>
                                </div>
                                <div className={styles.paymentRow}>
                                    <div className={styles.paymentLabel}>
                                        <MdAttachMoney size={18} className={styles.paymentIcon} />
                                        <span>Jumlah</span>
                                    </div>
                                    <div className={styles.paymentValue}>
                                        {formatCurrency(item.jumlah)}
                                    </div>
                                </div>
                                <div className={styles.paymentRow}>
                                    <div className={styles.paymentLabel}>
                                        <MdPerson size={18} className={styles.paymentIcon} />
                                        <span>Petugas</span>
                                    </div>
                                    <div className={`${styles.paymentValue} ${styles.officerName}`}>
                                        {item.name}
                                    </div>
                                </div>
                                {item.keterangan && (
                                    <div className={styles.paymentRow} style={{ marginTop: '8px', fontStyle: 'italic', color: '#666' }}>
                                        <div className={styles.paymentLabel}>
                                            <span>Ket:</span>
                                        </div>
                                        <div className={styles.paymentValue} style={{ fontWeight: 'normal' }}>
                                            {item.keterangan}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
                            <MdDiscount size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                            <p>Belum ada riwayat pembayaran.</p>
                        </div>
                    )}
                </div>
            )}


            {/* SPP Detail Modal */}
            {
                sppModalOpen && (
                    <div className={styles.modalOverlay} onClick={() => setSppModalOpen(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3>Detail SPP {selectedSppBill?.nama_biaya || 'SPP'}</h3>
                                <button onClick={() => setSppModalOpen(false)} className={styles.closeButton}>
                                    <MdClose />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                {sppLoading ? (
                                    <>
                                        <Skeleton width="100%" height="80px" borderRadius="10px" style={{ marginBottom: '10px' }} />
                                        <Skeleton width="100%" height="80px" borderRadius="10px" style={{ marginBottom: '10px' }} />
                                        <Skeleton width="100%" height="80px" borderRadius="10px" />
                                    </>
                                ) : sppData.length > 0 ? (
                                    sppData.map((item, index) => {
                                        const isPaid = String(item.status) === '1';
                                        const dueDate = `10-${String(item.bulan).padStart(2, '0')}-${item.tahun}`; // Detailed date not in API, defaulting to 10th

                                        return (
                                            <div key={index} className={styles.sppItem}>
                                                <div className={styles.sppItemHeader}>
                                                    <span className={styles.sppMonth}>{getMonthName(item.bulan)} {item.tahun}</span>
                                                    <span className={styles.sppDate}>Jatuh Tempo: {dueDate}</span>
                                                </div>
                                                <div className={styles.sppDetailRow}>
                                                    <span>Tagihan</span>
                                                    <span className={styles.valTagihan}>{formatCurrency(item.jumlah)}</span>
                                                </div>
                                                <div className={styles.sppDetailRow}>
                                                    <span>Bayar</span>
                                                    <span className={styles.valBayar}>
                                                        {formatCurrency(item.realisasi)}
                                                    </span>
                                                </div>
                                                <div className={styles.sppDetailRow}>
                                                    <span>Sisa</span>
                                                    <span className={`${styles.valSisa} ${isPaid ? styles.paid : styles.unpaid}`}>
                                                        {formatCurrency(item.jumlah - item.realisasi)}
                                                    </span>
                                                </div>
                                                <div className={styles.sppStatusRow} style={{ marginTop: '5px', textAlign: 'right', fontSize: '12px', fontWeight: 'bold' }}>
                                                    <span style={{ color: item.jumlah - item.realisasi === 0 ? '#388E3C' : '#D32F2F' }}>
                                                        {item.jumlah - item.realisasi === 0 ? 'Lunas' : 'Belum Lunas'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#666' }}>Data rencana SPP tidak ditemukan.</div>
                                )}
                            </div >
                            {!sppLoading && sppData.length > 0 && (
                                <div className={styles.modalFooter}>
                                    <div className={styles.footerRow}>
                                        <span>TOTAL SPP</span>
                                        <span>{formatCurrency(totalSppTagihan)}</span>
                                    </div>
                                    <div className={styles.footerRow}>
                                        <span>TOTAL BAYAR</span>
                                        <span>{formatCurrency(totalSppBayar)}</span>
                                    </div>
                                    <div className={styles.footerRow}>
                                        <span>TOTAL SISA</span>
                                        <span>{formatCurrency(totalSppSisa)}</span>
                                    </div>
                                </div>
                            )}
                        </div >
                    </div >
                )
            }


            {/* History Detail Modal */}
            {
                historyModalOpen && selectedHistoryItem && (
                    <div className={styles.modalOverlay} onClick={() => setHistoryModalOpen(false)}>
                        <div className={`${styles.modalContent} ${styles.receiptModal}`} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.receiptHeader}>
                                <img src={logo} alt="Logo" className={styles.receiptLogo} />
                            </div>

                            <div className={styles.receiptDivider}></div>

                            <div className={styles.receiptBody}>
                                <div className={styles.receiptRow}>
                                    <span className={styles.receiptLabel}>No. Transaksi</span>
                                    <span className={styles.receiptValue}>{selectedHistoryItem.no_bukti}</span>
                                </div>
                                <div className={styles.receiptRow}>
                                    <span className={styles.receiptLabel}>Tanggal</span>
                                    <span className={styles.receiptValue}>{selectedHistoryItem.tanggal?.split(' ')[0]}</span>
                                </div>
                                <div className={styles.receiptRow}>
                                    <span className={styles.receiptLabel}>Jumlah</span>
                                    <span className={`${styles.receiptValue} ${styles.receiptTotal}`}>
                                        {formatCurrency(selectedHistoryItem.jumlah)}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.receiptSectionTitle}>Rincian Pembayaran:</div>
                            <div className={styles.receiptBreakdown}>
                                {historyDetailLoading ? (
                                    <>
                                        <Skeleton width="100%" height="20px" borderRadius="4px" style={{ marginBottom: '8px' }} />
                                        <Skeleton width="100%" height="20px" borderRadius="4px" style={{ marginBottom: '8px' }} />
                                        <Skeleton width="80%" height="20px" borderRadius="4px" />
                                    </>
                                ) : historyDetailData.length > 0 ? (
                                    historyDetailData.map((detail, index) => (
                                        <div key={index} className={styles.receiptRow}>
                                            <span className={styles.receiptLabel}>
                                                {detail.keterangan || detail.jenis_biaya}
                                            </span>
                                            <span className={styles.receiptValue}>
                                                {formatCurrency(detail.jumlah)}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
                                        Tidak ada rincian tersedia
                                    </div>
                                )}
                            </div>

                            <div className={styles.receiptDivider}></div>

                            <div className={styles.receiptFooter}>
                                <div className={styles.qrPlaceholder}>
                                    <QRCode
                                        value={selectedHistoryItem.no_bukti || '-'}
                                        size={80}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                                <span className={styles.scanText}>Scan kode transaksi</span>

                                <button onClick={() => setHistoryModalOpen(false)} className={styles.closeReceiptButton}>
                                    <MdClose />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Summary Recap */}
            {
                activeTab === 'detail' && billsData.length > 0 && !billsLoading && (
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryRow}>
                            <span>Total Biaya</span>
                            <span>{formatCurrency(billsData.reduce((acc, bill) => acc + (Number(bill.jumlah || bill.nominal) || 0), 0))}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Total Potongan</span>
                            <span>{formatCurrency(billsData.reduce((acc, bill) => acc + (Number(bill.jumlah_potongan) || 0), 0))}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Total Mutasi</span>
                            <span>{formatCurrency(billsData.reduce((acc, bill) => acc + (Number(bill.jumlah_mutasi) || 0), 0))}</span>
                        </div>
                        <div className={styles.divider}></div>
                        <div className={`${styles.summaryRow} ${styles.totalTagihan}`}>
                            <span>Total Tagihan</span>
                            <span>{formatCurrency(
                                billsData.reduce((acc, bill) => acc + (Number(bill.jumlah || bill.nominal) || 0), 0) -
                                billsData.reduce((acc, bill) => acc + (Number(bill.jumlah_potongan) || 0), 0) -
                                billsData.reduce((acc, bill) => acc + (Number(bill.jumlah_mutasi) || 0), 0)
                            )}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Total Bayar</span>
                            <span>{formatCurrency(billsData.reduce((acc, bill) => acc + (Number(bill.jmlbayar) || 0), 0))}</span>
                        </div>
                        <div className={`${styles.summaryRow} ${styles.sisaBayar}`}>
                            <span>Sisa Bayar</span>
                            <span>{formatCurrency(
                                (billsData.reduce((acc, bill) => acc + (Number(bill.jumlah || bill.nominal) || 0), 0) -
                                    billsData.reduce((acc, bill) => acc + (Number(bill.jumlah_potongan) || 0), 0) -
                                    billsData.reduce((acc, bill) => acc + (Number(bill.jumlah_mutasi) || 0), 0)) -
                                billsData.reduce((acc, bill) => acc + (Number(bill.jmlbayar) || 0), 0)
                            )}</span>
                        </div>
                    </div>
                )
            }

            <div style={{ paddingBottom: '20px' }}></div> {/* Spacer */}
        </div >
    );
};

export default Tagihan;
