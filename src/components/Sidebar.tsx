'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { FiMenu } from "react-icons/fi";


const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => {
        setIsOpen(!isOpen) 
    }

    return (
        <>
            <h1 
                className="fixed z-10 top-2 left-4 cursor-pointer sm:hidden text-black shadow-md bg-white  p-2 rounded-full "
                onClick={toggle}
            >
                {isOpen ? <RxCross2 size={24} /> : <FiMenu size={24} />}
            </h1>

            <div 
                className={`fixed top-0 left-0 h-screen w-[250px] shrink-0 p-6 border-r bg-[#1C2434] text-white transition-transform duration-300 sm:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <h1 className="text-2xl font-bold text-center">True Buy</h1>
                <nav className="mt-8">
                    <Link href="/" className="block py-2 hover:bg-gray-200 rounded px-4" onClick={toggle}>
                        Dashboard
                    </Link>
                    <Link href="/products" className="block py-2 hover:bg-gray-200 rounded px-4" onClick={toggle}> 
                        Products
                    </Link>
                    <Link href="/orders" className="block py-2 hover:bg-gray-200 rounded px-4" onClick={toggle}>
                        Orders
                    </Link>
                    <Link href="/users" className="block py-2 hover:bg-gray-200 rounded px-4" onClick={toggle}>
                        Users
                    </Link>
                </nav>
            </div>
        </>
    )
}

export default Sidebar
