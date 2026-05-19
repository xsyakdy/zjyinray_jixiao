import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PioneerItem } from '../types/dashboard';
import styles from './RankPersonModal.module.css';

interface RankPersonModalProps {
  items: PioneerItem[];
  initialIndex: number;
  onClose: () => void;
}

// 文字逐字动画的单个单词组件
const AnimatedWord = ({ word, delay }: { word: string; delay: number }) => {
  return (
    <motion.span
      initial={{
        filter: 'blur(8px)',
        opacity: 0,
        y: 4,
      }}
      animate={{
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
        delay: delay,
      }}
    >
      {word}&nbsp;
    </motion.span>
  );
};

// 带动画的文字组件
const AnimatedText = ({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) => {
  const words = text.split(' ');
  return (
    <p className={styles.description}>
      {words.map((word, i) => (
        <AnimatedWord key={i} word={word} delay={baseDelay + i * 0.02} />
      ))}
    </p>
  );
};

export const RankPersonModal = ({ items, initialIndex, onClose }: RankPersonModalProps) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const itemsLength = useMemo(() => items.length, [items]);
  const activeItem = useMemo(() => items[activeIndex], [activeIndex, items]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % itemsLength);
  }, [itemsLength]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + itemsLength) % itemsLength);
  }, [itemsLength]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev, onClose]);

  const infoVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="关闭">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className={styles.contentWrapper}>
          {/* 左侧头像卡片 */}
          <div className={styles.avatarSection}>
            <div className={styles.imageContainer}>
              <div className={styles.avatarCard}>
                <div className={styles.avatarCardInner}>
                  {activeItem.avatar ? (
                    <img 
                      src={activeItem.avatar} 
                      alt={activeItem.name} 
                      className={styles.avatarImage}
                    />
                  ) : (
                    <span className={styles.initial}>{activeItem.name.slice(0, 1)}</span>
                  )}
                </div>
                <div className={styles.rankBadge}>
                  <span className={styles.rankHash}>#</span>
                  <span className={styles.rankNumber}>{activeItem.rank}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧信息区域 */}
          <div className={styles.infoSection}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className={styles.infoWrapper}
                variants={infoVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <motion.h2
                  className={styles.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.05 }}
                >
                  {activeItem.name}
                </motion.h2>

                <motion.p
                  className={styles.department}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
                >
                  {activeItem.department}
                </motion.p>

                <motion.div
                  className={styles.rankTag}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                >
                  <span className={styles.tagNumber}>{activeItem.rank}</span>
                  <span className={styles.tagDivider}></span>
                  <span className={styles.tagText}>奋斗先锋</span>
                </motion.div>

                <motion.div
                  className={styles.divider}
                  initial={{ width: 0 }}
                  animate={{ width: 50 }}
                  transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
                />

                <div className={styles.descriptionSection}>
                  <motion.p
                    className={styles.sectionLabel}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: 0.25 }}
                  >
                    奋斗事迹
                  </motion.p>
                  <AnimatedText
                    text={activeItem.achievement}
                    baseDelay={0.3}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 底部导航 */}
        <div className={styles.footer}>
          <div className={styles.arrowButtons}>
            <button
              className={styles.arrowButton}
              onClick={handlePrev}
              aria-label="上一个"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              className={styles.arrowButton}
              onClick={handleNext}
              aria-label="下一个"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className={styles.dots}>
            {items.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`跳转到第 ${index + 1} 个`}
              />
            ))}
          </div>

          <div className={styles.counter}>
            {activeIndex + 1} / {itemsLength}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RankPersonModal;
