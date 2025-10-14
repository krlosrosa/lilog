"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/_shared/lib/utils"
import { Button } from "@/_shared/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/_shared/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/_shared/components/ui/popover"

const empresas = [
  {
    value: "LDB",
    label: "Lactalis",
  },
  {
    value: "ITB",
    label: "Itambé",
  },
  {
    value: "DPA",
    label: "DPA",
  },
]

type Props = {
  nomeEmpresa?: string,
  setEmpresa: (empresa: string) => void
}

export function ComboboxEmpresa({nomeEmpresa, setEmpresa} : Props) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full"
        >
          {nomeEmpresa
            ? empresas.find((empresa) => empresa.value === nomeEmpresa)?.label
            : "Selecionar empresa..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="empresa..." className="h-9" />
          <CommandList>
            <CommandEmpty>No empresa found.</CommandEmpty>
            <CommandGroup>
              {empresas.map((empresa) => (
                <CommandItem
                  key={empresa.value}
                  value={empresa.value}
                  onSelect={(currentValue) => {
                    setEmpresa(currentValue === nomeEmpresa ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {empresa.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      nomeEmpresa === empresa.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
