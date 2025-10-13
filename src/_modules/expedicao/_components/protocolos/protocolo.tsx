'use client'
import { useFileStore } from "../../_stores/useMapaImpressao"
import { Dialog, DialogContent, DialogTrigger } from "@/_shared/components/ui/dialog"
import { Button } from "@/_shared/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { gerarProtocolo, ItemTransporte } from "../../services/pipeline/13-gerar-protocolo"
import { Printer } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { useSession } from "next-auth/react"

type Props = {
  tipo: 'SEPARACAO' | 'CARREGAMENTO'
}

export default function ProtocoloExpedicao({ tipo }: Props) {
  const { data: session } = useSession()
  const [transportes, setTransportes] = useState<ItemTransporte[]>([])
  const { shipments } = useFileStore()
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "",
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm 5mm 20mm 5mm;
        @top-center { content: ""; }
        @top-left { 
          font-size: 8pt;
          font-family: Arial, sans-serif;
          color: #71717a; /* zinc-500 */
        }
        @top-right { content: ""; }
        @bottom-right {
          content: "Página " counter(page) " de " counter(pages);
          font-size: 8pt;
          color: #71717a;
          font-family: Arial, sans-serif;
        }
        @bottom-left {
          content: "Impresso em: ${new Date().toLocaleString('pt-BR')} — por ${session?.user?.name || 'Usuário'}";
          font-size: 8pt;
          color: #71717a;
          font-family: Arial, sans-serif;
        }
      }

      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        .no-print {
          display: none !important;
        }
        .print-container {
          padding: 0 !important;
          background: white !important;
          color: black !important;
        }
        .print-page-break {
          page-break-before: always !important;
        }
      }
    `
  })

  useEffect(() => {
    gerarProtocolo({ shipments }).then((response) => {
      if (response) setTransportes(response)
    })
  }, [shipments])

  const totalPesoBruto = transportes.reduce((acc, t) => acc + t.pesoBruto, 0)
  const totalPesoLiquido = transportes.reduce((acc, t) => acc + t.pesoLiquido, 0)
  const totalTransportes = transportes.length

  const formatPeso = (peso: number) =>
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(peso)

  const dataAtual = new Date().toLocaleDateString('pt-BR')
  const horaAtual = new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir Protocolo
        </Button>
      </DialogTrigger>

      <DialogContent className="min-w-3xl max-h-[90vh] overflow-y-auto print:text-black">
        <div ref={printRef} className="print-container space-y-4 text-sm p-4">
          {/* Cabeçalho */}
          <div className="text-center border-b pb-2">
            <h2 className="text-lg font-bold uppercase">
              Protocolo de {tipo}
            </h2>
            <p className="text-xs text-gray-600">
              Data: {dataAtual} | Hora: {horaAtual}
            </p>
          </div>

          {/* Resumo Geral */}
          <div className="bg-gray-50 rounded-md p-2">
            <h3 className="font-semibold mb-1 text-xs uppercase text-gray-700">Resumo Geral</h3>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-gray-600">Transportes</p>
                <p className="font-bold text-base">{totalTransportes}</p>
              </div>
              <div>
                <p className="text-gray-600">Peso Bruto Total</p>
                <p className="font-bold text-base">{formatPeso(totalPesoBruto)} kg</p>
              </div>
              <div>
                <p className="text-gray-600">Peso Líquido Total</p>
                <p className="font-bold text-base">{formatPeso(totalPesoLiquido)} kg</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1 text-xs uppercase text-gray-700">Detalhamento por Transporte</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-2 py-1 text-left font-semibold border-b">#</th>
                    <th className="px-2 py-1 text-left font-semibold border-b">ID Transporte</th>
                    <th className="px-2 py-1 text-right font-semibold border-b">Peso Líquido (kg)</th>
                    <th className="px-2 py-1 text-right font-semibold border-b">Peso Bruto (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {transportes.map((t, index) => (
                    <tr key={t.transportId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-2 py-1 border-b">{index + 1}</td>
                      <td className="px-2 py-1 border-b font-medium">{t.transportId}</td>
                      <td className="px-2 py-1 border-b text-right">{formatPeso(t.pesoLiquido)}</td>
                      <td className="px-2 py-1 border-b text-right">{formatPeso(t.pesoBruto)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold text-gray-800">
                    <td colSpan={2} className="px-2 py-1 border-t text-right">TOTAL</td>
                    <td className="px-2 py-1 border-t text-right">{formatPeso(totalPesoLiquido)}</td>
                    <td className="px-2 py-1 border-t text-right">{formatPeso(totalPesoBruto)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex mt-3 justify-end no-print">
          <Button size="sm" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
