import React, { useState, useEffect } from "react";

export function InfiniteCounter() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 1); // збільшуємо без кордонів
    }, 1000);

    return () => clearInterval(interval); // очищаємо при unmount
  }, []);

  return time;
}


