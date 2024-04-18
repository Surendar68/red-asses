import SkillForm from '@/components/SkillDetails';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {}

export const metadata = {
    title: "Quiz | Skill Details"
}

const SkillDetailsPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    } else if (session.user.loggedIn != null) {
        redirect("/dashboard");
    }
    return (
        <SkillForm currentUser={session?.user} />
    )
}

export default SkillDetailsPage