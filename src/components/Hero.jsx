import React from 'react'
import heroImg from '../assets/hero.png'
import heroBase from '../assets/hero-base.png'

function Hero() {
    return (
        <>
            <div className='w-screen h-screen bg-cover bg-no-repeat bg-bottom flex items-center relative' style={{backgroundImage: `url(${heroImg})`}}>
                <div className='w-full h-full bg-black opacity-10 absolute'></div>
            </div>
            <div className='h-screen w-screen'>
                <div className='w-full h-[10%] bg-repeat-x' style={{backgroundImage: `url(${heroBase})`}}></div>
                <p className='text-7xl font-bold text-white ml-[5%] z-10 text-center mt-20'>Surfing the Digital Wave</p>
            </div>
        </>
    )
}

export default Hero