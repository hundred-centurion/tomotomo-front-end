import { z } from 'zod';

export const NickNameSchema = z
  .string()
  .min(1, {
    message: '닉네임은 1글자 이상 작성해주세요.',
  })
  .max(12, {
    message: '닉네임은 최대 12글자까지만 작성할 수 있습니다.',
  });

export const EmailSchema = z.string().email('이메일 형식으로 작성해주세요.');

export const PasswordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[!@#$%^&*()\-_=+{}[\]|\\:;"'<>,.?/~`])[a-zA-Z0-9!@#$%^&*()\-_=+{}[\]|\\:;"'<>,.?/~`]{8,20}$/,
    '비밀번호는 8글자 이상, 20글자 이하, 특수문자 1개 이상을 포함하여야 합니다.',
  );

export const SignInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type SignInFields = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  nickname: NickNameSchema,
  email: EmailSchema,
  password: PasswordSchema,
});

export type SignUpFields = z.infer<typeof SignUpSchema>;
