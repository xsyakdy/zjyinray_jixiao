import { useMemo } from 'react';
import { mockDashboardData } from '../data/mockDashboardData';
import { useCurrentTime } from '../hooks/useCurrentTime';
import type { MetricStatus, WarningItem, WarningRiskLevel } from '../types/dashboard';
import { formatPercent, formatWan } from '../utils/format';
import { calculateCompletionRate } from '../utils/metrics';
import { MetricGauge } from './MetricGauge';
import { PanelFrame } from './PanelFrame';
import { WarningStatusTag } from './WarningStatusTag';
import styles from './DashboardPage.module.css';

const rankingSections = [
  { key: 'marketingBattle', title: '营销战功榜' },
  { key: 'brandProjects', title: '品牌项目榜' },
  { key: 'pioneerList', title: '奋斗先锋榜' },
] as const;

const metricColorMap = {
  contract: '#42d5ff',
  collection: '#2f88ff',
  outputValue: '#57f3c3',
} as const;

const metricStatusLabelMap: Record<MetricStatus, string> = {
  达标: '达标',
  关注: '关注',
  预警: '预警',
};

const quarterLabelMap = {
  Q1: '第一季度',
  Q2: '第二季度',
  Q3: '第三季度',
  Q4: '第四季度',
} as const;

const riskLabelMap: Record<WarningRiskLevel, string> = {
  高风险: '高风险',
  中风险: '中风险',
  低风险: '低风险',
};

const getMetricStatus = (annualRate: number, quarterRate: number): MetricStatus => {
  const baseRate = Math.max(annualRate, quarterRate);

  if (baseRate >= 100) {
    return '达标';
  }

  if (baseRate >= 60) {
    return '关注';
  }

  return '预警';
};

const getRiskClassName = (riskLevel: WarningRiskLevel) => {
  const riskClassMap: Record<WarningRiskLevel, string> = {
    高风险: styles.riskHigh,
    中风险: styles.riskMedium,
    低风险: styles.riskLow,
  };

  return riskClassMap[riskLevel];
};

const getStatusClassName = (status: MetricStatus) => {
  const statusClassMap: Record<MetricStatus, string> = {
    达标: styles.metricStatusGood,
    关注: styles.metricStatusWatch,
    预警: styles.metricStatusAlert,
  };

  return statusClassMap[status];
};

const getWarningSummary = (warning: WarningItem) => {
  return `${riskLabelMap[warning.riskLevel]} · 责任人 ${warning.owner}`;
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
        };
      }),
    [],
  );

  const currentScope = `${mockDashboardData.filters.year} 年 / ${quarterLabelMap[mockDashboardData.filters.quarter]}`;

  return (
    <main className={styles.screen}>
      <section className={styles.dashboard}>
        <div className={styles.dashboardFrame} />
        <div className={styles.cornerLt} />
        <div className={styles.cornerRt} />
        <div className={styles.cornerLb} />
        <div className={styles.cornerRb} />

        <header className={styles.topHeader}>
          <div className={styles.headerLineLeft} />

          <div className={styles.headerCenter}>
            <span className={styles.headerLabel}>ENTERPRISE PERFORMANCE COCKPIT</span>
            <h1 className={styles.headerTitle}>中嘉英瑞年度绩效看板</h1>
            <div className={styles.headerUnderline}>
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className={styles.headerActions}>
            <button type="button" className={styles.headerActionButton}>
              修改历史
            </button>
            <button type="button" className={styles.headerActionButton}>
              恢复默认数据
            </button>
          </div>
        </header>

        <section className={styles.commandGrid}>
          <PanelFrame title="当前口径" className={styles.scopePanel}>
            <div className={styles.scopeMain}>{currentScope}</div>
            <p className={styles.scopeNote}>{mockDashboardData.filters.scopeNote}</p>
          </PanelFrame>

          <PanelFrame title="当前时间" className={styles.timePanel}>
            <div className={styles.timeValue}>{currentTime}</div>
          </PanelFrame>
        </section>

        <section className={styles.metricsGrid}>
          {metrics.map((metric) => (
            <PanelFrame key={metric.key} title={metric.name} className={styles.metricPanel}>
              <article className={styles.metricCard}>
                <div className={styles.metricHeader}>
                  <div>
                    <span className={styles.metricCaption}>战略指标 / 单位：{metric.unit}</span>
                    <strong className={styles.metricActualValue}>{formatWan(metric.annualActual)}</strong>
                    <span className={styles.metricActualLabel}>年度累计完成额</span>
                  </div>

                  <div className={styles.metricVisualWrap}>
                    <MetricGauge value={metric.annualRate} color={metricColorMap[metric.key]} />
                  </div>
                </div>

                <div className={styles.metricStatusRow}>
                  <div className={styles.metricStatusMeta}>
                    <span className={styles.metricSectionLabel}>经营状态</span>
                    <strong className={`${styles.metricStatusTag} ${getStatusClassName(metric.status)}`}>
                      {metricStatusLabelMap[metric.status]}
                    </strong>
                  </div>
                  <div className={styles.metricGapMeta}>
                    <span className={styles.metricSectionLabel}>年度目标缺口</span>
                    <strong className={styles.metricGapValue}>{formatWan(metric.annualGap)}</strong>
                  </div>
                </div>

                <div className={styles.metricProgressArea}>
                  <div className={styles.progressHeader}>
                    <span>季度完成进度</span>
                    <strong className={styles.progressValue}>{formatPercent(metric.quarterRate)}</strong>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min(metric.quarterRate, 100)}%`,
                        background: `linear-gradient(90deg, ${metricColorMap[metric.key]}33 0%, ${metricColorMap[metric.key]} 100%)`,
                        boxShadow: `0 0 18px ${metricColorMap[metric.key]}66`,
                      }}
                    />
                  </div>
                </div>

                <div className={styles.metricSections}>
                  <section className={styles.metricBlock}>
                    <div className={styles.metricBlockHeader}>
                      <span className={styles.metricBlockTitle}>年度维度</span>
                    </div>
                    <div className={styles.metricBlockGrid}>
                      <article className={styles.detailCard}>
                        <span className={styles.detailLabel}>年度目标值</span>
                        <strong className={styles.detailValue}>{formatWan(metric.annualTarget)}</strong>
                      </article>
                      <article className={styles.detailCard}>
                        <span className={styles.detailLabel}>年度完成比例</span>
                        <strong className={`${styles.detailValue} ${styles.rateValue}`}>{formatPercent(metric.annualRate)}</strong>
                      </article>
                    </div>
                  </section>

                  <section className={styles.metricBlock}>
                    <div className={styles.metricBlockHeader}>
                      <span className={styles.metricBlockTitle}>季度维度</span>
                      <strong className={styles.metricBlockGap}>缺口 {formatWan(metric.quarterGap)}</strong>
                    </div>
                    <div className={styles.metricBlockGrid}>
                      <article className={styles.detailCard}>
                        <span className={styles.detailLabel}>当季度目标值</span>
                        <strong className={styles.detailValue}>{formatWan(metric.quarterTarget)}</strong>
                      </article>
                      <article className={styles.detailCard}>
                        <span className={styles.detailLabel}>当季度完成额</span>
                        <strong className={styles.detailValue}>{formatWan(metric.quarterActual)}</strong>
                      </article>
                      <article className={styles.detailCard}>
                        <span className={styles.detailLabel}>当季度完成比例</span>
                        <strong className={`${styles.detailValue} ${styles.rateValue}`}>{formatPercent(metric.quarterRate)}</strong>
                      </article>
                    </div>
                  </section>
                </div>
              </article>
            </PanelFrame>
          ))}
        </section>

        <section className={styles.recognitionGrid}>
          {rankingSections.map((section) => (
            <PanelFrame key={section.key} title={section.title} className={styles.recognitionPanel}>
              <div className={styles.rankingList}>
                {mockDashboardData.recognition[section.key].map((item) => (
                  <article key={`${section.key}-${item.rank}`} className={styles.rankingItem}>
                    <div className={`${styles.rankingMedal} ${styles[`medal${item.rank}` as const]}`}>{item.rank}</div>
                    <div className={styles.avatarFrame}>
                      <span className={styles.avatarText}>{item.avatarText}</span>
                    </div>
                    <div className={styles.rankingMain}>
                      <strong className={styles.rankingName}>{item.name}</strong>
                      <p className={styles.rankingMeta}>{item.label}</p>
                    </div>
                    <div className={styles.scoreBlock}>
                      <span className={styles.scoreLabel}>荣誉指数</span>
                      <strong className={styles.rankingScore}>{item.score}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </PanelFrame>
          ))}
        </section>

        <section className={styles.warningSection}>
          <PanelFrame title="风险督办" className={styles.warningPanel}>
            <div className={styles.warningTableWrap}>
              <div className={styles.warningTableHeader}>
                <span>预警标题</span>
                <span>项目名称</span>
                <span>问题描述</span>
                <span>责任人</span>
                <span>当前状态</span>
                <span>待督办</span>
              </div>

              <div className={styles.warningList}>
                {mockDashboardData.warnings.map((warning) => (
                  <article key={warning.id} className={styles.warningRow}>
                    <div className={styles.warningTitleBlock}>
                      <span className={`${styles.warningRiskTag} ${getRiskClassName(warning.riskLevel)}`}>
                        {riskLabelMap[warning.riskLevel]}
                      </span>
                      <strong className={styles.warningTitle}>{warning.title}</strong>
                      <span className={styles.warningSubMeta}>{getWarningSummary(warning)}</span>
                    </div>
                    <div className={styles.warningCell}>{warning.projectName}</div>
                    <div className={`${styles.warningCell} ${styles.warningDescription}`}>{warning.issueDesc}</div>
                    <div className={styles.warningOwner}>{warning.owner}</div>
                    <div className={styles.warningStatusCell}>
                      <WarningStatusTag status={warning.status} />
                    </div>
                    <div className={styles.warningTodo}>{warning.todo}</div>
                  </article>
                ))}
              </div>
            </div>
          </PanelFrame>
        </section>
      </section>
    </main>
  );
};
