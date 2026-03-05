import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const fireConfetti = (options?: confetti.Options) => {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#5ECFCF', '#FFD966', '#F5A48A', '#C4B5E0', '#98E4C4'],
    };

    confetti({
      ...defaults,
      ...options,
    });
  };

  const fireMultiple = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#5ECFCF', '#FFD966', '#F5A48A', '#C4B5E0', '#98E4C4'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const fireRainbow = () => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#7950f2', '#da77f2'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const fireStars = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'] as confetti.Shape[],
      colors: ['#FFD966', '#FFFFFF', '#5ECFCF'],
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star'] as confetti.Shape[],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle'] as confetti.Shape[],
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  };

  return { fireConfetti, fireMultiple, fireRainbow, fireStars };
};