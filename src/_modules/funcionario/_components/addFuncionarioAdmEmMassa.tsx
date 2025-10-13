'use client'
import { convertXlsxToArray, convertXlsxToArrayUserAdm } from "@/_modules/produtividade/services/convertXlsxToArray";
import { useCriarFuncionarioAdmEmMassa } from "@/_services/api/hooks/usuario/usuario";
import { Button } from "@/_shared/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/_shared/components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { Input } from "@/_shared/components/ui/input";
import { Label } from "@/_shared/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/_shared/components/ui/popover";
import { cn } from "@/_shared/lib/utils";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { Check, ChevronsUpDown, FileSpreadsheet, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const processos = [
  {
    value: "EXPEDICAO",
    label: "Expedição",
  },
  {
    value: "PRODUTIVIDADE",
    label: "Produtividade",
  },
]

export default function AddFuncionarioAdmEmMassa() {
  const { centerId } = useAuthStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [senha, setSenha] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: addFuncionarioEmMassa, isPending } = useCriarFuncionarioAdmEmMassa(
    callBackReactQuery({
    successMessage: 'Funcionarios adicionados com sucesso',
    errorMessage: 'Erro ao adicionar Funcionários',
  }))

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Verificar se é um arquivo Excel
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]

      if (validTypes.includes(file.type) || file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        setSelectedFile(file)
      } else {
        toast.error('Por favor, selecione um arquivo Excel (.xls ou .xlsx)')
        event.target.value = ''
      }
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo')
      return
    }
    const info = await convertXlsxToArrayUserAdm(selectedFile)
    const dataInput = info.map((item) => {
      return {
        centerId, 
        credencial: senha, 
        id: item.id, 
        nome: item.name,
        primeiroNome: item.primeiro_nome, 
        turno: item.turno, 
        ultimoNome: item.ultimo_nome, 
        processo: value
      }
    })
    addFuncionarioEmMassa({
      centerId,
      processo: value,
      senha,
      data: dataInput
    })
  }
  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="w-full" asChild>
          <Button className="w-full" variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Adicionar Funcionários em Massa
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Funcionários em Massa</DialogTitle>
            <DialogDescription>
              Selecione um arquivo Excel (.xls ou .xlsx) contendo os dados dos funcionários.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Senha Inicial</Label>
              <Input value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha Inicial"/>
              <Label htmlFor="file-upload">Processo</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? processos.find((processo) => processo.value === value)?.label
                      : "Select processo..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." className="h-9" />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {processos.map((processo) => (
                          <CommandItem
                            key={processo.value}
                            value={processo.value}
                            onSelect={(currentValue) => {
                              setValue(currentValue === value ? "" : currentValue)
                              setOpen(false)
                            }}
                          >
                            {processo.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                value === processo.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Label htmlFor="file-upload">Arquivo XLS/XLSX</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />

                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="h-6 w-6 p-0 hover:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2"
              disabled={isPending}
            >
              {isPending ? "Aguarda" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}