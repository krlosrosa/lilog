import { Separator } from "@/_shared/components/ui/separator";

type HeaderProps = { 
  title: string;
  subtitle: string;
 };

export const Header = ({ title, subtitle }: HeaderProps) => { 
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      <Separator />
    </div>
  );
};