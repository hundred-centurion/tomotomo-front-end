# TOMOTOMO Front-end Application

## Abstract

이 Repository는 C100의 TOMOTOMO Front-end application을 개발하고 관리합니다. <br />
아래 내용을 준수하여 개발하고 관리해주세요.

## Tech stack

- Node.js
- Bun.js
- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

## Install runtime

Runtime으로 `bun.js`를 사용합니다. `bun.js`를 설치해주세요.

```shell
$ curl -fsSL https://bun.com/install | bash # for macOS & Linux
$ brew install oven-sh/bun/bun # for macOS(homebrew)
$ powershell -c "irm bun.sh/install.ps1|iex" # for Windows
```

## Set-up submodules

Application API Client를 build하기 위하여 의존하는 submodule이 있습니다. <br />
아래와 같이 Set-up 해주세요.

```shell
$ git submodule init
$ git submodule update --recursive
```

## Install dependencies

Application이 의존하는 패키지를 설치해주세요.

```shell
$ bun install
```

## Build API Client

내부적으로 사용하는 API Client가 있습니다. Build하여 사용해주세요. <br />
모든 API 요청은 API Client를 활용하여 사용합니다.

```shell
$ bun run client
```

## Run locally

Local 컴퓨터에 개발서버를 실행하실 때는 아래와 같은 명령을 사용하여 실행하시면 됩니다.

```shell
$ bun dev
```

## Build application

배포를 위하여 Build가 필요할때는 아래와 같은 명령을 사용해주시면 됩니다.

```shell
$ bun run build # "bun build"는 'bun' 내부 명령이므로 꼭 'run'을 사용하여 실행해주세요.
```
