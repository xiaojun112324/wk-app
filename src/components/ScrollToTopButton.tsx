import React, { useState, useEffect } from 'react';

const ScrollToTopButton: React.FC = () => {
    // State to track visibility of the button
    const [isVisible, setIsVisible] = useState(false);

    // Handle window scroll event
    const handleScroll = () => {
     
        if (window.scrollY > 500) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Add scroll event listener when the component mounts
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-30 z-10 cursor-pointer right-2 sm:right-5  py-1 px-1.5 rounded-full bg-accent text-white transition-opacity duration-300 ${isVisible ? 'block' : 'hidden'}`}
            style={{ transition: 'opacity 0.3s ease-in-out' }}
        >
            ↑
        </button>
    );
};

export default ScrollToTopButton;
