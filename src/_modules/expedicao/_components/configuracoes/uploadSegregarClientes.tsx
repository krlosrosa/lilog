"use client"

import { useState, useEffect } from "react"
import { produce } from "immer"
import { Input } from "@/_shared/components/ui/input"
import { Button } from "@/_shared/components/ui/button"
import { FileSpreadsheet, Upload, X } from "lucide-react"
import { convertFileToClientesSegregados } from "../../utils/converterExcel"


interface UploadClientesSegregadosProps {
  onUploadComplete?: (clientes: string[]) => void
}

export function UploadClientesSegregados({ onUploadComplete }: UploadClientesSegregadosProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const clientes = await (await convertFileToClientesSegregados(file)).map((item) => item.codCliente)
      if(onUploadComplete){
        onUploadComplete(clientes)
        event.target.value = ''
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isLoading}
            className="w-full h-9"
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar arquivo Excel
          </Button>
        </div>
        {uploadedFile && (
          <Button
            disabled={isLoading}
            size="sm"
            className="h-9"
          >
            {isLoading ? "Processando..." : "Cadastrar"}
          </Button>
        )}
      </div>

      {uploadedFile && (
        <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">{uploadedFile.name}</span>
          </div>
        </div>
      )}
    </div>
  )
} 