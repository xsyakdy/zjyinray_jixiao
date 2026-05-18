import styles from './SummaryBar.module.css';

interface SummaryItem {
  label: string;
  value: number;
  tone: 'good' | 'watch' | 'alert' | 'info';
}

interface SummaryBarProps {
  items: SummaryItem[];
}

export const SummaryBar = ({ items }: SummaryBarProps) => {
  return (
    <section className={styles.summaryBar}>
      {items.map((item) => (
        <article key={item.label} className={styles.summaryItem}>
          <span className={styles.summaryLabel}>{item.label}</span>
          <strong className={`${styles.summaryValue} ${styles[item.tone]}`}>{item.value}</strong>
        </article>
      ))}
    </section>
  );
};
