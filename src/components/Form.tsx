"use client"
import React from 'react'
import { useFieldArray, useForm } from "react-hook-form";

type FormValues = {
    topic: string,
    social: {
        facebook: string,
        twitter: string,
    },
    phoneNumbers: {
        number: string
    }[]
}
const Form = () => {
    const form = useForm<FormValues>({
        defaultValues: {
            topic: "",
            social: {
                facebook: "",
                twitter: "",
            },
            phoneNumbers: [{ number: "" }]
        }
    });
    const { register, control, handleSubmit } = form;
    const { fields } = useFieldArray({
        name: "phoneNumbers",
        control: control
    })
    const onSubmit = (data: FormValues) => {
        console.log(data);
    }
    return (
        <div className='flex justify-center items-center h-screen'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='flex-col'>
                    <label htmlFor="topic">Topic</label>
                    <input type="text" id='topic' {...register("topic")} />
                </div>
                <div className='flex-col'>
                    <label htmlFor="fb">Facebook</label>
                    <input type="text" id='fb' {...register("social.facebook")} />
                </div>
                <div className='flex-col'>
                    <label htmlFor="fb">Twitter</label>
                    <input type="text" id='fb' {...register("social.twitter")} />
                </div>
                <label>Phone Numbers</label>
                {fields.map((field, index) => {
                    return (
                        <div className='form-control' key={field.id}>
                            <p>I would like to:</p>
                            <label htmlFor="field-rain">
                                <input
                                    {...register(`phoneNumbers.${index}.number`)}
                                    type="radio"
                                    value="4565456445"
                                    id="field-rain"
                                />
                                4565456445
                            </label>
                            <label htmlFor="field-wind">
                                <input
                                    {...register(`phoneNumbers.${index}.number`)}
                                    type="radio"
                                    value="9898465465"
                                    id="field-wind"
                                />
                                9898465465
                            </label>
                        </div>
                    )
                })}

                <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Submit</button>
            </form>
        </div>
    )
}

export default Form;
