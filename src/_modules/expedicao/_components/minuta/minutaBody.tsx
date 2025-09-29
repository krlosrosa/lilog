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
        <div className='grid grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700 print:text-black'>Lacre:</label>
            <div className='h-12 border-b-2 border-dashed border-gray-400 print:border-black'></div>
          </div>
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-gray-700 print:text-black'>Stage:</label>
            <div className='h-12 border-b-2 border-dashed border-gray-400 print:border-black'></div>
          </div>
        </div>
        
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 print:text-black'>Observações:</label>
          <div className='h-16 border-b-2 border-dashed border-gray-400 print:border-black'></div>
        </div>
        
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 print:text-black'>Assinatura:</label>
          <div className='h-12 border-b-2 border-dashed border-gray-400 print:border-black'></div>
        </div>
      </div>
    </div>
  );
};
