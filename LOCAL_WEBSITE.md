## 로컬 웹사이트 실행 방법

### macOS (추천)
- `사이트열기.command` 더블클릭
  - 기본 주소: `http://localhost:4173/index.html`
  - 종료: 터미널 창에서 `Ctrl + C`

다른 포트로 열고 싶으면 (터미널에서):

```bash
./사이트열기.command 4174
```

### macOS / Linux (터미널)

```bash
./start-local.sh
```

포트 지정:

```bash
./start-local.sh 4174
```

### Windows
- `사이트열기.bat` 실행

> 참고: Windows 배치는 Node 기반(`server.js`)으로 구성되어 있어 Node.js 설치가 필요합니다.
> Python으로도 바꿔드릴 수 있어요.

