'use client';

// "How it works": one small sheet shared by the Corporate, Weddings and
// Parties sections. Each section's quiet link opens it with that section's own
// "what you can include" list. A native <dialog>, so the browser traps focus,
// closes it on Esc and hands focus back to the link that opened it.

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HOW_IT_WORKS, type HowTopic } from './data';
import { BuildButton, Points, ring, type Tone } from './parts';

const OpenContext = createContext<(topic: HowTopic) => void>(() => {});

export function HowItWorksProvider({ children }: { children: React.ReactNode }) {
  const [topic, setTopic] = useState<HowTopic | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (topic !== null && !d.open) d.showModal();
    if (topic === null && d.open) d.close();
  }, [topic]);

  const close = () => setTopic(null);
  const info = topic ? HOW_IT_WORKS.topics[topic] : null;

  return (
    <OpenContext.Provider value={setTopic}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={close}
        // A click on the dimmed area outside the sheet lands on the dialog itself.
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        aria-labelledby="how-title"
        className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 text-nh-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
      >
        {info && (
          <div className="pointer-events-none flex h-full items-end justify-center sm:items-center sm:p-6">
            <div className="nh-sheet-in pointer-events-auto flex max-h-[92dvh] w-full flex-col overflow-y-auto rounded-t-[28px] bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:max-w-[560px] sm:rounded-[28px] sm:px-8 sm:pb-8 sm:pt-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="nh-eyebrow text-nh-ash">{info.label}</p>
                  <h2 id="how-title" className="mt-1.5 text-[28px] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[34px]">
                    {HOW_IT_WORKS.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={close}
                  autoFocus
                  aria-label="Close"
                  className={cn('-mr-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-nh-mist transition hover:bg-nh-line', ring.onLight)}
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <ol className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4">
                {HOW_IT_WORKS.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-nh-ink font-nh-display text-[14px] font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-bold leading-snug sm:text-[17px]">{step.title}</h3>
                      <p className="mt-0.5 text-[14.5px] leading-snug text-nh-ash sm:text-[15px]">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-5 rounded-[18px] bg-nh-mist p-4 sm:mt-6 sm:p-5">
                <h3 className="nh-eyebrow text-nh-ash">{HOW_IT_WORKS.includedTitle}</h3>
                <Points items={info.included} tone="light" compact className="mt-3 lg:space-y-2" />
              </div>

              {/* Closing first leaves one dialog open at a time: the builder opens on the hash. */}
              <BuildButton tone="light" onClick={close} className="mt-5 w-full sm:mt-6">
                {HOW_IT_WORKS.cta}
              </BuildButton>
            </div>
          </div>
        )}
      </dialog>
    </OpenContext.Provider>
  );
}

/** The quiet "How it works" link under a section's main button. */
export function HowItWorksLink({ topic, tone, className }: { topic: HowTopic; tone: Tone; className?: string }) {
  const open = useContext(OpenContext);
  return (
    <button
      type="button"
      onClick={() => open(topic)}
      aria-haspopup="dialog"
      className={cn(
        'inline-flex h-11 items-center rounded px-1 text-[15px] font-semibold underline underline-offset-4 transition',
        tone === 'dark'
          ? cn('text-white/85 decoration-white/35 hover:text-white hover:decoration-white', ring.onDark)
          : cn('text-nh-ink decoration-nh-ink/30 hover:decoration-nh-ink', ring.onLight),
        className,
      )}
    >
      {HOW_IT_WORKS.title}
    </button>
  );
}
