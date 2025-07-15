import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { cn } from '@/lib/utils.ts';
import type { CommonExcludeProps, CommonFieldProps } from '@/types/field.ts';

const inputFieldVariants = cva('border-black');

type InputFieldProps = Omit<React.ComponentProps<'input'>, CommonExcludeProps> &
  CommonFieldProps &
  VariantProps<typeof inputFieldVariants>;

const InputField: React.FC<InputFieldProps> = ({
  className,
  type,
  form,
  name,
  placeholder,
  withFormMessage = true,
  ...props
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className={cn(inputFieldVariants(), className)}
              {...field}
              {...props}
            />
          </FormControl>
          {withFormMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
};

export default InputField;
