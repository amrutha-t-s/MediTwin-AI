function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-6">
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
