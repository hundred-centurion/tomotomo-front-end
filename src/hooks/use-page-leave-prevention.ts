import { useEffect } from 'react';
import { useTimerStore } from '@/store/timer-store';

/**
 * 다운로드 중일 때 페이지 이탈을 방지하는 훅
 */
export function usePageLeavePrevention() {
    const { isDownloading } = useTimerStore();

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDownloading) {
                const message = '분석 리포트의 다운로드가 진행 중입니다. 다른 페이지로 이동 시 다운로드가 중단됩니다.';

                // 표준 방법
                event.preventDefault();
                event.returnValue = message;

                // 브라우저 호환성을 위한 추가 설정
                return message;
            }
        };

        // beforeunload 이벤트 리스너 등록
        window.addEventListener('beforeunload', handleBeforeUnload);

        // cleanup 함수
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDownloading]);
}
