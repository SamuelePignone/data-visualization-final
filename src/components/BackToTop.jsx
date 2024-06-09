import React, { useState, useEffect } from 'react';
import { MdOutlineBubbleChart } from "react-icons/md";

function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const handleScroll = () => {
        if (window.scrollY === 0 && isAnimating) {
            document.getElementById('back-to-top-btn').classList.add('breathe');
            setTimeout(() => {
                document.getElementById('back-to-top-btn').classList.remove('breathe');
                setIsAnimating(false);
            }, 1500);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setIsAnimating(true);
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isAnimating]);

    return (
        <button
            id="back-to-top-btn"
            className={`z-[9999999] w-14 h-14 fixed right-10 bottom-10 flex justify-center items-center font-medium tracking-wide text-[#3c70aa] capitalize transition-colors duration-300 transform bg-white rounded-full hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-100 focus:ring-opacity-80 shadow-md ${isVisible || isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={scrollToTop}
            alt="Back to surface"
        >
            <MdOutlineBubbleChart className="inline-block text-3xl" />
        </button>
    );
}

export default BackToTop;
