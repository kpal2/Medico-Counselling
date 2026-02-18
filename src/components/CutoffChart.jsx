const CutoffChart = ({
  title = "MD General Medicine Cutoff",
  subtitle = "Closing Rank vs Year",
  points = [68, 72, 78, 86, 92], // 0-100 scale for visual
  years = ["2021", "2022", "2023", "2024", "2025"],
}) => {
  // build SVG polyline points
  const w = 520;
  const h = 220;
  const padX = 44;
  const padY = 24;

  const innerW = w - padX * 2;
  const innerH = h - padY * 2;

  const toX = (i) => padX + (innerW * i) / (points.length - 1);
  const toY = (v) => padY + innerH - (innerH * v) / 100;

  const poly = points.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");
  const lastX = toX(points.length - 1);
  const lastY = toY(points[points.length - 1]);

  return (
    <div className="chartCard">
      <div className="chartTitle">{title}</div>
      <div className="chartSub">{subtitle}</div>

      <div className="chartSvgWrap">
        <svg viewBox={`0 0 ${w} ${h}`} className="chartSvg" role="img" aria-label={title}>
          {/* grid */}
          <line x1={padX} y1={padY} x2={padX} y2={h - padY} className="chartAxis" />
          <line x1={padX} y1={h - padY} x2={w - padX} y2={h - padY} className="chartAxis" />

          {[0, 25, 50, 75, 100].map((v) => {
            const y = toY(v);
            return (
              <g key={v}>
                <line x1={padX} y1={y} x2={w - padX} y2={y} className="chartGrid" />
              </g>
            );
          })}

          {/* line */}
          <polyline points={poly} className="chartLine" />
          {/* endpoint dot */}
          <circle cx={lastX} cy={lastY} r="5" className="chartDot" />

          {/* x labels */}
          {years.map((yr, i) => (
            <text key={yr} x={toX(i)} y={h - 6} textAnchor="middle" className="chartLabel">
              {yr}
            </text>
          ))}

          {/* y labels (left) */}
          {["0", "500", "1000", "1500"].map((t, idx) => (
            <text
              key={t}
              x={padX - 10}
              y={padY + idx * (innerH / 3) + 4}
              textAnchor="end"
              className="chartLabel"
            >
              {t}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default CutoffChart;
