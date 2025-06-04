"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField, // Ensure this is correctly imported
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Ensure FormType is defined, e.g., globally or in types/index.d.ts
// For this example, let's define it here if it's not global
type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z.string().min(3, "Name must be at least 3 characters.")
        : z.string().optional(),
    email: z.string().email("Invalid email address."),
    password: z.string().min(3, "Password must be at least 3 characters."),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const endpoint = type === "sign-up" ? "/signup" : "/signin";
      const apiUrl = `/api${endpoint}`; // Using the proxy in next.config.ts

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message ||
            (type === "sign-up"
              ? "Account created successfully!"
              : "Logged in successfully!"),
        );
        console.log("API Response:", data);
        router.push("/home");
      } else {
        toast.error(data.error || "An error occurred.");
        console.error("API Error:", data.error);
      }
    } catch (error: unknown) {
      // FIX: Changed 'any' to 'unknown'
      console.error("Network or unexpected error:", error);
      // FIX: Type guard for 'error.message'
      toast.error(
        `There was an error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div
      className="min-h-screen flex flex-col justify-end px-4 w-full max-w-md "
      style={{ backgroundColor: "#FDFDFD" }}
    >
      <div className="flex justify-center items-center">
        <img src="/img/logo.png" alt="Attends Logo" className="h-64 w-auto" />
      </div>

      <div className="bg-other w-full max-w-md mx-auto rounded-t-3xl px-6 py-8 shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isSignIn && (
              <FormField // This should now be correctly recognized
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        className="h-10 px-3 text-sm border rounded-md w-full py-5"
                      />
                    </FormControl>
                    <FormMessage className="text-xs min-h-[16px]" />
                  </FormItem>
                )}
              />
            )}

            <FormField // This should now be correctly recognized
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="h-10 px-3 text-sm border border-gray-300 rounded-md w-full py-5"
                    />
                  </FormControl>
                  <FormMessage className="text-xs min-h-[16px]" />
                </FormItem>
              )}
            />

            <FormField // This should now be correctly recognized
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="h-10 px-3 text-sm border border-gray-300 rounded-md w-full py-5"
                    />
                  </FormControl>
                  <FormMessage className="text-xs min-h-[16px]" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mb-4 w-full py-7 rounded-full text-black font-semibold text-center cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]"
              style={{ backgroundColor: "#FDFDFD" }}
            >
              {type === "sign-in" ? "Login" : "Sign Up"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-white mt-4 mb-8">
          {isSignIn ? "Don't" : "Already"} have an account?{" "}
          <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
            <span className="font-bold cursor-pointer text-[#4a915f]">
              {isSignIn ? "Sign up" : "Login"}
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
