import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">เข้าสู่ระบบ</h2>
        <LoginForm />
      </div>
    </div>
  );
}
