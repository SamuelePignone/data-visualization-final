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
        const sections = ['home', 'project', 'resources', 'team'];
        const scrollPosition = window.scrollY;

        if (scrollPosition < 100) setActiveSection('home');
        else if (scrollPosition >= 100 && scrollPosition < 100 + document.getElementById('project').offsetTop) setActiveSection('home');
        else if (scrollPosition >= 100 + document.getElementById('project').offsetTop && scrollPosition < 100 + document.getElementById('resources').offsetTop) setActiveSection('project');
        else if (scrollPosition >= 100 + document.getElementById('resources').offsetTop && scrollPosition < 100 + document.getElementById('team').offsetTop) setActiveSection('resources');
        else if (scrollPosition >= 100 + document.getElementById('team').offsetTop) setActiveSection('team');
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
                            isActiveSection('resources')
                                ? 'transition-colors duration-300 transform border-b-2 border-[#95dc6f] text-blue-400 mx-1.5 sm:mx-6 font-bold text-xl'
                                : 'border-b-2 border-transparent hover:border-[#95dc6f87] hover:text-blue-400 transition-colors duration-300 transform mx-1.5 sm:mx-6 font-bold text-xl cursor-pointer'
                        }`}
                        onClick={() => scrollTo('resources')}
                    >
                        Resources
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