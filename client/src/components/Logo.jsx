export default function Logo({ size = "text-2xl" }) {
  return (
    <h1 className={`font-bold ${size}`}>
      <span className="text-blue-600">Alumni</span>
      <span className="text-gray-900">Nest</span>
    </h1>
  );
}