"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useLoginMutation } from "@/store/handexApi"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoginFormValues, loginSchema } from "@/validations/login/login.validation"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';




export default function LoginPage() {
    const [login, { isLoading, isError, data, isSuccess }] = useLoginMutation()
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: LoginFormValues) => {
        try {
            const response = await login({
                username: values.email,
                password: values.password,
            }).unwrap();

            Cookies.set('token', response.token, {
                expires: 7,
            });
            toast.success('Daxil olundu');
            router.push('/');
        } catch (error) {
            toast.error('Uğursuz cəhd');
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Login to Dashboard</CardTitle>
                    <CardDescription className="text-center">Keçid üçün username və parol daxil edin</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Username daxil edin..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        placeholder="Parol daxil edin..."
                                                        type={showPassword ? "text" : "password"}
                                                        className="pr-10"
                                                        {...field}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-500"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                                                        )}
                                                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? "Giriş edilir..." : "Giriş et"}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    )
}
