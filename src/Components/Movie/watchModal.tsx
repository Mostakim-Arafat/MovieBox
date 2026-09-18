"use client";

import MuxPlayer from "@mux/mux-player-react";

interface WatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  muxPlaybackId: string;
}

export default function WatchModal({ isOpen, onClose, title, muxPlaybackId }: WatchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6">
      {/* Added max-h-[90vh] and flex flex-col to force containment inside the viewport */}
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-zinc-800 shrink-0">
          <h3 className="text-base sm:text-lg font-bold text-white truncate pr-4">{title}</h3>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl font-bold px-2 py-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Mux Video Player Container */}
        <div className="relative flex-1 bg-black min-h-0 aspect-video w-full flex items-center justify-center">
          <MuxPlayer
            playbackId={muxPlaybackId}
            metadata={{ video_title: title }}
            streamType="on-demand"
            autoPlay
            accentColor="#e11d48"
            style={{ width: "100%", height: "100%", maxHeight: "calc(90vh - 60px)" }}
          />
        </div>

      </div>
    </div>
  );
}