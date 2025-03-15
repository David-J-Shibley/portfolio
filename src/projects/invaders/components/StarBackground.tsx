import { useEffect, useState } from 'react';

type Star = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const generateStars = (width: number, height: number, count: number): Star[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.1,
    opacity: Math.random() * 0.8 + 0.2,
  }));
};

const StarBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const starCount = Math.floor((dimensions.width * dimensions.height) / 6000);
    setStars(generateStars(dimensions.width, dimensions.height, starCount));
  }, [dimensions]);

  useEffect(() => {
    const animateStars = () => {
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          y: (star.y + star.speed) % dimensions.height,
          opacity: star.opacity + (Math.random() * 0.1 - 0.05),
        }))
      );
    };

    const interval = setInterval(animateStars, 50);
    return () => clearInterval(interval);
  }, [dimensions.height]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}px`,
            top: `${star.y}px`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;