import { z } from 'zod';

export const NickNameSchema = z
  .string()
  .min(2, {
    message: '닉네임은 2글자 이상 작성해주세요.',
  })
  .max(10, {
    message: '닉네임은 최대 10글자까지만 작성할 수 있습니다.',
  });

export const EmailSchema = z.string().email('이메일 형식으로 작성해주세요.');

export const PasswordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_\-+=])[a-z\d!@#$%^&*_\-+=]{8,16}$/,
    '비밀번호는 최소 8글자 이상, 16글자 이하, 특수문자 1개 이상을 포함하여야 합니다.',
  );

export const BooleanSchema = z.boolean().default(false).optional();

export const SignInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type SignInFields = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  nickName: NickNameSchema,
  email: EmailSchema,
  password: PasswordSchema,
  terms: BooleanSchema,
  privacyTerms: BooleanSchema,
});

export type SignUpFields = z.infer<typeof SignUpSchema>;

export const EmailSubmitSchema = z.object({
  email: EmailSchema,
});

export type EmailSubmitFields = z.infer<typeof EmailSubmitSchema>;

export const ResetPasswordSchema = z.object({
  password1: PasswordSchema,
  password2: PasswordSchema,
});

export type ResetPasswordFields = z.infer<typeof ResetPasswordSchema>;
