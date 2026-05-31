import { Field, FieldGroup, FieldLabel } from "./field";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth";
import { ROLE_ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Input } from "./input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const { signIn, isLoggingIn, loginError, user } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      const path = ROLE_ROUTES[user.role] || "/dashboard";
      navigate(path, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6 text-hewan-blue-800", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-[15px] text-hewan-blue-600/80 ">
            Enter your username below to login to your account
          </p>

          {loginError && (
            <p className="mt-3 text-sm font-medium text-red-500 animate-in fade-in zoom-in-95">
              {loginError.message}
            </p>
          )}
        </div>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="e.g., pegawai"
            required
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            placeholder="Enter your password"
            onChange={handleChange}
            required
          />
        </Field>
        <Field>
          <Button
            disabled={isLoggingIn}
            className="bg-gradient-to-r from-hewan-blue-500 to-hewan-blue-800"
            type="submit"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
