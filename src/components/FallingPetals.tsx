import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  width: number;
  height: number;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
  blur: string;
  opacity: number;
}

export const FallingPetals: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const count = 12;
    const generated: Petal[] = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 14 + 8; // 8px to 22px
      generated.push({
        id: i,
        width: size,
        height: size,
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 50 + 20}px`,
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${Math.random() * 12 + 10}s`,
        blur: size < 12 ? 'blur(1.5px)' : 'none',
        opacity: size < 12 ? 0.6 : Math.random() * 0.3 + 0.6,
      });
    }
    setPetals(generated);
  }, []);

  return (
    <div className="petals-container absolute inset-0 overflow-hidden pointer-events-none" id="petals-canvas">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="petal absolute"
          style={{
            width: `${petal.width}px`,
            height: `${petal.height}px`,
            left: petal.left,
            top: petal.top,
            animationDelay: petal.animationDelay,
            animationDuration: petal.animationDuration,
            filter: petal.blur,
            opacity: petal.opacity,
            animationName: 'fall',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        />
      ))}
    </div>
  );
};
export default FallingPetals;
