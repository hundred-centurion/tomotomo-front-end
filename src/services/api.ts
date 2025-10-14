/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface MemberDto {
  /** @format int64 */
  id?: number;
  userId?: string;
  email?: string;
  nickName?: string;
  name?: string;
  status?: string;
  /** 이메일 인증 여부 */
  emailVerified?: boolean;
  createDate?: string;
}

export interface ResponseEntityBaseResponseVoid {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: null;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface TaskListResponse {
  /** @format int64 */
  id?: number;
  name?: string;
  color?: string;
  isDefault?: boolean;
  /** @format int64 */
  incompleteTaskCount?: number;
  /** 작업 목록 생성 시간 */
  createDate?: string;
  /** 작업 목록 최종 수정 시간 */
  updateDate?: string;
}

export interface ResponseEntityBaseResponseMemberDto {
  success?: boolean;
  data?: MemberDto;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface Create {
  /** @format int64 */
  taskId: number;
  /** @maxLength 30 */
  title: string;
}

export interface ResponseEntityBaseResponseListTaskListResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: TaskListResponse[];
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface RegisterRequest {
  /**
   * @format email
   * @maxLength 200
   */
  email: string;
  /**
   * @minLength 8
   * @maxLength 16
   * @pattern ^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_=+\-])[A-Za-z0-9!@#$%^&*_=+\-]{8,16}$
   */
  password: string;
  /**
   * @minLength 2
   * @maxLength 10
   * @pattern ^[가-힣A-Za-z0-9]+$
   */
  nickName: string;
  /** @maxLength 50 */
  name: string;
}

export interface ResponseEntityBaseResponseTaskListResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: TaskListResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
}

export interface ResponseEntityBaseResponseString {
  success?: boolean;
  data?: string;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface TaskListRequest {
  /** @maxLength 10 */
  name: string;
  /** @pattern ^#[0-9A-Fa-f]{6}$ */
  color: string;
}

export interface Update {
  /** @maxLength 30 */
  title: string;
}

export interface LoginRequest {
  /** @format email */
  email: string;
  password: string;
}

export interface ResponseEntityBaseResponseLoginResponse {
  success?: boolean;
  data?: LoginResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface SubTaskResponse {
  /** @format int64 */
  id?: number;
  /** @format int64 */
  taskId?: number;
  title?: string;
  completed?: boolean;
  /** 서브태스크 생성 시간 */
  createDate?: string;
  /** 서브태스크 최종 수정 시간 */
  updateDate?: string;
}

export interface BaseResponseListSubTaskResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: SubTaskResponse[];
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface BaseResponseSubTaskResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: SubTaskResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export type Key = object;

export interface MapObject {
  key?: Key;
}

export interface PasswordResetRequest {
  /** @format email */
  email: string;
}

export interface ResponseEntityBaseResponseMapObject {
  success?: boolean;
  data?: MapObject;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface BaseResponseVoid {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: null;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

export interface ResponseEntityBaseResponseBoolean {
  success?: boolean;
  data?: boolean;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface Duration {
  /**
   * The number of seconds in the duration.
   * @format int64
   */
  seconds?: number;
  /**
   * The number of nanoseconds in the duration, expressed as a fraction of the
   * number of seconds. This is always positive, and never exceeds 999,999,999.
   */
  nanos?: number;
}

export interface NicknameChangeRequest {
  /**
   * @minLength 2
   * @maxLength 10
   */
  newNickname: string;
}

export interface ResponseEntityBaseResponseTaskResponse {
  success?: boolean;
  data?: TaskResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface TimerResponse {
  /** @format int64 */
  totalTime?: number;
  /** @format int64 */
  id?: number;
  /** @format int64 */
  taskId?: number;
  taskContent?: string;
  setFocusTime?: Duration;
  setBreakTime?: Duration;
  /** 실제 사용된 집중 시간 */
  useFocusTime?: Duration;
  /** 실제 사용된 휴식 시간 */
  useBreakTime?: Duration;
  routineCnt?: number;
  createDate?: string;
  completed?: boolean;
  completedRoutineCnt?: number;
  /** 현재 타이머 상태 */
  timerStatus?: string;
}

export interface ResponseEntityBaseResponseListTaskResponse {
  success?: boolean;
  data?: TaskResponse[];
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface ResponseEntityBaseResponseTimerResponse {
  success?: boolean;
  data?: TimerResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface TimerStartRequest {
  /** @format int64 */
  taskId: number;
  /** 분 단위 */
  focusTime: number;
  /** 분 단위 */
  breakTime: number;
  repeatCount: number;
}

export interface ResponseEntityBaseResponseListTimerResponse {
  success?: boolean;
  data?: TimerResponse[];
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface TaskResponse {
  /** @format int64 */
  id?: number;
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  /** @format int64 */
  taskListId?: number;
  taskListName?: string;
  taskListColor?: string;
  /** 작업 생성 시간 */
  createDate?: string;
  /** 작업 최종 수정 시간 */
  updateDate?: string;
}

export interface VerifyPasswordRequest {
  currentPassword: string;
}

export interface WeeklyFocusData {
  /** 주차 (1, 2, 3, 4, 5) */
  weekNumber?: number;
  /** 주차 범위 (예: "12/1 - 12/7") */
  weekRange?: string;
  /** 해당 주의 총 집중 시간 (시간 단위, 분은 반올림) */
  focusHours?: number;
}

export interface UpdatePasswordRequest {
  /** @minLength 8 */
  newPassword: string;
}

export interface MapInteger {
  key?: number;
}

export interface ResponseEntityBaseResponseLong {
  /** 성공 여부 */
  success?: boolean;
  /**
   * 성공 시 데이터
   * @format int64
   */
  data?: number;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface SummaryDashboard {
  /** 종합 점수 (0-100) */
  overallScore?: number;
  /** "25시간 30분" */
  totalFocusTimeFormatted?: string;
  totalSessions?: number;
  consecutiveDays?: number;
  /** 3-5개의 핵심 인사이트 */
  keyInsights?: string[];
}

export interface MapInteger1 {
  key?: number;
}

export interface TimerDashboardStatsResponse {
  /** 총 집중 시간(분) */
  totalFocusTime?: Duration;
  /** 총 휴식 시간(분) */
  totalBreakTime?: Duration;
  /** 총 세션 수 */
  totalSessions?: number;
  /** 총 집중 시간 (예: "25시간 30분") */
  totalFocusTimeFormatted?: string;
  /** 오늘의 총 집중 시간 (예: "25시간 30분") */
  todayFocusTimeFormatted?: string;
}

export interface TimePatternAnalysis {
  /** 가장 생산적인 날 */
  mostProductiveDay?: string;
  /** 최대 일별 집중시간 */
  maxDailyFocusHours?: number;
  /** 평균 일별 집중시간 */
  averageDailyFocusHours?: number;
  /** 활동한 날 수 */
  activeDaysCount?: number;
  /** "높음", "보통", "낮음" */
  consistencyLevel?: string;
  /** 주차별 집중시간 패턴 */
  weeklyPattern?: MapInteger1;
}

export interface ResponseEntityBaseResponseTimerDashboardStatsResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: TimerDashboardStatsResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface PerformanceAnalysis {
  /** 생산성 추세 (+ 증가, - 감소) */
  productivityTrend?: number;
  /** 연속성 점수 (0-100) */
  streakScore?: number;
  /** "우수", "양호", "개선필요" */
  performanceLevel?: string;
  /** 월간 목표 달성률 (%) - 임시로 평균 기반 계산 */
  monthlyGoalAchievement?: number;
}

export interface Create2 {
  /** @maxLength 30 */
  title: string;
  /**
   * 설명은 선택사항
   * @maxLength 200
   */
  description?: string;
  dueDate: string;
  /**
   * TaskList ID (null이면 기본 리스트 사용)
   * @format int64
   */
  taskListId?: number;
}

export interface ActionableRecommendation {
  /** 카테고리 (예: "시간 관리", "목표 설정") */
  category?: string;
  /** 제안 제목 */
  title?: string;
  /** 상세 설명 */
  description?: string;
  /** 기대 효과 */
  expectedImpact?: string;
  /** 우선순위 (1: 높음, 2: 보통, 3: 낮음) */
  priority?: number;
}

export interface Update3 {
  /** @maxLength 30 */
  title: string;
  /**
   * 설명은 선택사항
   * @maxLength 200
   */
  description?: string;
  dueDate: string;
  /**
   * TaskList 변경 시 사용
   * @format int64
   */
  taskListId?: number;
}

export interface AICoachingInsights {
  /** 강점 분석 */
  strengths?: string[];
  /** 개선 영역 */
  improvementAreas?: string[];
  /** 실행 가능한 제안 */
  recommendations?: ActionableRecommendation[];
  /** AI가 생성한 동기부여 메시지 */
  motivationalMessage?: string;
}

export interface MonthlyDashboardStatsResponse {
  /** 주차별 집중 시간 데이터 (그래프용) */
  weeklyFocusData?: WeeklyFocusData[];
  /** 일별 집중 시간 데이터 (캘린더 히트맵용) */
  dailyFocusHours?: MapInteger;
  /** 이번 달 총 집중 시간 */
  totalMonthlyFocusHours?: number;
}

export interface UserAnalysisReportResponse {
  /** === 1. 요약 대시보드 === */
  summaryDashboard?: SummaryDashboard;
  /** === 2. 시간 패턴 분석 === */
  timePatternAnalysis?: TimePatternAnalysis;
  /** === 3. 성과 지표 분석 === */
  performanceAnalysis?: PerformanceAnalysis;
  /** === 4. AI 개인화 코칭 === */
  aiCoachingInsights?: AICoachingInsights;
  /** === 5. 리포트 메타데이터 === */
  generatedAt?: string;
  /** 예: "2024-12-01 ~ 2024-12-31" */
  reportPeriod?: string;
}

export interface ResponseEntityBaseResponseMonthlyDashboardStatsResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: MonthlyDashboardStatsResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface ResponseEntityBaseResponseUserAnalysisReportResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: UserAnalysisReportResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface PdfDownloadLimitResponse {
  /** 월간 최대 다운로드 횟수 */
  maxDownloadsPerMonth?: number;
  /** 현재 월 누적 다운로드 횟수 */
  currentMonthDownloads?: number;
  /** 남은 다운로드 횟수 */
  remainingDownloads?: number;
  /** 다운로드 가능 여부 */
  canDownload?: boolean;
}

export interface CalculationDetail {
  /** 집중력 계산 상세 */
  totalSessions?: number;
  /** 완료 세션 수 */
  completedSessions?: number;
  /** 완료율 (%) */
  completionRate?: number;
  /** 성실함 계산 상세 */
  totalActiveDays?: number;
  /** 연속 접속일수 */
  consecutiveDays?: number;
  /** 연속 접속 비율 (%) */
  consecutiveRate?: number;
  /** 성장 계산 상세 */
  previousFocusScore?: number;
  /** 이전 성실함 점수 */
  previousDiligenceScore?: number;
  /** 집중력 성장률 (%) */
  focusGrowthRate?: number;
  /** 성실함 성장률 (%) */
  diligenceGrowthRate?: number;
  /** 평균 성장률 (%) */
  averageGrowthRate?: number;
}

export interface DayOfWeekStats {
  /** 가장 많이 사용한 요일 (1:월 ~ 7:일) */
  mostUsedDay?: number;
  /** 가장 많이 사용한 요일 이름 */
  mostUsedDayName?: string;
  /** 월요일 막대 높이 (0-10) */
  mondayBar?: number;
  /** 화요일 막대 높이 (0-10) */
  tuesdayBar?: number;
  /** 수요일 막대 높이 (0-10) */
  wednesdayBar?: number;
  /** 목요일 막대 높이 (0-10) */
  thursdayBar?: number;
  /** 금요일 막대 높이 (0-10) */
  fridayBar?: number;
  /** 토요일 막대 높이 (0-10) */
  saturdayBar?: number;
  /** 일요일 막대 높이 (0-10) */
  sundayBar?: number;
}

export interface ResponseEntityBaseResponsePdfDownloadLimitResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: PdfDownloadLimitResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

export interface HealthIndicators {
  /** 집중력 점수 (1-10점) */
  focusScore?: number;
  /** 성실함 점수 (1-10점) */
  diligenceScore?: number;
  /** 성장 점수 (1-10점) */
  growthScore?: number;
  /** 요일별 사용 통계 */
  dayOfWeekStats?: DayOfWeekStats;
  /** 최근 30일 접속 여부 (0:31일전 ~ 29:전날) */
  last30DaysLogin?: boolean[];
}

export interface PdfReportStatisticsResponse {
  /** === 기본 정보 === */
  nickname?: string;
  /**
   * 누적 집중시간 (초 단위)
   * @format int64
   */
  totalFocusTime?: number;
  /** 누적 집중시간 (시간 단위, 소수점 첫째자리) */
  totalFocusTimeHours?: number;
  /** 연속 접속일수 (최소 1일) */
  consecutiveLoginDays?: number;
  /** 종합 점수 (0-100점) */
  totalScore?: number;
  /** AI 생성 핵심 인사이트 (2-4줄, 줄당 35자) */
  keyInsight?: string;
  /** === Deep Research 전용 필드 === */
  deepAnalysis?: string;
  /** 일평균 집중시간 (소수점 첫째자리) */
  avgDailyFocusHours?: number;
  /** 최고 생산성의 날 */
  maxProductivityDate?: string;
  /** 일 최대 집중시간 (소수점 첫째자리) */
  maxDailyFocusHours?: number;
  /** 활동 일수 */
  activeDaysCount?: number;
  /** 완주율 (0-100%, 정수) */
  completionRate?: number;
  /** === Coach 전용 필드 === */
  coachPraise?: string;
  /** AI 코칭: 아쉬워요 (3-8줄, 줄당 46자) */
  coachRegret?: string;
  /** AI 코칭: 이렇게 해볼까요 (3-8줄, 줄당 46자) */
  coachSuggestion?: string;
  /** === 집중건강 상태 지표 === */
  healthIndicators?: HealthIndicators;
  /** === 계산 상세 정보 (디버깅/검증용) === */
  calculationDetail?: CalculationDetail;
  /** === 리포트 메타데이터 === */
  reportStartDate?: string;
  /** 리포트 종료일 (다운로드 날짜) */
  reportEndDate?: string;
}

export interface ResponseEntityBaseResponsePdfReportStatisticsResponse {
  /** 성공 여부 */
  success?: boolean;
  /** 성공 시 데이터 */
  data?: PdfReportStatisticsResponse;
  /** 에러 상황별 고유 코드 */
  code?: string;
  /** 실패 시 에러 메시지 */
  error?: string;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || '',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Default module
 * @version 1.0.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description 리프레시 토큰을 통해 엑세스 토큰을 갱신합니다.
     *
     * @name AuthRefreshCreate
     * @summary 엑세스 토큰 갱신
     * @request POST:/api/auth/refresh
     * @secure
     */
    authRefreshCreate: (data: RefreshTokenRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseLoginResponse>({
        path: `/api/auth/refresh`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 토큰이 유효한지 확인하고, 유효 시 사용자 ID를 반환합니다.
     *
     * @name AuthValidateList
     * @summary JWT 토큰 유효성 검증
     * @request GET:/api/auth/validate
     * @secure
     */
    authValidateList: (
      query: {
        /** 검증할 JWT 토큰 */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ResponseEntityBaseResponseMapObject>({
        path: `/api/auth/validate`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 회원 가입 요청을 처리하고 생성된 회원 정보를 반환합니다.
     *
     * @name AuthRegisterCreate
     * @summary 회원가입
     * @request POST:/api/auth/register
     * @secure
     */
    authRegisterCreate: (data: RegisterRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseMemberDto>({
        path: `/api/auth/register`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 로그인 요청을 처리하고 JWT 토큰을 반환합니다.
     *
     * @name AuthLoginCreate
     * @summary 로그인
     * @request POST:/api/auth/login
     * @secure
     */
    authLoginCreate: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseLoginResponse>({
        path: `/api/auth/login`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 로그아웃 요청을 처리하고 성공 메시지를 반환합니다. 헤더 Authorization에 Request탭 Auth -> Authorization Type (Bearer Token) -> 로그인 시 받은 토큰 값
     *
     * @name AuthLogoutCreate
     * @summary 로그아웃
     * @request POST:/api/auth/logout
     * @secure
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseString>({
        path: `/api/auth/logout`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 이메일 검증 토큰을 받아 인증을 완료합니다.
     *
     * @name AuthVerifyEmailList
     * @summary 이메일 인증
     * @request GET:/api/auth/verify-email
     * @secure
     */
    authVerifyEmailList: (
      query: {
        /** 이메일 검증 토큰 */
        token: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ResponseEntityBaseResponseString>({
        path: `/api/auth/verify-email`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 이메일 인증 상태를 조회합니다.
     *
     * @name AuthEmailVerifiedList
     * @summary 이메일 인증 상태 조회
     * @request GET:/api/auth/email-verified
     * @secure
     */
    authEmailVerifiedList: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseBoolean>({
        path: `/api/auth/email-verified`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 인증 메일 재전송 성공 메시지 또는 오류 응답
     *
     * @name AuthResendEmailCreate
     * @summary 이메일 인증 메일 재전송
     * @request POST:/api/auth/resend-email
     * @secure
     */
    authResendEmailCreate: (
      query: {
        /** 재전송할 이메일 주소 */
        email: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ResponseEntityBaseResponseString>({
        path: `/api/auth/resend-email`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 닉네임 변경 API 닉네임 변경 인증된 사용자의 닉네임을 변경합니다.
     *
     * @name AuthNicknameCreate
     * @summary 닉네임 변경
     * @request POST:/api/auth/nickname
     * @secure
     */
    authNicknameCreate: (data: NicknameChangeRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseMemberDto>({
        path: `/api/auth/nickname`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 타이머 시작 선택한 할 일과 설정으로 타이머를 시작하고 기록을 생성합니다.
     *
     * @name TimerStartCreate
     * @summary 타이머 시작
     * @request POST:/api/timer/start
     * @secure
     */
    timerStartCreate: (data: TimerStartRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTimerResponse>({
        path: `/api/timer/start`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 집중 타이머 중지 진행 중인 집중 타이머를 중지하고 사용 시간을 기록합니다.
     *
     * @name TimerFocusStopCreate
     * @summary 집중 타이머 중지
     * @request POST:/api/timer/{timerId}/focus/stop
     * @secure
     */
    timerFocusStopCreate: (timerId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTimerResponse>({
        path: `/api/timer/${timerId}/focus/stop`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 휴식 타이머 시작 휴식 타이머를 시작합니다.
     *
     * @name TimerBreakStartCreate
     * @summary 휴식 타이머 시작
     * @request POST:/api/timer/{timerId}/break/start
     * @secure
     */
    timerBreakStartCreate: (timerId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTimerResponse>({
        path: `/api/timer/${timerId}/break/start`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 휴식 타이머 중지 진행 중인 휴식 타이머를 중지하고 사용 시간을 기록합니다.
     *
     * @name TimerBreakStopCreate
     * @summary 휴식 타이머 중지
     * @request POST:/api/timer/{timerId}/break/stop
     * @secure
     */
    timerBreakStopCreate: (timerId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTimerResponse>({
        path: `/api/timer/${timerId}/break/stop`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 집중 타이머 재시작 휴식 후 다음 집중 타이머를 시작합니다.
     *
     * @name TimerFocusStartCreate
     * @summary 집중 타이머 재시작
     * @request POST:/api/timer/{timerId}/focus/start
     * @secure
     */
    timerFocusStartCreate: (timerId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTimerResponse>({
        path: `/api/timer/${timerId}/focus/start`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 지정된 기간의 타이머 기록을 반환합니다.
     *
     * @name TimerHistoryDateRangeList
     * @summary 기간별 타이머 기록 조회
     * @request GET:/api/timer/history/date-range
     * @secure
     */
    timerHistoryDateRangeList: (
      query: {
        /**
         * 시작 날짜
         * @example "2025-05-01"
         */
        startDate: string;
        /**
         * 종료 날짜
         * @example "2025-06-07"
         */
        endDate: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ResponseEntityBaseResponseListTimerResponse>({
        path: `/api/timer/history/date-range`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 사용자의 타이머 통계 정보를 반환합니다.
     *
     * @name TimerStatsList
     * @summary 타이머 통계 조회
     * @request GET:/api/timer/stats
     * @secure
     */
    timerStatsList: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTimerDashboardStatsResponse>({
        path: `/api/timer/stats`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 월별 타이머 통계 조회 지정된 월의 주차별 막대그래프 데이터와 일별 히트맵 데이터를 반환합니다.
     *
     * @name TimerStatsMonthlyList
     * @summary 월별 타이머 통계 조회
     * @request GET:/api/timer/stats/monthly
     * @secure
     */
    timerStatsMonthlyList: (
      query: {
        /** 연도 (예: 2024) */
        year: number;
        /** 월 (1-12) */
        month: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ResponseEntityBaseResponseMonthlyDashboardStatsResponse>({
        path: `/api/timer/stats/monthly`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 사용자의 타이머 통계를 기반으로 AI가 피드백을 제공합니다.
     *
     * @name TimerStatsFeedbackList
     * @summary AI 피드백 조회
     * @request GET:/api/timer/stats/feedback
     * @secure
     */
    timerStatsFeedbackList: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseString>({
        path: `/api/timer/stats/feedback`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description AI 사용자 분석 리포트 조회 (JSON) 사용자의 타이머 데이터를 바탕으로 AI가 분석한 종합 리포트를 JSON으로 반환합니다.
     *
     * @name TimerAnalysisReportList
     * @summary AI 사용자 분석 리포트 조회 (JSON)
     * @request GET:/api/timer/analysis-report
     * @secure
     */
    timerAnalysisReportList: (
      query: {
        /** 연도 (예: 2025) */
        year: number;
        /** 월 (1-12) */
        month: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, ResponseEntityBaseResponseUserAnalysisReportResponse>({
        path: `/api/timer/analysis-report`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description AI 사용자 분석 리포트 PDF 다운로드 사용자의 타이머 데이터를 바탕으로 AI가 분석한 종합 리포트를 PDF로 다운로드합니다.
     *
     * @name TimerDownloadReportPdfList
     * @summary AI 사용자 분석 리포트 PDF 다운로드
     * @request GET:/api/timer/download-report-pdf
     * @secure
     */
    timerDownloadReportPdfList: (
      query: {
        /** 연도 (예: 2025) */
        year: number;
        /** 월 (1-12) */
        month: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, number[]>({
        path: `/api/timer/download-report-pdf`,
        method: 'GET',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description PDF 리포트 전용 통계 조회 회원가입일부터 현재까지의 집중건강 지표를 포함한 PDF 리포트 통계를 반환합니다.
     *
     * @name TimerPdfStatisticsList
     * @summary PDF 리포트 전용 통계 조회
     * @request GET:/api/timer/pdf-statistics
     * @secure
     */
    timerPdfStatisticsList: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponsePdfReportStatisticsResponse>({
        path: `/api/timer/pdf-statistics`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 전체 리포트 PDF 다운로드 사용자 통계 데이터를 기반으로 6페이지 리포트 PDF를 생성하여 다운로드
     *
     * @name TimerAnalysisReportPdfList
     * @summary 전체 리포트 PDF 다운로드
     * @request GET:/api/timer/analysis-report/pdf
     * @secure
     */
    timerAnalysisReportPdfList: (params: RequestParams = {}) =>
      this.request<any, number[]>({
        path: `/api/timer/analysis-report/pdf`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description PDF 다운로드 제한 정보 조회 현재 월의 PDF 다운로드 횟수 및 남은 횟수 조회
     *
     * @name TimerAnalysisReportDownloadLimitList
     * @summary PDF 다운로드 제한 정보 조회
     * @request GET:/api/timer/analysis-report/download-limit
     * @secure
     */
    timerAnalysisReportDownloadLimitList: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponsePdfDownloadLimitResponse>({
        path: `/api/timer/analysis-report/download-limit`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 비밀번호 재설정 요청 API (이메일 발송) 비밀번호 재설정 요청 (이메일) 입력한 이메일로 비밀번호 재설정 메일을 발송합니다.
     *
     * @name PasswordResetRequestCreate
     * @summary 비밀번호 재설정 요청 (이메일)
     * @request POST:/api/password/reset/request
     * @secure
     */
    passwordResetRequestCreate: (data: PasswordResetRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseString>({
        path: `/api/password/reset/request`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 비밀번호 재설정 확인 API (토큰 이용) 비밀번호 재설정 확인 (토큰) 토큰과 새 비밀번호를 받아 비밀번호를 재설정합니다.
     *
     * @name PasswordResetConfirmCreate
     * @summary 비밀번호 재설정 확인 (토큰)
     * @request POST:/api/password/reset/confirm
     * @secure
     */
    passwordResetConfirmCreate: (data: PasswordResetConfirmRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseString>({
        path: `/api/password/reset/confirm`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 현재 비밀번호 확인 API 현재 비밀번호 확인 인증된 사용자의 현재 비밀번호가 일치하는지 확인합니다.
     *
     * @name PasswordVerifyCreate
     * @summary 현재 비밀번호 확인
     * @request POST:/api/password/verify
     * @secure
     */
    passwordVerifyCreate: (data: VerifyPasswordRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseBoolean>({
        path: `/api/password/verify`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 새 비밀번호로 변경 API 새 비밀번호로 변경 인증된 사용자의 비밀번호를 새로 설정합니다.
     *
     * @name PasswordUpdateCreate
     * @summary 새 비밀번호로 변경
     * @request POST:/api/password/update
     * @secure
     */
    passwordUpdateCreate: (data: UpdatePasswordRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseString>({
        path: `/api/password/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 사용자의 모든 TaskList 조회
     *
     * @name TaskListsList
     * @summary 사용자의 모든 TaskList 조회
     * @request GET:/api/task-lists
     * @secure
     */
    taskListsList: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseListTaskListResponse>({
        path: `/api/task-lists`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 새로운 TaskList 생성 새로운 할 일 리스트를 생성합니다. 색상과 이름은 필수입니다.
     *
     * @name TaskListsCreate
     * @summary 새로운 TaskList 생성
     * @request POST:/api/task-lists
     * @secure
     */
    taskListsCreate: (data: TaskListRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTaskListResponse>({
        path: `/api/task-lists`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description TaskList 수정
     *
     * @name TaskListsUpdateCreate
     * @summary TaskList 수정
     * @request POST:/api/task-lists/{taskListId}/update
     * @secure
     */
    taskListsUpdateCreate: (taskListId: number, data: TaskListRequest, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTaskListResponse>({
        path: `/api/task-lists/${taskListId}/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description TaskList 삭제 기본 리스트(My task)는 삭제할 수 없습니다.
     *
     * @name TaskListsDeleteCreate
     * @summary TaskList 삭제
     * @request POST:/api/task-lists/{taskListId}/delete
     * @secure
     */
    taskListsDeleteCreate: (taskListId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseVoid>({
        path: `/api/task-lists/${taskListId}/delete`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description TaskList별 할 일 조회 특정 TaskList에 속한 할 일들을 조회합니다.
     *
     * @name TasksListDetail
     * @summary TaskList별 할 일 조회
     * @request GET:/api/tasks/list/{taskListId}
     * @secure
     */
    tasksListDetail: (taskListId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseListTaskResponse>({
        path: `/api/tasks/list/${taskListId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description TaskList별 미완료 할 일 조회
     *
     * @name TasksListIncompleteList
     * @summary TaskList별 미완료 할 일 조회
     * @request GET:/api/tasks/list/{taskListId}/incomplete
     * @secure
     */
    tasksListIncompleteList: (taskListId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseListTaskResponse>({
        path: `/api/tasks/list/${taskListId}/incomplete`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description TaskList별 완료된 할 일 조회
     *
     * @name TasksListCompletedList
     * @summary TaskList별 완료된 할 일 조회
     * @request GET:/api/tasks/list/{taskListId}/completed
     * @secure
     */
    tasksListCompletedList: (taskListId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseListTaskResponse>({
        path: `/api/tasks/list/${taskListId}/completed`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description TaskList의 미완료 할 일 개수 조회
     *
     * @name TasksListIncompleteCountList
     * @summary TaskList의 미완료 할 일 개수 조회
     * @request GET:/api/tasks/list/{taskListId}/incomplete/count
     * @secure
     */
    tasksListIncompleteCountList: (taskListId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseLong>({
        path: `/api/tasks/list/${taskListId}/incomplete/count`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 할 일 삭제 할 일을 삭제합니다.
     *
     * @name TasksDeleteCreate
     * @summary 할 일 삭제
     * @request POST:/api/tasks/{taskId}/delete
     * @secure
     */
    tasksDeleteCreate: (taskId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseVoid>({
        path: `/api/tasks/${taskId}/delete`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 할 일 목록 조회 사용자의 모든 할 일 목록을 조회합니다.
     *
     * @name TasksList
     * @summary 할 일 목록 조회
     * @request GET:/api/tasks
     * @secure
     */
    tasksList: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseListTaskResponse>({
        path: `/api/tasks`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 할 일 생성 새로운 할 일을 생성합니다.
     *
     * @name TasksCreate
     * @summary 할 일 생성
     * @request POST:/api/tasks
     * @secure
     */
    tasksCreate: (data: Create2, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTaskResponse>({
        path: `/api/tasks`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 할 일 수정 기존 할 일의 내용을 수정합니다.
     *
     * @name TasksUpdateCreate
     * @summary 할 일 수정
     * @request POST:/api/tasks/{taskId}/update
     * @secure
     */
    tasksUpdateCreate: (taskId: number, data: Update3, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTaskResponse>({
        path: `/api/tasks/${taskId}/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 할 일 완료 처리 할 일을 완료 상태로 변경합니다.
     *
     * @name TasksCompleteCreate
     * @summary 할 일 완료 처리
     * @request POST:/api/tasks/{taskId}/complete
     * @secure
     */
    tasksCompleteCreate: (taskId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTaskResponse>({
        path: `/api/tasks/${taskId}/complete`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 할 일 완료 취소 할 일의 완료 상태를 취소합니다.
     *
     * @name TasksUncompleteCreate
     * @summary 할 일 완료 취소
     * @request POST:/api/tasks/{taskId}/uncomplete
     * @secure
     */
    tasksUncompleteCreate: (taskId: number, params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseTaskResponse>({
        path: `/api/tasks/${taskId}/uncomplete`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description Task의 모든 서브태스크 조회 특정 Task에 속한 모든 서브태스크를 생성 순서대로 조회합니다.
     *
     * @name SubtasksTaskDetail
     * @summary Task의 모든 서브태스크 조회
     * @request GET:/api/subtasks/task/{taskId}
     * @secure
     */
    subtasksTaskDetail: (taskId: number, params: RequestParams = {}) =>
      this.request<any, BaseResponseListSubTaskResponse>({
        path: `/api/subtasks/task/${taskId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Task의 미완료 서브태스크 조회 특정 Task에 속한 미완료 서브태스크를 생성 순서대로 조회합니다.
     *
     * @name SubtasksTaskIncompleteList
     * @summary Task의 미완료 서브태스크 조회
     * @request GET:/api/subtasks/task/{taskId}/incomplete
     * @secure
     */
    subtasksTaskIncompleteList: (taskId: number, params: RequestParams = {}) =>
      this.request<any, BaseResponseListSubTaskResponse>({
        path: `/api/subtasks/task/${taskId}/incomplete`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description Task의 완료된 서브태스크 조회 특정 Task에 속한 완료된 서브태스크를 생성 순서대로 조회합니다.
     *
     * @name SubtasksTaskCompletedList
     * @summary Task의 완료된 서브태스크 조회
     * @request GET:/api/subtasks/task/{taskId}/completed
     * @secure
     */
    subtasksTaskCompletedList: (taskId: number, params: RequestParams = {}) =>
      this.request<any, BaseResponseListSubTaskResponse>({
        path: `/api/subtasks/task/${taskId}/completed`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 서브태스크 생성 새로운 서브태스크를 생성합니다.
     *
     * @name SubtasksCreate
     * @summary 서브태스크 생성
     * @request POST:/api/subtasks
     * @secure
     */
    subtasksCreate: (data: Create, params: RequestParams = {}) =>
      this.request<any, BaseResponseSubTaskResponse>({
        path: `/api/subtasks`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 서브태스크 수정 서브태스크의 제목을 수정합니다.
     *
     * @name SubtasksUpdateCreate
     * @summary 서브태스크 수정
     * @request POST:/api/subtasks/{subTaskId}/update
     * @secure
     */
    subtasksUpdateCreate: (subTaskId: number, data: Update, params: RequestParams = {}) =>
      this.request<any, BaseResponseSubTaskResponse>({
        path: `/api/subtasks/${subTaskId}/update`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 서브태스크 완료 서브태스크를 완료 상태로 변경합니다.
     *
     * @name SubtasksCompleteCreate
     * @summary 서브태스크 완료
     * @request POST:/api/subtasks/{subTaskId}/complete
     * @secure
     */
    subtasksCompleteCreate: (subTaskId: number, params: RequestParams = {}) =>
      this.request<any, BaseResponseSubTaskResponse>({
        path: `/api/subtasks/${subTaskId}/complete`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 서브태스크 완료 취소 서브태스크의 완료 상태를 취소합니다.
     *
     * @name SubtasksUncompleteCreate
     * @summary 서브태스크 완료 취소
     * @request POST:/api/subtasks/{subTaskId}/uncomplete
     * @secure
     */
    subtasksUncompleteCreate: (subTaskId: number, params: RequestParams = {}) =>
      this.request<any, BaseResponseSubTaskResponse>({
        path: `/api/subtasks/${subTaskId}/uncomplete`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 서브태스크 삭제 서브태스크를 삭제합니다.
     *
     * @name SubtasksDeleteCreate
     * @summary 서브태스크 삭제
     * @request POST:/api/subtasks/{subTaskId}/delete
     * @secure
     */
    subtasksDeleteCreate: (subTaskId: number, params: RequestParams = {}) =>
      this.request<any, BaseResponseVoid>({
        path: `/api/subtasks/${subTaskId}/delete`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 더미 데이터 생성 개발/테스트용 더미 데이터를 수동으로 생성합니다. 이미 데이터가 존재하면 생성되지 않습니다.
     *
     * @name AdminGenerateDummyDataCreate
     * @summary 더미 데이터 생성
     * @request POST:/api/admin/generate-dummy-data
     * @secure
     */
    adminGenerateDummyDataCreate: (params: RequestParams = {}) =>
      this.request<any, ResponseEntityBaseResponseString>({
        path: `/api/admin/generate-dummy-data`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description 특정 HTML을 PDF로 다운로드 PDF 다운로드 지정한 HTML을 PDF로 변환하여 다운로드
     *
     * @name PdfDownloadDetail
     * @summary PDF 다운로드
     * @request GET:/api/pdf/download/{fileName}
     * @secure
     */
    pdfDownloadDetail: (fileName: string, params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/pdf/download/${fileName}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description 모든 PDF를 ZIP으로 다운로드 모든 PDF 다운로드 6개의 HTML을 모두 PDF로 변환하여 ZIP 파일로 다운로드
     *
     * @name PdfDownloadAllList
     * @summary 모든 PDF 다운로드
     * @request GET:/api/pdf/download-all
     * @secure
     */
    pdfDownloadAllList: (params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/pdf/download-all`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description 사용 가능한 PDF 파일 목록 조회 사용 가능한 PDF 목록 다운로드 가능한 PDF 파일 목록 조회
     *
     * @name PdfAvailableList
     * @summary 사용 가능한 PDF 목록
     * @request GET:/api/pdf/available
     * @secure
     */
    pdfAvailableList: (params: RequestParams = {}) =>
      this.request<string[], any>({
        path: `/api/pdf/available`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description 개별 PDF 다운로드 엔드포인트 (6개) Abstract PDF 다운로드
     *
     * @name PdfDownloadAbstractList
     * @summary Abstract PDF 다운로드
     * @request GET:/api/pdf/download/abstract
     * @secure
     */
    pdfDownloadAbstractList: (params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/pdf/download/abstract`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Coach PDF 다운로드
     *
     * @name PdfDownloadCoachList
     * @summary Coach PDF 다운로드
     * @request GET:/api/pdf/download/coach
     * @secure
     */
    pdfDownloadCoachList: (params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/pdf/download/coach`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Cover PDF 다운로드
     *
     * @name PdfDownloadCoverList
     * @summary Cover PDF 다운로드
     * @request GET:/api/pdf/download/cover
     * @secure
     */
    pdfDownloadCoverList: (params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/pdf/download/cover`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Dashboard PDF 다운로드
     *
     * @name PdfDownloadDashboardList
     * @summary Dashboard PDF 다운로드
     * @request GET:/api/pdf/download/dashboard
     * @secure
     */
    pdfDownloadDashboardList: (params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/pdf/download/dashboard`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Deep Research PDF 다운로드
     *
     * @name PdfDownloadDeepResearchList
     * @summary Deep Research PDF 다운로드
     * @request GET:/api/pdf/download/deep-research
     * @secure
     */
    pdfDownloadDeepResearchList: (params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/pdf/download/deep-research`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Focus Check PDF 다운로드
     *
     * @name PdfDownloadFocusCheckList
     * @summary Focus Check PDF 다운로드
     * @request GET:/api/pdf/download/focus-check
     * @secure
     */
    pdfDownloadFocusCheckList: (params: RequestParams = {}) =>
      this.request<number[], any>({
        path: `/api/pdf/download/focus-check`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  health = {
    /**
     * No description
     *
     * @name HealthList
     * @summary health
     * @request GET:/health
     * @secure
     */
    healthList: (params: RequestParams = {}) =>
      this.request<Key, any>({
        path: `/health`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
}
