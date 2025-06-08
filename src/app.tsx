import { useEffect, useState } from 'preact/hooks';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import './app.css';


const gray = 'hsl(0,   0%,  60%)';
const cyan = 'hsl(180, 40%, 65%)';
const magenta = '#e239e2';
const yellow = 'hsl(60,  40%, 65%)';
const schedule = [
  { name: 'Sleep', value: 5, color: gray },
  { name: 'Morning Routine', value: 2, color: cyan },
  { name: 'Study', value: 3, color: yellow },
  { name: 'Work', value: 1, color: magenta },
  { name: 'Lunch', value: 1, color: cyan },
  { name: 'Work', value: 7, color: magenta },
  { name: 'Dinner', value: 1, color: cyan },
  { name: 'Study', value: 2, color: yellow },
  { name: 'Sleep', value: 2, color: gray },
];

const pad2 = (n: number) => n.toString().padStart(2, '0');
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function App() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 中央用の日付・時刻フォーマット
  const formattedDate = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}(${weekdays[now.getDay()]})`;
  const formattedTime = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;

  // 針の先端計算（省略）
  const CX = 50, CY = 50;
  const hour = now.getHours() + now.getMinutes() / 60;
  const angle = (hour / 24) * 360 - 90;
  const rad = angle * Math.PI / 180;
  const R_HAND = 40;
  const xHand = CX + R_HAND * Math.cos(rad);
  const yHand = CY + R_HAND * Math.sin(rad);

  // 境界ラベル用の累積角度計算（省略）
  let acc = 0;
  const total = schedule.reduce((s, e) => s + e.value, 0);

  return (
    <div className="app">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={schedule}
            dataKey="value"
            cx="50%" cy="50%"
            startAngle={90} endAngle={-270}
            innerRadius="50%" outerRadius="80%"
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

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none'
        }}
      >
        {/* セグメント開始時刻ラベル */}
        {schedule.map((seg, i) => {
          const startHour = acc;
          const angle0 = (startHour / total) * 360 - 90;
          acc += seg.value;
          const r0 = 45;
          const x0 = CX + r0 * Math.cos(angle0 * Math.PI / 180);
          const y0 = CY + r0 * Math.sin(angle0 * Math.PI / 180);
          return (
            <text
              key={i}
              x={x0} y={y0}
              fontSize="3"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#444"
            >
              {`${startHour}:00`}
            </text>
          );
        })}

        {/* 中央の２行テキスト */}
        <text
          textAnchor="middle"
          fill="#333"
          fontSize="4"
        >
          <tspan x="50" y="46">{formattedDate}</tspan>
          <tspan x="50" y="54">{formattedTime}</tspan>
        </text>

        {/* 時針 */}
        <line
          x1={CX} y1={CY}
          x2={xHand} y2={yHand}
          strokeWidth="0.5"
        />
        <circle cx={CX} cy={CY} r="1" />
      </svg>
    </div>
  );
}
