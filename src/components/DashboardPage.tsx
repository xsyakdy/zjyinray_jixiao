import { useMemo } from 'react';
import { mockDashboardData } from '../data/mockDashboardData';
import { useCurrentTime } from '../hooks/useCurrentTime';
import type { MetricStatus } from '../types/dashboard';
import { formatPercent, formatWan } from '../utils/format';
import { calculateCompletionRate } from '../utils/metrics';
import { HeaderBar } from './HeaderBar';
import { MetricsBoard } from './MetricsBoard';
import { RecognitionBoard } from './RecognitionBoard';
import { SummaryBar } from './SummaryBar';
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

        return {
          ...metric,
          annualRate,
          quarterRate,
          annualGap,
          quarterGap,
          status,
          color: metricColorMap[metric.key],
        };
      }),
    [],
  );

  const summaryItems = useMemo(() => {
    const warningCount = metrics.filter((item) => item.status === '预警').length;
    const watchCount = metrics.filter((item) => item.status === '关注').length;
    const goodCount = metrics.filter((item) => item.status === '达标').length;
    const highRiskCount = mockDashboardData.warnings.filter((item) => item.riskLevel === '高风险').length;
    const pendingCount = mockDashboardData.warnings.filter((item) => item.status === '待处理').length;

    return [
      { label: '达标指标数量', value: goodCount, tone: 'good' as const },
      { label: '关注指标数量', value: watchCount, tone: 'watch' as const },
      { label: '预警指标数量', value: warningCount, tone: 'alert' as const },
      { label: '高风险数量', value: highRiskCount, tone: 'alert' as const },
      { label: '待处理风险数量', value: pendingCount, tone: 'info' as const },
    ];
  }, [metrics]);

  const currentScope = `${mockDashboardData.filters.year} 年 / ${quarterLabelMap[mockDashboardData.filters.quarter]}`;

  return (
    <main className={styles.screen}>
      <section className={styles.dashboard}>
        <HeaderBar
          title="中嘉英瑞年度绩效看板"
          scopeText={currentScope}
          currentTime={currentTime}
        />

        <SummaryBar items={summaryItems} />

        <MetricsBoard metrics={metrics} formatWan={formatWan} formatPercent={formatPercent} />

        <RecognitionBoard recognition={mockDashboardData.recognition} />

        <div className={styles.warningArea}>
          <WarningBoard warnings={mockDashboardData.warnings} />
        </div>
      </section>
    </main>
  );
};
