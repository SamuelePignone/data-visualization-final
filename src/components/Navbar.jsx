import React, { useState, useEffect } from 'react';

function Navbar() {
    const [activeSection, setActiveSection] = useState('home');

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const scrollPosition = element.offsetTop - 100;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        const sections = ['home', 'project', 'team'];
        const scrollPosition = window.scrollY;

        if (scrollPosition < 100) setActiveSection('home');
        else if (scrollPosition >= 100 && scrollPosition < document.getElementById('project').offsetTop -150) setActiveSection('home');
        else if (scrollPosition >= document.getElementById('project').offsetTop - 150 && scrollPosition < document.getElementById('team').offsetTop - 150) setActiveSection('project');
        else if (scrollPosition >= document.getElementById('team').offsetTop - 150) setActiveSection('team');
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const isActiveSection = (section) => {
        return section === activeSection;
    };

    return (
        <>
            <nav className="bg-[#edf4fb] fixed top-0 left-0 w-full z-[999999999999] shadow-sm">
                <div className="container flex items-center justify-center p-6 mx-auto text-blue-300 capitalize">
                    <div
                        className={`${
                            isActiveSection('home')
                                ? 'transition-colors duration-300 transform border-b-2 border-[#95dc6f] text-blue-400 mx-1.5 sm:mx-6 font-bold text-xl'
                                : 'border-b-2 border-transparent hover:border-[#95dc6f87] hover:text-blue-400 transition-colors duration-300 transform mx-1.5 sm:mx-6 font-bold text-xl cursor-pointer'
                        }`}
                        onClick={() => scrollTo('home')}
                    >
                        Home
                    </div>

                    <div
                        className={`${
                            isActiveSection('project')
                                ? 'transition-colors duration-300 transform border-b-2 border-[#95dc6f] text-blue-400 mx-1.5 sm:mx-6 font-bold text-xl'
                                : 'border-b-2 border-transparent hover:border-[#95dc6f87] hover:text-blue-400 transition-colors duration-300 transform mx-1.5 sm:mx-6 font-bold text-xl cursor-pointer'
                        }`}
                        onClick={() => scrollTo('project')}
                    >
                        Project
                    </div>

                    <div
                        className={`${
                            isActiveSection('team')
                                ? 'transition-colors duration-300 transform border-b-2 border-[#95dc6f] text-blue-400 mx-1.5 sm:mx-6 font-bold text-xl'
                                : 'border-b-2 border-transparent hover:border-[#95dc6f87] hover:text-blue-400 transition-colors duration-300 transform mx-1.5 sm:mx-6 font-bold text-xl cursor-pointer'
                        }`}
                        onClick={() => scrollTo('team')}
                    >
                        Team
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar