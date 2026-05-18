import type { WarningStatus } from '../types/dashboard';
import styles from './WarningStatusTag.module.css';

interface WarningStatusTagProps {
  status: WarningStatus;
}

const statusClassMap = {
  待处理: styles.pending,
  处理中: styles.processing,
  待确认: styles.confirming,
  已处理: styles.done,
} as const;

export const WarningStatusTag = ({ status }: WarningStatusTagProps) => {
  return <span className={`${styles.tag} ${statusClassMap[status]}`}>{status}</span>;
};
