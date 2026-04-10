"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CandidateAuthShell } from "@/components/candidate/candidate-auth-shell";
import { login } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

const schema = z.object({
  email: z.email("Valid email is required"),
  password: z.string().min(6, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function CandidateLoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "candidate@akij.com",
      password: "candidate123",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormData) => login({ ...values, role: "candidate" }),
    onSuccess: (data) => {
      setSession(data.token, data.user);
      router.push("/candidate/dashboard");
    },
  });

  return (
    <CandidateAuthShell title="Akij Resource">
      <div className="mx-auto w-full max-w-[520px] md:max-w-[760px]">
        <h1 className="mb-6 text-center text-[42px] font-semibold text-[#364255] md:text-[52px]">Sign In</h1>

        <section className="rounded-2xl border border-[#d8dde7] bg-white p-4 md:p-7">
          <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <div>
              <label htmlFor="email" className="mb-2 block text-[34px] font-medium text-[#4f596c] md:text-[24px]">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your primary email address"
                className="h-12 w-full rounded-xl border border-[#d1d6df] px-4 text-[30px] text-[#354052] outline-none md:h-13 md:text-base"
                {...form.register("email")}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-[34px] font-medium text-[#4f596c] md:text-[24px]">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="h-12 w-full rounded-xl border border-[#d1d6df] px-4 text-[30px] text-[#354052] outline-none md:h-13 md:text-base"
                {...form.register("password")}
              />
              <p className="mt-2 text-right text-[36px] font-semibold text-[#42516a] md:text-[24px]">Forget Password?</p>
            </div>

            {mutation.isError ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">Invalid credentials.</p>
            ) : null}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-12 w-full rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] text-[36px] font-semibold text-white disabled:opacity-70 md:h-13 md:text-[32px]"
            >
              {mutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </form>
        </section>
      </div>
    </CandidateAuthShell>
  );
}
