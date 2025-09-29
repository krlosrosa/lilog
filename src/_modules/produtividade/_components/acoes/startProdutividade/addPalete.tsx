'use client'
import { Button } from "@/_shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Input } from "@/_shared/components/ui/input";
import { Label } from "@/_shared/components/ui/label";
import { Plus, Trash2, Package, Users } from "lucide-react";
import { useState } from "react";

type AddPaleteProps = {
  paletes: string[];
  add: (palete: string) => void;
  remove: (palete: string) => void;
  setTab: (tab: 'paletes' | 'funcionario') => void;
}

export function AddPalete({ paletes, add, remove, setTab }: AddPaleteProps) {
  const [novoPalete, setNovoPalete] = useState<string>('');

  const handleAddPalete = () => {
    if (novoPalete.trim() !== '') {
      add(novoPalete.trim());
      setNovoPalete('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPalete();
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Coluna 1: Adicionar Palete */}
        <div className="w-full">
          <Card className="h-fit border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="p-1 bg-primary/10 rounded">
                  <Plus className="h-3 w-3 text-primary" />
                </div>
                Adicionar Palete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="novo-palete" className="text-sm font-medium text-foreground">
                  ID do Palete
                </Label>
                <Input
                  id="novo-palete"
                  value={novoPalete}
                  onChange={(e) => setNovoPalete(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ex: PLT-001, PLT-002..."
                  className="w-full h-10"
                />
              </div>

              <Button
                type="button"
                onClick={handleAddPalete}
                disabled={novoPalete.trim() === ''}
                className="w-full gap-2 h-10 font-medium"
              >
                <Plus className="h-4 w-4" />
                Adicionar à Lista
              </Button>
              <div className="flex w-full mt-16">
                <Button disabled={paletes.length === 0} variant="outline" onClick={() => setTab('funcionario')} className="w-full">
                  <Users className="h-4 w-4" />
                  Adicionar Funcionário
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna 2: Lista de Paletes */}
        <div className="w-full">
          <Card className="h-fit border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="p-1 bg-secondary rounded">
                  <Package className="h-3 w-3 text-secondary-foreground" />
                </div>
                Paletes Adicionados
                <span className="ml-auto bg-muted px-1.5 py-0.5 rounded-full text-xs font-normal">
                  {paletes.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paletes.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground space-y-3">
                  <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground/60" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Nenhum palete adicionado</p>
                    <p className="text-sm">Adicione paletes usando o formulário ao lado</p>
                  </div>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  {paletes.map((palete, index) => (
                    <div
                      key={index}
                      className="group flex items-center justify-between p-3 border border-border rounded-lg bg-card hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-medium text-sm text-foreground">{palete}</p>
                          <p className="text-xs text-muted-foreground">
                            Palete {index + 1} de {paletes.length}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(palete)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}