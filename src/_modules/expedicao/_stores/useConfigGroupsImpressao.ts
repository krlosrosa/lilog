import { Groups } from '../services/types/groups.type';
import { create } from 'zustand';


export const useConfigGroupsImpressao = create<GroupsState>((set) => ({
  segregarClientes: null,
  agruparClientes: null,
  agruparTransportes: null,
  agruparRemessas: null,
  setSegregarClientes: (segregarClientes: string[]) => set({ segregarClientes }),
  setAgruparClientes: (agruparClientes: Groups[]) => set({ agruparClientes }),
  setAgruparTransportes: (agruparTransportes: Groups[]) => set({ agruparTransportes }),
  setAgruparRemessas: (agruparRemessas: Groups[]) => set({ agruparRemessas }),
}));

export interface GroupsState {
  segregarClientes: string[] | null;
  agruparClientes: Groups[] | null;
  agruparTransportes: Groups[] | null;
  agruparRemessas: Groups[] | null;
  setSegregarClientes: (segregarClientes: string[]) => void;
  setAgruparClientes: (agruparClientes: Groups[]) => void;
  setAgruparTransportes: (agruparTransportes: Groups[]) => void;
  setAgruparRemessas: (agruparRemessas: Groups[]) => void;
}