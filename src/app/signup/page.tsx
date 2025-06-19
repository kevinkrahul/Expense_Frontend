"use client";

import { useState} from "react";
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
import { z } from "zod";
import axios from "axios";
import Link from "next/link";
  
  const FormSchema =z.object({
    username:z.string().min(5,{message:"Username must be at least 5 characters long"}),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  })



  export default function VerifyOtpPage() {
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = async()=>{

    try{
        const SERVER_URL="http://localhost:5000/signup";
        const response = await axios.post(SERVER_URL,{
            username:user,
            email:email,
            password:password
        },{headers:{"Content-Type":"application/json"}});
        setSuccess("Signup Successful");
        window.location.href = "/login";
        setError("");
        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);
    }
    catch(error:any){
        console.error("API ERROR : ",error.response ?error.response.data:error.message);
        setError("Signup failed. Please try again.")
        setSuccess("");
    }
  };

  

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Change Password</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e)=>{e.preventDefault(); handleSubmit();}}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="username"
                      placeholder="Enter Username"
                      onChange={(e) => setUser(e.target.value)}
                      required
                    />
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="m@example.com"
                      required
                    />
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New Password"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant={"outline"}
                  >
                    Sign Up
                  </Button>
                  <Label>If you already have an account,</Label>
                  <Link href="/login">
                    <Button className="w-full"variant={"outline"}>Log in</Button>
                  </Link>
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
