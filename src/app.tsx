import { useEffect, useState } from 'preact/hooks';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './app.css';

const schedule = [
  { name: 'Sleep', value: 8, color: 'rgba(79, 79, 79, 0.3)' },
  { name: 'Work', value: 9, color: 'rgba(25, 118, 210, 0.3)' },
  { name: 'Leisure', value: 4, color: 'rgba(129, 199, 132, 0.3)' },
  { name: 'Other', value: 3, color: 'rgba(251, 192, 45, 0.3)' },
];

export function App() {
  // 針の時刻更新
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // viewBox 単位（0–100）の中心
  const CX = 50;
  const CY = 50;

  // 針の先端位置を計算（長さ 40%）
  const hour = now.getHours() + now.getMinutes() / 60;
  const angleDeg = (hour / 24) * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const R_HAND = 40;
  const xHand = CX + R_HAND * Math.cos(angleRad);
  const yHand = CY + R_HAND * Math.sin(angleRad);

  // スケジュール開始時刻ラベル用の累積角度計算
  let acc = 0;
  const total = schedule.reduce((s, e) => s + e.value, 0);

  return (
    <div className="app">
      {/* Recharts の PieChart */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={schedule}
            dataKey="value"
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius="50%"
            outerRadius="80%"
            isAnimationActive={false}
            label={({ name }) => name}
            labelLine={false}
            stroke="none"
          >
            {schedule.map((seg, i) => (
              <Cell key={i} fill={seg.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* SVG overlay: viewBox 0–100 で両方のラベル＆針を描画 */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* 各セグメント開始時刻を境界に描画 */}
        {schedule.map((seg, i) => {
          const startHour = acc;
          const angle = (startHour / total) * 360 - 90;
          acc += seg.value;
          const rad = (angle * Math.PI) / 180;
          const R_LABEL = 45; // 外円から少しはみ出す
          const x = CX + R_LABEL * Math.cos(rad);
          const y = CY + R_LABEL * Math.sin(rad);

          const hourLabel = `${startHour}:00`;
          return (
            <text
              key={i}
              x={x}
              y={y}
              fontSize="3"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#444"
            >
              {hourLabel}
            </text>
          );
        })}

        {/* 今の時刻を指す時針 */}
        <line
          x1={CX}
          y1={CY}
          x2={xHand}
          y2={yHand}
          stroke="red"
          strokeWidth="0.5"
        />
        <circle cx={CX} cy={CY} r="1" fill="red" />
      </svg>
    </div>
  );
}
