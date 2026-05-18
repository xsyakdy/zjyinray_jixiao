import type { RecognitionBoardData } from '../types/dashboard';
import styles from './RecognitionBoard.module.css';

interface RecognitionBoardProps {
  recognition: RecognitionBoardData;
}

const sections = [
  { key: 'marketingBattle', title: '营销战功榜' },
  { key: 'brandProjects', title: '品牌项目榜' },
  { key: 'pioneerList', title: '奋斗先锋榜' },
] as const;

export const RecognitionBoard = ({ recognition }: RecognitionBoardProps) => {
  return (
    <section className={styles.board}>
      {sections.map((section) => {
        const [first, ...rest] = recognition[section.key];

        return (
          <article key={section.key} className={styles.panel}>
            <header className={styles.panelHeader}>
              <h2 className={styles.title}>{section.title}</h2>
            </header>

            <div className={styles.firstCard}>
              <div className={styles.rankBadge}>1</div>
              <div className={styles.avatar}>{first.avatarText}</div>
              <div className={styles.firstMain}>
                <strong>{first.name}</strong>
                <span>{first.label}</span>
              </div>
              <div className={styles.score}>{first.score}</div>
            </div>

            <div className={styles.compactList}>
              {rest.map((item) => (
                <div key={item.rank} className={styles.compactRow}>
                  <div className={styles.compactLeft}>
                    <span className={styles.compactRank}>{item.rank}</span>
                    <span className={styles.compactAvatar}>{item.avatarText}</span>
                    <div className={styles.compactMain}>
                      <strong>{item.name}</strong>
                      <span>{item.label}</span>
                    </div>
                  </div>
                  <strong className={styles.compactScore}>{item.score}</strong>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
};
