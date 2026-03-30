# Frontend 전문가 가이드: 빠르고 신뢰감 있는 홈페이지

## 목표
- 첫 화면 로딩 속도와 사용자 신뢰도를 동시에 확보

## 권장 스택
- 0원 시작: GitHub Pages/Cloudflare Pages/Vercel의 기본 도메인으로 먼저 배포
- 정적 중심: Astro 또는 Next.js SSG
- 동적 일부 필요: Next.js App Router + 최소 SSR

## UI/UX 기본 원칙
- 모바일 우선(360px 기준)
- 타이포/색상/간격 토큰화
- 접근성(시맨틱, 키보드, 명도 대비)

## 성능 최적화
- 이미지: WebP/AVIF + lazy loading
- 폰트: subset + `font-display: swap`
- JS: 필요 컴포넌트만 hydrate

## SEO 기본
- title/description/OG 태그
- sitemap.xml, robots.txt
- canonical URL 고정

## 배포 전 체크리스트
- [ ] Lighthouse 성능/접근성 90+
- [ ] 모바일/데스크톱 레이아웃 확인
- [ ] 다국어/폰트 깨짐 없음
- [ ] 404 페이지 제공
