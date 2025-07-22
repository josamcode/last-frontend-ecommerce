import React from "react";

const GradientButton = ({ children, onClick, className = "", disabled = false, ...props }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
        w-full 
        bg-gradient-to-r 
        from-indigo-500 
        via-purple-500 
        to-pink-500 
        text-white 
        py-4 
        rounded-xl 
        font-semibold 
        shadow-lg 
        hover:shadow-xl 
        transform 
        hover:-translate-y-0.5 
        transition-all 
        duration-300 
        focus:outline-none 
        focus:ring-4 
        focus:ring-indigo-300
        ${disabled
                    ? 'opacity-60 cursor-not-allowed transform-none hover:shadow-none'
                    : 'hover:shadow-xl active:translate-y-0'
                } 
        ${className}
      `.trim()}
            {...props}
        >
            {children}
        </button>
    );
};

export default GradientButton;