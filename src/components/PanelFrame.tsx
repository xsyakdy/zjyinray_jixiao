import type { ReactNode } from 'react';
import styles from './PanelFrame.module.css';

interface PanelFrameProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export const PanelFrame = ({ title, children, className }: PanelFrameProps) => {
  return (
    <section className={[styles.panel, className].filter(Boolean).join(' ')}>
      <header className={styles.header}>
        <span className={styles.title}>{title}</span>
        <span className={styles.headerGlow} />
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
};
