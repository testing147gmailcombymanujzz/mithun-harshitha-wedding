import { useEffect, useRef, useState } from 'react';

export function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);
  const wasManuallyControlled = useRef(false);

  useEffect(() => {
    const attemptAutoplay = () => {
      const audio = audioRef.current;
      if (!audio || wasManuallyControlled.current || !audio.paused) return;

      setHasAttemptedAutoplay(true);
      audio.volume = 0.32;
      audio.play().then(() => setHasError(false)).catch(() => setHasError(true));
    };
    const startOnInteraction = (event) => {
      if (event.target instanceof Element && event.target.closest('.music-control')) return;
      attemptAutoplay();
    };
    const timeoutId = window.setTimeout(attemptAutoplay, 3_000);
    window.addEventListener('scroll', attemptAutoplay, { once: true, passive: true });
    window.addEventListener('pointerdown', startOnInteraction, { once: true, passive: true });
    window.addEventListener('keydown', attemptAutoplay, { once: true });
    // Tapping the envelope seal is a user gesture, so the music can begin with it.
    window.addEventListener('wedding:open', attemptAutoplay);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', attemptAutoplay);
      window.removeEventListener('pointerdown', startOnInteraction);
      window.removeEventListener('keydown', attemptAutoplay);
      window.removeEventListener('wedding:open', attemptAutoplay);
    };
  }, []);

  async function togglePlayback() {
    wasManuallyControlled.current = true;
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        audio.volume = 0.32;
        await audio.play();
        setHasError(false);
        setIsPlaying(true);
      } catch {
        setHasError(true);
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }

  return (
    <>
      <button className="music-control" type="button" onClick={togglePlayback}
        aria-label={isPlaying ? 'Pause optional wedding music' : 'Play optional wedding music'}
        aria-pressed={isPlaying} aria-controls="wedding-music" title={isPlaying ? 'Pause wedding music' : 'Play wedding music'}>
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {isPlaying ? <path d="M8 5v14m8-14v14" strokeWidth="2.3" /> : <><path d="M10 5 19 12l-9 7V5Z" /><path d="M6 8v8" /></>}
        </svg>
        <span className="music-control__label">{hasError ? 'Wedding music could not be played' : isPlaying ? 'Wedding music is playing' : 'Wedding music is paused'}</span>
      </button>
      <audio id="wedding-music" ref={audioRef} src="/audio/wedding-instrumental.mp3" loop preload="auto" volume={0.32}
        data-autoplay-attempted={hasAttemptedAutoplay}
        onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onError={() => { setHasError(true); setIsPlaying(false); }} />
    </>
  );
}
