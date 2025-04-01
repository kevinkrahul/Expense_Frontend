"use client";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const customerSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters" })
    .max(20, "Name must be less than 20 chracters"),
  feedback: z
    .string()
    .min(100, { message: "Comments must be at least 100 characters" })
    .max(250, { message: "Comments must be less than 250 characters" }),
});

const Customersurvey = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
  });

  async function handleCustomerSubmit(
    values: z.infer<typeof customerSchema>,
    reset: () => void
  ) {
    setLoading(true);
    try {
      reset();
    } catch (error) {
      console.error("Error creating Customer:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Submit your Feedback</CardTitle>
              <CardDescription>
                Share your thoughts ans ideas with us!!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit((values) =>
                  handleCustomerSubmit(values, reset)
                )}
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="feedback">Thoughts</Label>
                    </div>
                    <Input
                      id="feedback"
                      type="text"
                      placeholder="Enter your thoughts & ideas"
                      required
                      {...register("feedback")}
                    />
                    {errors.feedback && (
                      <p className="text-red-500 text-sm">
                        {errors.feedback.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" variant={"outline"} className="w-full">
                    {loading?"Submitting":"Submit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Customersurvey;
