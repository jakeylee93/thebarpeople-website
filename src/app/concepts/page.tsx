import FilmPrototype from '@/components/film/FilmPrototype';

// /concepts — the opening film and Section Two together, as the homepage would
// flow. ?shirt=real shows the roundel as stitched today; default is the silver
// preview.
export default async function ConceptsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { shirt } = await searchParams;
  return <FilmPrototype initialShirt={typeof shirt === 'string' ? shirt : undefined} />;
}
