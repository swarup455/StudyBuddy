import { useSelector } from "react-redux";

export const getInitials = (name) => {
    if (!name) return '??';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
};

export const getColorClass = (name) => {
    if (!name) return 'from-gray-400 to-gray-500';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
        'from-blue-500 to-purple-500',
        'from-pink-500 to-orange-500',
        'from-green-500 to-teal-500',
        'from-purple-500 to-pink-500',
        'from-orange-500 to-red-500',
        'from-teal-500 to-blue-500',
        'from-indigo-500 to-purple-500',
        'from-rose-500 to-pink-500',
        'from-cyan-500 to-blue-500',
        'from-amber-500 to-orange-500',
    ];

    return colors[Math.abs(hash) % colors.length];
};

export const UserLogo = ({ name, about, role, isAdmin, isOnline = false }) => {
    const initials = getInitials(name);
    const colorClass = getColorClass(name);

    return (
        <div className="h-full w-full flex items-center justify-start gap-2 md:gap-3">
            <div className="relative w-fit h-full">
                <div className={`h-full aspect-square rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center text-white text-sm font-medium`}>
                    {initials}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${isOnline ? 'bg-green-500' : 'bg-zinc-400'} border-2 border-white dark:border-zinc-900 rounded-full`} />
            </div>
            <div className="flex items-center gap-1">
                <p className=" text-xs sm:text-sm">{name}</p>
                <p className="text-zinc-300 dark:text-zinc-300 line-clamp-1 text-xs sm:text-sm">{about}</p>
                <p className={`text-xs sm:text-sm ${role.toLowerCase()!=="editor" ? "text-zinc-400 dark:text-zinc-400" : "text-green-400"}`}>{role}</p>
            </div>
            {isAdmin && <p className="flex-1 text-end text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">Admin</p>}
        </div>
    );
};

export const UserCard = ({ user, work }) => {
    const { authUser } = useSelector((state) => state.auth);

    return (
        <div className='w-full aspect-square p-3 my-5 border rounded-2xl bg-zinc-300/10 dark:bg-zinc-800/10 
          hover:bg-zinc-300 hover:dark:bg-zinc-800 cursor-pointer border-zinc-300 dark:border-zinc-800 
          flex flex-col items-center justify-center'>
            <div className={`flex-1 text-white aspect-square flex justify-center items-center rounded-full bg-gradient-to-br ${getColorClass(user?.fullName)}`}>
                {getInitials(user?.fullName)}
            </div>
            <div className='w-full text-center'>
                <h1 className='text-xl text-zinc-700 dark:text-zinc-300'>{user?.fullName}</h1>
                {user?._id === authUser._id && <p className="text-sm">(You)</p>}
                <p className={`text-sm ${work === "Editor" || work === "editor" ? "text-green-400 dark:text-green-400" : "text-zinc-600 dark:text-zinc-400"}`}>{work}</p>
            </div>
        </div>
    )
}