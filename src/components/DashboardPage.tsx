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

const getMetricStatus = (rate: number): MetricStatus => {
  if (rate >= 100) return '正常';
  if (rate >= 80) return '滞后';
  if (rate >= 50) return '严重滞后';
  return '危急';
};

const getMetricStatusReason = (
  annualRate: number,
  quarterRate: number,
  status: MetricStatus,
) => {
  const baseSource = quarterRate > annualRate ? '季度完成率' : '年度完成率';
  const baseRate = quarterRate > annualRate ? quarterRate : annualRate;

  if (status === '危急') {
    return `${baseSource} ${baseRate.toFixed(1)}%，低于 50% 阈值`;
  }

  if (status === '严重滞后') {
    return `${baseSource} ${baseRate.toFixed(1)}%，处于 50%-80% 区间`;
  }

  if (status === '滞后') {
    return `${baseSource} ${baseRate.toFixed(1)}%，处于 80%-100% 区间`;
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
        const annualStatus = getMetricStatus(annualRate);
        const quarterStatus = getMetricStatus(quarterRate);
        const status: MetricStatus = annualStatus === '危急' || quarterStatus === '危急' ? '危急' :
          annualStatus === '严重滞后' || quarterStatus === '严重滞后' ? '严重滞后' :
            annualStatus === '滞后' || quarterStatus === '滞后' ? '滞后' : '正常';
        const statusReason = metric.statusReason || getMetricStatusReason(annualRate, quarterRate, status);

        return {
          ...metric,
          annualRate,
          quarterRate,
          annualGap,
          quarterGap,
          annualStatus,
          quarterStatus,
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
