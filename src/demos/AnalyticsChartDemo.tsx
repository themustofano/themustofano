import { DemoCanvas } from './shared';

// Exact Figma heights within the fixed 411 × 318 plot.
const bars = [[234, 190], [281, 229], [310, 271], [163, 143], [295, 280], [264, 258], [204, 204]];

export function AnalyticsChartDemo() {
  return <DemoCanvas label="Analytics chart for previous week">
    <div className="analytics-panel">
      <div className="analytics-date-control"><span>Today</span><span className="is-selected">Previous week</span><span>Previous month</span></div>
      <div className="analytics-chart-area">
        <div className="analytics-y-axis">{[48, 40, 32, 24, 16, 8, 0].map((value, index) => <span key={value} style={{ top: index * 53 }}>{value}</span>)}</div>
        <div className="analytics-plot">
          {[0, 1, 2, 3, 4, 5, 6].map(index => <img className="analytics-grid-line" key={index} src="/assets/analytics/grid-line.svg" alt="" style={{ top: index * 53 - 1 }} />)}
          {bars.map(([height, green], index) => <div className={`analytics-slot${index === 5 ? ' is-highlighted' : ''}`} key={index} style={{ left: index * 411 / 7 }}><div className="analytics-bar" style={{ height }}><div className="analytics-green" style={{ height: green }} /></div></div>)}
        </div>
        <div className="analytics-x-axis"><span>29 Jun</span><span>01 Jul</span><span>5</span></div>
      </div>
      <div className="analytics-tooltip"><div className="analytics-tooltip-title">Jul 4</div><div className="analytics-tooltip-row"><i className="is-blue" /><span>Unanswered</span><strong>1</strong></div><div className="analytics-tooltip-row"><i className="is-green" /><span>Answered</span><strong>38</strong></div></div>
      <div className="analytics-design-cursor"><img src="/assets/analytics/cursor.svg" alt="" /></div>
    </div>
  </DemoCanvas>;
}
