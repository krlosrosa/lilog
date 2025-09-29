import { Alert, AlertDescription, AlertTitle } from "@/_shared/components/ui/alert";
import { Button } from "@/_shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_shared/components/ui/table";
import { ErrorFiles } from "../services/types/errorsFile";

export default function ErrorsValidacao({ errors, setTab }: { errors: ErrorFiles | null, setTab: (tab: string) => void }) {
  if (
    !errors ||
    (!errors.error && !errors.errors?.length && !errors.produtosNaoEncontrados?.length)
  ) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Erros na Validação</CardTitle>
          <p className="text-sm text-muted-foreground">
            Corrija os erros nos arquivos e tente novamente.
          </p>
        </div>
        <Button variant="outline" onClick={() => setTab("upload")}>
          Voltar para Uploads
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {errors.error && (
          <Alert variant="destructive">
            <AlertTitle>Erro Geral</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao validar os arquivos de entrada.
            </AlertDescription>
          </Alert>
        )}

        {errors.errors?.length > 0 && (
          <div>
            <h3 className="mb-2 text-lg font-semibold">Erros nos Arquivos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Linha</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Mensagem</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.errors.map((error, index) => (
                  <TableRow key={index}>
                    <TableCell>{error.arquivo}</TableCell>
                    <TableCell>{error.linha}</TableCell>
                    <TableCell>{error.campo}</TableCell>
                    <TableCell>{error.codigo}</TableCell>
                    <TableCell>{error.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {errors.produtosNaoEncontrados?.length > 0 && (
          <div>
            <h3 className="mb-2 mt-4 text-lg font-semibold">
              Produtos Não Encontrados
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errors.produtosNaoEncontrados.map(produto => (
                  <TableRow key={produto.id}>
                    <TableCell>{produto.id}</TableCell>
                    <TableCell>{produto.descricao}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}