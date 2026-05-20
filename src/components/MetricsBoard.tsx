import { useState } from 'react';
import { MetricGauge } from './MetricGauge';
import styles from './MetricsBoard.module.css';

type MetricStatus = '正常' | '滞后' | '严重滞后' | '危急';

interface MetricCardViewModel {
  key: string;
  name: string;
  unit: string;
  annualActual: number;
  annualTarget: number;
  annualRate: number;
  annualGap: number;
  annualStatus: MetricStatus;
  quarterTarget: number;
  quarterActual: number;
  quarterRate: number;
  quarterGap: number;
  quarterStatus: MetricStatus;
  status: MetricStatus;
  statusReason?: string;
  color: string;
}

interface MetricsBoardProps {
  metrics: MetricCardViewModel[];
  formatWan: (value: number) => string;
  formatPercent: (value: number) => string;
}

const statusClassMap = {
  正常: 'good',
  滞后: 'watch',
  严重滞后: 'alert',
  危急: 'alert',
} as const;

const statusTitleMap = {
  正常: '正常：完成率 ≥ 100%',
  滞后: '滞后：完成率 [80%, 100%)',
  严重滞后: '严重滞后：完成率 [50%, 80%)',
  危急: '危急：完成率 < 50%',
} as const;

export const MetricsBoard = ({ metrics, formatWan, formatPercent }: MetricsBoardProps) => {
  const [tooltipId, setTooltipId] = useState<string | null>(null);

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
          </div>

          <div className={styles.heroRow}>
            <div className={styles.gaugeWrap}>
              <MetricGauge value={metric.annualRate} color={metric.color} />
            </div>

            <div className={styles.metricsColumns}>
              <section className={styles.metricsBlock}>
                <div className={styles.blockTitleRow}>
                  <span className={styles.blockTitle}>年度组</span>
                  <span className={styles.blockStatusTag}>
                    <strong className={`${styles.statusTag} ${styles[statusClassMap[metric.annualStatus]]}`}>
                      {metric.annualStatus}
                    </strong>
                    <span
                      className={styles.statusHelp}
                      onMouseEnter={() => setTooltipId(`${metric.key}-annual`)}
                      onMouseLeave={() => setTooltipId(null)}
                    >
                      ?
                      {tooltipId === `${metric.key}-annual` && (
                        <span className={styles.tooltip}>
                          {`年度完成率 ${metric.annualRate.toFixed(1)}%，${statusTitleMap[metric.annualStatus].replace('完成率 ', '')}`}
                        </span>
                      )}
                    </span>
                  </span>
                </div>
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
                <div className={styles.blockTitleRow}>
                  <span className={styles.blockTitle}>季度组</span>
                  <span className={styles.blockStatusTag}>
                    <strong className={`${styles.statusTag} ${styles[statusClassMap[metric.quarterStatus]]}`}>
                      {metric.quarterStatus}
                    </strong>
                    <span
                      className={styles.statusHelp}
                      onMouseEnter={() => setTooltipId(`${metric.key}-quarter`)}
                      onMouseLeave={() => setTooltipId(null)}
                    >
                      ?
                      {tooltipId === `${metric.key}-quarter` && (
                        <span className={styles.tooltip}>
                          {`季度完成率 ${metric.quarterRate.toFixed(1)}%，${statusTitleMap[metric.quarterStatus].replace('完成率 ', '')}`}
                        </span>
                      )}
                    </span>
                  </span>
                </div>
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
                    <span>季度完成率</span>
                    <strong>{formatPercent(metric.quarterRate)}</strong>
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
