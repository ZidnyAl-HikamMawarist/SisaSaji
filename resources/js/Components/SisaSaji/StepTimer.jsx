import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Bell, Volume2, CheckCircle2 } from 'lucide-react';

/**
 * Utility to parse human duration string (e.g. "5 - 7 menit", "1-2 menit", "30 detik") into seconds.
 */
export function parseDurationToSeconds(durationStr) {
    if (!durationStr || typeof durationStr !== 'string') return 180;
    const str = durationStr.toLowerCase();

    // Check for seconds
    if (str.includes('detik')) {
        const match = str.match(/\d+/);
        return match ? parseInt(match[0], 10) : 30;
    }

    // Check for minutes
    if (str.includes('menit')) {
        const matches = str.match(/\d+/g);
        if (matches && matches.length > 0) {
            // Use the first number as target (e.g., "5 - 7 menit" -> 5 mins)
            return parseInt(matches[0], 10) * 60;
        }
    }

    return 180; // default 3 minutes
}

/**
 * Play a pleasant 3-tone notification chime using Web Audio API (no external mp3 file needed).
 */
export function playChime() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

            gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.15);
            gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + idx * 0.15 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + idx * 0.15);
            osc.stop(ctx.currentTime + idx * 0.15 + 0.45);
        });

        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200, 100, 300]);
        }
    } catch (e) {
        console.warn('AudioContext not supported or permitted:', e);
    }
}

export default function StepTimer({
    durationStr,
    stepTitle = '',
    compact = false,
    onComplete = null,
}) {
    const initialSeconds = parseDurationToSeconds(durationStr);
    const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const intervalRef = useRef(null);

    // Sync when durationStr prop changes
    useEffect(() => {
        const s = parseDurationToSeconds(durationStr);
        setTotalSeconds(s);
        setTimeLeft(s);
        setIsRunning(false);
        setIsFinished(false);
    }, [durationStr]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        setIsFinished(true);
                        playChime();
                        if (onComplete) onComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft, onComplete]);

    const handleToggle = (e) => {
        e?.stopPropagation();
        if (isFinished) {
            setTimeLeft(totalSeconds);
            setIsFinished(false);
            setIsRunning(true);
        } else {
            setIsRunning((prev) => !prev);
        }
    };

    const handleReset = (e) => {
        e?.stopPropagation();
        setIsRunning(false);
        setIsFinished(false);
        setTimeLeft(totalSeconds);
    };

    const handleAddMinute = (e) => {
        e?.stopPropagation();
        setTimeLeft((prev) => prev + 60);
        setTotalSeconds((prev) => prev + 60);
        setIsFinished(false);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const progress = totalSeconds > 0 ? Math.max(0, Math.min(100, ((totalSeconds - timeLeft) / totalSeconds) * 100)) : 0;

    if (compact) {
        return (
            <div
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200 text-xs ${
                    isFinished
                        ? 'bg-sage-50 border-sage-300 text-sage-800 animate-gentle-pulse'
                        : isRunning
                        ? 'bg-amber-50/90 border-amber-300 text-amber-900 shadow-soft-xs'
                        : 'bg-white/80 border-cream-300 text-charcoal-700 hover:bg-white'
                }`}
            >
                <span className="font-mono font-bold tracking-tight text-xs tabular-nums">
                    {formattedTime}
                </span>

                <button
                    type="button"
                    onClick={handleToggle}
                    className={`p-1 rounded-lg transition-transform active:scale-95 ${
                        isRunning
                            ? 'bg-amber-500 text-white'
                            : isFinished
                            ? 'bg-sage-500 text-white'
                            : 'bg-cream-200 text-charcoal-700 hover:bg-charcoal-200'
                    }`}
                    title={isRunning ? 'Jeda Timer' : 'Mulai Timer'}
                >
                    {isFinished ? (
                        <RotateCcw className="w-3 h-3" strokeWidth={2.5} />
                    ) : isRunning ? (
                        <Pause className="w-3 h-3" strokeWidth={2.5} />
                    ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" strokeWidth={1} />
                    )}
                </button>

                {(isRunning || timeLeft !== totalSeconds) && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="p-1 rounded-lg text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200 transition-colors"
                        title="Reset Timer"
                    >
                        <RotateCcw className="w-3 h-3" strokeWidth={2} />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm rounded-2xl border p-4 transition-all duration-300 ${
                isFinished
                    ? 'bg-sage-50/90 border-sage-300 shadow-soft-sm'
                    : isRunning
                    ? 'bg-amber-50/80 border-amber-300/80 shadow-soft-sm'
                    : 'bg-white/90 border-cream-200/90'
            }`}
        >
            <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isFinished
                            ? 'bg-sage-500 text-white'
                            : isRunning
                            ? 'bg-amber-500 text-white animate-gentle-pulse'
                            : 'bg-cream-200 text-charcoal-600'
                    }`}>
                        {isFinished ? <Bell className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-bold text-charcoal-800">
                        {isFinished ? 'Waktu Memasak Selesai!' : isRunning ? 'Timer Sedang Berjalan' : 'Timer Langkah Memasak'}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleAddMinute}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold bg-cream-100 hover:bg-cream-200 text-charcoal-600 border border-cream-300 transition-all active:scale-95"
                    title="Tambah 1 menit"
                >
                    <Plus className="w-3 h-3" />
                    <span>1 mnt</span>
                </button>
            </div>

            {/* Time display & Progress */}
            <div className="space-y-2 mb-3">
                <div className="flex items-baseline justify-between">
                    <span className="font-mono text-3xl font-extrabold tracking-tight text-charcoal-950 tabular-nums">
                        {formattedTime}
                    </span>
                    <span className="text-[11px] text-charcoal-400 font-medium">
                        Target: {durationStr}
                    </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-cream-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out-expo ${
                            isFinished ? 'bg-sage-500' : isRunning ? 'bg-amber-500' : 'bg-charcoal-400'
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={handleToggle}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-soft-xs ${
                        isFinished
                            ? 'bg-sage-600 hover:bg-sage-700 text-white'
                            : isRunning
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-charcoal-900 hover:bg-charcoal-800 text-white'
                    }`}
                >
                    {isFinished ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Ulangi Timer</span>
                        </>
                    ) : isRunning ? (
                        <>
                            <Pause className="w-4 h-4" />
                            <span>Jeda Waktu</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                            <span>Mulai Hitung Mundur</span>
                        </>
                    )}
                </button>

                {(isRunning || timeLeft !== totalSeconds) && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="py-2 px-3 rounded-xl border border-cream-300 hover:bg-cream-100 text-charcoal-600 text-xs font-semibold transition-all active:scale-95"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}
