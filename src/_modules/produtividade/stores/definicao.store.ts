import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DefinicaoState {
  token: string;
  processo: string;
  dataTrabalho: string;
  setToken: (token: string) => void;
  setProcesso: (processo: string) => void;
  setDataTrabalho: (dataTrabalho: string) => void;
  setValidateToken: (token: string) => void;
}

export const useDefinicaoStore = create<DefinicaoState>()(persist((set, get) => ({
  token: '',
  processo: '',
  dataTrabalho: '',
  setValidateToken: (token: string) => {
    if (get().token !== token) {
      set({ token, processo: '', dataTrabalho: '' });
    }
  },
  setToken: (token) => set({ token }),
  setProcesso: (processo) => set({ processo }),
  setDataTrabalho: (dataTrabalho) => set({ dataTrabalho }),
}), {
  name: 'definicao-store',
  storage: createJSONStorage(() => localStorage),
}));

