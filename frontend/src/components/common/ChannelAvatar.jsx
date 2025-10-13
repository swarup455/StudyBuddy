import { getColorClass } from "./AvatarLogo";

const ChannelAvatar = ({ name }) => {
    const initials = name.split('-')[0].substring(0, 1).toUpperCase();
    return (
        <div className={`h-9 w-9 text-white flex justify-center items-center rounded-full bg-gradient-to-br ${getColorClass(name)}`}>
            {initials}
        </div>
    );
};

export default ChannelAvatar;