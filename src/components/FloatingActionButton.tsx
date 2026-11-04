import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, PhoneCall, X, ShieldAlert, Sparkles } from 'lucide-react';

export const FloatingActionButton: React.FC = () => {
  const { setActiveTab, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0,
  });
  const hasMovedRef = useRef(false);

  // Set default initial position bottom-right on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultRightOffset = 24;
      const defaultBottomOffset = 84; // above mobile bottom nav
      const x = window.innerWidth - 64 - defaultRightOffset;
      const y = window.innerHeight - 64 - defaultBottomOffset;
      setPosition({ x: Math.max(16, x), y: Math.max(80, y) });
      setIsInitialized(true);
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    hasMovedRef.current = false;
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      hasMovedRef.current = true;
    }
    const newX = Math.min(Math.max(12, dragStartRef.current.posX + dx), window.innerWidth - 72);
    const newY = Math.min(Math.max(70, dragStartRef.current.posY + dy), window.innerHeight - 80);
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (!hasMovedRef.current) {
      setIsOpen((prev) => !prev);
    }
  };

  if (!isInitialized) return null;

  return (
    <div
      ref={dragRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
      }}
      className="fixed top-0 left-0 z-50 transition-transform duration-75 select-none"
    >
      {/* Popout menu when open */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-64 bg-white border border-[#0F2942]/20 rounded-md shadow-2xl p-3 mb-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F2942]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#0F2942]" />
              <span>{language === 'kn' ? 'ತ್ವರಿತ ನಾಗರಿಕ ಸೇವೆ' : 'Quick Grievance Action'}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-500 mb-2 leading-tight">
            {language === 'kn'
              ? 'ಆಸ್ಪತ್ರೆಯ ಸಮಸ್ಯೆಗಳನ್ನು ದಾಖಲಿಸಿ ಅಥವಾ 108 ಆಂಬುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ.'
              : 'Move this button anywhere on screen. Report hospital issues or call 108.'}
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => {
                setActiveTab('report');
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded bg-[#0F2942] hover:bg-[#1E3A8A] text-white text-xs font-medium transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{language === 'kn' ? 'ಆಸ್ಪತ್ರೆ ದೂರು ಸಲ್ಲಿಸಿ' : 'Report Hospital Issue'}</span>
            </button>

            <a
              href="tel:108"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'kn' ? '108 ತುರ್ತು ಆಂಬುಲೆನ್ಸ್' : 'Dial 108 Emergency'}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-bold">24/7 Toll-Free</span>
            </a>
          </div>
        </div>
      )}

      {/* Moving / Floating Icon Button */}
      <div className="relative group">
        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          aria-label={language === 'kn' ? 'ದೂರು ಅಥವಾ ತುರ್ತು ಸೇವೆ' : 'Report Issue or Emergency (Draggable)'}
          title={language === 'kn' ? 'ಈ ಐಕಾನ್ ಅನ್ನು ನೀವು ಎಲ್ಲಿಯಾದರೂ ಚಲಿಸಬಹುದು' : 'Draggable Quick Action Icon · Drag anywhere'}
          className={`relative w-14 h-14 rounded-full bg-[#0F2942] hover:bg-[#1E3A8A] text-white shadow-xl flex items-center justify-center cursor-grab active:cursor-grabbing border-2 border-white/90 transition-shadow ${
            isDragging ? 'scale-105 shadow-2xl' : 'animate-gentle-float'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0F2942]" />
            </div>
          )}
        </button>

        {/* Floating helper chip for discovery */}
        {!isOpen && !isDragging && (
          <div className="hidden md:flex absolute -top-8 right-0 items-center gap-1 bg-[#0F2942]/90 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full shadow pointer-events-none whitespace-nowrap">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>{language === 'kn' ? 'ಚಲಿಸಬಹುದಾದ ಐಕಾನ್' : 'Move / Drag me'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
