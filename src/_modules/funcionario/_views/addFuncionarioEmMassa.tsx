'use client'
import { useState, useRef } from "react";
import { Button } from "@/_shared/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/_shared/components/ui/dialog";
import { Input } from "@/_shared/components/ui/input";
import { Label } from "@/_shared/components/ui/label";
import { useCriarFuncionariosEmMassa, useListarFuncionariosPorCentro } from "@/_services/api/hooks/usuario/usuario";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Upload, FileSpreadsheet, X } from "lucide-react";
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery";
import { useAuthStore } from "@/_shared/stores/auth.store";
import { convertXlsxToArray } from "@/_modules/produtividade/services/convertXlsxToArray";

export function AddFuncionarioEmMassa() {
  const { centerId } = useAuthStore()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: addFuncionarioEmMassa, isPending } = useCriarFuncionariosEmMassa(callBackReactQuery({
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
    const info = await convertXlsxToArray(selectedFile)
    addFuncionarioEmMassa({
      data: {
        centerId: centerId || '',
        users: info.map((item) => ({
          id: item.id,
          name: item.name,
          turno: item.turno,
          empresa: item.empresa
        })),
      },
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
              <Button variant="outline" disabled={isPending}>
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedFile || isPending}
              className="flex items-center gap-2"
            >
              {isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isPending ? 'Enviando...' : 'Adicionar Funcionários'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}