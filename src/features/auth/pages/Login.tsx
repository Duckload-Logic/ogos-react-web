import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthHeader,
  AuthMessages,
  LoginForm,
} from "@/features/auth/components";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "@/utils/validation";
import { ROLE_ROUTES } from "@/config/constants";
import { useLogin } from "../hooks";
import { useMe } from "@/features/users/hooks/useMe";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError } = useLogin();
  const { refetch } = useMe({});

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      if (!username || !password) throw new Error("Credentials required");

      const isEmail = username.includes("@");
      if (isEmail && !isValidEmail(username)) throw new Error("Invalid email");
      if (!isEmail && !isValidUsername(username)) {
        throw new Error("Invalid username");
      }
      if (!isValidPassword(password)) throw new Error("Password too short");

      await login({
        email: username,
        password,
      });

      const result = await refetch();

      if (result.data) {
        const roleId = result.data.role?.id;
        const route = ROLE_ROUTES[roleId as keyof typeof ROLE_ROUTES];

        if (route) {
          navigate(route, { replace: true });
        } else {
          setLocalError("Unauthorized role.");
        }
      } else {
        setLocalError("Failed to load user data.");
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-[1180px] items-center justify-center py-3 sm:py-5 lg:py-6">
      <div className="relative grid w-full overflow-hidden rounded-[30px] border border-[hsl(var(--border)/0.65)] bg-[hsl(var(--card)/0.82)] shadow-[0_30px_90px_-40px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:grid-cols-[0.92fr_1.08fr]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-12 top-0 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10),transparent_45%,rgba(255,255,255,0.03))]" />
        </div>

        <AuthHeader
          title="PUPT OGOS"
          subtitle="Secure access to guidance services, student support, and account tools."
        />

        <div className="relative flex items-center p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-xl">
            <div className="mb-7 space-y-2">
              <span className="inline-flex rounded-full border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--background)/0.72)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
                Sign in
              </span>

              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Access your account
              </h2>

              <p className="text-sm leading-6 text-muted-foreground">
                Use your email, username, or institutional login to continue.
              </p>
            </div>

            <AuthMessages error={localError || loginError?.message} />

            <LoginForm
              username={username}
              password={password}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
              isLoading={isLoggingIn}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
