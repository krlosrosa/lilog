export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'finalizada':
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'em andamento':
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'pausada':
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};