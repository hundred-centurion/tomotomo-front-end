import { createFileRoute, Link } from '@tanstack/react-router';
import { H2, Large, Muted, Small } from '@/components/typography.tsx';
import { Button } from '@/components/ui/button.tsx';

type EmailVerificationPageSearchQuery = {
  type: 'ready' | 'done';
  email: string;
  nickname: string;
};

const EmailVerificationPage = () => {
  const { type, email, nickname } = Route.useSearch();

  return type === 'ready' ? (
    <div className="flex w-full max-w-[350px] flex-col items-center px-4">
      <H2 className="mb-[32px] lg:mb-[42px]">이메일 확인</H2>
      <div className="flex flex-col gap-6">
        <Muted className="text-center">
          {email}로 인증 메일을 발송해 드렸어요.
          <br />
          인증 메일을 확인해 주세요.
        </Muted>

        <Button variant="secondary">인증 대기 중...</Button>

        <div className="flex justify-center">
          <Small>
            이메일이 오지 않았나요?{' '}
            <span className="cursor-pointer underline" onClick={() => console.log('재발송!')}>
              재발송
            </span>
          </Small>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex w-full max-w-[350px] flex-col items-center px-4">
      <H2 className="mb-[32px] lg:mb-[42px]">Welcome!</H2>
      <div className="flex flex-col gap-6">
        <Large className="text-center font-normal">
          {nickname}님의 회원가입이 완료되었어요. <br /> Tomotomo를 사용하러 가볼까요?
        </Large>

        <Link to="/auth/sign-in">
          <Button className="w-full cursor-pointer">로그인 하러 가기</Button>
        </Link>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/auth/email-verification')({
  component: EmailVerificationPage,
  validateSearch: (search: Record<string, unknown>): EmailVerificationPageSearchQuery => {
    return {
      type: search?.type ?? 'ready',
      email: search?.email ?? '',
      nickname: search?.nickname ?? '',
    } as EmailVerificationPageSearchQuery;
  },
});
