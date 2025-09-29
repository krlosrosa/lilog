'use client'
import { useAuthStore } from "@/_shared/stores/auth.store"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/_shared/components/ui/table"
import { LoadingState } from "@/_shared/components/feedbacks/LoadingState"
import { ErrorState } from "@/_shared/components/feedbacks/ErrorState"
import { Badge } from "@/_shared/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card"
import { Button } from "@/_shared/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/_shared/components/ui/dropdown-menu"
import { useListarFuncionariosAdmPorCentro } from "@/_services/api/hooks/usuario/usuario"
import ResetSenha from "./resetSenha"
import RemoverFuncionarioCentro from "./removerFuncionarioCentro"
import AssociarFuncionarioACentro from "./associarFuncionarioACentro"
import { MoreHorizontal, KeyRound, Trash2, Building2 } from "lucide-react"

const getShiftLabel = (turno: string) => {
  const shiftMap = {
    'MANHA': 'Manhã',
    'TARDE': 'Tarde', 
    'NOITE': 'Noite'
  }
  return shiftMap[turno as keyof typeof shiftMap] || turno
}

const getRoleLabel = (role: string) => {
  const roleMap = {
    'USER': 'Usuário',
    'FUNCIONARIO': 'Funcionário',
    'ADMIN': 'Administrador'
  }
  return roleMap[role as keyof typeof roleMap] || role
}

const getRoleVariant = (role: string): "secondary" | "default" | "destructive" | "outline" => {
  const variantMap = {
    'USER': 'secondary' as const,
    'FUNCIONARIO': 'default' as const,
    'ADMIN': 'destructive' as const
  }
  return variantMap[role as keyof typeof variantMap] || 'default'
}

const getShiftVariant = (turno: string): "secondary" | "default" | "destructive" | "outline" => {
  const variantMap = {
    'MANHA': 'default' as const,
    'TARDE': 'secondary' as const, 
    'NOITE': 'outline' as const
  }
  return variantMap[turno as keyof typeof variantMap] || 'default'
}

export default function ListagemFuncionariosAdm() {
  const { centerId } = useAuthStore()
  const { data: funcionarios = [], isLoading, error } = useListarFuncionariosAdmPorCentro(centerId || '')

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState />
  }

  if (!funcionarios || funcionarios.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Listagem de Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-muted-foreground text-center">
              <p className="text-lg font-medium">Nenhum funcionário encontrado</p>
              <p className="text-sm">Não há funcionários cadastrados neste centro.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listagem de Funcionários</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total de {funcionarios.length} funcionário{funcionarios.length !== 1 ? 's' : ''} cadastrado{funcionarios.length !== 1 ? 's' : ''}
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Centro</TableHead>
              <TableHead>Turno</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="w-[50px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funcionarios.map((funcionario) => (
              <TableRow key={funcionario.id}>
                <TableCell className="font-mono text-xs">
                  {funcionario.id}
                </TableCell>
                <TableCell className="font-medium">
                  {funcionario.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {funcionario.centerId}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getShiftVariant(funcionario.turno)}>
                    {getShiftLabel(funcionario.turno)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(funcionario.role)}>
                    {getRoleLabel(funcionario.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <AssociarFuncionarioACentro 
                        funcionario={funcionario}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Building2 className="mr-2 h-4 w-4" />
                          Associar ao Centro
                        </DropdownMenuItem>
                      </AssociarFuncionarioACentro>
                      <ResetSenha 
                        userId={funcionario.id} 
                        userName={funcionario.name}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Resetar Senha
                        </DropdownMenuItem>
                      </ResetSenha>
                      <RemoverFuncionarioCentro 
                        userId={funcionario.id} 
                        userName={funcionario.name}
                      >
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
                        </DropdownMenuItem>
                      </RemoverFuncionarioCentro>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}