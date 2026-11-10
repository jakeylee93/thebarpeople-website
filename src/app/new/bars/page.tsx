import BarDiagram from '@/components/new-home/package/BarDiagram';
import { BAR_SHAPES, FINISHES, barName, barPrice, finishesFor, normaliseBar, type BarChoice } from '@/lib/quote/bars';
import { formatPenceCompact } from '@/lib/visual-quote/money';

// /new/bars — every bar shape in every finish it comes in, for checking the drawings.
export default function BarsSheet() {
  const bars: BarChoice[] = [];
  for (const shape of BAR_SHAPES) {
    const sizes = shape.id === 'straight' ? [1, 2, 3, 4, 6] : shape.id === 'l-shape' ? [3, 5] : [shape.defaultSections];
    for (const sections of sizes) for (const finishId of finishesFor(shape.id, sections)) bars.push(normaliseBar({ shapeId: shape.id, sections, finishId, branded: false }));
  }
  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10">
      <h1 className="text-[32px] font-extrabold tracking-tight">Bar drawings</h1>
      <p className="mt-1 text-[15px] text-nh-ash">Every shape, in each finish it comes in. Same camera for all. Second row of each: with artwork.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {bars.flatMap((bar, i) => [false, true].map((branded) => {
          const price = barPrice(bar);
          return (
            <figure key={`${i}-${branded}`} className="rounded-[18px] bg-nh-mist p-3">
              <BarDiagram bar={{ ...bar, branded }} />
              <figcaption className="mt-1 text-[13px]">
                <strong>{barName(bar)}</strong> · {FINISHES.find((f) => f.id === bar.finishId)?.name}{branded ? ' · branded' : ''} ·{' '}
                {price ? formatPenceCompact(price.pence) : 'To confirm'}
              </figcaption>
            </figure>
          );
        }))}
      </div>
    </main>
  );
}
