import type { ItemMinutaCarregamento } from '../../services/types/pickingMap';

interface BodyProps {
  itens: ItemMinutaCarregamento[];
}

export const Body = ({ itens }: BodyProps) => {
  if (!itens || itens.length === 0) {
    return (
      <div className='w-full p-8 text-center bg-gray-50 print:bg-white border border-gray-200 print:border-black'>
        <p className='text-gray-500 print:text-black'>
          Nenhum item encontrado para separação
        </p>
      </div>
    );
  }

  return (
    <div className='w-full bg-white print:shadow-none'>
      <div>
        {/* Seção de Informações Gerais com Destaque na Doca */}
  <div className='grid grid-cols-3 gap-x-6 gap-y-4 border border-gray-300 print:border-black p-4 rounded-md'>
    {/* Coluna 1 */}
    <div className='space-y-4'>
      <div className='flex items-end'>
        <span className='text-sm font-semibold text-gray-700 print:text-black mr-2'>Lacre 1:</span>
        <div className='flex-grow border-b border-gray-400 print:border-black'></div>
      </div>
      <div className='flex items-end'>
        <span className='text-sm font-semibold text-gray-700 print:text-black mr-2'>Início:</span>
        <div className='flex-grow border-b border-gray-400 print:border-black'></div>
      </div>
    </div>

    {/* Coluna 2 */}
    <div className='space-y-4'>
      <div className='flex items-end'>
        <span className='text-sm font-semibold text-gray-700 print:text-black mr-2'>Temperatura:</span>
        <div className='flex-grow border-b border-gray-400 print:border-black'></div>
      </div>
       <div className='flex items-end'>
        <span className='text-sm font-semibold text-gray-700 print:text-black mr-2'>Fim:</span>
        <div className='flex-grow border-b border-gray-400 print:border-black'></div>
      </div>
    </div>
    
    {/* Coluna 3 - Doca em Destaque */}
    <div className='flex flex-col items-center justify-center bg-gray-100 print:bg-gray-200 border-2 border-gray-400 print:border-black rounded-md p-2'>
        <label className='text-sm font-bold pb-12 text-gray-800 print:text-black'>DOCA</label>
    </div>
  </div>
      </div>
      {/* Seção de Checklists em duas colunas - CORRIGIDO */}
      <div className='grid grid-cols-2 gap-x-1.5 py-2'>
        {/* Coluna do Check List do Veículo */}
        <div className='flex flex-col space-y-2 border border-gray-300 print:border-black p-4'>
          <h2 className='text-base font-bold text-gray-800 print:text-black border-b print:border-black pb-1 mb-2'>
            Checklist do Veículo
          </h2>
          <div className='text-sm space-y-3'>
            {/* Cada item agora é uma div com flexbox para alinhamento */}
            <div className='flex justify-between items-center'>
              <span>Baú com odor?</span>
              <span className='whitespace-nowrap'><span className='font-mono'>( &nbsp; )</span> Sim <span className='font-mono'>( &nbsp; )</span> Não</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Porta/Divisória em boas condições?</span>
              <span className='whitespace-nowrap'><span className='font-mono'>( &nbsp; )</span> Sim <span className='font-mono'>( &nbsp; )</span> Não</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Condições externas do veículo?</span>
              <span className='whitespace-nowrap'><span className='font-mono'>( &nbsp; )</span> Sim <span className='font-mono'>( &nbsp; )</span> Não</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Condições internas do veículo?</span>
              <span className='whitespace-nowrap'><span className='font-mono'>( &nbsp; )</span> Sim <span className='font-mono'>( &nbsp; )</span> Não</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Assoalho em boas condições e sem furos?</span>
              <span className='whitespace-nowrap'><span className='font-mono'>( &nbsp; )</span> Sim <span className='font-mono'>( &nbsp; )</span> Não</span>
            </div>
            <div className='flex items-center pt-2'>
              <span className='mr-2 font-semibold'>OBS:</span>
              <div className='flex-grow mt-2 border-b-1 border-dotted border-gray-400 print:border-black'></div>
            </div>
          </div>
        </div>

        {/* Coluna de Informações do Palete */}
        <div className='flex flex-col space-y-2 border border-gray-300 print:border-black p-4'>
          <h2 className='text-base font-bold text-gray-800 print:text-black border-b print:border-black pb-1 mb-2'>
            Informações do Palete
          </h2>
          <div className='text-sm space-y-3'>
            <div className='flex items-end'>
              <span className='mr-2'>Quantidade troca de palete:</span>
              <div className='w-20 border-b-2 border-dotted border-gray-400 print:border-black text-center'></div>
            </div>
            <div className='flex justify-between items-center'>
              <span>Termo Palete?</span>
              <span className='whitespace-nowrap'><span className='font-mono'>( &nbsp; )</span> Sim <span className='font-mono'>( &nbsp; )</span> Não</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Carga Estivada?</span>
              <span className='whitespace-nowrap'><span className='font-mono'>( &nbsp; )</span> Sim <span className='font-mono'>( &nbsp; )</span> Não</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Possui Carrinho?</span>
              <span className='whitespace-nowrap'><span className='font-mono'>( &nbsp; )</span> Sim <span className='font-mono'>( &nbsp; )</span> Não</span>
            </div>
            <div className='flex items-center pt-2'>
              <span className='mr-2 font-semibold'>OBS:</span>
              <div className='flex-grow mt-2 border-b-1 border-dotted border-gray-400 print:border-black'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='overflow-hidden border border-gray-300 print:border-black'>
        <table className='w-full text-xs print:text-xs'>
          <thead>
            <tr className='bg-gray-100 print:bg-gray-200'>
              <th className='px-2 py-2 font-semibold text-gray-700 print:text-black border-b border-r border-gray-300 print:border-black text-left'>
                ID
              </th>
              <th className='px-2 py-2 font-semibold text-gray-700 print:text-black border-b border-r border-gray-300 print:border-black text-left'>
                Empresa
              </th>
              <th className='px-2 py-2 font-semibold text-gray-700 print:text-black border-b border-r border-gray-300 print:border-black text-left'>
                Seguimento
              </th>
              <th className='px-2 py-2 font-semibold text-gray-700 print:text-black border-b border-r border-gray-300 print:border-black text-center'>
                Qtd. Caixas
              </th>
              <th className='px-2 py-2 font-semibold text-gray-700 print:text-black border-b border-r border-gray-300 print:border-black text-center'>
                Unidades
              </th>
              <th className='px-2 py-2 font-semibold text-gray-700 print:text-black border-b border-r border-gray-300 print:border-black text-center'>
                Qtd. Paletes
              </th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => (
              <tr
                key={`${item.id}-${index}`}
                className='hover:bg-gray-50 print:hover:bg-transparent'
              >
                <td className='px-2 py-2 border-b border-r border-gray-300 print:border-black text-left'>
                  {item.id}
                </td>
                <td className='px-2 py-2 border-b border-r border-gray-300 print:border-black text-left'>
                  {item.empresa}
                </td>
                <td className='px-2 py-2 border-b border-r border-gray-300 print:border-black text-left'>
                  {item.seguimento}
                </td>
                <td className='px-2 py-2 border-b border-r border-gray-300 print:border-black text-center'>
                  {item.quantidadeCaixas}
                </td>
                <td className='px-2 py-2 border-b border-r border-gray-300 print:border-black text-center'>
                  {item.quantidade}
                </td>
                <td className='px-2 py-2 border-b border-r border-gray-300 print:border-black text-center'>
                  {item.quantidadePaletes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Campos para preenchimento manual */}
      <div className='mt-6 space-y-4 border-t border-gray-300 print:border-black pt-4'>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 print:text-black'>Assinatura:</label>
          <div className='h-12 border-b-2 border-dashed border-gray-400 print:border-black'></div>
        </div>
      </div>
    </div>
  );
};
