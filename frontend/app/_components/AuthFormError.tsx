export default function AuthFormError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400">{message}</p>;
}
