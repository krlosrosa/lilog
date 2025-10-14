import * as XLSX from 'xlsx';
import { ImpressaoMapa } from '../types/pickingMap';

export function gerarExcelConferencia(mapas: ImpressaoMapa[], centerId: string, data: string) {
  const resultado = mapas.flatMap((mapa) =>
    mapa.itens.map((item) => ({
      ...item,
      transportId: mapa.transportId,
      processo: mapa.processo,
    }))
  );

  const worksheet = XLSX.utils.json_to_sheet(resultado)
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'data');
  // 2. Gera o arquivo em memória como ArrayBuffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  // 3. Cria um Blob e um link para download
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${centerId}-${data}-dados.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // limpa o objeto após o uso
}
