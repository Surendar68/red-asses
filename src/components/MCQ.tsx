'use client';
import React from 'react'
import { differenceInSeconds } from 'date-fns';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button, buttonVariants } from './ui/button';
import { Assessment, Question } from '@prisma/client';
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react';
import MCQCounter from './MCQCounter';
import axios from 'axios';
import { z } from 'zod';
import { checkAnswerSchema } from '@/schemas/questions';
import { useMutation } from '@tanstack/react-query';
import { useToast } from './ui/use-toast';
import { cn, formatTimeDelta } from '@/lib/utils';
import Link from 'next/link';

type Props = {
    assessment: Assessment & { questions: Pick<Question, "id" | "question" | "options">[] };
};

const MCQ = ({ assessment }: Props) => {
    const [questionIndex, setQuestionIndex] = React.useState(0);
    const [hasEnded, setHasEnded] = React.useState(false);
    const [stats, setStats] = React.useState({
        correct_answers: 0,
        wrong_answers: 0,
    });
    const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
    const [now, setNow] = React.useState(new Date());
    const currentQuestion = React.useMemo(() => {
        return assessment.questions[questionIndex];
    }, [questionIndex, assessment.questions]);
    const options = React.useMemo(() => {
        if (!currentQuestion) return [];
        if (!currentQuestion.options) return [];
        return JSON.parse(currentQuestion.options as string) as string[];
    }, [currentQuestion]);

    const { toast } = useToast();

    const { mutate: checkAnswer, isPending: isChecking } = useMutation({
        mutationFn: async () => {
            const payload: z.infer<typeof checkAnswerSchema> = {
                questionId: currentQuestion.id,
                userInput: options[selectedChoice],
            };
            const response = await axios.post(`/api/checkAnswer`, payload);
            return response.data;
        },
    });

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (!hasEnded) {
                setNow(new Date());
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [hasEnded]);

    const handleNext = React.useCallback(() => {
        checkAnswer(undefined, {
            onSuccess: ({ isCorrect }) => {
                if (isCorrect) {
                    setStats((stats) => ({
                        ...stats,
                        correct_answers: stats.correct_answers + 1,
                    }));
                    toast({
                        title: "Correct",
                        description: "You got it right!",
                        variant: "success",
                    });
                } else {
                    setStats((stats) => ({
                        ...stats,
                        wrong_answers: stats.wrong_answers + 1,
                    }));
                    toast({
                        title: "Incorrect",
                        description: "You got it wrong!",
                        variant: "destructive",
                    });
                }
                if (questionIndex === assessment.questions.length - 1) {
                    setHasEnded(true);
                    return;
                }
                setQuestionIndex((questionIndex) => questionIndex + 1);
            },
        });
    }, [checkAnswer, questionIndex, assessment.questions.length, toast]);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const key = event.key;

            if (key === "1") {
                setSelectedChoice(0);
            } else if (key === "2") {
                setSelectedChoice(1);
            } else if (key === "3") {
                setSelectedChoice(2);
            } else if (key === "4") {
                setSelectedChoice(3);
            } else if (key === "Enter") {
                handleNext();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleNext]);

    if (hasEnded) {
        return (
            <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className="px-4 py-2 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
                    You Completed in{" "}{formatTimeDelta(differenceInSeconds(now, assessment.timeStarted))}
                </div>
                <Link
                    href={`/statistics/${assessment.id}`}
                    className={cn(buttonVariants({ size: "lg" }), "mt-2")}
                >
                    View Statistics
                    <BarChart className="w-4 h-4 ml-2" />
                </Link>
            </div>
        );
    }


    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw] top-1/2 left-1/2">
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    {/* topic */}
                    <p>
                        <span className="text-slate-400">Topic</span> &nbsp;
                        <span className="px-2 py-1 text-white rounded-lg bg-slate-800">
                            {assessment.topic}
                        </span>
                    </p>

                    <div className="flex self-start mt-3 text-slate-400">
                        <Timer className="mr-2" />{formatTimeDelta(differenceInSeconds(now, assessment.timeStarted))}
                    </div>

                </div>
                <MCQCounter correct_answers={stats.correct_answers}
                    wrong_answers={stats.wrong_answers} />
            </div>
            <Card className="w-full mt-4">
                <CardHeader className="flex flex-row items-center">
                    <CardTitle className="mr-5 text-center divide-y divide-zinc-600/50">
                        <div>{questionIndex + 1}</div>
                        <div className="text-base text-slate-400">
                            {assessment.questions.length}
                        </div>
                    </CardTitle>
                    <CardDescription className="flex-grow text-lg">
                        {currentQuestion?.question}
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="flex flex-col items-center justify-center w-full mt-4">
                {options.map((option, index) => {
                    return (
                        <Button
                            key={option}
                            variant={selectedChoice === index ? "default" : "outline"}
                            className="justify-start w-full py-8 mb-4"
                            onClick={() => setSelectedChoice(index)}
                        >
                            <div className="flex items-center justify-start">
                                <div className="p-2 px-3 mr-5 border rounded-md">
                                    {index + 1}
                                </div>
                                <div className="text-start">{option}</div>
                            </div>
                        </Button>
                    );
                })}
                <Button
                    variant="default"
                    className="mt-2"
                    size="lg"
                    disabled={isChecking}
                    onClick={() => {
                        handleNext();
                    }}
                >
                    {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}

export default MCQ