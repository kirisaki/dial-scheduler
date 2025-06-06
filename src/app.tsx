import { useEffect, useState } from 'preact/hooks';
import { PieChart, Pie, Cell, LabelList } from 'recharts';
import './app.css'

const schedule = [
  { name: 'Sleep', value: 8, color: 'rgba(79, 79, 79, 0.3)' },
  { name: 'Work', value: 9, color: 'rgba(25, 118, 210, 0.3)' },
  { name: 'Leisure', value: 4, color: 'rgba(129, 199, 132, 0.3)' },
  { name: 'Other', value: 3, color: 'rgba(251, 192, 45, 0.3)' },
];

const ClockHand = ({ size }: { size: number }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hour = time.getHours() + time.getMinutes() / 60;
  const angle = (hour / 24) * 360 - 90;
  const rad = (angle * Math.PI) / 180;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.4;
  const x = cx + r * Math.cos(rad);
  const y = cy + r * Math.sin(rad);

  return (
    <svg
      width={size}
      height={size}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="red" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="4" fill="red" />
    </svg>
  );
};

export function App() {
  const size = 300;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        margin: '2rem auto',
      }}
    >
      <PieChart width={size} height={size}>
        <Pie
          data={schedule}
          dataKey="value"
          cx="50%"
          cy="50%"
          startAngle={90}
          endAngle={-270}
          innerRadius={80}
          outerRadius={140}
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
      <ClockHand size={size} />
    </div>
  );
}
