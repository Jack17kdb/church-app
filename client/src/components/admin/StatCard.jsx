const StatCard = ({ icon: Icon, label, value, color = 'church', trend }) => {
  const colorMap = {
    church: 'bg-church-50 text-church-600',
    green: 'bg-green-50 text-green-600',
    gold: 'bg-gold-50 text-gold-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600'
  };

  return (
    <div className="card-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 font-display">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.text}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${colorMap[color]} flex items-center justify-center flex-shrink-0`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
