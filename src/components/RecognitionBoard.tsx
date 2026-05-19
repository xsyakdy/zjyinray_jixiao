import { useEffect, useRef, useReducer } from 'react';
import type {
  BrandProjectItem,
  MarketingBattleItem,
  PioneerItem,
  RecognitionBoardData,
} from '../types/dashboard';
import styles from './RecognitionBoard.module.css';

interface PioneerState {
  index: number;
  autoplayPaused: boolean;
}

type PioneerAction =
  | { type: 'NEXT' }
  | { type: 'PREV' }
  | { type: 'GOTO'; index: number }
  | { type: 'PAUSE_AUTOPLAY' };

function pioneerReducer(state: PioneerState, action: PioneerAction, total: number): PioneerState {
  switch (action.type) {
    case 'NEXT':
      return { ...state, index: (state.index + 1) % total, autoplayPaused: true };
    case 'PREV':
      return { ...state, index: (state.index - 1 + total) % total, autoplayPaused: true };
    case 'GOTO':
      return { ...state, index: action.index, autoplayPaused: true };
    case 'PAUSE_AUTOPLAY':
      return { ...state, autoplayPaused: true };
    default:
      return state;
  }
}

interface RecognitionBoardProps {
  recognition: RecognitionBoardData;
}

const formatAmount = (value: number) => `${value.toFixed(2)} 万元`;

const renderMarketingBattle = (items: MarketingBattleItem[]) => {
  const [first, ...rest] = items;

  return (
    <>
      <div className={styles.firstCard}>
        <span className={styles.rankBadge}>1</span>
        <div className={styles.mainInfo}>
          <strong>{first.name}</strong>
          <span>{first.department}</span>
        </div>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span>回款额</span>
            <strong>{formatAmount(first.collectionAmount)}</strong>
          </div>
          <div className={styles.metric}>
            <span>合同额</span>
            <strong>{formatAmount(first.contractAmount)}</strong>
          </div>
        </div>
      </div>

      <div className={styles.compactList}>
        {rest.map((item) => (
          <div key={item.rank} className={styles.card}>
            <span className={styles.rankBadge}>{item.rank}</span>
            <div className={styles.mainInfo}>
              <strong>{item.name}</strong>
              <span>{item.department}</span>
            </div>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span>回款额</span>
                <strong>{formatAmount(item.collectionAmount)}</strong>
              </div>
              <div className={styles.metric}>
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
      <div className={styles.cardBrand}>
        <span className={styles.rankBadge}>1</span>
        <span className={styles.projectMark}>P</span>
        <div className={styles.mainInfo}>
          <strong>{first.projectName}</strong>
          <span>{first.reason}</span>
        </div>
        <div className={styles.metric}>
          <span>产值</span>
          <strong>{formatAmount(first.outputValue)}</strong>
        </div>
      </div>

      <div className={styles.compactList}>
        {rest.map((item) => (
          <div key={item.rank} className={styles.cardBrand}>
            <span className={styles.rankBadge}>{item.rank}</span>
            <span className={styles.projectMarkSmall}>P</span>
            <div className={styles.mainInfo}>
              <strong>{item.projectName}</strong>
              <span>{item.reason}</span>
            </div>
            <div className={styles.metric}>
              <span>产值</span>
              <strong>{formatAmount(item.outputValue)}</strong>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const renderPioneerListFull = (
  items: PioneerItem[],
  activeIndex: number,
  onNext: () => void,
  onDotClick: (index: number) => void,
  onMouseEnter: () => void,
  onMouseLeave: () => void
) => {
  const item = items[activeIndex];

  return (
    <div
      className={styles.pioneerCarousel}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.pioneerCard}>
        <div className={styles.pioneerLeft}>
          <div className={styles.pioneerAvatar}>
            {item.avatar ? (
              <img src={item.avatar} alt={item.name} className={styles.pioneerAvatarImg} />
            ) : (
              item.name.slice(0, 1)
            )}
          </div>
          <div className={styles.pioneerHeader}>
            <h3 className={styles.pioneerName}>{item.name}</h3>
            <span className={styles.pioneerDept}>{item.department}</span>
          </div>
        </div>
        <div className={styles.pioneerRight}>
          <div className={styles.pioneerRank}>
            <span className={styles.pioneerRankBadge}>{item.rank}</span>
            <span className={styles.pioneerRankLabel}>排名</span>
          </div>
          <div className={styles.pioneerStory}>
            <span className={styles.pioneerStoryLabel}>奋斗事迹</span>
            <p className={styles.pioneerStoryText}>{item.achievement}</p>
          </div>
        </div>
      </div>
      <div className={styles.dots}>
        {items.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === activeIndex ? styles.dotActive : ''}`}
            onClick={() => onDotClick(idx)}
            aria-label={`第 ${idx + 1} 位`}
          />
        ))}
      </div>
    </div>
  );
};

export const RecognitionBoard = ({ recognition }: RecognitionBoardProps) => {
  const pioneerList = recognition.pioneerList;
  const totalLength = pioneerList.length;

  const [state, dispatch] = useReducer(
    (s: PioneerState, action: PioneerAction) => pioneerReducer(s, action, totalLength),
    { index: 0, autoplayPaused: false }
  );

  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (state.autoplayPaused) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    } else {
      autoplayRef.current = setInterval(() => {
        dispatch({ type: 'NEXT' });
      }, 5000);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [state.autoplayPaused]);

  return (
    <section className={styles.board}>
      <article className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 className={styles.title}>营销战功榜</h2>
        </header>
        <div className={styles.content}>
          {renderMarketingBattle(recognition.marketingBattle)}
        </div>
      </article>

      <article className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 className={styles.title}>品牌项目榜</h2>
        </header>
        <div className={styles.content}>
          {renderBrandProjects(recognition.brandProjects)}
        </div>
      </article>

      <article className={styles.panel}>
        <header className={styles.panelHeader}>
          <h2 className={styles.title}>奋斗先锋榜</h2>
        </header>
        <div className={styles.content}>
          {renderPioneerListFull(
            pioneerList,
            state.index,
            () => dispatch({ type: 'NEXT' }),
            (idx) => dispatch({ type: 'GOTO', index: idx }),
            () => dispatch({ type: 'PAUSE_AUTOPLAY' }),
            () => dispatch({ type: 'NEXT' })
          )}
        </div>
      </article>
    </section>
  );
};
