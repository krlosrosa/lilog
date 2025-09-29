import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Badge } from "@/_shared/components/ui/badge";
import { cn } from "@/_shared/lib/utils";

type CardsSessaoProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  className?: string;
}

export default function CardsSessao({ 
  title, 
  description, 
  icon, 
  badge,
  className 
}: CardsSessaoProps) {

  return (
    <Card 
      className={cn(
        "group border-border/50 bg-card",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-xl bg-primary/10">
            {icon}
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl font-semibold text-card-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}