const EmptyState = ({ icon: Icon, title, message, action }) => {
  return (
    <div className="text-center py-16">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Icon className="text-gray-400 text-2xl" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {message && <p className="text-gray-400 text-sm mb-4 max-w-sm mx-auto">{message}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
