import type { UseFormReturn } from 'react-hook-form';
import * as React from 'react';

export type CommonFieldProps = {
  name: string;
  form: UseFormReturn;
  placeholder?: string;
  withFormMessage?: boolean;
};

export type InputFieldValue = {
  type: 'input';
  value: Pick<CommonFieldProps, 'name' | 'placeholder' | 'withFormMessage'> & {
    type: React.ComponentProps<'input'>['type'];
  };
};

export type CheckboxFieldValue = {
  type: 'checkbox';
  value: Pick<CommonFieldProps, 'name' | 'placeholder' | 'withFormMessage'> & {
    id: string;
    label: string;
  };
};

export type CommonExcludeProps = 'children' | 'form' | 'name';
