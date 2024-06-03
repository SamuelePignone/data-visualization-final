import React, { useState, useEffect } from 'react';

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
            className={`z-[9999999] fixed right-10 bottom-10 px-6 py-3 font-medium tracking-wide text-[#3c70aa] capitalize transition-colors duration-300 transform bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring focus:ring-gray-100 focus:ring-opacity-80 shadow-md ${isVisible || isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={scrollToTop}
        >
            🫧 Back to surface 🫧
        </button>
    );
}

export default BackToTop;
