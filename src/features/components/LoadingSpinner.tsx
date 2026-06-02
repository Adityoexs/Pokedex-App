
interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-8"
      data-testid="loading-spinner"
      role="status"
      aria-label={message}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      <span className="text-sm text-gray-500">{message}</span>
    </div>
  );
}

export default LoadingSpinner;
