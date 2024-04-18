import MCQ from '@/components/MCQ';
import { prisma } from '@/lib/db';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    params: {
        assessmentId: string;
    };
};

const MCQPage = async ({ params: { assessmentId } }: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }
    const assessment = await prisma.assessment.findUnique({
        where: {
            id: assessmentId
        },
        include: {
            questions: true
        }
    });
    if (!assessment || assessment.assessmentType === "open_ended") {
        return redirect("/quiz");
    }
    return (
        <MCQ assessment={assessment} />
    )
}

export default MCQPage