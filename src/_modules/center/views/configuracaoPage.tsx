'use client'
import { Form } from "@/_shared/components/hookForms/Form"
import { FormCheckbox } from "@/_shared/components/hookForms/FormCheckBox"
import { FormInput } from "@/_shared/components/hookForms/FormInput"
import { FormRadioGroup } from "@/_shared/components/hookForms/FormRadioGroup"
import { FormSwitch } from "@/_shared/components/hookForms/FormSwitch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/_shared/components/ui/accordion"
import { Button } from "@/_shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_shared/components/ui/card"
import { Checkbox } from "@/_shared/components/ui/checkbox"
import { Label } from "@/_shared/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/_shared/components/ui/tabs"
import { callBackReactQuery } from "@/_shared/utils/callBackReactQuery"
import { useAuthStore } from "@/_shared/stores/auth.store"
import { FormStateLogger } from "@/_shared/components/hookForms/formState.errors"
import {
  useBuscarConfiguracoesImpressao,
  useDefinirConfiguracaoImpressao,
} from "@/_services/api/hooks/centro/centro"
import { definirConfiguracaoImpressaoBody } from "@/_services/api/schema/centro/centro.zod"
import { Controller, useFormContext } from "react-hook-form"
import z from "zod"
import { Header } from "@/_shared/components/ui/header"
import { toast } from "react-toastify"
import { useEffect } from "react"

type DefinirConfiguracaoImpressaoBody = z.infer<
  typeof definirConfiguracaoImpressaoBody
>

export default function ConfiguracaoPage() {
  const { centerId } = useAuthStore()

  const { mutate: definirConfiguracaoImpressao } =
    useDefinirConfiguracaoImpressao(
      callBackReactQuery({
        successMessage: "Configuração de impressão salva com sucesso",
        errorMessage: "Erro ao salvar configuração de impressão",
      })
    )

  function onSubmit(data: DefinirConfiguracaoImpressaoBody) {
    definirConfiguracaoImpressao({ centerId: centerId as string, data: data })
  }

  const {
    data: config,
    isLoading,
    isError,
  } = useBuscarConfiguracoesImpressao(centerId as string, {
    query: {
      enabled: !!centerId,
    }
  })


  if (isLoading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Header title="Configuração" subtitle="Configuração do centro" />
        <div>Carregando configurações...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <Header title="Configuração" subtitle="Configuração do centro" />
      <Tabs defaultValue="impressao" className="w-full">
        <TabsList>
          <TabsTrigger value="impressao">Impressão Mapa</TabsTrigger>
        </TabsList>
        <TabsContent value="impressao">
          <Form
            schema={definirConfiguracaoImpressaoBody}
            onSubmit={onSubmit}
            formOptions={{
              defaultValues: {
                tipoImpressao: config?.tipoImpressao || "CLIENTE",
                quebraPalete: config?.quebraPalete || false,
                tipoQuebra: config?.tipoQuebra || null,
                valorQuebra: config?.valorQuebra || null,
                separarPaleteFull: config?.separarPaleteFull || false,
                separarUnidades: config?.separarUnidades || false,
                exibirInfoCabecalho: config?.exibirInfoCabecalho || 'NENHUM',
                segregarFifo: config?.segregarFifo || [],
                dataMaximaPercentual: config?.dataMaximaPercentual || null,
              },
            }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Impressão de Mapa</CardTitle>
                <CardDescription>
                  Ajuste as configurações para a geração e impressão dos mapas
                  de separação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConfiguracaoFormContent />
              </CardContent>
              <CardFooter>
                <Button type="submit">Salvar alterações</Button>
              </CardFooter>
            </Card>
            <FormStateLogger/>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ConfiguracaoFormContent() {
  const { control, watch } = useFormContext()
  const quebraPalete = watch("quebraPalete")

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Tipo de Impressão</AccordionTrigger>
        <AccordionContent>
          <FormRadioGroup
            name="tipoImpressao"
            className="flex gap-4"
            options={[
              { value: "CLIENTE", label: "Cliente" },
              { value: "TRANSPORTE", label: "Transporte" },
            ]}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Range Data</AccordionTrigger>
        <AccordionContent>
          <FormInput
            rules={{
              valueAsNumber: true,
            }}
            name="dataMaximaPercentual"
            type="number"
            placeholder="Informe o % de data maximo"
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Quebra Palete</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormSwitch
            name="quebraPalete"
            label="Habilitar quebra de palete"
            description="Ativa ou desativa a funcionalidade de quebra de palete."
          />
          {quebraPalete && (
            <>
              <FormRadioGroup
                name="tipoQuebra"
                label="Tipo de quebra"
                className="flex gap-4"
                options={[
                  { value: "PERCENTUAL", label: "Quebra Percentual" },
                  { value: "LINHAS", label: "Quebra Linha" },
                ]}
              />
              <FormInput
                rules={{
                  valueAsNumber: true,
                }}
                name="valorQuebra"
                type="number"
                placeholder="Informe o valor da quebra palete"
              />
            </>
          )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>Impressão</AccordionTrigger>
        <AccordionContent className="space-y-4">
          <FormCheckbox name="separarPaleteFull" label="Segregar Palete" />
          <FormCheckbox name="separarUnidades" label="Segregar Unidade" />
          <FormRadioGroup
            name="exibirInfoCabecalho"
            label="Exibir informações no cabeçalho"
            className="flex gap-4"
            options={[
              { value: "NENHUM", label: "Nenhum" },
              { value: "PRIMEIRO", label: "Primeiro" },
              { value: "TODOS", label: "Todos" },
            ]}
          />

          <Controller
            name="segregarFifo"
            control={control}
            render={({ field }) => {
              const onCheckedChange = (checked: boolean, value: string) => {
                const currentValues: string[] = field.value || []
                if (checked) {
                  field.onChange([...currentValues, value])
                } else {
                  field.onChange(currentValues.filter(v => v !== value))
                }
              }

              return (
                <div className="space-y-2">
                  <Label>Segregar FIFO</Label>
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="segregar-fifo-vermelho"
                        checked={field.value?.includes("VERMELHO")}
                        onCheckedChange={checked => {
                          onCheckedChange(Boolean(checked), "VERMELHO")
                        }}
                      />
                      <Label htmlFor="segregar-fifo-vermelho">Vermelho</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="segregar-fifo-laranja"
                        checked={field.value?.includes("LARANJA")}
                        onCheckedChange={checked => {
                          onCheckedChange(Boolean(checked), "LARANJA")
                        }}
                      />
                      <Label htmlFor="segregar-fifo-laranja">Laranja</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="segregar-fifo-amarelo"
                        checked={field.value?.includes("AMARELO")}
                        onCheckedChange={checked => {
                          onCheckedChange(Boolean(checked), "AMARELO")
                        }}
                      />
                      <Label htmlFor="segregar-fifo-amarelo">Amarelo</Label>
                    </div>
                  </div>
                </div>
              )
            }}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}