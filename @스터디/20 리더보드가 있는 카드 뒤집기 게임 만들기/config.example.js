/**
 * Supabase 설정 템플릿 (이 파일은 커밋해도 됩니다)
 *
 * 사용 방법:
 * 1) 이 파일을 복사해 같은 폴더에 config.js 로 저장
 * 2) 아래 값을 본인 프로젝트 정보로 교체
 * 3) config.js 는 .gitignore 대상이라 Git에 올라가지 않습니다
 *
 * 키 위치: Supabase Dashboard → Project Settings → API
 * - url      : Project URL
 * - anonKey  : Publishable key (예전 anon key)
 *
 * 주의:
 * - Secret key / service_role 은 절대 여기에 넣지 마세요 (서버 전용)
 * - Publishable key는 브라우저에 노출될 수 있으므로 RLS로 보호하세요
 */
window.SUPABASE_CONFIG = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_KEY",
};
