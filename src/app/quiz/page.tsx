import QuizCreation from '@/components/QuizCreation';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

export const metadata = {
    title: "Quiz | Quizzy"
}

const QuizPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    }
    return (
        <QuizCreation />
    )
}

export default QuizPage