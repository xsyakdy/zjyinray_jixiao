import { MetricGauge } from './MetricGauge';
import styles from './MetricsBoard.module.css';

interface MetricCardViewModel {
  key: string;
  name: string;
  unit: string;
  annualActual: number;
  annualTarget: number;
  annualRate: number;
  annualGap: number;
  quarterTarget: number;
  quarterActual: number;
  quarterRate: number;
  quarterGap: number;
  status: '达标' | '关注' | '预警';
  color: string;
}

interface MetricsBoardProps {
  metrics: MetricCardViewModel[];
  formatWan: (value: number) => string;
  formatPercent: (value: number) => string;
}

const statusClassMap = {
  达标: 'good',
  关注: 'watch',
  预警: 'alert',
} as const;

export const MetricsBoard = ({ metrics, formatWan, formatPercent }: MetricsBoardProps) => {
  return (
    <section className={styles.board}>
      {metrics.map((metric) => (
        <article key={metric.key} className={styles.card}>
          <div className={styles.cardTop}>
            <div>
              <span className={styles.cardName}>{metric.name}</span>
              <strong className={styles.mainValue}>{formatWan(metric.annualActual)}</strong>
              <span className={styles.mainLabel}>年度累计完成额</span>
            </div>
            <strong className={`${styles.statusTag} ${styles[statusClassMap[metric.status]]}`}>
              {metric.status}
            </strong>
          </div>

          <div className={styles.heroRow}>
            <div className={styles.gaugeWrap}>
              <MetricGauge value={metric.annualRate} color={metric.color} />
            </div>

            <div className={styles.metricsColumns}>
              <section className={styles.metricsBlock}>
                <span className={styles.blockTitle}>年度组</span>
                <div className={styles.metricsList}>
                  <div className={styles.metricItem}>
                    <span>年度目标</span>
                    <strong>{formatWan(metric.annualTarget)}</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span>年度完成率</span>
                    <strong>{formatPercent(metric.annualRate)}</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span>年度缺口</span>
                    <strong>{formatWan(metric.annualGap)}</strong>
                  </div>
                </div>
              </section>

              <section className={styles.metricsBlock}>
                <span className={styles.blockTitle}>季度组</span>
                <div className={styles.metricsList}>
                  <div className={styles.metricItem}>
                    <span>季度目标</span>
                    <strong>{formatWan(metric.quarterTarget)}</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span>季度完成额</span>
                    <strong>{formatWan(metric.quarterActual)}</strong>
                  </div>
                  <div className={styles.metricItem}>
                    <span>季度缺口</span>
                    <strong>{formatWan(metric.quarterGap)}</strong>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressHead}>
              <span>季度进度</span>
              <strong>{formatPercent(metric.quarterRate)}</strong>
            </div>
            <div className={styles.track}>
              <div className={styles.fill} style={{ width: `${Math.min(metric.quarterRate, 100)}%`, background: metric.color }} />
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};
