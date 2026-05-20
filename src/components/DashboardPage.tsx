import { useMemo } from 'react';
import { mockDashboardData } from '../data/mockDashboardData';
import { useCurrentTime } from '../hooks/useCurrentTime';
import type { MetricStatus } from '../types/dashboard';
import { formatPercent, formatWan } from '../utils/format';
import { calculateCompletionRate } from '../utils/metrics';
import { HeaderBar } from './HeaderBar';
import { MetricsBoard } from './MetricsBoard';
import { RecognitionBoard } from './RecognitionBoard';
import { WarningBoard } from './WarningBoard';
import styles from './DashboardPage.module.css';

const metricColorMap = {
  contract: '#42d5ff',
  collection: '#2f88ff',
  outputValue: '#5eb8ff',
} as const;

const quarterLabelMap = {
  Q1: '第一季度',
  Q2: '第二季度',
  Q3: '第三季度',
  Q4: '第四季度',
} as const;

const getMetricStatus = (annualRate: number, quarterRate: number): MetricStatus => {
  const baseRate = Math.max(annualRate, quarterRate);
  if (baseRate >= 100) return '达标';
  if (baseRate >= 60) return '关注';
  return '预警';
};

const getMetricStatusReason = (
  annualRate: number,
  quarterRate: number,
  status: MetricStatus,
) => {
  const baseSource = quarterRate > annualRate ? '季度完成率' : '年度完成率';
  const baseRate = quarterRate > annualRate ? quarterRate : annualRate;

  if (status === '预警') {
    return `${baseSource} ${baseRate.toFixed(1)}%，低于 60% 阈值`;
  }

  if (status === '关注') {
    return `${baseSource} ${baseRate.toFixed(1)}%，处于 60%-100% 区间`;
  }

  return `${baseSource} ${baseRate.toFixed(1)}%，已达到或超过 100%`;
};

export const DashboardPage = () => {
  const currentTime = useCurrentTime();

  const metrics = useMemo(
    () =>
      mockDashboardData.metrics.map((metric) => {
        const annualRate = calculateCompletionRate(metric.annualActual, metric.annualTarget);
        const quarterRate = calculateCompletionRate(metric.quarterActual, metric.quarterTarget);
        const annualGap = Math.max(metric.annualTarget - metric.annualActual, 0);
        const quarterGap = Math.max(metric.quarterTarget - metric.quarterActual, 0);
        const status = getMetricStatus(annualRate, quarterRate);
        const statusReason = metric.statusReason || getMetricStatusReason(annualRate, quarterRate, status);

        return {
          ...metric,
          annualRate,
          quarterRate,
          annualGap,
          quarterGap,
          status,
          statusReason,
          color: metricColorMap[metric.key],
        };
      }),
    [],
  );

  const highRiskCount = mockDashboardData.warnings.filter((item) => item.riskLevel === '高风险').length;
  const pendingCount = mockDashboardData.warnings.filter((item) => item.status === '待处理').length;

  const currentScope = `${mockDashboardData.filters.year} 年 / ${quarterLabelMap[mockDashboardData.filters.quarter]}`;

  return (
    <main className={styles.screen}>
      <section className={styles.dashboard}>
        <HeaderBar
          title="中嘉英瑞年度绩效看板"
          scopeText={currentScope}
          currentTime={currentTime}
        />

        <MetricsBoard metrics={metrics} formatWan={formatWan} formatPercent={formatPercent} />

        <RecognitionBoard recognition={mockDashboardData.recognition} />

        <div className={styles.warningArea}>
          <WarningBoard
            warnings={mockDashboardData.warnings}
            highRiskCount={highRiskCount}
            pendingCount={pendingCount}
          />
        </div>
      </section>
    </main>
  );
};
