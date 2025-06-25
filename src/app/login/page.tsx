"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

type FormData = {
  email: string;
  password: string;
};

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export default function VerifyOtpPage() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(FormSchema) });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const SERVER_URL = process.env.NEXT_PUBLIC_API_URL ;
      // || "http://172.20.0.3:8000";
      const response = await axios.post(`${SERVER_URL}/login`, {
        email: data.email,
        password: data.password,
      });
      const token= response.data.token;
      setSuccess("Login Successful");
      window.location.href = "/";
      setError("");
      localStorage.setItem("token", token);
      reset();
    } catch (error: any) {
      console.error(
        "API ERROR : ",
        error.response ? error.response.data : error.message
      );
      setError("Login failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login Here</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit) } noValidate>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                    //   onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" variant={"outline"} disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>

                </div>
                <div className="mt-4 text-center text-sm">
                  {success && <p className="text-green-500">{success}</p>}
                  {error && <p className="text-red-500">{error}</p>}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
