import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthShell from "@/components/auth/auth-shell";
import PasswordInput from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerMutationFn } from "@/lib/api";
import { toast } from "@/lib/toast";

const formSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const inviteCode = returnUrl?.match(
    /^\/invite\/workspace\/([a-zA-Z0-9]{8})\/join$/
  )?.[1];
  const { mutate, isPending } = useMutation({ mutationFn: registerMutationFn });
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { name: "", email: "", password: "" } });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    mutate({ ...values, inviteCode }, {
      onSuccess: ({ workspaceId }) => { toast({ title: "Account created", description: inviteCode ? "Your account joined the invited workspace. Sign in to continue." : "Sign in to open your new workspace.", variant: "success" }); navigate(`/sign-in?returnUrl=${encodeURIComponent(`/workspace/${workspaceId}`)}`); },
      onError: (error) => toast({ title: "Unable to create account", description: error.message, variant: "destructive" }),
    });
  };

  return (
    <AuthShell eyebrow="Start building" title="Create your TeamNova account" description="Set up your workspace in under a minute.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel className="text-[#0F172A]">Full name</FormLabel><FormControl><Input autoComplete="name" placeholder="Alex Morgan" className="h-12 rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#818CF8]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel className="text-[#0F172A]">Work email</FormLabel><FormControl><Input type="email" autoComplete="email" placeholder="you@company.com" className="h-12 rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:ring-[#818CF8]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel className="text-[#0F172A]">Password</FormLabel><FormControl><PasswordInput autoComplete="new-password" placeholder="At least 8 characters" className="rounded-xl border-[#E2E8F0] bg-white text-[#0F172A] focus-visible:ring-[#818CF8]" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button disabled={isPending} type="submit" className="h-12 w-full gap-2 rounded-xl bg-[#4F46E5] text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-[#4338CA] focus-visible:ring-[#818CF8]">
            {isPending ? <Loader className="size-4 animate-spin" /> : null}Create account{!isPending ? <ArrowRight className="size-4" /> : null}
          </Button>
        </form>
      </Form>
      <p className="mt-7 text-center text-sm text-[#64748B]">Already have an account? <Link to={returnUrl ? `/sign-in?returnUrl=${encodeURIComponent(returnUrl)}` : "/sign-in"} className="font-semibold text-[#4F46E5] hover:text-[#4338CA]">Sign in</Link></p>
      <p className="mt-8 text-center text-xs leading-5 text-slate-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
    </AuthShell>
  );
};

export default SignUp;
