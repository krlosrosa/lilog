'use client'

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
} from "@/_shared/components/ui/card"
import { Input } from "@/_shared/components/ui/input"
import { Bus, Plus, Trash2, XIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useConfigGroupsImpressao } from "../../_stores/useConfigGroupsImpressao"

interface Group {
  id: string
  name: string
  items: string[]
}

function GroupCard({
  group,
  groupIndex,
  onRemoveGroup,
  onUpdateGroup,
}: {
  group: Group
  groupIndex: number
  onRemoveGroup: () => void
  onUpdateGroup: (updatedGroup: Group) => void
}) {
  const [newItemValue, setNewItemValue] = useState("")

  function handleAddNewItem() {
    if (newItemValue.trim() !== "") {
      const updatedGroup = {
        ...group,
        items: [...group.items, newItemValue.trim()]
      }
      onUpdateGroup(updatedGroup)
      setNewItemValue("")
    }
  }

  function handleRemoveItem(itemIndex: number) {
    const updatedGroup = {
      ...group,
      items: group.items.filter((_, index) => index !== itemIndex)
    }
    onUpdateGroup(updatedGroup)
  }

  function handleUpdateItem(itemIndex: number, newValue: string) {
    const updatedGroup = {
      ...group,
      items: group.items.map((item, index) => 
        index === itemIndex ? newValue : item
      )
    }
    onUpdateGroup(updatedGroup)
  }

  function handleUpdateGroupName(newName: string) {
    const updatedGroup = {
      ...group,
      name: newName
    }
    onUpdateGroup(updatedGroup)
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
        <Input
          value={group.name}
          onChange={e => handleUpdateGroupName(e.target.value)}
          className="text-base font-semibold border-none p-0 h-auto"
        />
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
        {group.items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={e => handleUpdateItem(itemIndex, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveItem(itemIndex)}
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

export default function AdicionarTransportesAgrupados() {
  const { agruparTransportes, setAgruparTransportes } = useConfigGroupsImpressao()
  const [groups, setGroups] = useState<Group[]>(agruparTransportes || [])
  const [newGroupName, setNewGroupName] = useState("")

  useEffect(() => {
    setGroups(agruparTransportes || [])
  }, [agruparTransportes])

  function handleAddGroup() {
    if (newGroupName.trim() !== "") {
      const newGroup: Group = {
        id: crypto.randomUUID(),
        name: newGroupName.trim(),
        items: []
      }
      const updatedGroups = [...groups, newGroup]
      setGroups(updatedGroups)
      setAgruparTransportes(updatedGroups)
      setNewGroupName("")
    }
  }

  function handleUpdateGroup(updatedGroup: Group) {
    const updatedGroups = groups.map(group => 
      group.id === updatedGroup.id ? updatedGroup : group
    )
    setGroups(updatedGroups)
    setAgruparTransportes(updatedGroups)
  }

  function handleRemoveGroup(groupIndex: number) {
    const updatedGroups = groups.filter((_, index) => index !== groupIndex)
    setGroups(updatedGroups)
    setAgruparTransportes(updatedGroups)
  }

  const handleNewGroupKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddGroup()
    }
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Agrupamento de Transporte ({groups.length} grupo
              {groups.length !== 1 && "s"})
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
              {groups.map((group, groupIndex) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  groupIndex={groupIndex}
                  onRemoveGroup={() => handleRemoveGroup(groupIndex)}
                  onUpdateGroup={handleUpdateGroup}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}