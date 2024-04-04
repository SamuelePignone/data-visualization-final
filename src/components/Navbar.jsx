import React from 'react'

function Navbar() {
    return (
        <>
            <nav className="bg-white dark:bg-transparent fixed top-0 left-0 w-full z-50">
                <div className="container flex items-center justify-center p-6 mx-auto text-gray-600 capitalize dark:text-gray-200">
                    <a href="#" className="text-gray-800 transition-colors duration-300 transform dark:text-gray-200 border-b-2 border-[#bc4458] mx-1.5 sm:mx-6 font-bold text-xl">Sus</a>

                    <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-[#bc4458] mx-1.5 sm:mx-6 font-bold text-xl">Aaaaaa</a>

                    <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-[#bc4458] mx-1.5 sm:mx-6 font-bold text-xl">Eeeeee</a>

                    <a href="#" className="border-b-2 border-transparent hover:text-gray-800 transition-colors duration-300 transform dark:hover:text-gray-200 hover:border-[#bc4458] mx-1.5 sm:mx-6 font-bold text-xl">Iiiiiii</a>
                </div>
            </nav>
        </>
    )
}

export default Navbar