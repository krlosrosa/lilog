'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/_shared/components/ui/dialog";
import { Button } from "@/_shared/components/ui/button";
import { Card, CardContent } from "@/_shared/components/ui/card";
import { Calendar } from "@/_shared/components/ui/calendar";
import { useState } from "react";
import { Label } from "@/_shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_shared/components/ui/select";
import { usePathname, useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Filtros } from "../_views/produtividadePage";
import { CalendarIcon } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  filtros: Filtros;
  setFiltros: (filtros: Filtros) => void;
}

export default function DefinirProcesso({ filtros, setFiltros, open, setOpen }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedProcess, setSelectedProcess] = useState<string>('');
  const handleProcessChange = (value: string) => {
    setSelectedProcess(value);
  };
  const handleDefineProcess = () => {
    if (!date) {
      toast.error('Selecione uma data');
      return;
    }
    if (!selectedProcess) {
      toast.error('Selecione um processo');
      return;
    }
    setFiltros({ ...filtros, data: format(date, 'yyyy-MM-dd'), processo: selectedProcess });
    setOpen(false);
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
        <Button className={`${selectedProcess ? 'bg-primary/10' : 'bg-red-300'}`} size='icon' variant="outline" onClick={() => setOpen(true)}><CalendarIcon /></Button>
        </DialogTrigger>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Definir Processo</DialogTitle>
          </DialogHeader>
          <Card>
            <CardContent className="pt-0">
              <div className="flex w-full gap-4">
                <div className="">
                  <div className="flex justify-center">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border shadow-sm"
                      captionLayout="dropdown"
                    />
                  </div>
                  {date && !isNaN(date.getTime()) && (
                    <div className="mt-3 p-2 bg-primary/5 rounded-md border">
                      <p className="text-xs font-medium text-center text-primary">
                        {date.toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2 w-full">
                  <Label className="text-xs font-medium">Tipo de Processo</Label>
                  <Select value={selectedProcess} onValueChange={handleProcessChange}>
                    <SelectTrigger className="h-10 w-full text-sm">
                      <SelectValue placeholder="Selecione um processo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SEPARACAO">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Separação
                        </div>
                      </SelectItem>
                      <SelectItem value="CONFERENCIA">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          Conferência
                        </div>
                      </SelectItem>
                      <SelectItem value="CARREGAMENTO">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-teal-800 rounded-full"></div>
                          Carregamento
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="default" className="w-full mt-16" onClick={handleDefineProcess}>Definir</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  )

}