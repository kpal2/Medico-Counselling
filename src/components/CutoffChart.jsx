import { useEffect, useState } from "react";

const CutoffChart = ({
  title = "Cutoff Chart",
  subtitle = "Closing rank trend",
  points = [68, 72, 78, 86, 92],
  years = ["1", "2", "3", "4", "5"],
  details = [],
}) => {
  const safePoints = points.length ? points : [0];
  const safeYears = years.length ? years : ["1"];
  const [activeIndex, setActiveIndex] = useState(0);
  const w = 520;
  const h = 220;
  const padX = 44;
  const padY = 24;
  const innerW = w - padX * 2;
  const innerH = h - padY * 2;
  const xDivisor = Math.max(safePoints.length - 1, 1);

  useEffect(() => {
    setActiveIndex(0);
  }, [title, subtitle, points.length]);

  const toX = (i) => padX + (innerW * i) / xDivisor;
  const toY = (v) => padY + innerH - (innerH * v) / 100;

  const poly = safePoints.map((value, index) => `${toX(index)},${toY(value)}`).join(" ");
  const activeDetail = details[activeIndex];

  return (
    <div className="chartCard">
      <div className="chartTitle">{title}</div>
      <div className="chartSub">{subtitle}</div>

      <div className="chartSvgWrap">
        <svg viewBox={`0 0 ${w} ${h}`} className="chartSvg" role="img" aria-label={title}>
          <line x1={padX} y1={padY} x2={padX} y2={h - padY} className="chartAxis" />
          <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} className="chartAxis" />

          {[0, 25, 50, 75, 100].map((value) => {
            const y = toY(value);
            return (
              <g key={value}>
                <line x1={padX} y1={y} x2={w - padX} y2={y} className="chartGrid" />
              </g>
            );
          })}

          <polyline points={poly} className="chartLine" />

          {safePoints.map((value, index) => (
            <g key={`${safeYears[index] ?? index}-${index}`}>
              <circle
                cx={toX(index)}
                cy={toY(value)}
                r={index === activeIndex ? "7" : "5"}
                className={index === activeIndex ? "chartDot chartDot--active" : "chartDot"}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                role="button"
                tabIndex="0"
                aria-label={`Show details for ${safeYears[index] ?? `point ${index + 1}`}`}
              />
            </g>
          ))}

          {safeYears.map((year, index) => (
            <text key={`${year}-${index}`} x={toX(index)} y={h - 6} textAnchor="middle" className="chartLabel">
              {year}
            </text>
          ))}
        </svg>
      </div>

      {activeDetail && (
        <div className="chartLegend">
          <div className="chartLegend__header">
            <div className="chartLegend__title">{activeDetail.label}</div>
            <div className="chartLegend__value">{activeDetail.value}</div>
          </div>
          <div className="chartLegend__meta">
            {activeDetail.meta?.map((item) => (
              <div className="chartLegend__item" key={`${activeDetail.label}-${item.label}`}>
                <span className="chartLegend__itemLabel">{item.label}</span>
                <span className="chartLegend__itemValue">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CutoffChart;
