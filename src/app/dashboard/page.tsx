import HistoryCard from '@/components/dashboard/HistoryCard';
import HotTopicsCard from '@/components/dashboard/HotTopicsCard';
import QuizMeCard from '@/components/dashboard/QuizMeCard';
import RecentActivityCard from '@/components/dashboard/RecentActivityCard';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import { prisma } from "@/lib/db";
import React from 'react';
import axios from 'axios';

type Props = {}

export const metadata = {
    title: "Dashboard | Quizzy",
};

const Dashboard = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    }
    const fetchUserSkills = async (userId: any) => {
        const userSkill = await prisma.userSkill.findMany({
            where: {
                userId: userId,
                isDone: false
            },
            include: {
                skill: {
                    select: {
                        title: true,
                    },
                },
            },
        });
        const getTitle = userSkill.map((item) => { return { topic: item.skill.title, level: item.hardness } })
        let x = Math.floor((Math.random() * getTitle.length) + 1);
        console.log(getTitle[x]);
        const skill = getTitle[x];
        const amount = 15;
        const topic = skill.topic;
        const type = "mcq";
        const response = await axios.post("/api/assessment", { amount, topic, type });
        if (response.data) {
            console.log('assessment created!');
        }
    }
    const userAssessment = await prisma.assessment.findMany({
        where: {
            userId: session?.user.id
        }
    });
    if (userAssessment.length === 0) {
        fetchUserSkills(session?.user.id);
    }
    return (
        <main className="p-8 mx-auto max-w-7xl">
            <div className="flex items-center">
                <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 mt-4 md:grid-cols-2">
                <QuizMeCard />
                <HistoryCard />
            </div>
            <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
                <HotTopicsCard />
                <RecentActivityCard />
            </div>
        </main>
    )
}

export default Dashboard