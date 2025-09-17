import { z } from 'zod';

export const NickNameSchema = z
  .string('닉네임을 입력해주세요.')
  .min(2, {
    message: '닉네임은 2글자 이상 작성해주세요.',
  })
  .max(10, {
    message: '닉네임은 최대 10글자까지만 작성할 수 있습니다.',
  });

export const EmailSchema = z.string().email('이메일 형식으로 작성해주세요.');

export const PasswordSchema = z
  .string('비밀번호를 입력해주세요.')
  .regex(
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_\-+=])[a-z\d!@#$%^&*_\-+=]{8,16}$/,
    '비밀번호는 최소 8글자 이상, 16글자 이하, 특수문자 1개 이상을 포함하여야 합니다.',
  );

export const BooleanSchema = z.boolean('선택해주세요.').default(false).optional();

export const LogInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type LogInFields = z.infer<typeof LogInSchema>;

export const SignUpSchema = z.object({
  nickName: NickNameSchema,
  password: PasswordSchema,
  passwordConfirm: PasswordSchema,
});

export type SignUpFields = z.infer<typeof SignUpSchema>;

export const SignUpStep1Schema = z
  .object({
    nickName: NickNameSchema,
    password: PasswordSchema,
    passwordConfirm: PasswordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type SignUpStep1Fields = z.infer<typeof SignUpStep1Schema>;

export const SignUpStep2Schema = z.object({
  email: EmailSchema,
});

export type SignUpStep2Fields = z.infer<typeof SignUpStep2Schema>;

export const EmailSubmitSchema = z.object({
  email: EmailSchema,
});

export type EmailSubmitFields = z.infer<typeof EmailSubmitSchema>;

export const ResetPasswordSchema = z.object({
  password1: PasswordSchema,
  password2: PasswordSchema,
});

export type ResetPasswordFields = z.infer<typeof ResetPasswordSchema>;

export const AccountSchema = z.object({
  email: EmailSchema,
  nickName: NickNameSchema,
});

export type AccountFields = z.infer<typeof AccountSchema>;

export const NewPasswordConfirmSchema = z.object({
  password: PasswordSchema,
});

export type NewPasswordConfirmFields = z.infer<typeof NewPasswordConfirmSchema>;

export const NewPasswordSchema = z
  .object({
    password: PasswordSchema,
    passwordConfirm: PasswordSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type NewPasswordFields = z.infer<typeof NewPasswordSchema>;
