import * as React from "react";
import { Label } from "@/_shared/components/ui/label";
import { FormMessage } from "@/_shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/_shared/components/ui/select";
import { useFormContext, RegisterOptions, Controller } from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormSelectInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  rules?: RegisterOptions;
  disabled?: boolean;
  className?: string;
}

export function FormSelectInput({ 
  name, 
  label, 
  placeholder = "Selecione uma opção...", 
  options, 
  rules, 
  disabled = false,
  className 
}: FormSelectInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="w-full flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select
            value={field.value || ""}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={className} id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}
