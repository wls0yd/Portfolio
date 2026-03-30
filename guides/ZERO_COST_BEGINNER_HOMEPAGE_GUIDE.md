# 0원 기준 초보자용 개인 홈페이지 가이드

이 문서는 **개발을 거의 모르는 사용자**를 기준으로 작성했습니다.  
기본 가정은 **초기 비용 0원(호스팅 비용 0원)** 입니다.

> 중요한 사실: **커스텀 도메인(`yourname.com`)은 보통 유료**입니다.  
> 즉, “완전 0원”은 `github.io` 같은 기본 도메인 사용일 때 가능합니다.

---

## 1) 오늘 바로 오픈하는 가장 쉬운 경로 (완전 0원)

### 추천 경로 A: GitHub Pages (초보자 1순위)
1. GitHub 가입
2. 새 저장소 생성 (예: `my-homepage`)
3. 아래 파일 업로드

`index.html`
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>내 홈페이지</title>
</head>
<body>
  <h1>안녕하세요. 제 홈페이지입니다.</h1>
  <p>첫 배포 성공!</p>
</body>
</html>
```

4. 저장소 `Settings -> Pages` 진입
5. Deploy from branch 선택, `main` / root 설정
6. 1~5분 후 URL 접속: `https://<username>.github.io/<repo>`

장점:
- 무료
- 가장 단순
- 실패해도 복구 쉬움

---

## 2) 플랫폼 선택표 (0원 기준)

| 플랫폼 | 기본 무료 배포 | 기본 도메인 무료 | 커스텀 도메인 | 초보 난이도 |
|---|---|---|---|---|
| GitHub Pages | 가능 | 가능(`github.io`) | 가능(도메인 비용 별도) | 쉬움 |
| Cloudflare Pages | 가능 | 가능(`pages.dev`) | 가능(도메인 비용 별도) | 쉬움~보통 |
| Vercel(Hobby) | 가능 | 가능(`vercel.app`) | 가능(도메인 비용 별도) | 쉬움 |

핵심:
- **호스팅은 무료로 시작 가능**
- **도메인은 거의 항상 유료**
- `www`가 루트(`@`)보다 초보자에게 보통 안전함

### 서비스별 빠른 선택
- 순수 HTML/CSS/JS: **GitHub Pages**
- React/Next.js: **Vercel(Hobby)**
- Cloudflare DNS/WAF까지 같이 쓰고 싶음: **Cloudflare Pages**

---

## 3) 도메인 열기(연결) 초보 절차

### 3-1. 도메인 구매
- 예: `yourname.com`
- 자동 갱신(autorenew) 켜기
- 만료 알림 켜기

### 3-2. DNS 기본 개념(딱 이것만)
- `A`: 도메인 -> IP
- `CNAME`: 도메인 -> 다른 도메인
- `@`: 루트 도메인(`yourname.com`)
- `www`: 서브도메인(`www.yourname.com`)

### 3-3. 연결 방식
1. 배포 플랫폼에 도메인 추가
2. 플랫폼이 알려주는 DNS 값을 복사
3. 도메인 구매처 DNS 관리 화면에 입력
4. 전파(몇 분~최대 48시간) 대기
5. HTTPS 활성화 확인

실수 방지:
- 플랫폼 안내값 그대로 복붙
- 옛날 레코드 중복 제거
- `www`와 `@` 중 대표 주소 하나로 301 통일

플랫폼별 핵심 차이:
- GitHub Pages: `www`는 CNAME, apex는 A/ALIAS/ANAME 계열
- Vercel: apex는 A, 서브도메인은 CNAME, 계정 충돌 시 TXT 검증 필요 가능
- Cloudflare Pages: 대시보드에서 먼저 도메인 연결 후 DNS 적용(순서 바뀌면 오류 가능)

---

## 4) Docker는 언제 쓰나요? (초보자용 결정표)

### 결론 먼저
- **정적 홈페이지만 운영:** Docker **불필요**
- 백엔드/API/DB를 같이 운영: Docker **유용**

즉, 처음에는 Docker 없이 시작하고 필요할 때 도입하세요.

초보자 규칙 한 줄:
- 정적 사이트면 GitHub Pages/Vercel/Cloudflare Pages로 바로 배포
- 서버 런타임(Node/Python 등)이 있으면 Docker 고려

---

## 5) Docker 완전 입문 (필요할 때만)

### 5-1. 설치
- Docker Desktop 설치(Windows/macOS)
- 설치 후 재부팅
- 터미널에서 확인:

```bash
docker --version
```

### 5-2. 가장 작은 예제

`Dockerfile`
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

빌드:
```bash
docker build -t my-homepage .
```

실행:
```bash
docker run --rm -p 127.0.0.1:8080:80 my-homepage
```

브라우저에서 `http://localhost:8080` 접속

왜 `127.0.0.1`?
- 처음 학습 단계에서는 외부 전체 공개(`0.0.0.0`)보다 로컬 바인딩이 안전합니다.

### 5-3. docker-compose(선택)

`compose.yaml`
```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./:/usr/share/nginx/html:ro
```

실행:
```bash
docker compose up
```

중지:
```bash
docker compose down
```

### 5-4. 초보자 주의점
- 비밀번호/API 키를 이미지에 하드코딩 금지
- `.env` 파일은 Git에 올리지 않기
- Docker는 “배포 방법”이지 “도메인 설정”을 대신해주지 않음
- `EXPOSE`만으로 포트가 열리는 것은 아님 (`-p` 필요)
- 데이터 보존이 필요하면 volume을 써야 함

---

## 6) 0원에서 유료로 넘어가는 기준

다음이 필요해지면 유료 검토:
- 커스텀 도메인
- 트래픽 급증
- 서버/DB 상시 운영
- 팀 협업/고급 모니터링

---

## 7) 초보자용 최종 체크리스트

- [ ] 기본 도메인(`github.io`/`pages.dev`/`vercel.app`)에서 먼저 오픈
- [ ] 모바일에서 화면 확인
- [ ] HTTPS 확인
- [ ] 커스텀 도메인은 나중에 연결
- [ ] 필요 생기기 전까지 Docker 생략

이 순서로 진행하면 실패 확률이 가장 낮고, 0원으로 시작하기 좋습니다.
