import React, { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Chip from './Chip';

export default function TagInput({
    label,
    placeholder,
    tags = [],
    onAddTag,
    onRemoveTag,
    maxTags = 7,
    variant = 'sage',
    hint,
}) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitTag();
        }
    };

    const submitTag = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        const success = onAddTag(trimmed);
        if (success) {
            setInputValue('');
        }
    };

    const isMaxReached = tags.length >= maxTags;

    const focusStyles = {
        sage: 'focus-within:border-sage-400 focus-within:ring-1 focus-within:ring-sage-200',
        terracotta: 'focus-within:border-terracotta-400 focus-within:ring-1 focus-within:ring-terracotta-200',
    };

    const buttonStyles = {
        sage: 'bg-sage-500 hover:bg-sage-600 text-white',
        terracotta: 'bg-terracotta-500 hover:bg-terracotta-600 text-white',
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Label row */}
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider">
                    {label}
                </label>
                <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md tabular-nums ${
                        isMaxReached
                            ? 'bg-charcoal-100 text-charcoal-500 font-bold'
                            : 'bg-cream-100 text-charcoal-400'
                    }`}
                >
                    {tags.length}/{maxTags}
                </span>
            </div>

            {/* Input row */}
            <div className={`flex gap-1.5 p-1.5 rounded-xl border border-cream-300/80 bg-white/70 transition-all duration-200 ${focusStyles[variant] || focusStyles.sage}`}>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isMaxReached ? `Batas (${maxTags}) tercapai` : placeholder}
                    disabled={isMaxReached}
                    className={`flex-1 px-3 py-2 rounded-lg border-0 bg-transparent text-sm text-charcoal-800 placeholder:text-charcoal-300 focus:outline-none focus:ring-0 ${
                        isMaxReached ? 'cursor-not-allowed text-charcoal-400' : ''
                    }`}
                />
                <button
                    type="button"
                    onClick={submitTag}
                    disabled={isMaxReached || !inputValue.trim()}
                    className={`px-3 py-2 rounded-lg flex items-center justify-center transition-all duration-150 active:scale-[0.95] ${
                        isMaxReached || !inputValue.trim()
                            ? 'bg-charcoal-50 text-charcoal-300 cursor-not-allowed'
                            : buttonStyles[variant] || buttonStyles.sage
                    }`}
                    aria-label="Tambah Bahan"
                >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                </button>
            </div>

            {/* Chips display */}
            {tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag, index) => (
                        <Chip
                            key={`${tag}-${index}`}
                            label={tag}
                            variant={variant}
                            onRemove={() => onRemoveTag(index)}
                        />
                    ))}
                </div>
            ) : (
                hint && (
                    <p className="text-[11px] text-charcoal-400 px-0.5">
                        {hint}
                    </p>
                )
            )}
        </div>
    );
}
