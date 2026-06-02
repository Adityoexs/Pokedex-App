
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

function ErrorState({
  message = 'Something went wrong.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-12 text-center"
      data-testid="error-state"
      role="alert"
    >
      <span className="text-4xl">⚠️</span>
      <p className="text-base font-medium text-gray-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
