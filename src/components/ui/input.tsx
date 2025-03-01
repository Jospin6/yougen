import { InputHTMLAttributes } from "react";

export const Input = ({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) => {
    return <div className="w-full">
        <input type="text" {...props} className={`px-3 bg-transparent w-full outline-none ${className}`} />
    </div>
}