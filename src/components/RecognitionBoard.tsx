import type {
  BrandProjectItem,
  MarketingBattleItem,
  PioneerItem,
  RecognitionBoardData,
} from '../types/dashboard';
import styles from './RecognitionBoard.module.css';

interface RecognitionBoardProps {
  recognition: RecognitionBoardData;
}

const formatAmount = (value: number) => `${value.toFixed(2)} 万元`;

const renderMarketingBattle = (items: MarketingBattleItem[]) => {
  const [first, ...rest] = items;

  return (
    <>
      <div className={styles.firstCard}>
        <div className={styles.rankBadge}>1</div>
        <div className={styles.firstMain}>
          <strong>{first.name}</strong>
          <span>{first.department}</span>
        </div>
        <div className={styles.metricStack}>
          <span>回款额</span>
          <strong>{formatAmount(first.collectionAmount)}</strong>
        </div>
        <div className={styles.metricStack}>
          <span>合同额</span>
          <strong>{formatAmount(first.contractAmount)}</strong>
        </div>
      </div>

      <div className={styles.compactList}>
        {rest.map((item) => (
          <div key={item.rank} className={styles.compactRow}>
            <div className={styles.compactLeftPlain}>
              <span className={styles.compactRank}>{item.rank}</span>
              <div className={styles.compactMain}>
                <strong>{item.name}</strong>
                <span>{item.department}</span>
              </div>
            </div>
            <div className={styles.compactMetrics}>
              <div className={styles.compactMetric}>
                <span>回款额</span>
                <strong>{formatAmount(item.collectionAmount)}</strong>
              </div>
              <div className={styles.compactMetric}>
                <span>合同额</span>
                <strong>{formatAmount(item.contractAmount)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const renderBrandProjects = (items: BrandProjectItem[]) => {
  const [first, ...rest] = items;

  return (
    <>
      <div className={styles.firstCard}>
        <div className={styles.rankBadge}>1</div>
        <div className={styles.projectMark}>P</div>
        <div className={styles.firstMain}>
          <strong>{first.projectName}</strong>
          <span>{first.reason}</span>
        </div>
        <div className={styles.metricStack}>
          <span>产值</span>
          <strong>{formatAmount(first.outputValue)}</strong>
        </div>
      </div>

      <div className={styles.compactList}>
        {rest.map((item) => (
          <div key={item.rank} className={styles.compactRow}>
            <div className={styles.compactLeftRich}>
              <span className={styles.compactRank}>{item.rank}</span>
              <span className={styles.projectMarkSmall}>P</span>
              <div className={styles.compactMain}>
                <strong>{item.projectName}</strong>
                <span>{item.reason}</span>
              </div>
            </div>
            <div className={styles.compactMetricSingle}>
              <span>产值</span>
              <strong>{formatAmount(item.outputValue)}</strong>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const renderPioneerList = (items: PioneerItem[]) => {
  const [first, ...rest] = items;

  return (
    <>
      <div className={styles.firstCard}>
        <div className={styles.rankBadge}>1</div>
        <div className={styles.avatar}>{first.name.slice(0, 1)}</div>
        <div className={styles.firstMain}>
          <strong>{first.name}</strong>
          <span>{first.department}</span>
        </div>
        <p className={styles.story}>{first.achievement}</p>
      </div>

      <div className={styles.compactList}>
        {rest.map((item) => (
          <div key={item.rank} className={styles.compactRow}>
            <div className={styles.compactLeftRich}>
              <span className={styles.compactRank}>{item.rank}</span>
              <span className={styles.compactAvatar}>{item.name.slice(0, 1)}</span>
              <div className={styles.compactMain}>
                <strong>{item.name}</strong>
                <span>{item.department}</span>
              </div>
            </div>
            <p className={styles.compactStory}>{item.achievement}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export const RecognitionBoard = ({ recognition }: RecognitionBoardProps) => {
  return (
    <section className={styles.board}>
      <article className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 className={styles.title}>营销战功榜</h2>
        </header>
        {renderMarketingBattle(recognition.marketingBattle)}
      </article>

      <article className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 className={styles.title}>品牌项目榜</h2>
        </header>
        {renderBrandProjects(recognition.brandProjects)}
      </article>

      <article className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 className={styles.title}>奋斗先锋榜</h2>
        </header>
        {renderPioneerList(recognition.pioneerList)}
      </article>
    </section>
  );
};
