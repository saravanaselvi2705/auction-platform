
import Card from "../ui/Card";

export default function StatsCard({ title, value, icon: Icon, description, className = "" }) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-sm font-semibold text-gray-500">{title}</span>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs text-gray-400 font-semibold">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
export { StatsCard };
