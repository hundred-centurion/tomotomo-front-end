import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { CommonExcludeProps, CommonFieldProps } from '@/types/field.ts';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { cn } from '@/lib/utils.ts';

const checkboxFieldVariants = cva('');

type CheckboxFieldProps = Omit<React.ComponentProps<typeof Checkbox>, CommonExcludeProps> &
  CommonFieldProps &
  VariantProps<typeof checkboxFieldVariants> & {
    label: string;
  };

const CheckboxField: React.FC<CheckboxFieldProps> = ({ className, form, name, id, label, withFormMessage = true }) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex items-center">
          <FormControl>
            <Checkbox
              id={id}
              checked={field.value}
              onCheckedChange={field.onChange}
              className={cn(checkboxFieldVariants(), className)}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel htmlFor={id} className="text-muted-foreground">
              {label}
            </FormLabel>
          </div>
          {withFormMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

export default CheckboxField;
