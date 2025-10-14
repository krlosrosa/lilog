'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/_shared/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/_shared/components/ui/card';
import { Badge } from '@/_shared/components/ui/badge';
import { Button } from '@/_shared/components/ui/button';
import { Calendar } from '@/_shared/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_shared/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/_shared/components/ui/command';
import { Loader2, Calendar as CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { useListarPaletesEmAberto } from '@/_services/api/hooks/produtividade/produtividade';
import { useAuthStore } from '@/_shared/stores/auth.store';
import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/_shared/lib/utils';

const tiposProcesso = [
  { value: 'SEPARACAO', label: 'Separação' },
  { value: 'CARREGAMENTO', label: 'Carregamento' },
  { value: 'CONFERENCIA', label: 'Conferência' },
]

export default function PaletesPendentesPage() {
  const {centerId} = useAuthStore()
  const [date, setDate] = useState<Date>()
  const [tipoProcesso, setTipoProcesso] = useState('')
  const [open, setOpen] = useState(false)

  const {data: paletes, isLoading, isError} = useListarPaletesEmAberto(
    centerId, 
    date ? format(date, 'yyyy-MM-dd') : '',
    tipoProcesso,
    {
      query:{
        enabled: !!centerId && !!date && tipoProcesso !== ""
      }
    }
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-10">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erro</CardTitle>
            <CardDescription>{isError}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Paletes Não Iniciados</CardTitle>
              <CardDescription>
                Centro: {centerId} | Data: {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione uma data'} | Tipo: {tipoProcesso || 'Todos'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {tipoProcesso
                      ? tiposProcesso.find((tipo) => tipo.value === tipoProcesso)?.label
                      : 'Tipo de Processo'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar tipo..." />
                    <CommandEmpty>Nenhum tipo encontrado.</CommandEmpty>
                    <CommandGroup>
                      {tiposProcesso.map((tipo) => (
                        <CommandItem
                          key={tipo.value}
                          value={tipo.value}
                          onSelect={(currentValue) => {
                            setTipoProcesso(currentValue === tipoProcesso ? '' : currentValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              tipoProcesso === tipo.value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {tipo.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-[240px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione a data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {paletes?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Nenhum palete encontrado
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transporte</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Caixas</TableHead>
                    <TableHead className="text-right">Unidades</TableHead>
                    <TableHead className="text-right">Paletes</TableHead>
                    <TableHead>Segmento</TableHead>
                    <TableHead>Tipo Processo</TableHead>
                    <TableHead>Validado</TableHead>
                    <TableHead>Data Expedição</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paletes?.map((palete) => (
                    <TableRow key={palete.id}>
                      <TableCell className="font-mono text-sm">
                        {palete.transporteId.substring(0, 10)}
                      </TableCell>
                      <TableCell className="font-medium">{palete.empresa}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{palete.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{palete.quantidadeCaixas}</TableCell>
                      <TableCell className="text-right">{palete.quantidadeUnidades}</TableCell>
                      <TableCell className="text-right">{palete.quantidadePaletes}</TableCell>
                      <TableCell>{palete.segmento}</TableCell>
                      <TableCell>{palete.tipoProcesso}</TableCell>
                      <TableCell>
                        <Badge variant={palete.validado ? 'default' : 'outline'}>
                          {palete.validado ? 'Sim' : 'Não'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {palete.dataExpedicao}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}