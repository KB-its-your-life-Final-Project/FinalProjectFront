// src/types/naver-maps.d.ts
export {};

declare global {
  interface Window {
    naver: typeof naver;  // 전역 naver 네임스페이스
  }

  namespace naver.maps {
    class Map {
      constructor(el: HTMLElement, opts: any);
      getBounds(): any;
      // 필요한 메서드 추가...
    }
    class LatLng {
      constructor(lat: number, lng: number);
    }
    // 기타 타입들...
  }
}
