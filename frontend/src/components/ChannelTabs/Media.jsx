import React from 'react'

const Media = ({media}) => {
    return (
        <div className='w-full flex-1'>
            <ul className='h-full w-full overflow-y-auto grid gap-2 grid-cols-4 p-5 bg-zinc-300/30 dark:bg-zinc-950/30 rounded-xl border border-zinc-200 dark:border-zinc-800'>
                {media.map((media) => (
                    <li key={media?._id}>
                        <img src={media?.image} className='w-full aspect-square rounded-md object-cover' alt="media" />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Media