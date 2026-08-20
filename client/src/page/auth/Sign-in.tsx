import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthShell from "@/components/auth/auth-shell";
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import PasswordInput from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginMutationFn } from "@/lib/api";
import { toast } from "@/lib/toast";

const formSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const getSafeReturnUrl = (value: string | null) =>
  value && value.startsWith("/") && !value.startsWith("//") ? value : null;

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const returnUrl = searchParams.get("returnUrl");
  const { mutate, isPending } = useMutation({ mutationFn: loginMutationFn });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    mutate(values, {
      onSuccess: ({ user }) => {
        queryClient.setQueryData(["authUser"], { user });
        toast({
          title: "Signed in",
          description: "Welcome back to TeamNova.",
          variant: "success",
        });
        navigate(
          getSafeReturnUrl(returnUrl) || `/workspace/${user.currentWorkspace}`
        );
      },
      onError: (error) => toast({ title: "Unable to sign in", description: error.message, variant: "destructive" }),
    });
  };

  return (
    <AuthShell eyebrow="Welcome back" title="Sign in to your workspace" description="Pick up exactly where your team left off.">
      <GoogleOauthButton label="Continue" />
      <div className="my-7 flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        <span className="h-px flex-1 bg-[#E2E8F0]" />or use email<span className="h-px flex-1 bg-[#E2E8F0]" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel className="text-[#0F172A]">Email address</FormLabel><FormControl><Input type="email" autoComplete="email" placeholder="you@company.com" className="h-12 rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#818CF8]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#0F172A]">Password</FormLabel>
              <FormControl><PasswordInput autoComplete="current-password" className="rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] focus-visible:ring-[#818CF8]" {...field} /></FormControl><FormMessage />
            </FormItem>
          )} />
          <Button disabled={isPending} type="submit" className="h-12 w-full gap-2 rounded-xl bg-[#4F46E5] text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-[#4338CA] focus-visible:ring-[#818CF8]">
            {isPending ? <Loader className="size-4 animate-spin" /> : null}Sign in{!isPending ? <ArrowRight className="size-4" /> : null}
          </Button>
        </form>
      </Form>
      <p className="mt-7 text-center text-sm text-[#64748B]">New to TeamNova? <Link to={returnUrl ? `/sign-up?returnUrl=${encodeURIComponent(returnUrl)}` : "/sign-up"} className="font-semibold text-[#4F46E5] hover:text-[#4338CA]">Create an account</Link></p>
      <p className="mt-8 text-center text-xs leading-5 text-slate-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
    </AuthShell>
  );
};

export default SignIn;
