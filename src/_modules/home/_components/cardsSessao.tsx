import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_shared/components/ui/card";
import { Badge } from "@/_shared/components/ui/badge";
import { cn } from "@/_shared/lib/utils";
import Link from "next/link";

type CardsSessaoProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  className?: string;
  href: string;
}

export default function CardsSessao({ 
  title, 
  description, 
  icon, 
  badge,
  className,
  href 
}: CardsSessaoProps) {

  return (
    <Link href={href} className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-lg">
      <Card 
        className={cn(
          "group border-border/50 bg-card h-full transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1",
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
    </Link>
  )
}