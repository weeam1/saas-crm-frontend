export const animateValue = ({ start = 0, end, duration = 1000, onUpdate, onComplete }) => {
  const startTime = performance.now();
  const change = end - start;
  
  const animate = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);
    const currentValue = start + change * progress;
    
    onUpdate(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  requestAnimationFrame(animate);
};