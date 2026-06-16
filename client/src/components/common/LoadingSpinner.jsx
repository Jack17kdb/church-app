const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className={`${sizeMap[size]} border-4 border-church-200 border-t-church-600 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center py-20">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
