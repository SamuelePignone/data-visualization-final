import React from 'react'

function Navbar() {

    const scrollTo = (id) => {
        const element = document.getElementById(id)
        if (element) {
            const scrollPosition = element.offsetTop - 100
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            })
        }
    }

    return (
        <>
            <nav className="bg-[#edf4fb] fixed top-0 left-0 w-full z-50 shadow-sm">
                <div className="container flex items-center justify-center p-6 mx-auto text-blue-300 capitalize">
                    <a href="#" className="transition-colors duration-300 transform border-b-2 border-[#95dc6f] text-blue-400 mx-1.5 sm:mx-6 font-bold text-xl">Home</a>

                    <a href="#" className="border-b-2 border-transparent hover:border-[#95dc6f87] hover:text-blue-400 transition-colors duration-300 transform mx-1.5 sm:mx-6 font-bold text-xl" onClick={() => scrollTo('project')}>Project</a>

                    <a href="#" className="border-b-2 border-transparent hover:border-[#95dc6f87] hover:text-blue-400 transition-colors duration-300 transform mx-1.5 sm:mx-6 font-bold text-xl">Resource</a>

                    <a href="#" className="border-b-2 border-transparent hover:border-[#95dc6f87] hover:text-blue-400 transition-colors duration-300 transform mx-1.5 sm:mx-6 font-bold text-xl">Team</a>
                </div>
            </nav>
        </>
    )
}

export default Navbar