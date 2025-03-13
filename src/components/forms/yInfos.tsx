"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/features/store";
import { postChannelId } from "@/features/youtube/yInfoSlice";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const formSchema = z.object({
    channelId: z.string().min(1, "Channel ID or URL is required")
});

type FormData = z.infer<typeof formSchema>;

export const YInfos = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });
    const dispatch = useDispatch<AppDispatch>()
    const user = useCurrentUser()

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        setError("");
        if (user) {
            dispatch(postChannelId({ channelId: data.channelId, userId: user.id! }))
        }
    };

    return (
        <div className="mt-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div>
                    <label className="block font-semibold">YouTube Channel ID or URL</label>
                    <input
                        type="text"
                        {...register("channelId")}
                        className="h-[30px] w-full outline-none border-[1px] border-black mb-2 rounded-xl px-2"
                        placeholder="Your Channel ID or URL"
                    />
                    {errors.channelId && <p className="text-red-500 text-sm">{errors.channelId.message}</p>}
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full h-[35px] rounded-2xl bg-black text-gray-50"
                    disabled={loading}
                >
                    {loading ? "Fetching..." : "Get Channel Info"}
                </button>
            </form>
        </div>
    );
}
