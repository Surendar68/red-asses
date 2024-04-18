'use client';
import { useTheme } from 'next-themes';
import React from 'react'
import D3WordCloud from "react-d3-cloud";

type Props = {}

const data = [
    {
        text: "React JS",
        value: 3,
    },
    {
        text: "Computer",
        value: 15,
    },
    {
        text: "Next js",
        value: 5,
    },
    {
        text: "Html",
        value: 10,
    },
    {
        text: "Css",
        value: 8,
    },
    {
        text: "Javascript",
        value: 7,
    },
];

const fontSizeMapper = (word: { value: number }) =>
    Math.log2(word.value) * 5 + 16;

const CustomWordCloud = (props: Props) => {
    const theme = useTheme();
    return (
        <>
            <D3WordCloud
                data={data}
                height={550}
                font="Times"
                fontSize={fontSizeMapper}
                rotate={0}
                padding={10}
                fill={theme.theme === "dark" ? "white" : "black"}
            />
        </>
    )
}

export default CustomWordCloud