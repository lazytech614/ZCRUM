import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

const UserAvatar = ({user}: any) => {
  return (
    <div className='flex items-center space-x-2 w-full'>
        <Avatar>
            <AvatarImage src={user?.profileImageUrl} alt={user?.name} />
            <AvatarFallback className='capitalize'>
                {user ? user.name : "?"}
            </AvatarFallback>
        </Avatar>
        <span className='text-sm text-gray-500'>
            {user ? user.name : "Unassigned"}
        </span>
    </div>
  )
}

export default UserAvatar