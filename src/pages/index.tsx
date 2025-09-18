import * as React from 'react';
import PageLayout from '@/components/layouts/page-layout.tsx';
import IndexLayout from '@/components/layouts/index-layout.tsx';
import TitledCardContainer from '@/components/titled-card-container.tsx';
import { Text } from '@/components/typography.tsx';
import { CircleQuestionMark, Plus, Loader } from 'lucide-react';
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
import { makeCalendarHeatMap } from '@/lib/heat-map.ts';
import EmptyWrapper from '@/components/empty-wrapper.tsx';
import { Avatar } from '@/shadcn/avatar.tsx';
import { sortTasksByDueDate } from '@/lib/utils.ts';

type IndexPageProps = Omit<React.ComponentProps<'div'>, 'children'> & {};

export default function IndexPage({ ...props }: IndexPageProps) {
  const user = useAuthStore((state) => state.user);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
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
    try {
      const year = parseInt(selectedYear);
      const month = parseInt(selectedDay);
      await downloadReport(year, month);
    } catch (error) {
      console.error('리포트 다운로드 오류:', error);
      alert(error instanceof Error ? error.message : '리포트 다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <PageLayout {...props}>
      <IndexLayout className="gap-4">
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
                      <Text>{stats?.totalFocusTimeFormatted}</Text>
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
                      <Text>{stats?.todayFocusTimeFormatted}</Text>
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
            <ReportButton
              prefix={
                !isDownloading && (
                  <img src="/images/button/report-button-prefix.png" alt="Report Button Prefix" className="h-8 w-8" />
                )
              }
              onClick={handleDownloadReport}
              disabled={isDownloading}
            >
              {isDownloading ? <Loader className="h-4 w-4 animate-spin" /> : '공부 리포트 받아보기'}
            </ReportButton>,
          ]}
          cardContainerClassName="grid grid-cols-2 gap-4 flex-1 min-h-0"
          cardClassName="gap-4 min-h-0 overflow-hidden"
          cards={[
            {
              content: (
                <EmptyWrapper value={user} title="로그인이 필요합니다!">
                  <LoadingWrapper loading={isMonthlyStatsLoading}>
                    <Calendar
                      currentDate={selectedDate}
                      customDays={
                        monthlyStats?.dailyFocusHours &&
                        makeCalendarHeatMap(monthlyStats.dailyFocusHours as Record<string, number>)
                      }
                    />
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
                      <div className="flex w-full items-center justify-center">
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
      </IndexLayout>
    </PageLayout>
  );
}
