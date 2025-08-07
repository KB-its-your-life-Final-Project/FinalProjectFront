# 알림 설정 기능 구현 문서

## 개요
백엔드 API와 연동된 알림 설정 기능을 구현했습니다. 사용자는 다양한 알림 타입을 개별적으로 설정할 수 있으며, 실시간으로 알림을 확인할 수 있습니다.

## 구현된 기능

### 1. 알림 설정 페이지 (`src/pages/mypage/AlarmSetting.vue`)
- **계약 진행 단계별 알림** (type: 1)
  - 전입신고, 보증보험 가입 알림
- **주택 위험도 변동 알림** (type: 2)
  - 주변 시세 변동, 권리관계 변동 알림
- **계약 만료 및 갱신 알림** (type: 3)
- **관심 지역 변동 알림** (type: 4)
- **시세 변동 알림** (type: 5)
  - 관심 매물의 시세 변동 알림

### 2. 받은 알림 페이지 (`src/pages/alarm/MyAlarm.vue`)
- **알림 목록 표시**
  - 최신순 정렬
  - 읽음/미확인 상태 표시
  - 알림 타입별 색상 구분
- **필터링 기능**
  - 읽음 상태별 필터 (전체/미확인/확인함)
  - 알림 타입별 필터
- **알림 관리 기능**
  - 개별 알림 읽음 처리
  - 전체 읽음 처리
  - 알림 삭제 (선택적)
- **사용자 경험**
  - 스마트한 날짜 표시 (오늘/어제/N일 전)
  - 빈 상태 메시지
  - 로딩 상태 표시

### 3. 알림 서비스 (`src/services/alarmService.ts`)
- 미확인 알림 개수 조회
- 알림 목록 조회
- 알림 설정 변경
- 알림 읽음 처리
- 특정 타입의 알림 설정 변경
- 알림 삭제 (백엔드 API 준비 시)

### 4. 알림 스토어 (`src/stores/alarmStore.ts`)
- 알림 상태 관리
- 알림 설정 상태 관리
- 실시간 미확인 알림 개수 추적
- 알림 읽음 처리 로직
- 알림 삭제 로직

### 5. 알림 컴포넌트들
- **AlarmSettingItem** (`src/pages/mypage/_component/AlarmSettingItem.vue`)
  - 개별 알림 설정 토글 컴포넌트
- **AlarmList** (`src/pages/mypage/_component/AlarmList.vue`)
  - 알림 목록 모달 컴포넌트
- **AlarmIcon** (`src/components/common/AlarmIcon.vue`)
  - 헤더용 알림 아이콘 컴포넌트

## API 연동

### 사용된 API 엔드포인트
1. `GET /api/alarm/count` - 미확인 알림 개수 조회
2. `GET /api/alarm/list` - 알림 목록 조회
3. `PUT /api/alarm/settings` - 알림 설정 변경
4. `PUT /api/alarm/{alarmId}/read` - 알림 읽음 처리

### 데이터 타입
- `AlarmResponseDto` - 알림 응답 데이터
- `AlarmSettingRequestDto` - 알림 설정 변경 요청 데이터

## 주요 기능

### 1. 실시간 알림 설정
- 각 알림 타입별로 개별 토글 가능
- 설정 변경 시 즉시 백엔드에 반영
- 로딩 상태 및 저장 상태 표시

### 2. 알림 목록 관리
- 모달 형태로 알림 목록 표시
- 미확인 알림 개수 실시간 업데이트
- 알림 클릭 시 읽음 처리
- 알림 타입별 아이콘 및 색상 구분

### 3. 사용자 경험 개선
- 로딩 상태 표시
- 에러 처리 및 사용자 피드백
- 반응형 디자인
- 접근성 고려

## 사용 방법

### 1. 알림 설정 변경
```typescript
// 알림 스토어 사용
const alarmStore = useAlarmStore();

// 특정 타입의 알림 설정 변경
await alarmStore.updateAlarmSetting(type, isChecked);
```

### 2. 알림 목록 조회
```typescript
// 알림 목록 조회
await alarmStore.fetchAlarms();

// 미확인 알림 개수 조회
await alarmStore.fetchUnreadCount();
```

### 3. 알림 읽음 처리
```typescript
// 특정 알림 읽음 처리
await alarmStore.markAlarmAsRead(alarmId);
```

## 파일 구조

```
src/
├── pages/mypage/
│   ├── AlarmSetting.vue                    # 알림 설정 페이지
│   └── _component/
│       ├── AlarmSettingItem.vue           # 알림 설정 아이템
│       └── AlarmList.vue                  # 알림 목록 모달
├── pages/alarm/
│   └── MyAlarm.vue                        # 받은 알림 페이지
├── components/common/
│   └── AlarmIcon.vue                      # 알림 아이콘
├── services/
│   └── alarmService.ts                    # 알림 API 서비스
├── stores/
│   └── alarmStore.ts                      # 알림 상태 관리
└── api/autoLoad/
    ├── Api.ts                             # 자동 생성된 API 클라이언트
    └── data-contracts.ts                  # API 데이터 타입 정의
```

## 향후 개선 사항

1. **푸시 알림 지원**
   - 웹 푸시 알림 구현
   - 브라우저 알림 권한 요청

2. **알림 필터링**
   - 알림 타입별 필터링
   - 날짜 범위 필터링

3. **알림 설정 일괄 변경**
   - 전체 알림 on/off 기능
   - 알림 설정 템플릿 저장

4. **알림 히스토리**
   - 알림 히스토리 페이지
   - 알림 통계 및 분석

## 기술 스택

- **Frontend**: Vue 3 + TypeScript
- **상태 관리**: Pinia
- **API 통신**: Axios
- **UI 프레임워크**: Tailwind CSS
- **아이콘**: Heroicons (SVG)

## 개발자 노트

- 모든 API 호출은 에러 처리가 포함되어 있습니다.
- 로딩 상태와 저장 상태를 실시간으로 표시합니다.
- TypeScript를 사용하여 타입 안정성을 보장합니다.
- 컴포넌트 재사용성을 고려하여 설계되었습니다. 