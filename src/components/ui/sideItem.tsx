interface SideItemProps {
    label: string
    className?: string
    onClick?: () => void
    icon?: React.ReactNode
    isActive?: boolean
}

export const SideItem = ({ label, onClick, icon, isActive = false, className }: SideItemProps) => {
    const style = "text-gray-50 h-[40px] px-2 flex items-center hover:bg-gray-600 mb-2"
    return <h1 className={isActive ? `bg-gray-600 ${style} ${className}`: `${style} ${className}`} onClick={onClick}>
        <div className={icon ? `h-[25px] w-[25px] mr-2`: "hidden"}>{icon}</div>
        <div>{label}</div>
    </h1>
}