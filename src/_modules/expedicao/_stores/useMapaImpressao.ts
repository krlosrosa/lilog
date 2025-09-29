import { create } from 'zustand';

export const useFileStore = create<FilesState>((set) => ({
  products: null,
  routes: null,
  shipments: null,
  setFiles: (fileType, file) =>
    set((state) => ({
      ...state,
      [fileType]: file,
    })),
}));

export interface FilesState {
  products: File | null;
  routes: File | null;
  shipments: File | null;
  setFiles: (fileType: keyof FilesState, file: File | null) => void;
}
