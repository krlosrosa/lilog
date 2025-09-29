import { useState } from "react";
import { produce } from "immer";

export function usePaletes() {
  const [paletes, setPaletes] = useState<string[]>([]);

  const add = (novo: string) =>
    setPaletes(
      produce((draft) => {
        if (novo.trim() !== "") draft.push(novo);
      })
    );

  const remove = (id: string) =>
    setPaletes(
      produce((draft) => {
        const index = draft.findIndex((p) => p === id);
        if (index !== -1) draft.splice(index, 1);
      })
    );

  const clear = () => setPaletes([]);

  return { paletes, add, remove, clear };
}