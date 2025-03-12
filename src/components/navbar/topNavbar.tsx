import { useCurrentUser } from "@/hooks/useCurrentUser"

export const TopNavbar = () => {
    const user = useCurrentUser()

    return <div className="flex justify-between h-[50px] w-full text-gray-50 items-center px-10">
        <div></div>
        <div className="rounded-full w-[30px] h-[30px] bg-blue-500 text-white flex justify-center items-center font-semibold">{user && user.name.charAt(0)}</div>
    </div>
}