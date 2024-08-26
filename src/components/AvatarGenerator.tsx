import React, { useEffect, useRef } from 'react';

interface AvatarGeneratorProps {
  initials: string;
  size: number;
  className?: string;
}

const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({ initials, size, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = getRandomColor();
        ctx.fillRect(0, 0, size, size);
        ctx.font = `${size / 2}px Arial`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(initials, size / 2, size / 2);
      }
    }
  }, [initials, size]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return <canvas ref={canvasRef} width={size} height={size} className={className} />;
};

export default AvatarGenerator;