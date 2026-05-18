import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import styles from './MetricGauge.module.css';

interface MetricGaugeProps {
  value: number;
  color: string;
}

export const MetricGauge = ({ value, color }: MetricGaugeProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const chart = echarts.init(containerRef.current);
    const safeValue = Math.min(Math.max(value, 0), 100);

    chart.setOption({
      animation: false,
      series: [
        {
          type: 'pie',
          radius: ['68%', '88%'],
          center: ['50%', '50%'],
          silent: true,
          startAngle: 90,
          label: { show: false },
          data: [
            {
              value: safeValue,
              itemStyle: {
                color,
                shadowBlur: 18,
                shadowColor: color,
              },
            },
            {
              value: 100 - safeValue,
              itemStyle: {
                color: 'rgba(94, 151, 196, 0.14)',
              },
            },
          ],
        },
        {
          type: 'pie',
          radius: ['58%', '60%'],
          center: ['50%', '50%'],
          silent: true,
          startAngle: 90,
          label: { show: false },
          data: [
            {
              value: 100,
              itemStyle: {
                color: 'rgba(117, 231, 255, 0.08)',
              },
            },
          ],
        },
      ],
    });

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [color, value]);

  return (
    <div className={styles.gaugeShell}>
      <div ref={containerRef} className={styles.gaugeChart} />
      <div className={styles.gaugeText}>
        <span className={styles.gaugeLabel}>完成比例</span>
        <strong className={styles.gaugeValue}>{value.toFixed(2)}%</strong>
      </div>
    </div>
  );
};
