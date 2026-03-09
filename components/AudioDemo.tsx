import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, AlertCircle } from 'lucide-react';

const AudioDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fileError, setFileError] = useState(false);

  const audioSrc = '/demo.mp3';
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bars, setBars] = useState<number[]>(new Array(16).fill(10));

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.preload = "metadata";
    }

    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => {
      if (!isNaN(audio.duration) && audio.duration !== Infinity) {
        setDuration(audio.duration);
      }
    };
    const onEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setBars(new Array(16).fill(10));
    };
    const onError = () => {
      setIsPlaying(false);
      setFileError(true);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, [audioSrc]);

  const togglePlay = async () => {
    if (fileError) return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        setIsPlaying(false);
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setBars((prev) =>
          prev.map((h) => {
            const target = Math.random() * 100;
            const move = (target - h) * 0.2;
            return Math.max(10, h + move);
          })
        );
      }, 50);
    } else {
      setBars(new Array(16).fill(5));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section id="demo" className="py-24 md:py-32 border-b-2 border-white/20 relative w-full">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row gap-16 md:gap-24 items-center">

        {/* Play Button - Massive */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start shrink-0">
          <button
            onClick={togglePlay}
            disabled={fileError}
            className={`relative group w-64 h-64 md:w-80 md:h-80 rounded-full flex flex-col items-center justify-center transition-all duration-500 overflow-hidden border-2 cursor-pointer
                  ${fileError
                ? 'border-red-500 text-red-500 bg-red-500/10 cursor-not-allowed'
                : 'border-white text-white hover:bg-white hover:text-accent-blue'
              }
              `}
          >
            <div className="absolute inset-0 bg-white scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full origin-center"></div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              {fileError ? (
                <AlertCircle className="w-16 h-16" />
              ) : isPlaying ? (
                <Pause className="w-20 h-20 fill-current" />
              ) : (
                <Play className="w-20 h-20 fill-current ml-4" />
              )}
              <span className="font-display font-bold uppercase tracking-[0.2em] text-sm mt-4">
                {fileError ? "Грешка" : isPlaying ? "Пауза" : "Слушай Демото"}
              </span>
            </div>
          </button>
        </div>

        {/* Info & Visualizer */}
        <div className="w-full md:w-2/3 flex flex-col">
          <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Гласът на<br />вашия бизнес.
          </h2>
          <p className="text-xl md:text-2xl font-medium leading-normal opacity-90 mb-12 max-w-2xl">
            Чуйте как звучи бъдещето. Безупречна интонация, моментални реакции и пълно разбиране на контекста.
          </p>

          {/* Custom Massive Visualizer */}
          <div className="w-full">
            <div className="flex items-end justify-between h-32 md:h-48 gap-2 mb-4 border-b-2 border-white pb-2 overflow-hidden">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className="w-full bg-white transition-all duration-75 ease-out rounded-t-sm"
                  style={{
                    height: `${fileError ? 20 : height}%`,
                    opacity: isPlaying ? 1 : 0.3,
                  }}
                />
              ))}
            </div>

            <div
              className={`w-full h-4 relative ${fileError ? 'cursor-not-allowed' : 'cursor-pointer group'}`}
              onClick={(e) => {
                if (audioRef.current && duration > 0 && !fileError) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const percentage = x / rect.width;
                  audioRef.current.currentTime = percentage * duration;
                  setCurrentTime(percentage * duration);
                }
              }}
            >
              {/* Progress Line */}
              <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-1 bg-white/20"></div>
              <div
                className="absolute inset-0 top-1/2 -translate-y-1/2 h-1 bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
              {/* Thumb */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md"
                style={{ left: `calc(${progress}% - 8px)` }}
              ></div>
            </div>

            <div className="flex justify-between mt-4 font-mono text-sm tracking-widest uppercase font-bold">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/20 uppercase tracking-widest font-bold text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              Естествена реч
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
              Без забавяне
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white opacity-50"></div>
              Български Език
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AudioDemo;
