import LoginForm from "@/app/components/Forms/LoginForm/LoginForm";

export default function RegisterPage() {
  return (
    <div className="w-full h-full">
      <h1 className="text-xl font-semibold text-center">Đăng nhập</h1>
      <div className="flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
