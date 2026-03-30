# 네트워킹 전문가 가이드: 개인 홈페이지 전세계 접속 최적화

## 목표
- 어느 지역에서 접속해도 빠르고 안정적으로 열리는 구조

## 권장 기본 구조
1. DNS 제공자 1곳으로 통일(Cloudflare/Route53 등)
2. 대표 도메인 `www` 고정, `apex -> www` 301
3. CDN/프록시 활성화(Cloudflare면 웹 레코드는 proxied 권장)
4. HTTPS 강제 + HSTS (`Full (strict)` 권장)

## DNS 실무 규칙
- apex: A/AAAA 또는 ALIAS/ANAME/flattening
- www: CNAME
- TTL: 변경 전 300 또는 60으로 낮추고 작업 후 복구
- TXT: 도메인 검증용 레코드 유지

## 보안/성능 체크리스트
- [ ] HTTP/2 또는 HTTP/3 활성화
- [ ] CSP, nosniff, Referrer-Policy 적용
- [ ] WAF/rate limit 활성화
- [ ] Uptime 모니터링(1~5분)
- [ ] 전파 확인(`dig`, `nslookup`)
- [ ] Always Use HTTPS 활성화
- [ ] DNSSEC/DS 등록 완료

## 장애 대응 우선순위
1. DNS 레코드 오타/중복 확인
2. 네임서버 위임 상태 확인
3. 인증서 상태 확인
4. CDN 캐시 무효화 후 재검증
