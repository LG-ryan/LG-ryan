# 기술 설계 문서 (Architecture): AI 기반 차량 생애주기 매니저

## 1. 개요

본 문서는 '제품 요구사항 명세서(prd.md)'를 기반으로 'AI 기반 차량 생애주기 매니저'의 기술적 구조와 설계를 정의합니다. 본 설계는 확장성, 유지보수성, 그리고 안정적인 AI 모델 서빙에 중점을 둡니다.

## 2. 기술 스택 (Technology Stack)

- **프론트엔드 (Frontend)**: **React (TypeScript)**
  - 이유: 동적인 사용자 인터페이스(UI) 구축에 용이하며, 컴포넌트 기반 구조는 재사용성과 유지보수성을 높입니다. TypeScript를 사용하여 코드의 안정성과 예측 가능성을 확보합니다.
  - UI 라이브러리: **Recharts** 또는 **Chart.js**를 사용하여 감가 곡선, TCO 분석 등 데이터 시각화를 구현합니다.

- **백엔드 (Backend)**: **Node.js with Express.js (TypeScript)**
  - 이유: 프론트엔드와 동일한 언어(TypeScript)를 사용하여 개발 생산성을 높이고, 비동기 I/O 처리에 강점이 있어 다수의 API 요청을 효율적으로 처리할 수 있습니다. REST API 서버를 구축하는 데 널리 사용됩니다.

- **데이터베이스 (Database)**: **PostgreSQL**
  - 이유: 정형화된 차량 정보, 사용자 데이터, 정비 이력 등을 안정적으로 관리하기에 적합한 관계형 데이터베이스(RDBMS)입니다. JSONB 필드를 활용하여 일부 비정형 데이터도 유연하게 처리할 수 있습니다.

- **AI / 예측 모델 (AI/ML)**: **Python (Flask/FastAPI)**
  - 이유: `scikit-learn`, `pandas`, `TensorFlow` 등 AI/ML 생태계가 가장 발달한 Python을 사용하여 예측 모델을 개발하고 서빙합니다. 백엔드 서버(Node.js)와는 별도의 마이크로서비스로 분리하여 독립적으로 운영하고 확장할 수 있도록 합니다.

## 3. 시스템 아키텍처

본 시스템은 4개의 주요 구성요소로 이루어진 **마이크로서비스 아키텍처(MSA)**를 따릅니다.

```mermaid
graph TD
    A[사용자 (웹 브라우저)] --> B(프론트엔드 서버<br>React);
    B --> C{백엔드 API 서버<br>Node.js / Express};
    C --> D[데이터베이스<br>PostgreSQL];
    C --> E{AI 예측 서버<br>Python / FastAPI};
    E --> D;
```

1.  **프론트엔드 서버 (Client)**: 사용자가 직접 상호작용하는 웹 애플리케이션입니다. 사용자의 요청을 백엔드 API 서버로 전달하고, 받은 데이터를 시각화하여 보여줍니다.
2.  **백엔드 API 서버 (Backend API Server)**: 핵심 비즈니스 로직을 처리합니다. 사용자 인증, 데이터 조회/저장/수정, 그리고 AI 예측이 필요할 때 AI 예측 서버에 요청을 보내는 역할을 합니다.
3.  **AI 예측 서버 (AI Prediction Server)**: 차량 감가, TCO, 판매 시점 등 복잡한 AI 연산을 전담합니다. 백엔드 서버로부터 요청을 받아 예측 결과를 반환합니다.
4.  **데이터베이스 (Database)**: 모든 사용자 정보, 차량 데이터, 정비 이력, AI 모델 학습에 필요한 데이터 등을 영구적으로 저장합니다.

## 4. 데이터 모델 (초기 설계)

데이터베이스에 생성될 주요 테이블의 초기 구조입니다.

- **Users**: 사용자 정보
  - `id` (PK), `email`, `password_hash`, `name`, `created_at`
- **Vehicles**: 사용자 소유 차량 정보
  - `id` (PK), `owner_id` (FK, Users.id), `model_name`, `trim_name`, `year`, `mileage`, `created_at`
- **MaintenanceRecords**: 정비 이력
  - `id` (PK), `vehicle_id` (FK, Vehicles.id), `record_date`, `item` (예: 엔진오일 교환), `cost`, `memo`
- **HistoryBookEntries**: 히스토리북 기록
  - `id` (PK), `vehicle_id` (FK, Vehicles.id), `entry_date`, `title`, `content`, `image_url`

## 5. API 엔드포인트 설계 (주요 API 예시)

프론트엔드와 백엔드 서버가 통신할 때 사용할 주요 API 경로의 예시입니다.

- `GET /api/user/vehicles`: 현재 로그인된 사용자가 소유한 모든 차량 목록을 조회합니다.
- `GET /api/vehicles/{id}/dashboard`: 특정 차량의 생애주기 대시보드에 필요한 모든 정보(현재 가치, 생애주기 단계, TCO 등)를 조회합니다.
- `POST /api/vehicles/{id}/maintenance`: 특정 차량에 대한 새 정비 이력을 추가합니다.
- `GET /api/vehicles/{id}/timing-report`: 특정 차량에 대한 판매 타이밍 리포트 데이터(AI 예측 서버에 요청)를 조회합니다.
- `GET /api/vehicles/search?query={model_name}`: 특정 모델의 차량 정보를 조회하여 구매 전 시뮬레이션에 사용합니다.
