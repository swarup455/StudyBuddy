import { getColorClass } from "./AvatarLogo";

const ChannelAvatar = ({ channel }) => {
    const initials = channel.channelName.split('-')[0].substring(0, 1).toUpperCase();
    return (
        <div className={`h-full aspect-square text-white flex justify-center items-center rounded-full bg-gradient-to-br ${getColorClass(channel.channelName)} overflow-hidden`}>
            {channel.channelLogo ?
                <img className="h-full w-full object-cover" src={channel.channelLogo} alt="logo" />
                :
                <p>{ initials }</p>
            }
        </div>
    );
};

export default ChannelAvatar;