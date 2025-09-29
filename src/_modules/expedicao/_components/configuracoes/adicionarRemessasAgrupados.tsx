'use client'

import { useFieldArray, useFormContext } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/_shared/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/_shared/components/ui/accordion"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/_shared/components/ui/card"
import { Input } from "@/_shared/components/ui/input"
import { Truck, Plus, Trash2, XIcon } from "lucide-react"
import { useState } from "react"
import { Form } from "@/_shared/components/hookForms/Form"
import { FormInput } from "@/_shared/components/hookForms/FormInput"
import { useConfigGroupsImpressao } from "../../_stores/useConfigGroupsImpressao"
import { toast } from "react-toastify"

const itemSchema = z.object({
  id: z.string(),
  value: z.string().min(1, "O item é obrigatório."),
})

const groupSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "O nome do grupo é obrigatório."),
  items: z.array(itemSchema),
})

const formSchema = z.object({
  groups: z.array(groupSchema),
})

type FormValues = z.infer<typeof formSchema>

function GroupCard({
  group,
  groupIndex,
  onRemoveGroup,
}: {
  group: any
  groupIndex: number
  onRemoveGroup: () => void
}) {
  const { control } = useFormContext<FormValues>()
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: `groups.${groupIndex}.items`,
  })

  const [newItemValue, setNewItemValue] = useState("")

  function handleAddNewItem() {
    if (newItemValue.trim() !== "") {
      appendItem({
        id: crypto.randomUUID(),
        value: newItemValue,
      })
      setNewItemValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  const handleNewItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddNewItem()
    }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between p-4">
        <CardTitle className="text-base font-semibold">{group.name}</CardTitle>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemoveGroup}
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {itemFields.map((item, itemIndex) => (
          <div key={item.id} className="flex items-center gap-2">
            <FormInput
              name={`groups.${groupIndex}.items.${itemIndex}.value`}
              className="flex-1"
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeItem(itemIndex)}
            >
              <XIcon className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
        <div className="flex gap-2 pt-2">
          <Input
            placeholder="Adicionar item"
            value={newItemValue}
            onChange={e => setNewItemValue(e.target.value)}
            onKeyDown={handleNewItemKeyDown}
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={handleAddNewItem}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AgrupamentoFormContent() {
  const { control } = useFormContext<FormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "groups",
  })

  const [newGroupName, setNewGroupName] = useState("")

  function handleAddGroup() {
    if (newGroupName.trim() !== "") {
      append({
        id: crypto.randomUUID(),
        name: newGroupName,
        items: [],
      })
      setNewGroupName("")
    }
  }

  const handleNewGroupKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddGroup()
    }
  }

  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Agrupamento de Remessas ({fields.length} grupo
              {fields.length !== 1 && "s"})
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do grupo"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    onKeyDown={handleNewGroupKeyDown}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleAddGroup}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {fields.map((group, groupIndex) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  groupIndex={groupIndex}
                  onRemoveGroup={() => remove(groupIndex)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {fields.length > 0 && (
        <Button type="submit">Salvar Agrupamento</Button>
      )}
    </>
  )
}

export default function AdicionarRemessasAgrupados() {
  const { agruparRemessas, setAgruparRemessas } = useConfigGroupsImpressao()

  function onSubmit(values: FormValues) {
    const dataToStore = values.groups.map(group => ({
      id: group.id,
      name: group.name,
      items: group.items.map(item => item.value),
    }))
    setAgruparRemessas(dataToStore)
    toast.success("Agrupamento de remessas salvo com sucesso!")
  }

  const defaultValues = {
    groups:
      agruparRemessas?.map(group => ({
        ...group,
        items: group.items.map((itemValue: string) => ({
          id: crypto.randomUUID(),
          value: itemValue,
        })),
      })) || [],
  }

  return (
    <Form
      schema={formSchema}
      onSubmit={onSubmit}
      className="space-y-4"
      formOptions={{ defaultValues }}
    >
      <AgrupamentoFormContent />
    </Form>
  )
}