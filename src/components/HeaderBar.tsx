import styles from './HeaderBar.module.css';

interface HeaderBarProps {
  title: string;
  scopeText: string;
  currentTime: string;
  onHistoryClick?: () => void;
  onResetClick?: () => void;
}

export const HeaderBar = ({
  title,
  scopeText,
  currentTime,
  onHistoryClick,
  onResetClick,
}: HeaderBarProps) => {
  return (
    <header className={styles.headerBar}>
      <div className={styles.titleBlock}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.metaBar}>
        <strong className={styles.metaValue}>{scopeText}</strong>
        <div className={styles.metaDivider} />
        <strong className={styles.metaValue}>{currentTime}</strong>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.actionButton} onClick={onHistoryClick}>
          修改历史
        </button>
        <button type="button" className={styles.actionButton} onClick={onResetClick}>
          恢复默认数据
        </button>
      </div>
    </header>
  );
};
