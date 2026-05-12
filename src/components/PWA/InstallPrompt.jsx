import React, { useState, useEffect } from 'react';
import { MdPhoneAndroid, MdClose, MdDownload } from 'react-icons/md';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Check if device is iOS
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(isIosDevice);

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            return;
        }

        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // For testing/development: Show prompt after 1s if nothing happens
        const timer = setTimeout(() => setShowPrompt(true), 1000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User response: ${outcome}`);
            setDeferredPrompt(null);
            setShowPrompt(false);
        } else {
            // Manual instructions for iOS or unsupported browsers
            if (isIOS) {
                alert("Untuk menginstall di iOS:\n1. Klik tombol 'Share' (kotak dengan panah ke atas)\n2. Pilih 'Add to Home Screen' (Tambah ke Layar Utama)");
            } else {
                alert("Browser ini mungkin tidak mendukung instalasi otomatis.\nCoba cari menu 'Install App' atau 'Add to Home Screen' di pengaturan browser Anda.");
            }
        }
    };

    const handleClose = () => {
        setShowPrompt(false);
    };

    // Always show a small floating button if not installed? 
    // Or just rely on showPrompt. 
    // For now, let's trust the user wants to see it, so we display it if we successfully captured event OR if we want to force manual install guide.

    // Fallback: If no event fired but it's not standalone, maybe show a "Install" button anyway?
    // Let's modify logic: Show if showPrompt is true.
    if (!showPrompt) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.iconWrapper}>
                        <MdPhoneAndroid size={24} color="#0d9488" />
                    </div>
                    <div style={styles.textContainer}>
                        <h3 style={styles.title}>Install Siportu App</h3>
                        <p style={styles.description}>
                            {deferredPrompt ? "Akses lebih cepat & mudah tanpa membuka browser." : "Aplikasi ini dapat diinstall ke perangkat Anda."}
                        </p>
                    </div>
                    <button onClick={handleClose} style={styles.closeButton}>
                        <MdClose size={20} color="#999" />
                    </button>
                </div>
                <button onClick={handleInstallClick} style={styles.installButton}>
                    <MdDownload size={18} /> {deferredPrompt ? "Install Sekarang" : "Cara Install"}
                </button>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
    },
    card: {
        background: 'white',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        border: '1px solid #f0f0f0',
        animation: 'slideUp 0.3s ease-out'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    iconWrapper: {
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        backgroundColor: '#f0fdfa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: '14px',
        fontWeight: '700',
        margin: 0,
        color: '#333',
    },
    description: {
        fontSize: '12px',
        margin: '2px 0 0',
        color: '#666',
    },
    closeButton: {
        background: 'none',
        border: 'none',
        padding: '4px',
        cursor: 'pointer',
    },
    installButton: {
        background: 'linear-gradient(135deg, #0d9488 0%, #065f46 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        padding: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
    }
};

export default InstallPrompt;
