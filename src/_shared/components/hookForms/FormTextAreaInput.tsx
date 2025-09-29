import * as React from "react";
import { Input } from "@/_shared/components/ui/input";
import { Label } from "@/_shared/components/ui/label";
import { FormMessage } from "@/_shared/components/ui/form";
import { useFormContext, RegisterOptions } from "react-hook-form";
import { Textarea } from "../ui/textarea";

interface FormTextAreaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  rules?: RegisterOptions;
}

export function FormTextAreaInput({ name, label, rules, ...props }: FormTextAreaInputProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="w-full flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Textarea id={name} {...register(name, rules)} {...props} />
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}
