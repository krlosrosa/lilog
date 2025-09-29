import * as React from "react";
import { Checkbox } from "@/_shared/components/ui/checkbox";
import { Label } from "@/_shared/components/ui/label";
import { FormMessage } from "@/_shared/components/ui/form";
import { useFormContext, Controller, RegisterOptions } from "react-hook-form";

interface FormCheckboxProps {
  name: string;
  label?: string;
  rules?: RegisterOptions;
}

export function FormCheckbox({ name, label, rules }: FormCheckboxProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
              ref={field.ref}
            />
          )}
        />
        {label && <Label htmlFor={name}>{label}</Label>}
      </div>
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  );
}
