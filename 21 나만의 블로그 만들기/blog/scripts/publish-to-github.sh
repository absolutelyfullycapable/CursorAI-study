#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="cursor-astro-blog"
GITHUB_USER="absolutelyfullycapable"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
GH_BIN="${GH_BIN:-gh}"

if ! command -v "$GH_BIN" >/dev/null 2>&1; then
  CANDIDATE="/Users/mac_al02360215/Desktop/CursorAI-study/.tmp-gh/gh_2.96.0_macOS_arm64/bin/gh"
  if [ -x "$CANDIDATE" ]; then
    GH_BIN="$CANDIDATE"
  fi
fi

cd "$ROOT_DIR"

if ! command -v "$GH_BIN" >/dev/null 2>&1; then
  echo "GitHub CLI(gh)가 필요합니다."
  echo "설치: https://cli.github.com/"
  exit 1
fi

if ! "$GH_BIN" auth status >/dev/null 2>&1; then
  echo "GitHub 로그인이 필요합니다:"
  echo "  $GH_BIN auth login"
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  git init -b main
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
fi

if ! "$GH_BIN" repo view "${GITHUB_USER}/${REPO_NAME}" >/dev/null 2>&1; then
  "$GH_BIN" repo create "${REPO_NAME}" \
    --public \
    --description "Cursor 실습용 Astro 정적 블로그 (GitHub Pages)"
  echo "저장소 생성 완료"
fi

git add -A
git commit -m "chore: Astro 블로그 실습 프로젝트 업데이트" || true
git push -u origin main
echo "push 완료"

echo ""
echo "다음 단계:"
echo "1. https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
echo "2. Build and deployment → Source: GitHub Actions"
echo "3. 배포 URL: https://${GITHUB_USER}.github.io/${REPO_NAME}/"
