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
import { useFieldArray, useForm } from 'react-hook-form';
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
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axios from 'axios';
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Props = {
    currentUser: any
}

const validationSchema = z.object({
    topics: z
        .array(
            z.object({
                file: z.any(),
                name: z.string().min(1, { message: "Topic Name is required" }),
                hardness: z.string(),
            })
        )
        .nonempty({ message: "Topic is required" }),
});


type Input = z.infer<typeof validationSchema>;

const SkillDetails = (props: Props) => {

    const router = useRouter();
    const { mutate: createSkills, isPending } = useMutation({
        mutationFn: async (postData: Input) => {
            const response = await axios.post("/api/skills", postData);
            return response.data;
        },
    });

    const form = useForm<Input>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            topics: [{
                name: "",
                hardness: "",
            }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "topics",
        control: form.control,
    });

    function onSubmit(input: Input) {
        const userId = props.currentUser.id;
        const postData = {
            userId: userId,
            ...input
        };
        console.log(postData);
        createSkills(postData,
            {
                onSuccess: (response) => {
                    console.log('response', response);
                    if (response) {
                        router.push('/dashboard');

                    } else {
                        console.log('error in create');
                    }
                },
            }
        );
    }

    const addTopic = () => {
        append({ name: "", hardness: "" });
    };

    const removeTopic = (index: number) => {
        remove(index);
    };
    // form.watch();
    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Skill Details</CardTitle>
                    <CardDescription>Please provide this details</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-y-auto max-h-80">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {fields.map((_, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="flex items-start">
                                                <FormField
                                                    control={form.control}
                                                    key={index}
                                                    name={`topics.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            {index == 0 && <FormLabel>Title</FormLabel>}
                                                            {/* <FormLabel>Title</FormLabel> */}
                                                            <FormControl>
                                                                <Input placeholder="Enter a title" {...field} />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Based on skill you will be quized
                                                            </FormDescription>
                                                            {fields.length == index + 1 && <Button className="mx-1 px-5 h-8 rounded" type="button" onClick={() => append({ name: "", hardness: "" })}>+</Button>}
                                                            {/* <Button type="button" onClick={() => append({ name: "", hardness: "" })}>+</Button> */}
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    key={index + 1}
                                                    name={`topics.${index}.hardness`}
                                                    render={({ field }) => (
                                                        <FormItem className='mx-2'>
                                                            {index == 0 && <FormLabel>Level</FormLabel>}
                                                            {/* <FormLabel>Level</FormLabel> */}
                                                            <FormControl>
                                                                <RadioGroup onValueChange={field.onChange} className="flex m-3" defaultValue="option-one" {...field} >
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="easy" id="option-one" />
                                                                        <Label htmlFor="option-one">Beginner</Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="medium" id="option-two" />
                                                                        <Label htmlFor="option-two">Intermediate</Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <RadioGroupItem value="hard" id="option-three" />
                                                                        <Label htmlFor="option-three">Advance</Label>
                                                                    </div>
                                                                </RadioGroup>
                                                            </FormControl>
                                                            <FormMessage className="text-red-500 capitalize" />
                                                        </FormItem>
                                                    )}
                                                />
                                                {fields.length > 1 && <Button className='m-2 p-3 h-8 rounded-full' type="button" onClick={() => removeTopic(index)}>-</Button>}
                                                {/* <Button className='my-6' type="button" onClick={() => removeTopic(index)}>-</Button> */}
                                            </div>
                                        </div>
                                    )
                                })}


                                <Button disabled={isPending} type="submit">
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SkillDetails
