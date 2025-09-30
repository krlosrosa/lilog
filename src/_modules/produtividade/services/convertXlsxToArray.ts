import * as XLSX from 'xlsx';

export async function convertXlsxToArray(params: File): Promise<User[]> {
  const file = await params.arrayBuffer();
  const workbook = XLSX.read(file, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);


  const convertedData = data.map((item: any) => ({
    id: String(item['id'] ?? '').trim(),
    name: String(item['nome'] ?? '').trim(),
    turno: String(item['turno'] ?? '').trim(),
  }));

  return Promise.resolve(convertedData);
}

export type User = {
  id: string;
  name: string;
  turno: string;
};
