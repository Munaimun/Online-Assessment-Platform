"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EmployerAuthShell } from "@/components/employer/employer-auth-shell";
import { login } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

const schema = z.object({
  email: z.email("Valid email is required"),
  password: z.string().min(6, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function EmployerLoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "employer@akij.com",
      password: "employer123",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormData) => login({ ...values, role: "employer" }),
    onSuccess: (data) => {
      setSession(data.token, data.user);
      router.push("/employer/dashboard");
    },
  });

  return (
    <EmployerAuthShell title="Akij Resource">
      <div className="mx-auto w-full max-w-130 md:max-w-190">
        <h1 className="mb-4 text-center font-semibold text-[#364255] md:text-2xl">Sign In</h1>

        <section className="rounded-2xl border border-[#d8dde7] bg-white p-4 md:p-5">
          <form className="space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-base font-medium text-[#4f596c] md:text-lg">
                Email/ User ID
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email/User ID"
                className="h-10 w-full rounded-xl border border-[#d1d6df] px-4 text-sm text-[#354052] outline-none md:h-11 md:text-base"
                {...form.register("email")}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-base font-medium text-[#4f596c] md:text-lg">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-10 w-full rounded-xl border border-[#d1d6df] px-4 pr-11 text-sm text-[#354052] outline-none md:h-11 md:text-base"
                  {...form.register("password")}
                />
                <Eye size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9ba4b3]" />
              </div>
              <p className="mt-2 text-right text-sm font-semibold text-[#42516a] md:text-base">Forget Password?</p>
            </div>

            {mutation.isError ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">Invalid credentials.</p>
            ) : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-10 w-full rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] text-base font-semibold text-white disabled:opacity-70 md:h-11 md:text-lg"
            >
              {mutation.isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </section>
      </div>
    </EmployerAuthShell>
  );
}
