import * as React from "react";
import { Input } from "@/_shared/components/ui/input";
import { Label } from "@/_shared/components/ui/label";
import { FormMessage } from "@/_shared/components/ui/form";
import { useFormContext, RegisterOptions } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  rules?: RegisterOptions;
}

export function FormInput({ name, label, rules, ...props }: FormInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="w-full flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input id={name} {...props} {...register(name, rules)} />
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
} 
