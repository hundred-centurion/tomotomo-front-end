import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import HomeLayout from '@/components/layouts/home-layout.tsx';
import TitledCardContainer from '@/components/titled-card-container.tsx';
import { Text } from '@/components/typography.tsx';
import { CircleQuestionMark, Plus } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import DatePicker from '@/components/date-picker.tsx';
import { useState } from 'react';
import Calendar from '@/components/calendar.tsx';
import ReportButton from '@/components/report-button.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/tooltip.tsx';
import Chart from '@/components/chart.tsx';
import { useAuthStore } from '@/store/auth-store.ts';
import { format } from 'date-fns';
import { useTasks } from '@/hooks/task/use-tasks.ts';
import { useMonthlyStats, useTimerStats, useDownloadAnalysisReport, usePageLeavePrevention } from '@/hooks';
import LoadingWrapper from '@/components/loading-wrapper.tsx';
import { makeCalendarHeatMap } from '@/lib/heat-map';
import EmptyWrapper from '@/components/empty-wrapper.tsx';
import { Avatar } from '@/shadcn/avatar.tsx';
import { sortTasksByDueDate } from '@/lib/utils.ts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shadcn/dialog.tsx';
import Loading from '@/components/loading.tsx';

type IndexPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function IndexPage({ ...props }: IndexPageProps) {
  const user = useAuthStore((state) => state.user);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const today = format(new Date(), 'M월 dd일');
  const selectedYear = format(selectedDate, 'yyyy');
  const selectedDay = format(selectedDate, 'MM');

  const { data: tasks, isLoading: isTasksLoading } = useTasks();
  const { data: stats, isLoading: isStatsLoading } = useTimerStats();
  const { data: monthlyStats, isLoading: isMonthlyStatsLoading } = useMonthlyStats(selectedYear, selectedDay);
  const { downloadReport, isDownloading } = useDownloadAnalysisReport();

  // 페이지 이탈 방지 훅 사용
  usePageLeavePrevention();

  // 리포트 다운로드 핸들러
  const handleDownloadReport = async () => {
    await downloadReport();
    // 다운로드 완료 시 다이얼로그 닫기
    setIsDialogOpen(false);
  };

  // 다이얼로그 열기 핸들러
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <PageLayout {...props}>
      <HomeLayout className="gap-4">
        <TitledCardContainer
          title="Home"
          className="flex-shrink-0"
          cardContainerClassName="grid grid-cols-3 gap-4 mb-3"
          cards={[
            {
              title: '총 집중 시간',
              content: (
                <EmptyWrapper value={user} title="로그인이 필요합니다!">
                  <LoadingWrapper loading={isStatsLoading}>
                    <div className="flex w-full justify-end">
                      <Text className="text-2xl">{stats?.totalFocusTimeFormatted}</Text>
                    </div>
                  </LoadingWrapper>
                </EmptyWrapper>
              ),
              tooltipMessage: user && `토모토모와 함께한 첫 순간부터 지금까지 ${user.userName}님이 집중한 시간이에요.`,
            },
            {
              title: '오늘의 집중 시간',
              content: (
                <EmptyWrapper value={user} title="로그인이 필요합니다!">
                  <LoadingWrapper loading={isStatsLoading}>
                    <div className="flex w-full justify-end">
                      <Text className="text-2xl">{stats?.todayFocusTimeFormatted}</Text>
                    </div>
                  </LoadingWrapper>
                </EmptyWrapper>
              ),
              tooltipMessage: user && `${user.userName}님이 ${today}에 집중한 시간이에요.`,
            },
            {
              title: '할 일 목록',
              content: (
                <EmptyWrapper value={user} title="로그인이 필요합니다!">
                  <LoadingWrapper loading={isTasksLoading}>
                    {tasks?.length ? (
                      sortTasksByDueDate(tasks)
                        .slice(0, 2)
                        .map(({ title, taskListColor }) => (
                          <div className="flex w-full items-center gap-4">
                            <Avatar className="h-3 w-3 rounded-lg" style={{ backgroundColor: taskListColor }} />
                            <Text>{title}</Text>
                          </div>
                        ))
                    ) : (
                      <div className="flex flex-col items-center">
                        <Text as="small">작업 설정이 되어있지 않아요.</Text>
                        <Link to="/tasks">
                          <Text as="small" className="underline">
                            [할 일 목록]으로 이동
                          </Text>
                        </Link>
                      </div>
                    )}
                  </LoadingWrapper>
                </EmptyWrapper>
              ),
              actions: [
                <Link to="/tasks" className="cursor-pointer">
                  <Plus className="h-4 w-4" />
                </Link>,
              ],
              tooltipMessage: user && `${user.userName}님이 설정하신 할 일 목록이에요. 토모토모와 함께 해보아요!`,
            },
          ]}
        />

        <TitledCardContainer
          title={<DatePicker value={selectedDate} onChange={setSelectedDate} />}
          className="flex min-h-0 flex-1 flex-col"
          actions={[
            user ? (
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  // 다운로드 중일 때는 Dialog가 닫히지 않도록 함
                  if (!open && isDownloading) {
                    return;
                  }
                  setIsDialogOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <ReportButton
                    prefix={
                      <img
                        src="/images/button/report-button-prefix.png"
                        alt="Report Button Prefix"
                        className="h-8 w-8"
                      />
                    }
                    onClick={handleOpenDialog}
                  >
                    분석 리포트 받아보기
                  </ReportButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md" showCloseButton={!isDownloading}>
                  <DialogHeader>
                    <DialogTitle>분석 리포트 다운로드</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col items-center space-y-4 py-4">
                    {isDownloading ? (
                      <>
                        <Loading />
                        <Text className="text-muted-foreground text-center text-sm">
                          열심히 리포트를 생성하고 있어요... <br />
                          1~5분 정도 소요될 수 있으니 조금만 기다려주세요!
                        </Text>
                      </>
                    ) : (
                      <>
                        {/* <Text className="text-center">
                        분석 리포트는 매월 5회씩 다운받아 보실 수 있습니다. (0/5)
                      </Text> */}
                        <Text className="text-center text-sm">
                          정확한 분석 리포트 생성을 위해 Tomotomo를 <br />
                          <span className="font-bold">최소 30일간</span> 이용한 이후부터 다운받으시길 권장드립니다.{' '}
                          <br />
                          <br />
                          지금 다운로드하시겠습니까?
                        </Text>
                        <ReportButton onClick={handleDownloadReport} className="w-full">
                          다운로드 시작
                        </ReportButton>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <></>
            ),
          ]}
          cardContainerClassName="grid grid-cols-2 gap-4 flex-1 min-h-0"
          cardClassName="gap-4 min-h-[500px] max-h-[500px] overflow-hidden"
          cards={[
            {
              content: (
                <EmptyWrapper value={user} title="로그인이 필요합니다!">
                  <LoadingWrapper loading={isMonthlyStatsLoading}>
                    <div className="flex w-full">
                      <Calendar
                        currentDate={selectedDate}
                        customDays={
                          monthlyStats?.dailyFocusHours &&
                          makeCalendarHeatMap(monthlyStats.dailyFocusHours as Record<string, number>)
                        }
                      />
                    </div>
                  </LoadingWrapper>
                </EmptyWrapper>
              ),
              tooltipMessage: null,
            },
            {
              title: '',
              actions: [
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>주간 집중 그래프</TooltipContent>
                </Tooltip>,
              ],
              content: (
                <EmptyWrapper value={user} title="로그인이 필요합니다!">
                  <LoadingWrapper loading={isMonthlyStatsLoading}>
                    {monthlyStats && monthlyStats?.weeklyFocusData && monthlyStats.weeklyFocusData?.length ? (
                      <Chart data={monthlyStats.weeklyFocusData} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Text>아직 적재된 데이터가 없습니다!</Text>
                      </div>
                    )}
                  </LoadingWrapper>
                </EmptyWrapper>
              ),
              tooltipMessage: null,
            },
          ]}
        />
      </HomeLayout>
    </PageLayout>
  );
}
