
interface InputProps {
    className?: string
    placeholder?: string
}

export const Input = ({className, placeholder}: InputProps) => {
    return <div className="w-full">
        <input type="text" placeholder={placeholder} className={`px-3 bg-transparent w-full outline-none ${className}`} />
    </div>
}