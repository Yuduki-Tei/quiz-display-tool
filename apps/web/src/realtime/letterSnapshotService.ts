import { useTextStore } from "@/stores/dataStore";
import { useLetterStore } from "@/features/Letter/stores/letterStore";
import type { LetterContext } from "@/features/Letter/types/LetterTypes";
import type { LetterSnapshot, LetterSnapshotItem } from "@/realtime/letterSync";

// Build snapshot from current domain stores (host)
export function buildLetterSnapshot(): LetterSnapshot {
  const textStore = useTextStore();
  const letterStore = useLetterStore();
  const allText = textStore.getAllData();

  const items: LetterSnapshotItem[] = allText.map((t) => {
    const ctx =
      letterStore.getContext(t.id) ||
      ({
        totalChars: (t as any).content?.length || 0,
        charsPerRow: 10,
        revealed: [],
        isManual: true,
        autoRevealMode: "random",
      } as LetterContext);
    return {
      id: t.id,
      name: (t as any).name || t.id,
      content: (t as any).content || "",
      thumbnailSrc: (t as any).thumbnailSrc || null,
      context: ctx,
    };
  });

  const current = textStore.currentData?.id || null;
  return { items, currentId: current };
}

// Apply snapshot to domain stores (viewer)
export function applyLetterSnapshot(snapshot: LetterSnapshot) {
  const textStore = useTextStore();
  const letterStore = useLetterStore();

  const allData = snapshot.items.map((i) => ({
    id: i.id,
    name: i.name,
    content: i.content,
    thumbnailSrc: i.thumbnailSrc,
    type: "text",
  }));
  const currentIndex = snapshot.currentId
    ? allData.findIndex((d) => d.id === snapshot.currentId)
    : -1;
  textStore.importData({ allData: allData as any, currentIndex });

  snapshot.items.forEach((i) => {
    letterStore.setContext(i.id, { ...i.context });
  });
}
