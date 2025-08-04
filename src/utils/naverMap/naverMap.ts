/*
  //사용할 페이지 필수 선언
  const mapEl = ref<HTMLDivElement | null>(null);
  const markers = ref<Array<any>>([]);
  let map: any;
  let markerManager: any;
  let mapMoveTimer: any;
*/

import { createApp, h } from "vue";
import MapSearchMarker from "@/pages/mapSearch/_components/MapSearchMarker.vue";
import type { MarkerDataType } from "./naverMapCustomType";
import movePage from "../movePage";

const mapUtil = {
  // 네이버 지도 API 스크립트 로드
  loadNaverMapScript: (apiKey: string = "55s76chbvh"): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.naver) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${apiKey}&submodules=geocoder`;
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          resolve();
          console.log("Resolving NaverMap API Successful");
        }, 300);
      };
      script.onerror = () => reject(new Error("네이버 지도 API 로드 실패"));
      document.head.appendChild(script);
    });
  },

  // 지도 생성
  createMap: (mapEl: HTMLDivElement) => {
    //기본 옵션 설정
    const defaultOptions = {
      zoom: 19,
      zoomControl: false,
      zoomControlPosition: naver.maps.Position.LEFT_BOTTOM,
    };

    //생성
    const map = new naver.maps.Map(mapEl, {
      zoom: defaultOptions.zoom,
      zoomControl: defaultOptions.zoomControl,
      zoomControlOptions: {
        position: defaultOptions.zoomControlPosition,
      },
    });

    console.log("NaverMap initialized");
    return map;
  },

  // InfoWindow 생성
  createInfoWindow: (options?: { content?: string; anchorSkew?: boolean }) => {
    return new naver.maps.InfoWindow({
      content: "",
      anchorSkew: true,
      ...options,
    });
  },

  // 줌 레벨에 따른 마커/클러스터 관리
  createMarkersWithZoomControl: (
    map: naver.maps.Map,
    markerDataList: Array<MarkerDataType>,
    markerType?: "MapSearchMarker",
    onClickCallback?: (markerData: any, marker: naver.maps.Marker) => void,
  ) => {
    // return;
    let currentMarkers: naver.maps.Marker[] = [];
    let currentClusters: any[] = [];

    // 줌 레벨에 따른 마커/클러스터 전환 함수
    const updateMarkersByZoom = () => {
      const currentZoom = map.getZoom();

      // 기존 마커/클러스터 제거
      currentMarkers.forEach((marker) => marker.setMap(null));
      currentClusters.forEach((cluster) => cluster.setMap(null));
      currentMarkers = [];
      currentClusters = [];

      //기준 줌 15레벨
      if (currentZoom >= 17) {
        currentMarkers = mapUtil.createMarkers(map, markerDataList, markerType);
      } else {
        currentClusters = mapUtil.createClusters(map, markerDataList);
      }
    };

    // 초기 마커/클러스터 생성
    updateMarkersByZoom();

    // 줌 변경 이벤트 리스너 추가
    naver.maps.Event.addListener(map, "zoom_changed", updateMarkersByZoom);

    return {
      markers: currentMarkers,
      clusters: currentClusters,
      updateMarkersByZoom,
    };
  },

  // 마커 생성
  createMarkers: (
    map: naver.maps.Map,
    markerDataList: Array<MarkerDataType>,
    markerType?: "MapSearchMarker",
  ) => {
    const markers: naver.maps.Marker[] = []; // 마커 배열 추가

    markerDataList.forEach((MarkerData, index) => {
      const position = MarkerData.latlng;
      let iconContent: any = undefined;

      // 문자열에 따라 다른 컴포넌트 사용
      if (markerType) {
        let markerIcon: any = null;

        switch (markerType) {
          case "MapSearchMarker":
            markerIcon = MapSearchMarker;
            break;
        }

        //마커 아이콘 생성
        if (markerIcon) {
          const tempDiv = document.createElement("div");
          const app = createApp({
            render() {
              return h(markerIcon, MarkerData);
            },
          });
          app.mount(tempDiv);
          iconContent = tempDiv.innerHTML;
          app.unmount();
        }
      }

      const marker = new naver.maps.Marker({
        position: position,
        map: map,
        icon: iconContent
          ? {
              content: iconContent,
              size: new naver.maps.Size(0, 0),
              anchor: new naver.maps.Point(0, 0),
            }
          : undefined,
      });

      // 클릭시 이벤트
      naver.maps.Event.addListener(marker, "click", () => {
        movePage.transactionDetail({
          jibunAddress: encodeURIComponent(MarkerData.jibunAddress),
          roadAddress: encodeURIComponent(MarkerData.roadAddress),
          lat: MarkerData.latlng.lat().toString(),
          lng: MarkerData.latlng.lng().toString(),
          buildingName: encodeURIComponent(MarkerData.buildingName || ""),
        });
      });

      markers.push(marker);

      // 첫 번째 마커로 지도 중심 설정
      // if (index === 0) {
      // map.setCenter(position);
      // }
    });

    return markers;
  },

  // 클러스터 생성
  createClusters: (map: naver.maps.Map, markerDataList: Array<MarkerDataType>) => {
    const clusters: any[] = [];

    // 간단한 클러스터링 로직 (격자 기반)
    const gridSize = 0.01; // 격자 크기
    const clusterMap = new Map();

    markerDataList.forEach((MarkerDataType) => {
      const gridX = Math.floor(MarkerDataType.latlng.lat() / gridSize);
      const gridY = Math.floor(MarkerDataType.latlng.lng() / gridSize);
      const clusterKey = `${gridX}-${gridY}`;

      if (!clusterMap.has(clusterKey)) {
        clusterMap.set(clusterKey, []);
      }
      clusterMap.get(clusterKey).push(MarkerDataType);
    });

    // 클러스터 마커 생성
    clusterMap.forEach((markers) => {
      if (markers.length > 0) {
        const centerLat =
          markers.reduce((sum: number, m: any) => sum + m.latlng.lat(), 0) / markers.length;
        const centerLng =
          markers.reduce((sum: number, m: any) => sum + m.latlng.lng(), 0) / markers.length;

        const clusterMarker = new naver.maps.Marker({
          position: new naver.maps.LatLng(centerLat, centerLng),
          map: map,
          icon: {
            content: `
                <div class="bg-blue-300 opacity-70 text-white border-2 border-blue-600 rounded-full w-10 h-10 flex items-center justify-center text-md font-bold">
                  ${markers.length}
                </div>
              `,
            size: new naver.maps.Size(32, 32),
            anchor: new naver.maps.Point(16, 16),
          },
        });

        clusters.push(clusterMarker);
      }
    });

    return clusters;
  },

  //가장자이 구하기
  getBoundary: (map: naver.maps.Map) => {
    const bounds = map.getBounds();

    const topLeft = bounds.getMin();
    const bottomRight = bounds.getMax();
    const topRight = new naver.maps.LatLng(topLeft.y, bottomRight.x);
    const bottomLeft = new naver.maps.LatLng(bottomRight.y, topLeft.x);

    const mapBondary = {
      topLeft: { lat: topLeft.y, lng: topLeft.x },
      topRight: { lat: topRight.lat(), lng: topRight.lng() },
      bottomLeft: { lat: bottomLeft.lat(), lng: bottomLeft.lng() },
      bottomRight: { lat: bottomRight.y, lng: bottomRight.x },
    };

    return mapBondary;
  },

  // 지도 영역 내 건물 정보 검색
  searchBuildingsInBounds: async (
    map: naver.maps.Map,
  ): Promise<
    Array<{
      jibunAddress: string;
      roadAddress: string;
      latlng: naver.maps.LatLng;
      buildingName?: string;
    }>
  > => {
    const bounds = map.getBounds();
    const buildings: Array<{
      jibunAddress: string;
      roadAddress: string;
      latlng: naver.maps.LatLng;
      buildingName?: string;
    }> = [];

    // 줌 레벨에 따른 격자 크기 조정
    const currentZoom = map.getZoom();
    let gridSize: number;

    if (currentZoom >= 20) {
      gridSize = 0.0001; // 약 20m 간격 (줌 레벨 20 이상)
    } else if (currentZoom >= 19) {
      gridSize = 0.0003; // 약 50m 간격 (줌 레벨 19)
    } else if (currentZoom >= 17) {
      gridSize = 0.0006; // 약 100m 간격 (줌 레벨 17-18)
    } else if (currentZoom >= 15) {
      gridSize = 0.001; // 약 200m 간격 (줌 레벨 15-16)
    } else {
      gridSize = 0.0025; // 약 500m 간격 (줌 레벨 15 미만)
    }

    const minLat = bounds.getMin().y;
    const maxLat = bounds.getMax().y;
    const minLng = bounds.getMin().x;
    const maxLng = bounds.getMax().x;

    // 격자 기반으로 더 많은 지점 검색
    const searchPoints: naver.maps.LatLng[] = [];
    for (let lat = minLat; lat <= maxLat; lat += gridSize) {
      for (let lng = minLng; lng <= maxLng; lng += gridSize) {
        searchPoints.push(new naver.maps.LatLng(lat + gridSize / 2, lng + gridSize / 2));
      }
    }

    let successCount = 0;
    let failCount = 0;

    // 각 지점에서 주소 검색
    for (let i = 0; i < searchPoints.length; i++) {
      const point = searchPoints[i];
      console
        .log
        // `[${i + 1}/${searchPoints.length}] API 호출 중... (${point.lat().toFixed(6)}, ${point.lng().toFixed(6)})`,
        ();

      try {
        const buildingInfo = await mapUtil.searchCoordinateToAddress(point);
        successCount++;

        // 주소가 유효한지 확인 (빈 주소나 기본 주소가 아닌 경우)
        if (
          buildingInfo.jibunAddress &&
          buildingInfo.jibunAddress.trim() !== "" &&
          !buildingInfo.jibunAddress.includes("undefined")
        ) {
          // 중복 제거
          const isDuplicate = buildings.some(
            (building) =>
              building.jibunAddress === buildingInfo.jibunAddress &&
              building.roadAddress === buildingInfo.roadAddress,
          );

          if (!isDuplicate) {
            // 정확한 좌표로 주소 검색하여 정확한 위치 가져오기
            try {
              const accurateInfo = await mapUtil.searchAddressToCoordinate(
                buildingInfo.jibunAddress,
              );
              buildings.push({
                jibunAddress: accurateInfo.jibunAddress,
                roadAddress: accurateInfo.roadAddress,
                latlng: accurateInfo.latlng, // 정확한 좌표 사용
              });
              // console.log(
              //   `✅ 성공: ${buildingInfo.jibunAddress} -> 정확한 위치: (${accurateInfo.latlng.lat().toFixed(6)}, ${accurateInfo.latlng.lng().toFixed(6)})`,
              // );
            } catch (accurateError) {
              // 정확한 좌표 검색 실패시 원본 정보 사용
              buildings.push(buildingInfo);
              // console.log(`⚠️ 정확한 좌표 검색 실패, 원본 사용: ${buildingInfo.jibunAddress}`);
            }
          }
        } else {
          // console.log(`⚠️ 유효하지 않은 주소: ${buildingInfo.jibunAddress}`);
        }
      } catch (error) {
        failCount++;
        // console.warn(`❌ 실패 [${i + 1}]:`, error);
      }
    }

    console.log(`=== 검색 결과 ===`);
    console.log(`총 API 호출: ${searchPoints.length}회`);
    console.log(`성공: ${successCount}회`);
    console.log(`실패: ${failCount}회`);
    console.log(`중복 제거 후 건물 수: ${buildings.length}개`);
    console.log(`총 ${buildings.length}개의 건물 정보를 가져왔습니다.`);

    return buildings;
  },

  // 좌표 기반 주소 검색
  searchCoordinateToAddress: (latlng: naver.maps.LatLng): Promise<MarkerDataType> => {
    return new Promise((resolve, reject) => {
      naver.maps.Service.reverseGeocode(
        {
          coords: latlng,
          orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(
            ",",
          ),
        },
        function (status, response) {
          if (status === naver.maps.Service.Status.ERROR) {
            reject(new Error("Failed to load searchCoordinateToAddress" + status));
            return;
          }

          const address = response.v2.address;
          const jibunAddress = address.jibunAddress;
          const roadAddress = address.roadAddress;

          resolve({ jibunAddress, roadAddress, latlng });
        },
      );
    });
  },

  // 주소 기반 좌표 검색
  searchAddressToCoordinate: (address: string): Promise<MarkerDataType> => {
    return new Promise((resolve, reject) => {
      naver.maps.Service.geocode(
        {
          query: address,
        },
        function (status, response) {
          if (status === naver.maps.Service.Status.ERROR) {
            reject(new Error("Failed to load searchAddressToCoordinate" + status));
            return;
          }

          if (response.v2.meta.totalCount === 0) {
            reject(new Error("No address found"));
            return;
          }

          const address = response.v2.addresses[0];
          const jibunAddress = address.jibunAddress;
          const roadAddress = address.roadAddress;
          const latlng = new naver.maps.LatLng(parseFloat(address.y), parseFloat(address.x));

          resolve({ jibunAddress, roadAddress, latlng });
        },
      );
    });
  },

  // 현재 위치 가져오기
  getCurrentLocation: (): Promise<naver.maps.LatLng> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const latlng = new naver.maps.LatLng(latitude, longitude);
          resolve(latlng);
        },
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      );
    });
  },

  getTotalItemsByAnyLocation: async (item: any) => {
    //주소인 경우
    if (typeof item === "string") {
      return mapUtil.searchAddressToCoordinate(item);
    }
    //좌표인 경우
    else if (item instanceof naver.maps.LatLng) {
      return mapUtil.searchCoordinateToAddress(item);
    } else {
      const currentLatLng = await mapUtil.getCurrentLocation();
      return mapUtil.searchCoordinateToAddress(currentLatLng);
    }
  },

  // 주소 생성 헬퍼 함수 start
  makeAddress: (item: any) => {
    if (!item) {
      return;
    }

    var name = item.name,
      region = item.region,
      land = item.land,
      isRoadAddress = name === "roadaddr";

    var sido = "",
      sigugun = "",
      dongmyun = "",
      ri = "",
      rest = "";

    if (mapUtil.hasArea(region.area1)) {
      sido = region.area1.name;
    }

    if (mapUtil.hasArea(region.area2)) {
      sigugun = region.area2.name;
    }

    if (mapUtil.hasArea(region.area3)) {
      dongmyun = region.area3.name;
    }

    if (mapUtil.hasArea(region.area4)) {
      ri = region.area4.name;
    }

    if (land) {
      if (mapUtil.hasData(land.number1)) {
        if (mapUtil.hasData(land.type) && land.type === "2") {
          rest += "산";
        }

        rest += land.number1;

        if (mapUtil.hasData(land.number2)) {
          rest += "-" + land.number2;
        }
      }

      if (isRoadAddress === true) {
        if (mapUtil.checkLastString(dongmyun, "면")) {
          ri = land.name;
        } else {
          dongmyun = land.name;
          ri = "";
        }

        if (mapUtil.hasAddition(land.addition0)) {
          rest += " " + land.addition0.value;
        }
      }
    }

    return [sido, sigugun, dongmyun, ri, rest].join(" ");
  },

  hasArea: (area: any) => {
    return !!(area && area.name && area.name !== "");
  },

  hasData: (data: any) => {
    return !!(data && data !== "");
  },

  checkLastString: (word: any, lastString: any) => {
    return new RegExp(lastString + "$").test(word);
  },

  hasAddition: (addition: any) => {
    return !!(addition && addition.value);
  },
  // 주소 생성 헬퍼 함수 end
};

export default mapUtil;
