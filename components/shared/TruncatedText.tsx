"use client";

import React, { useState } from "react";

interface TruncatedTextProps {
  text?: string | null;
  limit?: number;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({ text, limit = 18 }) => {
  const [open, setOpen] = useState(false);

  if (!text) return <span>-</span>;

  const isLong = text.length > limit;
  const displayedText = isLong ? text.slice(0, limit) + "..." : text;

  return (
    <>
      <span
        className={isLong ? "cursor-pointer hover:underline" : ""}
        onClick={(e) => {
          if (isLong) {
            e.stopPropagation();
            setOpen(true);
          }
        }}
      >
        {displayedText}
      </span>

      {/* Popup */}
      {open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-black/50"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
          }}
        >
          <div 
            className="bg-card p-6 rounded-lg max-w-lg w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-xl font-bold text-muted-foreground hover:text-foreground rtl:right-auto rtl:left-3"
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold text-primary mb-4">
              Full Content
            </h3>

            <p className="text-foreground wrap-break-word">{text}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default TruncatedText;
