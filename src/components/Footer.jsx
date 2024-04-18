import React from 'react'

function Footer() {
    return (
        <div className='w-full flex flex-col justify-center items-center py-10 mb-[40vh]'>
            <p className='text-center font-bold mb-4'>
                Made with <span className='animate-pulse'>❤️</span> by Sam & Nico
            </p>
            <p className='text-center font-bold'>
                © Copyright {new Date().getFullYear()} All Rights Reserved
            </p>
        </div>
    )
}

export default Footer