import type { WarningItem } from '../types/dashboard';
import { WarningStatusTag } from './WarningStatusTag';
import styles from './WarningBoard.module.css';

interface WarningBoardProps {
  warnings: WarningItem[];
}

const riskClassMap = {
  高风险: 'high',
  中风险: 'medium',
  低风险: 'low',
} as const;

export const WarningBoard = ({ warnings }: WarningBoardProps) => {
  return (
    <section className={styles.board}>
      <header className={styles.header}>
        <h2 className={styles.title}>风险督办</h2>
        <p className={styles.subtitle}>当前页展示风险等级、责任人、处理状态与下一步督办动作</p>
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
