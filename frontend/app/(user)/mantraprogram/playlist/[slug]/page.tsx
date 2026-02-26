"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import { getMantraById, type ContentItem, upsertMantraProgress } from "@/lib/api/content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

const resolveMediaUrl = (mediaUrl: string | undefined, fallbackUrl: string) => {
    const source = mediaUrl || fallbackUrl;
    if (source.startsWith("http")) return source;
    const normalizedPath = source.startsWith("/") ? source : `/${source}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export default function MantraPlaylistPlayerPage() {
    const params = useParams<{ slug: string }>();
    const contentId = params?.slug;
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [item, setItem] = useState<ContentItem | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [error, setError] = useState<string | null>(null);
    const [practiceLogged, setPracticeLogged] = useState(false);

    useEffect(() => {
        if (!contentId) return;

        const load = async () => {
            try {
                const mantra = await getMantraById(contentId);
                setItem(mantra);
                setError(null);
            } catch (err: Error | any) {
                setError(err.message || "Failed to load mantra");
            }
        };

        load();
    }, [contentId]);

    useEffect(() => {
        const audioEl = audioRef.current;
        if (!audioEl || !item) return;

        audioEl.pause();
        audioEl.src = resolveMediaUrl(item.audio_url, "/uploads/audio/gyatri%20mantra.mp3");
        audioEl.load();
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setPracticeLogged(false);
    }, [item]);

    const togglePlay = async () => {
        const audioEl = audioRef.current;
        if (!audioEl || !item) return;

        if (isPlaying) {
            audioEl.pause();
            return;
        }

        try {
            await audioEl.play();
            if (!practiceLogged) {
                await upsertMantraProgress({ mantra_id: item.id, times_practiced: 1 });
                setPracticeLogged(true);
            }
        } catch {
            setIsPlaying(false);
            setError("Unable to play audio");
        }
    };

    const handleSeek = (value: number) => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        audioEl.currentTime = value;
        setCurrentTime(value);
    };

    const handleVolumeChange = (value: number) => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        const normalized = value / 100;
        audioEl.volume = normalized;
        setVolume(normalized);
    };

    const jumpBy = (offset: number) => {
        const audioEl = audioRef.current;
        if (!audioEl) return;
        const next = Math.min(Math.max(0, audioEl.currentTime + offset), duration || audioEl.duration || 0);
        audioEl.currentTime = next;
        setCurrentTime(next);
    };

    const lyricsLines = useMemo(() => {
        if (!item?.lyrics) return ["Lyrics unavailable"];
        return item.lyrics.split("\n").map((line) => line.trim()).filter(Boolean);
    }, [item?.lyrics]);

    if (!item) {
        return <div className="px-8 py-8">{error || "Loading mantra..."}</div>;
    }

    return (
        <div className="px-8 py-8 text-slate-900">
            <audio
                ref={audioRef}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || 0)}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center justify-between">
                <Link href="/mantraprogram" className="w-11 h-11 rounded-full border border-slate-200 bg-white text-[#6a5ae0] flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4" />
                </Link>

                <Link href="/mantraprogram" className="h-11 px-6 rounded-full border border-slate-200 bg-white text-slate-700 inline-flex items-center gap-2 font-medium">
                    Close Player
                </Link>
            </div>

            <section className="max-w-4xl mx-auto mt-6">
                <div className="mx-auto w-72 h-72 md:w-80 md:h-80 relative rounded-[2.4rem] overflow-hidden border-4 border-white shadow-xl">
                    <Image src={item.image_url || item.cover_image_url || "/images/homepage.png"} alt={item.title} fill className="object-cover" />
                </div>

                <div className="text-center mt-6">
                    <h1 className="text-5xl font-semibold italic text-slate-900">{item.title}</h1>
                    <p className="text-xs tracking-[0.22em] font-semibold text-slate-500 mt-2 uppercase">{item.subtitle || "Sacred mantra practice"}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-10 mt-12">
                    <div>
                        <p className="text-sm font-semibold tracking-widest text-[#6a5ae0] uppercase">LYRICS</p>
                        <div className="mt-6 space-y-6 text-4xl leading-tight text-slate-800">
                            {lyricsLines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold tracking-widest text-[#6a5ae0] uppercase">MEANING</p>
                        <p className="mt-6 text-4xl leading-tight italic text-slate-600">&quot;{item.meaning || item.description || item.transliteration || "Meaning unavailable"}&quot;</p>
                    </div>
                </div>

                <div className="mt-10 rounded-3xl bg-white/80 border border-slate-200 shadow-sm px-6 py-5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={Math.max(duration, 0)}
                        step={0.1}
                        value={currentTime}
                        onChange={(event) => handleSeek(Number(event.target.value))}
                        className="w-full mt-2 accent-[#6a5ae0]"
                    />

                    <div className="mt-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <button onClick={() => jumpBy(-10)} className="w-10 h-10 rounded-full text-slate-600 hover:bg-slate-100 flex items-center justify-center" aria-label="Back 10 seconds">
                                <SkipBack className="w-4 h-4" />
                            </button>
                            <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-[#6a5ae0] text-white shadow-md flex items-center justify-center" aria-label={isPlaying ? "Pause" : "Play"}>
                                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                            </button>
                            <button onClick={() => jumpBy(10)} className="w-10 h-10 rounded-full text-slate-600 hover:bg-slate-100 flex items-center justify-center" aria-label="Forward 10 seconds">
                                <SkipForward className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 w-36">
                            <Volume2 className="w-4 h-4 text-slate-500" />
                            <input
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={Math.round(volume * 100)}
                                onChange={(event) => handleVolumeChange(Number(event.target.value))}
                                className="w-full accent-[#6a5ae0]"
                            />
                        </div>
                    </div>
                </div>

                {error && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>}
            </section>
        </div>
    );
}
