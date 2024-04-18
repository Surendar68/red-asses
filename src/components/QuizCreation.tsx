'use client';
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { quizCreationSchema } from '@/schemas/form/quiz';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { BookOpen, CopyCheck } from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {}

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = (props: Props) => {
    const router = useRouter();
    const { mutate: getQuestions, isPending } = useMutation({
        mutationFn: async ({ amount, topic, type }: Input) => {
            const response = await axios.post("/api/assessment", { amount, topic, type });
            return response.data;
        },
    });

    const form = useForm<Input>({
        resolver: zodResolver(quizCreationSchema),
        defaultValues: {
            topic: "",
            type: "open_ended",
            amount: 3,
        },
    });

    function onSubmit(input: Input) {
        getQuestions({
            amount: input.amount,
            topic: input.topic,
            type: input.type,
            level: "hard"
        },
            {
                onSuccess: ({ assessmentId }) => {
                    if (form.getValues("type") === "open_ended") {
                        router.push(`/start/open-ended/${assessmentId}`);

                    } else {
                        router.push(`/start/mcq/${assessmentId}`);
                    }
                },
            }
        );

    }
    form.watch();
    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
                    <CardDescription>Choose a topic</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Topic</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter a topic" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Please provide any topic you would like to be quizzed on
                                            here.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Number of Questions</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="How many questions?"
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    form.setValue("amount", parseInt(e.target.value));
                                                }}
                                                min={1}
                                                max={10}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            You can choose how many questions you would like to be
                                            quizzed on here.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-between">
                                <Button
                                    variant={
                                        form.getValues("type") === "mcq" ? "default" : "secondary"
                                    }
                                    className="w-1/2 rounded-none rounded-l-lg"
                                    onClick={() => {
                                        form.setValue("type", "mcq");
                                    }}
                                    type="button"
                                >
                                    <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                                </Button>
                                <Separator />
                                <Button
                                    variant={
                                        form.getValues("type") === "open_ended"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="w-1/2 rounded-none rounded-r-lg"
                                    onClick={() => form.setValue("type", "open_ended")}
                                    type="button"
                                >
                                    <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                                </Button>
                            </div>
                            <Button disabled={isPending} type="submit">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default QuizCreation
