import React from 'react'

function Intro() {

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

    return (
        <div className='my-10 w-[85%] mx-auto h-screen flex flex-col justify-center items-center' id='project'>
            <p className='text-2xl text-white font-semibold text-center leading-tight'>Surfing we want to begin a trip to answer one question:</p>
            <p className='text-3xl text-white font-bold text-left leading-tight underline underline-offset-4'>How has digitalization transformed the lives of individuals and the operations of businesses across Europe?</p>
            <button className="mt-6 px-6 py-3 font-medium tracking-wide text-[#3c70aa] capitalize transition-colors duration-300 transform bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-100 focus:ring-opacity-80 shadow-md" onClick={() => scrollTo('journey_start')}>
                Start the journey 🏄🏻‍♂️
            </button>
        </div>
    )
}

export default Intro