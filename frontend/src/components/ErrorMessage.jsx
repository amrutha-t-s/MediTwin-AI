function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="p-3 mb-4 rounded-lg bg-red-100 text-red-700">{message}</div>
  );
}

export default ErrorMessage;
