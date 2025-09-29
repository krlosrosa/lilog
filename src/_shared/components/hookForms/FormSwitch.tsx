import * as React from "react"
import { Switch } from "@/_shared/components/ui/switch"
import { Label } from "@/_shared/components/ui/label"
import { FormMessage } from "@/_shared/components/ui/form"
import { useFormContext, Controller } from "react-hook-form"

interface FormSwitchProps {
  name: string
  label: string
  description?: string
}

export function FormSwitch({ name, label, description }: FormSwitchProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext()
  const error = errors[name]?.message as string | undefined

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <Label htmlFor={name}>{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Switch
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>
      {error && <FormMessage>{error}</FormMessage>}
    </div>
  )
}




