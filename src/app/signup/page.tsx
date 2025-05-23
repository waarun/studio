import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="flex justify-center items-start py-12 min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Create your Eventide Account</h1>
        <SignupForm />
      </div>
    </div>
  );
}
