import { useState, useEffect } from 'react';

export default function BookAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  
  useEffect(() => {
    // Auto-hover effect after 2 seconds for visual appeal
    const timer = setTimeout(() => {
      setIsHovered(true);
      setTimeout(() => setIsHovered(false), 2000);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex justify-center items-start py-20">
      <div 
        className={`relative w-48 h-72 transition-all duration-1000 ease-out ${
          isHovered ? 'transform-none scale-105' : 'transform rotate-y-[-20deg] rotate-x-[10deg]'
        }`}
        style={{
          perspective: '1500px',
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? '0 50px 100px rgba(0, 0, 0, 0.4)' 
            : '0 30px 60px rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid="book-animation"
      >
        {/* Book Cover */}
        <div 
          className="absolute inset-0 border border-gray-800 rounded-sm"
          style={{
            backgroundImage: "url('https://politicalscienceblog.com/wp-content/uploads/2023/05/How-to-Win-Friends-and-Influence-People-768x1186.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backfaceVisibility: 'hidden'
          }}
        />
        
        {/* Book Spine */}
        <div 
          className="absolute left-[-12px] w-3 h-full bg-amber-600 rounded-l-sm"
          style={{
            transform: 'rotateY(90deg)',
            transformOrigin: 'left center'
          }}
        />
        
        {/* Book Pages */}
        <div 
          className="absolute right-[-6px] w-1.5 h-full rounded-r-sm"
          style={{
            background: `repeating-linear-gradient(
              to bottom,
              #f7f7f7,
              #eaeaea 2px,
              #f7f7f7 4px
            )`,
            transform: 'rotateY(-90deg)',
            transformOrigin: 'right center'
          }}
        />
      </div>
    </div>
  );
}