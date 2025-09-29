'use client';
import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { AppAbility } from '../stores/auth.store'; // Importe o seu tipo AppAbility do store

// 1. Crie o Contexto do React para a sua 'ability'
export const AbilityContext = createContext<AppAbility>(undefined!);

// 2. Crie o seu componente <Can> personalizado usando a factory da biblioteca.
//    Ele é vinculado ao Consumer do seu contexto.
export const Can = createContextualCan(AbilityContext.Consumer);