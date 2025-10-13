// 차량 API 통합 모듈

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * API 호출 래퍼 함수
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  try {
    const res = await fetch(url, options);
    
    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `API 오류 (${res.status})`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }
      
      throw new Error(errorMessage);
    }
    
    return res.json();
  } catch (error) {
    console.error(`API 호출 실패: ${endpoint}`, error);
    throw error;
  }
}

/**
 * 차량 API
 */
export const vehicleApi = {
  /**
   * 모든 차량 목록 조회
   */
  getAll: async () => {
    return fetchAPI<any[]>("/api/v1/vehicles");
  },

  /**
   * 특정 차량의 대시보드 정보 조회
   */
  getDashboard: async (vehicleId: string) => {
    return fetchAPI<any>(`/api/v1/vehicles/${vehicleId}/dashboard`);
  },

  /**
   * 새 차량 등록
   */
  create: async (vehicleData: any) => {
    return fetchAPI<any>("/api/v1/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicleData),
    });
  },
};

/**
 * 카탈로그 API
 */
export const catalogApi = {
  /**
   * 제조사 목록 조회
   */
  getMakes: async () => {
    return fetchAPI<any[]>("/api/v1/catalog/makes");
  },

  /**
   * 모델 목록 조회
   */
  getModels: async (make?: string) => {
    const query = make ? `?make=${encodeURIComponent(make)}` : "";
    return fetchAPI<any[]>(`/api/v1/catalog/models${query}`);
  },

  /**
   * 트림 목록 조회
   */
  getTrims: async (params: { make?: string; model?: string; year?: number }) => {
    const query = new URLSearchParams();
    if (params.make) query.append("make", params.make);
    if (params.model) query.append("model", params.model);
    if (params.year) query.append("year", params.year.toString());
    
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return fetchAPI<any[]>(`/api/v1/catalog/trims${queryString}`);
  },
};

/**
 * 판매 타이밍 API
 */
export const timingApi = {
  /**
   * 판매 타이밍 리포트 조회
   */
  getReport: async (payload: any) => {
    return fetchAPI<any>("/api/v1/timing/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};


