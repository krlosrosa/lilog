'use client';

import { File as FileIcon } from 'lucide-react';

import { useFileStore } from '../../_stores/useMapaImpressao';
import { CompactFileUpload } from './compactFileUpload';
import { ValidarInputs } from '../../services/makeValidarInputs';   
import { Button } from '@/_shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/_shared/components/ui/card';
import { ErrorFiles } from '../../services/types/errorsFile';

export interface FilesState {
  products: File | null;
  routes: File | null;
  shipments: File | null;
}

export default function UploadsPage({
  setTab,
  setErrors,
}: {
  setTab: (tab: string) => void;
  setErrors: (errors: ErrorFiles) => void;
}) {
  const { setFiles, products, routes, shipments } = useFileStore();

  function handleValidarInputs() {
    ValidarInputs({
      products,
      shipments,
      routes,
    }).then(result => {
      if (result.error) {
        setTab('validacaoDados')
      } else {
        setTab('transporte')
      }
      setErrors(result)
    })
  }

  const handleFileChange =
    (fileType: keyof FilesState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFiles(fileType, e.target.files?.[0] || null)
    }

  const isValidationDisabled = !products || !shipments

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload de Arquivos</CardTitle>
        <CardDescription>
          Selecione os arquivos de produtos, remessas e rotas para iniciar o
          processo.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CompactFileUpload
          id="products"
          title="Produtos"
          icon={FileIcon}
          file={products}
          onChange={handleFileChange("products")}
          required={true}
        />
        <CompactFileUpload
          id="shipments"
          title="Remessas"
          icon={FileIcon}
          file={shipments}
          onChange={handleFileChange("shipments")}
          required={true}
        />
        <CompactFileUpload
          id="routes"
          title="Rota (Opcional)"
          icon={FileIcon}
          file={routes}
          onChange={handleFileChange("routes")}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleValidarInputs} disabled={isValidationDisabled}>
          Validar Entradas
        </Button>
      </CardFooter>
    </Card>
  )
}
