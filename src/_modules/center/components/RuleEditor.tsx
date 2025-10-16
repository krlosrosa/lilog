'use client'
import { useState } from 'react';
import type { RuleGroupType } from 'react-querybuilder';
import { defaultValidator, QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import { fields } from '../config/fields';
import { useCreateRule, useListarRulesPorCentro } from '@/_services/api/hooks/rules/rules';
import { Button } from '@/_shared/components/ui/button';
import { Input } from '@/_shared/components/ui/input';

const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };

export const RuleEditor = () => {
  const [query, setQuery] = useState(initialQuery);
  const [nomeRegra, setNomeRegra] = useState('')

  const {data} = useListarRulesPorCentro('pavuna')

  const { mutate } = useCreateRule()

  function handleMutation(){
    mutate({
      data: {
        centerId: 'pavuna',
        conditions: query,
        createdBy: 'Carlos Rosa',
        description: 'regras',
        name: nomeRegra,
        enabled: true
      },
    })
  }

  return (
    <div className='w-full'>
      <Input className='my-2' value={nomeRegra} onChange={(e) => setNomeRegra(e.target.value)}/>
      <QueryBuilder
        fields={fields}
        query={query}
        onQueryChange={setQuery}
        resetOnFieldChange={false}
        showCloneButtons
        validator={defaultValidator}
        controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
        />
        <div className='mt-4 w-full'>
          <Button className='w-full' onClick={handleMutation}>Add Regra</Button>
          <pre>{JSON.stringify(data,null,2)}</pre>
          <pre>{JSON.stringify(query, null, 2)}</pre>
        </div>
    </div>
  );
};