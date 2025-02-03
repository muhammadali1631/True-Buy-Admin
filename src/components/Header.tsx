import React from 'react'
import { UserButton } from "@clerk/nextjs";
const Header = () => {
  return (
    <div className='fic h-14  flex items-center justify-center w-full'>
        <div className="absolute inset-0 -z-10 h-14 w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)] shadow-md"></div></div>
        <div className='absolute right-3 top-3'>
            
       <UserButton/>
        </div>
    </div>
  )
}

export default Header