export default function Logo({ size = "text-2xl" }) {
  return (
    <div className={`flex items-center font-bold tracking-tight ${size}`}>
      <span className="text-blue-600">Alumni</span>
      <span className="text-slate-900">Nest</span>
    </div>
  );
}