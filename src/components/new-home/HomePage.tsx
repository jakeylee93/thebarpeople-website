'use client';

// The homepage's frame: the header film, the movable sections in their order,
// the footer. The order lives in React state so AnyVendor's editor can move,
// hide and bring back a section in the editing preview without a reload.
//
// The editor link (bridge v1) is public/anyvendor-bridge.js, AnyVendor's own
// script, unchanged. It is loaded only when the draft page passes `edit`, and
// it stays silent unless the page is framed by a listed editor origin.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { HomeChapter, HomeContent, HomeSection, MovableSectionId } from '@/content/new-home';
import { HowItWorksProvider } from './HowItWorks';
import SnapPage from './SnapPage';
import SiteFooter from './SiteFooter';

export interface EditLink {
  /** This site's AnyVendor slug. */
  slug: string;
  /** The editor origins allowed to frame this page and talk to it. */
  origins: string[];
  /** Lists whose row marks must come off (the page skipped a row, so the numbers no longer match). */
  unmark: string[];
}

interface BridgeApi {
  start(options: {
    slug: string; origins: string[]; capabilities: { text: boolean; image: boolean; chapters: boolean };
    onChapters: (order: { chapter: string; visible: boolean }[]) => void;
  }): boolean;
}

type Row = { id: MovableSectionId; visible: boolean };
const BRIDGE_SRC = '/anyvendor-bridge.js';

export default function HomePage({ home, hero, nodes, source, revision, edit }: {
  home: HomeContent;
  hero: React.ReactNode;
  /** The sections the server rendered. The live page gets only the visible ones; the editing preview gets them all. */
  nodes: Partial<Record<MovableSectionId, React.ReactNode>>;
  source: string;
  revision: string;
  edit?: EditLink;
}) {
  const known = useMemo(() => new Map<string, HomeChapter>(home.chapters.map((c) => [c.id, c])), [home.chapters]);
  const [order, setOrder] = useState<Row[]>(() =>
    home.chapters.filter((c) => nodes[c.id] !== undefined).map((c) => ({ id: c.id, visible: c.visible })));

  const sections = useMemo<HomeSection[]>(() => [
    home.sections[0],
    ...order.filter((r) => r.visible).map((r) => { const c = known.get(r.id) as HomeChapter; return { id: c.id, label: c.label, tone: c.tone }; }),
    home.sections[home.sections.length - 1],
  ], [order, known, home.sections]);

  // Unsaved words the editor has put on the page, kept across a change of order
  // (a menu link that comes back is new, and would otherwise show the saved name).
  const live = useRef(new Map<string, string>());
  const rendered = useRef(nodes);
  const chapters = useRef((rows: { chapter: string; visible: boolean }[]) => {
    const listed: Row[] = [];
    for (const r of rows) {
      const id = r.chapter as MovableSectionId;
      if (known.has(id) && rendered.current[id] !== undefined && !listed.some((x) => x.id === id)) listed.push({ id, visible: r.visible === true });
    }
    // A section left out of the list has been taken off the page: kept, hidden.
    const rest = [...known.keys()].filter((id) => rendered.current[id as MovableSectionId] !== undefined && !listed.some((x) => x.id === id));
    live.current.clear();
    document.querySelectorAll<HTMLElement>('[data-av-field]').forEach((el) => {
      const field = el.dataset.avField as string;
      if (el.tagName !== 'IMG' && !live.current.has(field)) live.current.set(field, el.textContent ?? '');
    });
    setOrder([...listed, ...rest.map((id) => ({ id: id as MovableSectionId, visible: false }))]);
  });

  useEffect(() => {
    if (live.current.size === 0) return;
    document.querySelectorAll<HTMLElement>('[data-av-field]').forEach((el) => {
      const value = live.current.get(el.dataset.avField as string);
      if (el.tagName !== 'IMG' && value !== undefined && el.textContent !== value) el.textContent = value;
    });
  }, [order]);

  // Start the editor link once the page is awake, so nothing it shows is undone by hydration.
  const started = useRef(false);
  useEffect(() => {
    if (!edit || started.current) return;
    started.current = true;
    for (const list of edit.unmark) {
      document.querySelectorAll(`[data-av-field^="${list}."]`).forEach((el) => el.removeAttribute('data-av-field'));
    }
    const script = document.createElement('script');
    script.src = BRIDGE_SRC;
    script.onload = () => {
      const bridge = (window as unknown as { AnyVendorBridge?: BridgeApi }).AnyVendorBridge;
      bridge?.start({
        slug: edit.slug,
        origins: edit.origins,
        capabilities: { text: true, image: true, chapters: true },
        onChapters: (rows) => chapters.current(rows),
      });
    };
    document.head.appendChild(script);
  }, [edit]);

  return (
    <HowItWorksProvider how={home.how}>
      <SnapPage sections={sections} contacts={home.footer.contacts} cta={home.hero.cta}>
        <main data-content-source={source} data-content-revision={revision}>
          {hero}
          {order.map((r) => (
            <div key={r.id} data-av-chapter={r.id} data-av-hidden={r.visible ? undefined : ''} className="contents">{nodes[r.id]}</div>
          ))}
        </main>
        <SiteFooter home={home} sections={sections} />
      </SnapPage>
    </HowItWorksProvider>
  );
}
