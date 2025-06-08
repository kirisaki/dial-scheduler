import { useEffect, useState } from 'preact/hooks';
import { PieChart, Pie, Cell, LabelList, ResponsiveContainer } from 'recharts';
import './app.css'

const schedule = [
  { name: '睡眠', value: 8, color: 'rgba(79, 79, 79, 0.3)' },
  { name: '仕事', value: 9, color: 'rgba(25, 118, 210, 0.3)' },
  { name: '余暇', value: 4, color: 'rgba(129, 199, 132, 0.3)' },
  { name: 'その他', value: 3, color: 'rgba(251, 192, 45, 0.3)' },
];

const ClockHand = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hour = time.getHours() + time.getMinutes() / 60;
  const angle = (hour / 24) * 360 - 90;
  const rad = (angle * Math.PI) / 180;

  const cx = 50;
  const cy = 50;
  const r = 40;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);

  return (
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
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="red" strokeWidth="0.5" />
      <circle cx={cx} cy={cy} r="1" fill="red" />
    </svg>
  );
};

export function App() {
  const start = 90 + 2 / 24 * 360; // 2 hrs. before bedtime
  const end = start - 369;

  return (
    <div
      className="app"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={schedule}
            dataKey="value"
            cx="50%"
            cy="50%"
            startAngle={start}
            endAngle={end}
            innerRadius="50%"
            outerRadius="80%"
            stroke="none"
            isAnimationActive={false}
            labelLine={false}
            label={({ name }) => name}
          >
            {schedule.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ClockHand />
    </div>
  );
}
