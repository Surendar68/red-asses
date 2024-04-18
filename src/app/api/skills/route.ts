import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server"

export const POST = async (req: Request, res: Response) => {
    try {
        const body = await req.json();
        const skillData = body.topics.map(async (item: any) => {
            const skill = await prisma.skill.create({
                data: {
                    title: item.name, active: true, userskill: {
                        create: {
                            hardness: item.hardness,
                            userId: body.userId,
                            isDone: false
                        },
                    },
                },
                include: {
                    userskill: true, // Include post categories
                },
            })
            return skill;
        });
        const updateUser = await prisma.user.update({
            where: {
                id: body.userId,
            },
            data: {
                loggedIn: new Date(),
            },
        })

        // const userSkill = await prisma.userSkill.findFirst()
        return NextResponse.json(
            {
                message: "Skill details created successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "An unexpected error occurred.", message: error },
            {
                status: 500,
            }
        );
    }
};