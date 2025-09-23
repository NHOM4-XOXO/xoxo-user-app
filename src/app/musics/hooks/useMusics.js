
'use client';
import { useRef, useState } from "react";

export default function useMusics(initialVolume = 1) {
    const musicRef = useRef(new Audio());
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(initialVolume);
    const [isMuted, setIsMuted] = useState(false);

    const togglePlay = () => {
        const audio = musicRef.current;
        if (audio.paused) {
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    const changeVolume = (v) => {
        musicRef.current.volume = v;
        setVolume(v);
        setIsMuted(v === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            musicRef.current.volume = volume;
            setIsMuted(false);
        } else {
            musicRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    return {
        musicRef,
        isPlaying,
        volume,
        isMuted,
        togglePlay,
        changeVolume,
        toggleMute,
    };
}