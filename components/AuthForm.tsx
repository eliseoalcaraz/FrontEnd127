"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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
  const { login } = useAuth();
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
      const apiUrl = `/api${endpoint}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        login({ id: data.user_id, name: data.name, email: data.email });
      } else {
        toast.error(data.error || "An error occurred.");
        console.error("API Error:", data.error);
      }
    } catch (error: unknown) {
      toast.error(
        `There was an error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div
      className="min-h-screen flex flex-col justify-end px-4 w-full max-w-md"
      style={{
        background:
          "linear-gradient(167deg, #890000 0%, #890000 47.38%, #890000 100%)",
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <h1 className="text-white text-4xl font-bold mb-10 mt-10">Attends</h1>
      </div>
      <div
        className="w-full max-w-md mx-auto rounded-t-3xl px-6 py-8 shadow-lg bg-white"
        style={{
          borderTopLeftRadius: "2rem",
          borderTopRightRadius: "2rem",
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        className="h-10 px-3 text-sm border border-gray-300 rounded-md w-full py-5 text-black bg-white"
                      />
                    </FormControl>
                    <FormMessage className="text-xs min-h-[16px] text-red-600" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="h-10 px-3 text-sm border border-gray-300 rounded-md w-full py-5 text-black bg-white"
                    />
                  </FormControl>
                  <FormMessage className="text-xs min-h-[16px] text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="h-10 px-3 text-sm border border-gray-300 rounded-md w-full py-5 text-black bg-white"
                    />
                  </FormControl>
                  <FormMessage className="text-xs min-h-[16px] text-red-600" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mb-4 w-full py-8 rounded-full text-white font-semibold text-center cursor-pointer shadow-lg transition-all text-md"
              style={{
                backgroundColor: "#890000",
                boxShadow: "0 6px 12px 0 rgba(0,0,0,0.15)",
              }}
            >
              {type === "sign-in" ? "Login" : "Sign Up"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-base text-black mt-4 mb-2">
          {isSignIn ? "Don't" : "Already"} have an account?{" "}
          <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
            <span className="font-bold cursor-pointer text-[#890000]">
              {isSignIn ? "Sign up" : "Login"}
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
