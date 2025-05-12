import { cva, type VariantProps } from 'class-variance-authority';
import { Form } from '@/components/ui/form.tsx';
import type { CheckboxFieldValue, CommonFieldProps, InputFieldValue } from '@/types/field.ts';
import { z } from 'zod';
import { cn } from '@/lib/utils.ts';
import * as React from 'react';
import InputField from '@/components/fields/input-field.tsx';
import CheckboxField from '@/components/fields/checkbox-field.tsx';
import { Button } from '@/components/ui/button.tsx';

const formRendererVariants = cva('');

type FormRendererProps<Schema extends z.ZodType> = React.ComponentProps<'form'> &
  VariantProps<typeof formRendererVariants> &
  Pick<CommonFieldProps, 'form'> & {
    schema: Schema;
    fields: Array<InputFieldValue | CheckboxFieldValue>;
    onSubmit: (values: z.infer<Schema>) => void;
    submitButtonText: string;
    wrapperClassName?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
  };

const FormRenderer = <Schema extends z.ZodType>({
  className,
  form,
  fields,
  onSubmit,
  submitButtonText,
  wrapperClassName,
  header,
  footer,
}: FormRendererProps<Schema>) => {
  return (
    <div className={cn(wrapperClassName)}>
      {header && header}
      <Form {...form}>
        <form className={cn(formRendererVariants(), className)} onSubmit={form.handleSubmit(onSubmit)}>
          {fields.map(({ type, value }, index) => {
            switch (type) {
              case 'input':
                return <InputField key={index} form={form} {...value} />;
              case 'checkbox':
                return <CheckboxField key={index} form={form} {...value} />;
            }
          })}
        </form>
        <Button type="submit">{submitButtonText}</Button>
      </Form>
      {footer && footer}
    </div>
  );
};
export default FormRenderer;
