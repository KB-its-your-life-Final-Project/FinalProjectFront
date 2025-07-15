// src/types/naver-maps.d.ts
// TypeScript가 naver.maps API 타입 정보를 모르기 때문에 직접 타입 선언 파일을 만들어주어야 함

export {};

declare global {
  // 전역 naver 네임스페이스
  interface Window {
    naver: typeof naver;
  }

  // 클러스터용 또는 API 호출 등에서 편리하게 쓰이는 리터럴 타입
  /** 좌표 리터럴 타입 */
  type LatLngLiteral = { lat: number; lng: number };
  /** 함수나 데이터 인터페이스에서 사용하는 좌표 배열 타입 */
  type LatLng = LatLngLiteral;

  /** 클러스터링 라이브러리 인터페이스 */
  interface MarkerClusteringOptions {
    map: Map;
    markers: Marker[];
    minClusterSize?: number;
    maxZoom?: number;
    gridSize?: number;
    disableClickZoom?: boolean;
    icons?: Array<{ content: string; size: Size; anchor: Point }>;
    indexGenerator?: number[];
    stylingFunction?: (clusterMarker: any, count: number) => void;
  }
  // 전역 MarkerClustering 클래스
  const MarkerClustering: {
    new (opts: MarkerClusteringOptions): any;
  };


  namespace naver.maps {
    /** 지도 생성 옵션 */
    interface MapOptions {
      center: LatLng;
      zoom: number;
      zoomControl?: boolean;
      zoomControlOptions?: {
        position?: Position;
        style?: ZoomControlStyle;
      };
      // 필요한 옵션 추가...
    }

    /** 지도 객체 */
    class Map {
      constructor(el: HTMLElement | string, opts: MapOptions);
      getCenter(): LatLng;
      getBounds(): Bounds;
      addListener(eventName: string, handler: () => void): EventListener;
      // 필요한 메서드 추가...
    }

    /** 위도·경도 API 클래스 */
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
      map?: Map | null;
      draggable?: boolean;
      // icon, title 등 다른 옵션 추가...
    }

    /** 마커 객체 */
    class Marker {
      constructor(opts: MarkerOptions);
      setMap(map: Map | null): void;
      // 필요한 메서드 추가...
    }

    /** 사이즈 객체 */
    class Size {
      constructor(width: number, height: number);
    }

    /** 앵커 포인트 객체 */
    class Point {
      constructor(x: number, y: number);
    }

    /** 줌 컨트롤 위치 enum */
    enum Position {
      TOP_LEFT,
      TOP_RIGHT,
      BOTTOM_LEFT,
      BOTTOM_RIGHT
    }

    /** 줌 컨트롤 스타일 enum */
    enum ZoomControlStyle {
      SMALL,
      DEFAULT
    }

    /** Geocoder 서비스 */
    namespace Service {
      class Geocoder {
        geocode(
          request: { address: string },
          callback: (status: string, response: any) => void
        ): void;
      }
    }


  }

}
