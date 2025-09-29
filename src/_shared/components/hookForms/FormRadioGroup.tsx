import * as React from "react"
import { Label } from "@/_shared/components/ui/label"
import { FormMessage } from "@/_shared/components/ui/form"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/_shared/components/ui/radio-group"
import { useFormContext, Controller } from "react-hook-form"

export interface RadioOption {
  value: string
  label: string
}

interface FormRadioGroupProps {
  name: string
  label?: string
  options: RadioOption[]
  className?: string
}

export function FormRadioGroup({
  name,
  label,
  options,
  className,
}: FormRadioGroupProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1">
      {label && <Label htmlFor={name}>{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value}
            className={className}
          >
            {options.map(option => (
              <div
                key={option.value}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${name}-${option.value}`}
                />
                <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      />
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  )
}




