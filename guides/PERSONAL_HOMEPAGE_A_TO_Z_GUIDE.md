# 개인 홈페이지 구축 A to Z 가이드 (언제 어디서든 접속 + 도메인 설정 포함)

이 문서는 **개인 홈페이지를 처음부터 배포/운영까지 완성**하는 실전 가이드입니다.  
목표는 다음 3가지입니다.

1. 전 세계 어디서든 접속 가능(고가용성/HTTPS/CDN)
2. 내 도메인 연결(예: `yourname.com`)
3. 운영 가능한 구조(보안, 모니터링, 백업)

초보자/0원 시작이 목적이라면 먼저 아래 문서부터 보세요.
- `ZERO_COST_BEGINNER_HOMEPAGE_GUIDE.md`

---

## 0) 빠른 의사결정: 어떤 방식으로 만들까?

### 옵션 A. 정적 사이트(추천: 포트폴리오/블로그/소개 페이지)
- 기술: Next.js SSG / Astro / Hugo / 순수 HTML
- 배포: Vercel, Netlify, Cloudflare Pages, GitHub Pages
- 장점: 빠름, 저렴함, 운영 쉬움
- 단점: 복잡한 서버 로직은 제한

### 옵션 B. SSR/풀스택 사이트(로그인, 관리자, API 포함)
- 기술: Next.js(SSR/API), Remix, Nuxt + DB
- 배포: Vercel + Serverless DB / VPS(Docker)
- 장점: 동적 기능 구현 쉬움
- 단점: 비용/운영 복잡도 증가

> **처음 시작은 옵션 A**, 필요 기능 생기면 B로 확장하는 전략이 가장 안전합니다.

---

## 1) A to Z 로드맵

### A. 요구사항 정의
- 페이지 목적: 포트폴리오, 이력서, 블로그, 연락처
- 필수 기능: 다국어, SEO, 분석, 문의폼
- 예산: 월 0원~3만원, 도메인 연 1~3만원대

### B. 개발 스택 선택
- 프론트: Next.js(가장 보편적), Astro(정적 최적화), 순수 HTML(최소 비용)
- 백엔드(필요시): Next API, Express, FastAPI
- DB(필요시): Supabase(PostgreSQL), PlanetScale(MySQL), MongoDB Atlas

### C. 로컬 개발 환경
- Node.js LTS 설치
- 패키지 매니저: npm/pnpm 중 1개 고정
- Git 설정 + GitHub 저장소 생성

### D. 프로젝트 생성(예: Next.js)
```bash
npx create-next-app@latest my-homepage
cd my-homepage
npm run dev
```

### E. 기본 페이지 구성
- `/` 홈
- `/about` 소개
- `/projects` 프로젝트
- `/contact` 연락처

### F. 반응형/접근성
- 모바일 우선 레이아웃
- 색 대비(AA 이상), 키보드 탭 이동, alt 텍스트

### G. 성능 최적화
- 이미지 WebP/AVIF
- 폰트 최적화(`font-display: swap`)
- 불필요한 JS 최소화

### H. SEO 기본
- title/description/og:image
- sitemap.xml, robots.txt
- 구조화 데이터(JSON-LD)

### I. 분석 도구 연동
- Google Analytics 4 / Plausible
- 핵심 이벤트: 클릭, 문의 전송, 프로젝트 방문

### J. 문의 기능(선택)
- 정적 사이트: Formspree, Basin 등 폼 백엔드
- 풀스택: API + rate limit + CAPTCHA

### K. 환경변수 분리
```env
NEXT_PUBLIC_SITE_URL=https://yourname.com
CONTACT_EMAIL=hello@yourname.com
```

### L. GitHub Actions (선택)
- PR 시 lint/test/build 자동화

### M. 배포 플랫폼 선택
- 쉬운 배포: Vercel/Netlify/Cloudflare Pages
- 고급 제어: VPS + Docker + Nginx + CI/CD

### N. 첫 배포
- 플랫폼에 GitHub 연결
- main 브랜치 자동 배포 설정

### O. 도메인 구매
- 가비아/후이즈/Namecheap/GoDaddy/Cloudflare Registrar 등
- 가능한 `.com` 우선, 대체로 `.dev`, `.io` 가능

### P. DNS 설계 (핵심)
- `apex`(루트): `yourname.com`
- `www`: `www.yourname.com`
- 권장: `www`를 대표 주소(primary)로 두고 `apex -> www` 301 고정
- 이유: 일부 DNS 환경에서 apex는 CNAME 제약이 있어 운영이 까다로울 수 있음

### Q. DNS 레코드 설정 (대표 패턴)

#### 패턴 1) Vercel
- apex: A 레코드(일반적으로 `76.76.21.21`, 단 대시보드 안내값 우선)
- www: CNAME(일반적으로 `cname.vercel-dns-0.com`, 단 대시보드 안내값 우선)
- 다른 Vercel 계정과 충돌 시 TXT 검증(`_vercel`) 필요 가능

#### 패턴 2) Netlify
- apex: A 레코드(플랫폼 제공 IP)
- www: CNAME `your-site.netlify.app`

#### 패턴 3) Cloudflare Pages
- 안내값에 따라 CNAME/A 레코드 구성

#### 패턴 4) GitHub Pages
- 사용자 페이지: apex + www 설정 방식 문서대로 적용
- 브랜치 배포 시 `CNAME` 파일 자동 생성 가능
- Actions 커스텀 워크플로우 배포 시 `CNAME` 파일이 필요 없을 수 있음

> 실제 값(IP/호스트)은 **반드시 플랫폼 공식 안내값**을 사용하세요.

### R. SSL/HTTPS 강제
- 플랫폼 자동 SSL 활성화 확인
- HTTP -> HTTPS 리다이렉트 강제
- HSTS는 HTTPS 안정화 후 적용

### S. 전세계 접속성 강화
- CDN 사용(대부분 플랫폼 기본 제공)
- 정적 자산 캐싱(`Cache-Control`)
- 이미지 최적화 + edge 배포

### T. 보안 기본 설정
- 보안 헤더(CSP, X-Frame-Options, X-Content-Type-Options)
- 비밀번호/토큰은 환경변수로만
- 관리자 경로 노출 최소화

### U. 모니터링
- UptimeRobot/Better Stack 등으로 1~5분 모니터링
- 에러 추적(Sentry)

### V. 백업/복구
- 코드: GitHub
- DB: 일일 자동 백업 + 복구 리허설
- DNS: 레코드 스냅샷 문서화

### W. 장애 대응 런북
- DNS 미전파, SSL 발급 대기, 404/502 체크리스트 준비

### X. 운영 자동화
- CI: lint/test/build
- CD: main merge 시 자동 배포

### Y. 비용 최적화
- 초기: 무료 티어 + 도메인만 유료
- 트래픽 증가 시 CDN/이미지/로그 비용 먼저 점검

### Z. 정기 점검 루틴
- 월 1회: 의존성 업데이트, 깨진 링크, Lighthouse 점검
- 분기 1회: 보안 점검, 백업 복구 테스트

---

## 2) 도메인 설정 A~Z 상세 (실무형)

### 2-1. 도메인 구매 직후
1. WHOIS 공개정보 보호(Privacy) 켜기
2. 자동 갱신(Auto Renewal) 켜기
3. Registrar Lock 켜기
4. 결제수단/만료 알림 이중화

### 2-2. 네임서버 결정
- 방법 A: 등록기관 기본 DNS 사용
- 방법 B: Cloudflare 네임서버로 위임(권장: DNS 관리 편의 + 보안 기능)

Cloudflare 사용 시 실무 기본값:
- 웹 트래픽용 `A/AAAA/CNAME`은 proxied(오렌지 클라우드)
- SSL/TLS 모드는 `Full (strict)`
- `Always Use HTTPS` 활성화
- 네임서버 전환 안정화 후 DNSSEC + DS 등록

### 2-3. 레코드 구성 권장안
- `A @ -> <플랫폼 IP>`
- `CNAME www -> <플랫폼 호스트>`
- `TXT`(도메인 인증 필요 시)
- TTL: 초기 문제해결 단계는 300초, 안정화 후 자동/기본
- `AAAA`는 호스팅이 IPv6를 공식 지원할 때만 추가

플랫폼별 자주 쓰는 예시(공식 문서 기준):
- Vercel(apex): `A @ -> 76.76.21.21` (프로젝트 화면 안내값이 있으면 그 값을 우선)
- GitHub Pages(apex): `A @ -> 185.199.108.153/109.153/110.153/111.153` (4개)
- GitHub Pages(www): `CNAME www -> <username>.github.io`

### 2-4. 전파 확인
- `dig`, `nslookup`, `whatsmydns`류 도구로 전파 상태 확인
- 전파 중에는 지역별 결과가 다를 수 있음(수분~48시간)
- 대규모 변경 전날 TTL을 낮춰두면 전환 리스크를 줄일 수 있음

### 2-5. HTTPS 확인
- 인증서 발급 완료 확인
- 브라우저 자물쇠/인증서 체인 점검
- 혼합 콘텐츠(HTTP 리소스) 제거

### 2-6. 캐노니컬/리다이렉트 정책
- `https://yourname.com` 또는 `https://www.yourname.com` 하나로 통일
- SEO 중복 방지를 위해 301 리다이렉트 설정

### 2-7. 이메일(선택)
- 도메인 메일 사용 시 MX/SPF/DKIM/DMARC 설정
- 웹사이트 DNS와 충돌 없게 분리 관리

---

## 3) 전문가별 실전 가이드

### 3-1. 네트워킹 전문가 관점
목표: 어디서든 빠르고 안정적으로 접속

- DNS 이중 확인: apex/www, CAA, TXT 검증
- CDN 캐시 전략: 정적 파일 장기 캐시 + HTML 짧은 캐시
- TLS 정책: TLS 1.2+ 강제, 오래된 cipher 비활성화
- DDoS/WAF: Cloudflare WAF 또는 플랫폼 보호 기능 활성화
- 관측성: 지역별 latency/가용성 모니터링

체크리스트:
- [ ] DNSSEC 적용 가능 여부 확인
- [ ] HTTP/2 또는 HTTP/3 활성화
- [ ] 기본 보안 헤더 적용
- [ ] 장애시 우회 페이지(maintenance) 준비

### 3-2. Frontend 전문가 관점
목표: 첫 화면 빠르고 신뢰감 있는 UX

- 디자인 시스템: 타이포/색상/간격 토큰화
- Core Web Vitals: LCP/CLS/INP 예산 수립
- 이미지: 적응형 사이즈 + lazy loading
- SEO/OG: 공유 썸네일, 구조화 데이터, canonical
- 접근성: 시맨틱 태그, focus-visible, aria-label

체크리스트:
- [ ] 모바일 360px에서 깨짐 없음
- [ ] Lighthouse 성능/접근성 90+
- [ ] 다크모드(선택) 지원
- [ ] 폰트 로딩 최적화

### 3-3. Backend 전문가 관점
목표: 안전한 API/문의 처리

- API 입력 검증(zod/joi 등)
- 레이트리밋(문의/로그인 엔드포인트)
- 비밀값 분리(환경변수, secret manager)
- 로깅: 요청 ID 기반 추적
- 오류 처리: 사용자 메시지/내부 로그 분리

체크리스트:
- [ ] 429/5xx 대응 설계
- [ ] CAPTCHA 또는 봇 방지
- [ ] CORS 최소 허용
- [ ] 에러 추적(Sentry) 연결

### 3-4. 데이터베이스 전문가 관점
목표: 단순하지만 복구 가능한 데이터 운영

- 스키마 최소화: `messages`, `projects`, `visits` 등
- 인덱스: 조회 패턴 기준 최소 인덱스
- 마이그레이션: 버전 관리(Prisma/Flyway 등)
- 백업: 일일 스냅샷 + 주기적 복원 테스트
- 개인정보 최소 수집 + 보관 주기 정책

체크리스트:
- [ ] 백업 자동화
- [ ] 복구 절차 문서화
- [ ] 불필요 PII 저장 금지
- [ ] 읽기/쓰기 권한 분리

### 3-5. 풀스택 개발자 관점
목표: 구현-배포-운영까지 한 번에 이어지는 파이프라인

- 단일 저장소(monorepo/단일 repo)로 일관 관리
- 브랜치 전략: `main` 보호 + PR 기반 배포
- CI 파이프라인: lint → test → build
- CD 파이프라인: staging → production
- 인프라 문서: `.env.example`, 운영 런북, 장애 대응 문서

체크리스트:
- [ ] 신규 기기에서도 30분 내 재현 가능
- [ ] main 머지 후 자동 배포
- [ ] 롤백 버튼 또는 이전 버전 복원 절차 확보
- [ ] 비용/성능 대시보드 주기 점검

---

## 4) 추천 아키텍처 3종

| 옵션 | 프론트엔드 | 백엔드 | DB | 운영 복잡도 | 비용 감각 | 추천 상황 |
|---|---|---|---|---|---|---|
| Static-only | Astro/Next SSG | 없음(또는 최소 폼 API) | 없음 | 낮음 | 최저 | 포트폴리오/블로그/이력서 |
| SSR | Next.js App Router | Route Handler | 선택 | 중간 | 낮음~중간 | 일부 동적 페이지, CMS 연동 |
| Fullstack | Next.js | 서버 함수/API | Supabase 등 | 높음 | 중간 | 로그인/관리자/방명록/업로드 |

권장 선택 순서:
1. 기본은 **Static-only**
2. 동적 요구가 생기면 **SSR**
3. 사용자 데이터/인증이 핵심이면 **Fullstack**

### 스타터(가장 추천)
- Next.js 정적 페이지 + Vercel + 커스텀 도메인
- 문의는 Form 서비스 사용
- 비용 최소, 운영 쉬움

### 확장형
- Next.js + API Routes + Supabase(PostgreSQL)
- 인증/관리자 페이지 추가 가능

### 완전 제어형
- VPS + Docker + Nginx + PostgreSQL
- 자유도 최고, 운영 난이도/책임도 최고

### 보안 헤더 기본 예시
```http
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 5) 배포 직전 최종 점검표

- [ ] HTTPS 강제 리다이렉트 동작
- [ ] `apex`/`www` 중 하나로 canonical 통일
- [ ] 모바일/데스크톱 UI 확인
- [ ] 404/500 에러 페이지 준비
- [ ] 문의/폼 스팸 방어 적용
- [ ] 모니터링 알림 수신 테스트
- [ ] 백업/복구 절차 문서화

---

## 6) 트러블슈팅 빠른 해결

### 도메인 연결이 안 됨
- DNS 레코드 오타 확인
- 네임서버 위임 상태 확인
- TTL/전파 시간 대기 후 재검증

### HTTPS가 안 붙음
- 도메인 검증 실패 여부 확인
- 프록시/SSL 모드(Cloudflare) 충돌 확인
- 임시로 DNS 단순화 후 재시도

### 지역별 접속 속도 차이 큼
- CDN 캐시 상태 확인
- 대용량 이미지 최적화
- 불필요한 JS 번들 축소

---

## 7) 최소 실행 플랜(오늘 바로 오픈)

1. Next.js 프로젝트 생성
2. 홈/소개/프로젝트/연락처 4페이지 구성
3. Vercel 배포
4. 도메인 구매 후 DNS 연결
5. HTTPS 확인 + 모니터링 연결
6. 월 1회 점검 루틴 운영

이 6단계만 완료해도 “언제 어디서든 접속 가능한 개인 홈페이지”를 안정적으로 운영할 수 있습니다.

---

## 8) 전문가별 개별 가이드 파일

- `GUIDE_NETWORK_EXPERT.md`
- `GUIDE_FRONTEND_EXPERT.md`
- `GUIDE_BACKEND_EXPERT.md`
- `GUIDE_DATABASE_EXPERT.md`
- `GUIDE_FULLSTACK_EXPERT.md`
