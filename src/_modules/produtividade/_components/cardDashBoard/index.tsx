import { Card, CardContent, CardTitle } from '@/_shared/components/ui/card';
import { styleVariants } from './CardDashBoard.variants';

type Props = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  type: 'emAndamento' | 'concluidos' | 'totalProcessos' | 'totalCaixas' | 'produtividade';
}

export function CardDashBoard({ title, value, icon, type }: Props) {

  const styles = styleVariants[type] || styleVariants.default;

  return (
    <Card className={`border ${styles.card} hover:shadow-md transition-shadow`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className={`text-md font-medium ${styles.title}`}>
            {title}
          </CardTitle>
          {icon}
        </div>
        <div className={`text-md font-bold ${styles.value}`}>
          {value}
        </div>
      </CardContent>
    </Card>
  )
}