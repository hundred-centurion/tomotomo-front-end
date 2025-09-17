# Custom Hooks & Zustand Stores

이 프로젝트는 API endpoint를 쉽게 사용할 수 있도록 Zustand store와 React Query 기반의 custom hooks를 제공합니다.

## 구조

```
src/
├── store/           # Zustand stores
│   ├── auth-store.ts
│   ├── task-store.ts
│   ├── timer-store.ts
│   ├── subtask-store.ts
│   └── index.ts
└── hooks/           # Custom hooks
    ├── auth/        # 인증 관련 hooks
    ├── task/        # 할 일 관련 hooks
    ├── timer/       # 타이머 관련 hooks
    ├── subtask/     # 서브태스크 관련 hooks
    ├── admin/       # 관리자 관련 hooks
    ├── health/      # 헬스체크 hooks
    └── index.ts
```

## 사용 예시

### 1. Auth Hooks

```tsx
import { useSignIn, useSignUp, useLogout } from '@/hooks';

function LoginForm() {
  const signIn = useSignIn();
  const signUp = useSignUp();
  const logout = useLogout();

  const handleLogin = async (credentials) => {
    try {
      await signIn.mutateAsync(credentials);
      // 로그인 성공 처리
    } catch (error) {
      // 에러 처리
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* 폼 내용 */}
    </form>
  );
}
```

### 2. Task Hooks

```tsx
import { useTasks, useCreateTask, useTaskLists } from '@/hooks';
import { useTaskStore } from '@/store';

function TaskList() {
  const { tasks, isLoading, error } = useTaskStore();
  const { data: taskLists } = useTaskLists();
  const createTask = useCreateTask();

  const handleCreateTask = async (taskData) => {
    try {
      await createTask.mutateAsync(taskData);
      // 생성 성공 처리
    } catch (error) {
      // 에러 처리
    }
  };

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
}
```

### 3. Timer Hooks

```tsx
import { useStartTimer, useTimerStats, useTimerHistory } from '@/hooks';
import { useTimerStore } from '@/store';

function TimerComponent() {
  const { currentTimer, timerStats } = useTimerStore();
  const startTimer = useStartTimer();
  const { data: history } = useTimerHistory();
  const { data: stats } = useTimerStats();

  const handleStartTimer = async (timerData) => {
    try {
      await startTimer.mutateAsync(timerData);
      // 타이머 시작 성공 처리
    } catch (error) {
      // 에러 처리
    }
  };

  return (
    <div>
      <button onClick={() => handleStartTimer(timerData)}>
        타이머 시작
      </button>
      {stats && (
        <div>
          총 집중 시간: {stats.totalFocusTime?.seconds}초
        </div>
      )}
    </div>
  );
}
```

### 4. Subtask Hooks

```tsx
import { useSubtasksByTask, useCreateSubtask } from '@/hooks';
import { useSubtaskStore } from '@/store';

function SubtaskList({ taskId }) {
  const { subtasks } = useSubtaskStore();
  const { data: taskSubtasks } = useSubtasksByTask(taskId);
  const createSubtask = useCreateSubtask();

  const handleCreateSubtask = async (subtaskData) => {
    try {
      await createSubtask.mutateAsync(subtaskData);
      // 생성 성공 처리
    } catch (error) {
      // 에러 처리
    }
  };

  return (
    <div>
      {taskSubtasks?.map(subtask => (
        <div key={subtask.id}>{subtask.title}</div>
      ))}
    </div>
  );
}
```

## Store 사용법

### Task Store

```tsx
import { useTaskStore } from '@/store';

function TaskComponent() {
  const { 
    tasks, 
    taskLists, 
    isLoading, 
    error,
    setCurrentTask,
    addTask,
    updateTask 
  } = useTaskStore();

  // store 상태와 액션들을 사용
}
```

### Timer Store

```tsx
import { useTimerStore } from '@/store';

function TimerComponent() {
  const { 
    timerHistory, 
    currentTimer, 
    timerStats,
    setCurrentTimer,
    addTimerRecord 
  } = useTimerStore();

  // store 상태와 액션들을 사용
}
```

## 주요 특징

1. **완전한 타입 안전성**: TypeScript로 모든 API 응답과 요청 타입이 지정되어 있습니다.
   - `useMutation<TData, TError, TVariables>` 형태로 제네릭 타입 지원
   - `useQuery<TData, TError>` 형태로 쿼리 반환 타입 지정
   - API 응답 타입과 완전히 일치하는 타입 추론
2. **에러 처리**: 각 hook에서 일관된 에러 처리를 제공합니다.
3. **로딩 상태**: 각 작업의 로딩 상태를 추적할 수 있습니다.
4. **캐싱**: React Query를 통한 자동 캐싱과 백그라운드 업데이트
5. **상태 관리**: Zustand를 통한 효율적인 전역 상태 관리
6. **자동 동기화**: API 호출과 store 상태가 자동으로 동기화됩니다.

## 타입 안전성

모든 hooks는 완전한 타입 안전성을 제공합니다:

```tsx
// useMutation의 제네릭 타입: <TData, TError, TVariables>
const createTask = useCreateTask(); // useMutation<TaskResponse, Error, Create3>
const signIn = useSignIn(); // useMutation<LoginResponse, Error, LoginRequest>

// useQuery의 제네릭 타입: <TData, TError>
const tasks = useTasks(); // useQuery<TaskResponse[], Error>
const timerStats = useTimerStats(); // useQuery<TimerStatsResponse, Error>

// 타입이 자동으로 추론되어 IDE에서 자동완성과 타입 체크가 가능합니다
createTask.mutateAsync({
  title: "새 할 일",
  description: "설명",
  dueDate: "2024-12-31",
  taskListId: 1
}); // Create3 타입이 요구됨

const taskData = createTask.data; // TaskResponse | undefined 타입
const error = createTask.error; // Error | null 타입
```

## 에러 처리

모든 hooks는 일관된 에러 처리 패턴을 따릅니다:

```tsx
const mutation = useCreateTask();

mutation.mutate(data, {
  onSuccess: (data) => {
    // data는 TaskResponse 타입으로 자동 추론
    ;
  },
  onError: (error) => {
    // error는 Error 타입으로 자동 추론
    console.error('에러:', error.message);
  }
});
```

## 로딩 상태

각 hook은 로딩 상태를 제공합니다:

```tsx
const { isLoading, isCreating, isUpdating, isDeleting } = useTaskStore();

if (isLoading) return <div>로딩 중...</div>;
if (isCreating) return <div>생성 중...</div>;
```
