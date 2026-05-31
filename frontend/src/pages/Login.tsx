import { LoginForm } from "../components/ui/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="absolute inset-0 z-10 lg:hidden pointer-events-none"></div>
      <div className="relative hidden bg-muted lg:block pointer-events-none"></div>
      <div className="flex flex-col gap-4 p-6 md:p-10 z-10">
        <div className="flex flex-1 flex-col gap-8 items-center justify-center">
          <div className="flex justify-center items-center gap-2 md:justify-start">
            <a href="#" className="flex items-center gap-2 font-medium"></a>
          </div>
          <div className="w-full max-w-xs lg:max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
