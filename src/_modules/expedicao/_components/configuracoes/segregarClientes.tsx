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
  CardContent
} from "@/_shared/components/ui/card"
import { Input } from "@/_shared/components/ui/input"
import { UserMinus, Plus, XIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useConfigGroupsImpressao } from "../../_stores/useConfigGroupsImpressao"
import { UploadClientesSegregados } from "./uploadSegregarClientes"

export default function SegregarClientes() {
  const { segregarClientes, setSegregarClientes } = useConfigGroupsImpressao()
  const [clientes, setClientes] = useState<string[]>(segregarClientes || [])
  const [newClient, setNewClient] = useState("")

  useEffect(() => {
    setClientes(segregarClientes || [])
  }, [segregarClientes])

  function handleAddClient() {
    if (newClient.trim() !== "") {
      const updatedClientes = [...clientes, newClient.trim()]
      setClientes(updatedClientes)
      setSegregarClientes(updatedClientes)
      setNewClient("")
    }
  }

  function handleRemoveClient(index: number) {
    const updatedClientes = clientes.filter((_, i) => i !== index)
    setClientes(updatedClientes)
    setSegregarClientes(updatedClientes)
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddClient()
    }
  }

  function handleSegregedClientes(clientes: string[]) {
    let dados: string[] = []
    if(segregarClientes){
      dados = [...segregarClientes, ...clientes]
    } else{
      dados = [...clientes]
    }
    setSegregarClientes(dados);
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-medium">
            <div className="flex items-center gap-2">
              <UserMinus className="h-5 w-5" />
              Segregar Clientes ({clientes.length} cliente
              {clientes.length !== 1 && "s"})
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do cliente"
                    value={newClient}
                    onChange={e => setNewClient(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={handleAddClient}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <UploadClientesSegregados onUploadComplete={handleSegregedClientes} />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {clientes.map((cliente, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={cliente}
                    onChange={e => {
                      const updatedClientes = [...clientes]
                      updatedClientes[index] = e.target.value
                      setClientes(updatedClientes)
                      setSegregarClientes(updatedClientes)
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveClient(index)}
                  >
                    <XIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}