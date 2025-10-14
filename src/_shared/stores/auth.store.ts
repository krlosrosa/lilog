import { create } from 'zustand';
import { Ability, AbilityBuilder, AbilityClass } from '@casl/ability';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Actions = 'manage' | 'read' | 'update' | 'delete';
export type Subjects = 'all' | string | { centerId: string };
export type AppAbility = Ability<[Actions, Subjects]>;

export interface Permission {
  centerId: string
  role: string
  processo: string
}

export interface User {
  name: string
  email: string
  accessToken: string
  permissions: Permission[]
  empresa: string
}

interface AuthState {
  user: User | null;
  centerId: string;
  hasMoreThanOneCenter: boolean;
  needsCenterSelection: boolean;
  availableCenters: Permission[];
  ability: AppAbility;
  login: (user: User) => void;
  logout: () => void;
  selectCenter: (centerId: string) => void;
  resetAll: () => void;
  setEmpresa: (empresa: string) => void
}

// 🔧 função que constrói a instância de Ability dinamicamente
const buildAbility = (permissions: Permission[]): AppAbility => {
  const { can, build } = new AbilityBuilder<AppAbility>(
    Ability as AbilityClass<AppAbility>
  );

  if (permissions.some(p => ['MASTER', 'ADMIN'].includes(p.role))) {
    can('manage', 'all');
  } else {
    permissions.forEach(permission => {
      switch (permission.role) {
        case 'FUNCIONARIO':
        case 'USER':
          can('read', permission.processo, { centerId: permission.centerId });
          can('update', permission.processo, { centerId: permission.centerId });
          break;
      }
    });
  }

  return build();
};

export const useAuthStore = create<AuthState>()(
  persist(

    (set, get) => ({
      user: null,
      centerId: '',
      hasMoreThanOneCenter: false,
      needsCenterSelection: false,
      availableCenters: [],
      ability: new Ability<[Actions, Subjects]>([]),
      setEmpresa: (empresa: string) =>
        set((state) => {
          if (!state.user) return state
          return {
            user: {
              ...state.user,
              empresa,
            },
          }
        })
      ,
      login: (user: User) => {
        const ability = buildAbility(user.permissions);

        set({
          user,
          ability,
          availableCenters: user.permissions,
          needsCenterSelection: user.permissions.length > 1,
          hasMoreThanOneCenter: user.permissions.length > 1,
          centerId: user.permissions.length === 1 ? user.permissions[0].centerId : '',
        });
      },

      logout: () => {
        set({
          user: null,
          centerId: '',
          ability: new Ability<[Actions, Subjects]>([]),
          needsCenterSelection: false,
          hasMoreThanOneCenter: false,
          availableCenters: []
        });
      },

      resetAll: () => get().logout(),

      selectCenter: (centerId: string) => set({ centerId }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => localStorage),
      // 🚨 persistimos apenas dados simples, não instâncias de classes
      partialize: (state) => ({
        user: state.user,
        centerId: state.centerId,
        hasMoreThanOneCenter: state.hasMoreThanOneCenter,
        needsCenterSelection: state.needsCenterSelection,
        availableCenters: state.availableCenters,
      }),
      // 🚀 recriamos a instância de Ability ao reidratar
      onRehydrateStorage: () => (state) => {
        if (!state) return; // ✅ garante que state não é undefined
      
        if (state.user) {
          state.ability = buildAbility(state.user.permissions);
        } else {
          state.ability = new Ability<[Actions, Subjects]>([]);
        }
      },
    }
  )
);
