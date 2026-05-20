import { useEffect, useState, useMemo, useCallback } from 'react';
import type { MouseEvent } from 'react';
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
    <span
      style={{
        filter: 'blur(0px)',
        opacity: 1,
        transform: 'translateY(0)',
        animationDelay: `${delay}s`,
      }}
    >
      {word}&nbsp;
    </span>
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
      <div
        className={styles.modal}
        onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
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
            <div
              key={activeIndex}
              className={styles.infoWrapper}
              style={{ opacity: infoVariants.animate.opacity, transform: `translateX(${infoVariants.animate.x}px)` }}
            >
                <h2 className={styles.name}>
                  {activeItem.name}
                </h2>

                <p className={styles.department}>
                  {activeItem.department}
                </p>

                <div className={styles.rankTag}>
                  <span className={styles.tagNumber}>{activeItem.rank}</span>
                  <span className={styles.tagDivider}></span>
                  <span className={styles.tagText}>奋斗先锋</span>
                </div>

                <div className={styles.divider} />

                <div className={styles.descriptionSection}>
                  <p className={styles.sectionLabel}>
                    奋斗事迹
                  </p>
                  <AnimatedText
                    text={activeItem.achievement}
                    baseDelay={0.3}
                  />
                </div>
            </div>
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
      </div>
    </div>
  );
};

export default RankPersonModal;
