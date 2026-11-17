import { useRef, useState } from 'react';

export function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
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
      <audio id="wedding-music" ref={audioRef} src="/audio/original-tanpura-drone.wav" loop preload="none"
        onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onError={() => { setHasError(true); setIsPlaying(false); }} />
    </>
  );
}
