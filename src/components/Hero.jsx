import React from 'react'
import heroImg from '../assets/hero.png'
import heroBase from '../assets/hero-base.png'

function Hero() {
    return (
        <>
            <div className='hidden w-screen h-screen bg-cover bg-no-repeat bg-bottom flex items-center relative' style={{ backgroundImage: `url(${heroImg})` }}>
                <div className='w-full h-full bg-black opacity-10 absolute'></div>
            </div>
            <div className='relative'>
                <div className='w-screen h-screen' id="sus">
                    <div className="ocean">
                        <div className="wave"></div>
                        <div className="wave"></div>
                    </div>
                </div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pb-20'>
                    <p className='text-8xl'>🏄🏻‍♂️</p>
                    <p className='text-7xl font-extrabold text-blue-300 z-10 text-center'>Surfing the Digital Wave</p>
                </div>
            </div>
            <div className='hidden w-screen'>
                <div className='w-full h-[10%] bg-repeat-x' style={{ backgroundImage: `url(${heroBase})` }}></div>
                <p className='text-7xl font-bold text-white z-10 text-center mt-20'>Surfing the Digital Wave</p>
            </div>
        </>
    )
}

export default Hero