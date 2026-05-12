import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineCalendar, HiOutlineUser, HiOutlineTag } from 'react-icons/hi2';
import styles from './BeritaDetail.module.css';
import { StudentRepository, GeneralRepository } from '../../repositories';
import Skeleton from '../../components/ui/Skeleton/Skeleton';

const BeritaDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [postRes, settingsRes] = await Promise.all([
                    StudentRepository.getPostBySlug(slug),
                    GeneralRepository.getSettings()
                ]);

                if (postRes && postRes.success) {
                    setPost(postRes.data);
                }
                if (settingsRes?.status === 'success') {
                    setSettings(settingsRes.data);
                }
            } catch (error) {
                console.error('Error fetching post detail:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchData();
    }, [slug]);

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <button onClick={handleBack} className={styles.backButton}>
                        <HiOutlineArrowLeft />
                    </button>
                </div>
                <div className={styles.skeletonContent}>
                    <Skeleton height="250px" borderRadius="0 0 32px 32px" />
                    <div style={{ padding: '24px' }}>
                        <Skeleton height="32px" width="80%" style={{ marginBottom: '16px' }} />
                        <Skeleton height="20px" width="40%" style={{ marginBottom: '32px' }} />
                        <Skeleton count={6} height="16px" style={{ marginBottom: '12px' }} />
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <button onClick={handleBack} className={styles.backButton}>
                        <HiOutlineArrowLeft />
                    </button>
                </div>
                <div className={styles.emptyState}>
                    <h3>Berita tidak ditemukan</h3>
                    <button onClick={() => navigate('/berita')} className={styles.btnHome}>Kembali ke Berita</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Background & Top Bar */}
            <div className={styles.topBar}>
                <button onClick={handleBack} className={styles.backButton}>
                    <HiOutlineArrowLeft />
                </button>
            </div>

            {/* Hero Image */}
            <div className={styles.heroSection}>
                {post.image ? (
                    <img src={post.image} alt={post.title} className={styles.heroImage} />
                ) : (
                    <div className={styles.heroPlaceholder}>
                        <HiOutlineTag size={64} />
                    </div>
                )}
                <div className={styles.heroOverlay}></div>
            </div>

            {/* Content Card */}
            <div className={styles.contentCard}>
                <div className={styles.postMeta}>
                    <span className={styles.category}>{post.category_name || 'Berita'}</span>
                    <div className={styles.metaItems}>
                        <div className={styles.metaItem}>
                            <HiOutlineCalendar />
                            <span>{new Date(post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <HiOutlineUser />
                            <span>Admin</span>
                        </div>
                    </div>
                </div>

                <h1 className={styles.postTitle}>{post.title}</h1>

                <div className={styles.postBody} dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
        </div>
    );
};

export default BeritaDetail;
