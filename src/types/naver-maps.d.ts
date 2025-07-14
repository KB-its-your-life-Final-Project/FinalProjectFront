// src/types/naver-maps.d.ts
// TypeScript 가 naver.maps API 타입 정보 모르기 때문에 직접 타입 선언 파일을 만들어주어야 함
export {};

declare global {
  interface Window {
    naver: typeof naver;  // 전역 naver 네임스페이스
  }

  namespace naver.maps {
    /** 지도 객체 생성 옵션 */
    interface MapOptions {
      center: LatLng;
      zoom: number;
      // 필요한 옵션 추가...
    }

    /** 지도 객체 */
    class Map {
      constructor(el: HTMLElement, opts: any);
      getBounds(): Bounds;
      addListener(eventName: string, handler: () => void): void;
      // 필요한 메서드 추가...
    }

    /** 위도·경도 */
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    /** 지도 범위 객체 */
    interface Bounds {
      getSW(): LatLng;
      getNE(): LatLng;
    }

    /** 마커 생성 옵션 */
    interface MarkerOptions {
      position: LatLng;
      map: Map | null;
      // icon, title 등 다른 옵션 추가...
    }

    /** 마커 객체 */
    class Marker {
      constructor(opts: MarkerOptions);
      setMap(map: Map | null): void;
      // 필요한 메서드 추가...
    }

    /** Geocoder 서비스 */
    namespace Service {
      class Geocoder {
        // geocode 메서드 예시
        geocode(request: { address: string }, callback: (status: string, response: any) => void): void;
      }
    }
  }
}
