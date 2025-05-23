import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-start py-12 min-h-[calc(100vh-200px)]"> {/* Adjust min-height based on navbar/footer */}
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Login to Eventide</h1>
        <LoginForm />
      </div>
    </div>
  );
}
