import type { WarningItem } from '../types/dashboard';
import { WarningStatusTag } from './WarningStatusTag';
import styles from './WarningBoard.module.css';

interface WarningBoardProps {
  warnings: WarningItem[];
  highRiskCount: number;
  pendingCount: number;
}

const riskClassMap = {
  高风险: 'high',
  中风险: 'medium',
  低风险: 'low',
} as const;

export const WarningBoard = ({ warnings, highRiskCount, pendingCount }: WarningBoardProps) => {
  return (
    <section className={styles.board}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>风险督办</h2>
          <div className={styles.counts}>
            <div className={`${styles.countBadge} ${styles.highRiskBadge}`}>
              <span className={styles.countDot} />
              <span className={styles.countLabel}>高风险</span>
              <span className={styles.countValue}>{highRiskCount}</span>
            </div>
            <div className={`${styles.countBadge} ${styles.pendingBadge}`}>
              <span className={styles.countDot} />
              <span className={styles.countLabel}>待处理</span>
              <span className={styles.countValue}>{pendingCount}</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.columns}>
        <span>预警标题</span>
        <span>项目名称</span>
        <span>问题描述</span>
        <span>责任人</span>
        <span>当前状态</span>
        <span>待督办</span>
      </div>

      <div className={styles.list}>
        {warnings.map((warning) => (
          <article key={warning.id} className={styles.row}>
            <div className={styles.titleCell}>
              <span className={`${styles.riskTag} ${styles[riskClassMap[warning.riskLevel]]}`}>{warning.riskLevel}</span>
              <strong className={styles.warningTitle}>{warning.title}</strong>
            </div>
            <div className={styles.projectCell}>{warning.projectName}</div>
            <div className={styles.descCell}>{warning.issueDesc}</div>
            <div className={styles.ownerCell}>{warning.owner}</div>
            <div className={styles.statusCell}>
              <WarningStatusTag status={warning.status} />
            </div>
            <div className={styles.todoCell}>{warning.todo}</div>
          </article>
        ))}
      </div>
    </section>
  );
};
