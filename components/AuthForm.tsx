"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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

import Link from "next/link";
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
      console.error("Network or unexpected error:", error);
      toast.error(
        `There was an error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bree+Serif:wght@400&family=Karma:wght@300;400;500;600;700&display=swap');
        
        body, html {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
      <div
        className="min-h-screen w-full flex flex-col justify-center items-center px-4 relative"
        style={{
          background: "linear-gradient(180deg, #000000 0%, rgba(140, 0, 0, 1) 35%, rgba(77, 0, 0, 1) 70%, rgba(50, 0, 0, 1) 100%)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh"
        }}
      >
        {/* Desktop gradient overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 0.4) 100%)"
          }}
        />
        {/* Logo and Title Container */}
        <div className="flex flex-col justify-center items-center mb-8 relative z-10">
          <img src="/home-logo.png" alt="Attends Logo" className="h-24 w-auto mb-4" />
          <h1 
            className="text-white text-center"
            style={{
              fontFamily: 'Bree Serif',
              fontWeight: 400,
              fontSize: '40px',
              letterSpacing: '3%'
            }}
          >
            ATTENDS
          </h1>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8 relative z-10">
          <h2 
            className="text-white mb-2"
            style={{
              fontFamily: 'Karma',
              fontWeight: 600,
              fontSize: '32px',
              letterSpacing: '3%'
            }}
          >
            {isSignIn ? "Welcome Back" : "Register"}
          </h2>
          <p 
            style={{
              fontFamily: 'Karma',
              fontWeight: 600,
              fontSize: '16px',
              letterSpacing: '3%',
              color: 'rgba(187, 187, 187, 1)'
            }}
          >
            {isSignIn ? "Login to your account" : "Create your account"}
          </p>
        </div>

        {/* Form Container with Floating Box */}
        <div className="w-full max-w-sm mx-auto relative z-10">
          <div 
            className="p-8 rounded-2xl"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Name"
                              {...field}
                              className="h-12 px-4 bg-transparent border-0 border-b-2 border-gray-400 rounded-none text-white placeholder-gray-400 focus:border-b-green-400 focus:ring-0"
                              style={{
                                fontFamily: 'Karma',
                                fontWeight: 400,
                                fontSize: '16px',
                                color: 'rgba(199, 199, 199, 1)'
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-400" />
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
                        <div className="relative">
                          <Input
                            placeholder="Email"
                            {...field}
                            className="h-12 px-4 bg-transparent border-0 border-b-2 border-gray-400 rounded-none text-white placeholder-gray-400 focus:border-b-green-400 focus:ring-0"
                            style={{
                              fontFamily: 'Karma',
                              fontWeight: 400,
                              fontSize: '16px',
                              color: 'rgba(199, 199, 199, 1)'
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="Password"
                            {...field}
                            className="h-12 px-4 bg-transparent border-0 border-b-2 border-gray-400 rounded-none text-white placeholder-gray-400 focus:border-b-green-400 focus:ring-0"
                            style={{
                              fontFamily: 'Karma',
                              fontWeight: 400,
                              fontSize: '16px',
                              color: 'rgba(199, 199, 199, 1)'
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 mt-8 rounded-full border-2 hover:opacity-90 transition-opacity"
                  style={{
                    backgroundColor: 'rgba(4, 120, 87, 1)',
                    borderColor: 'rgba(10, 245, 139, 1)',
                    fontFamily: 'Karma',
                    fontWeight: 500,
                    fontSize: '18px',
                    letterSpacing: '3%',
                    color: 'rgba(255, 255, 255, 1)'
                  }}
                >
                  {type === "sign-in" ? "LOGIN" : "SIGN UP"}
                </Button>
              </form>
            </Form>

            <p className="text-center mt-6">
              <span 
                style={{
                  fontFamily: 'Karma',
                  fontWeight: 400,
                  fontSize: '16px',
                  color: 'rgba(222, 222, 222, 1)'
                }}
              >
                {isSignIn ? "Don't" : "Already"} have an account?{" "}
              </span>
              <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
                <span 
                  className="cursor-pointer"
                  style={{
                    fontFamily: 'Karma',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: 'rgba(250, 204, 21, 1)'
                  }}
                >
                  {isSignIn ? "Sign Up" : "Login"}
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;