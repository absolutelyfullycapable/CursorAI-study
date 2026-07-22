# 25. Sequential Thinking MCP로 테트리스 게임 만들기

Sequential Thinking MCP로 요구사항 → 아키텍처 → 게임 루프 → 가설 검증 순으로 설계한 뒤, 바닐라 HTML/CSS/JS로 구현한 테트리스입니다.

배포용 단독 저장소: [absolutelyfullycapable/tetris-game](https://github.com/absolutelyfullycapable/tetris-game)

## 실행 방법

1. `index.html`을 브라우저에서 엽니다.
2. 또는 VS Code / Cursor Live Server로 폴더를 엽니다.

별도 설치나 빌드가 필요 없습니다.

## 조작법

| 키 / 버튼 | 동작 |
|-----------|------|
| `←` `→` | 좌우 이동 |
| `↓` | 소프트 드롭 (+1점/칸) |
| `↑` / `X` | 시계 방향 회전 |
| `Space` | 하드 드롭 (+2점/칸) |
| `P` | 일시정지 / 재개 |
| `R` | 다시 하기 |

모바일에서는 하단 터치 버튼으로 조작할 수 있습니다.

## 게임 규칙

- 보드 크기: **10 × 20**
- 테트로미노 7종: I, O, T, S, Z, J, L
- **7-bag** 랜덤으로 Next 피스를 미리 표시
- 라인 클리어 점수: 1/2/3/4줄 → `100/300/500/800 × level`
- 10줄마다 레벨 상승, 낙하 속도 증가
- 최고 점수는 `localStorage`에 저장

## Sequential Thinking 설계 요약

1. **요구사항**: 표준 보드, 7종 피스, 이동/회전/드롭, 점수·레벨, Pause/Restart
2. **스택**: Canvas 2D + 바닐라 JS (저장소의 02 사과 게임과 동일한 학습 친화 구조)
3. **코어 모델**: `board`, `collide`, `merge`, `clearLines`, `rotate` + wall kick
4. **루프**: `requestAnimationFrame` 렌더 + gravity 타이머, Ghost piece 표시
5. **검증**: Hold 생략으로 범위 축소, wall kick 기본 구현으로 플레이 가능성 확보

## 파일 구조

```
25 Sequential Thinking MCP로 테트리스 게임 만들기/
├── index.html   # 보드 · 사이드 패널 · 터치 컨트롤
├── style.css    # 아케이드 톤 UI
├── script.js    # 게임 로직 · 렌더 · 입력
└── README.md
```
