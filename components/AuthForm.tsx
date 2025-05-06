"use client";

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

import { Input } from "@/components/ui/input";

import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const authFormSchema = (type: FormType) => {
    return z.object({
      name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
      email: z.string().email(),
      password: z.string().min(3),
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

    function onSubmit(values: z.infer<typeof formSchema>) {
    try {
            if (type === 'sign-up') {
                toast.success('Account created successfully');
                console.log('Sign Up');
                router.push('/');
            } else {
                toast.success('Log in successfully.')
                console.log('Sign up')
                router.push('/');
            }
    } catch (error) {
            console.log(error)
            toast.error(`There was an error: ${error}`);
    }
    }

    const isSignIn = type === "sign-in";

    return (
        <div className="min-h-screen flex flex-col justify-end bg-back px-4 w-full max-w-md ">
        <div className="text-center my-auto">
            <h1 className="text-white text-3xl font-bold">Attends</h1>
        </div>

        <div className="bg-white w-full max-w-md mx-auto rounded-t-3xl px-6 py-8 shadow-md">
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
                                        className="h-10 px-3 text-sm border border-gray-300 rounded-md w-full py-5"
                                    />
                                </FormControl>
                                <FormMessage className="text-xs min-h-[16px]" />
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
                        className="h-10 px-3 text-sm border border-gray-300 rounded-md w-full py-5"
                        />
                    </FormControl>
                    <FormMessage className="text-xs min-h-[16px]" />
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
                        className="h-10 px-3 text-sm border border-gray-300 rounded-md w-full py-5"
                        />
                    </FormControl>
                    <FormMessage className="text-xs min-h-[16px]" />
                    </FormItem>
                )}
                />

                <Button
                type="submit"
                className="mb-4 w-full bg-back py-7 rounded-full text-white font-semibold text-center cursor-pointer shadow-[0px_4px_4px_rgba(0,0,0,0.25)] backdrop-blur-[4px]"
                >
                {type === 'sign-in' ? 'Login': 'Sign Up'}
                </Button>
            </form>
            </Form>

            <p className="text-center text-sm text-black mt-4 mb-8">
                {isSignIn ? "Don't" : 'Already'} have an account? {" "}
                <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
                    <span className="text-red-700 font-bold cursor-pointer">
                        {isSignIn ? 'Sign up' : 'Login' }
                    </span>
                </Link>
            </p>
        </div>
        </div>
    );
};

export default AuthForm;
