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
import type { MarkerDataType } from "../../types/markerDataType";
import movePage from "../movePage";
import { Api } from "@/api/autoLoad/Api";

const mapUtil = {
  /**
   * 네이버 지도 API 스크립트를 동적으로 로드
   * @param apiKey - Naver Map API Key
   * @returns Promise<void>
   */
  loadNaverMapScript: (apiKey: string = "9j5byktxr0"): Promise<void> => {
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
        }, 300);
      };
      script.onerror = () => reject(new Error("네이버 지도 API 로드 실패"));
      document.head.appendChild(script);
    });
  },

  /**
   * 지도를 생성
   * @param mapEl - 지도를 렌더링할 HTMLDivElement
   * @returns Naver Map 객체
   */
  createMap: (mapEl: HTMLDivElement) => {
    //기본 옵션 설정
    const defaultOptions = {
      zoom: 20,
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

    return map;
  },

  /**
   * InfoWindow 생성
   * @param options - InfoWindow 옵션 (content, anchorSkew 등)
   * @returns InfoWindow 객체
   */
  createInfoWindow: (options?: { content?: string; anchorSkew?: boolean }) => {
    return new naver.maps.InfoWindow({
      content: "",
      anchorSkew: true,
      ...options,
    });
  },

  /**
   * 현재 마커와 클러스터 제거
   * @param currentMarkers - 현재 지도에 표시된 마커 배열
   * @param currentClusters - 현재 지도에 표시된 클러스터 배열
   */
  clearCurrentMarkers: (currentMarkers: naver.maps.Marker[], currentClusters: any[]) => {
    currentMarkers.forEach((marker) => marker.setMap(null));
    currentClusters.forEach((cluster) => cluster.setMap(null));
    currentMarkers.length = 0;
    currentClusters.length = 0;
  },

  /**
   * 줌 레벨에 따라 마커 또는 클러스터를 생성/관리
   * @param map - Naver Map 객체
   * @param markerDataList - 마커 데이터 배열
   * @param markerType - 마커 타입 (옵션)
   * @param onClickCallback - 마커 클릭 시 호출되는 콜백 (옵션)
   * @returns 마커와 클러스터 배열, 업데이트 함수
   */
  createMarkersWithZoomControl: (
    map: naver.maps.Map,
    markerDataList: Array<MarkerDataType>,
    markerType?: "MapSearchMarker",
    onClickCallback?: (markerData: any, marker: naver.maps.Marker) => void,
  ) => {
    // return;
    const currentMarkers: naver.maps.Marker[] = [];
    const currentClusters: any[] = [];

    // 줌 레벨에 따른 마커/클러스터 전환 함수
    const updateMarkersByZoom = async () => {
      const currentZoom = map.getZoom();

      mapUtil.clearCurrentMarkers(currentMarkers, currentClusters);

      //기준 줌
      if (currentZoom >= 19) {
        const newMarkers = await mapUtil.createMarkers(map, markerDataList, markerType);
        currentMarkers.push(...newMarkers);
      } else {
        const newClusters = mapUtil.createClusters(map, markerDataList);
        currentClusters.push(...newClusters);
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
  /**
   * 개별 마커 생성
   * @param map - Naver Map 객체
   * @param markerDataList - 마커 데이터 배열
   * @param markerType - 마커 타입 (옵션)
   * @returns 생성된 마커 배열
   */
  createMarkers: async (
    map: naver.maps.Map,
    markerDataList: Array<MarkerDataType>,
    markerType?: "MapSearchMarker",
  ) => {
    const markers: naver.maps.Marker[] = [];

    for (const MarkerData of markerDataList) {
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

          // DB에서 부동산 정보 가져오기
          const api = new Api();
          let estateDTO = null;
          let estateSalesDTO = null;

          try {
            // 좌표로 부동산 정보 조회
            const response = await api.getEstateByLatLngUsingGet({
              lat: MarkerData.latlng.lat(),
              lng: MarkerData.latlng.lng(),
            });

            if (response.data?.data) {
              estateDTO = response.data.data;

              // 거래 정보 조회
              const responseSales = await api.getEstateSalesByElementUsingGet({
                estateId: estateDTO.id,
              });

              if (responseSales.data?.data) {
                estateSalesDTO = responseSales.data.data;
              }
            }
          } catch (error) {
            console.error("부동산 데이터 조회 실패:", error);
          }

          const app = createApp({
            render() {
              return h(markerIcon, {
                markerData: MarkerData,
                estateDTO: estateDTO,
                estateSalesDTO: estateSalesDTO,
              });
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
          jibunAddress: MarkerData.jibunAddress,
          roadAddress: MarkerData.roadAddress,
          lat: MarkerData.latlng.lat().toString(),
          lng: MarkerData.latlng.lng().toString(),
          buildingName: MarkerData.buildingName || "",
        });
      });

      markers.push(marker);
    }

    return markers;
  },

  /**
   * 클러스터 생성
   * @param map - Naver Map 객체
   * @param markerDataList - 마커 데이터 배열
   * @returns 생성된 클러스터 배열
   */
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

        // 마커 개수에 따른 크기 조절
        const getClusterSize = (count: number) => {
          if (count >= 100) return { width: 70, height: 70, fontSize: "18px" };
          if (count >= 50) return { width: 65, height: 65, fontSize: "17px" };
          if (count >= 20) return { width: 60, height: 60, fontSize: "16px" };
          if (count >= 10) return { width: 55, height: 55, fontSize: "15px" };
          return { width: 50, height: 50, fontSize: "14px" };
        };

        const size = getClusterSize(markers.length);

        const clusterMarker = new naver.maps.Marker({
          position: new naver.maps.LatLng(centerLat, centerLng),
          map: map,
          icon: {
            content: `
                <div class="bg-blue-300 opacity-70 text-white border-2 border-blue-600 rounded-full flex items-center justify-center font-bold cursor-pointer"
                     style="width: ${size.width}px; height: ${size.height}px; font-size: ${size.fontSize};">
                  ${markers.length}
                </div>
              `,
            size: new naver.maps.Size(size.width, size.height),
            anchor: new naver.maps.Point(size.width / 2, size.height / 2),
          },
        });

        // 클러스터 클릭 이벤트 추가
        naver.maps.Event.addListener(clusterMarker, "click", () => {
          // 클러스터 내 마커들의 정보를 이벤트로 전달
          const clusterInfo = {
            markers: markers,
            center: new naver.maps.LatLng(centerLat, centerLng),
            count: markers.length,
          };

          // 커스텀 이벤트 발생
          const event = new CustomEvent("clusterClick", {
            detail: clusterInfo,
          });
          document.dispatchEvent(event);
        });

        clusters.push(clusterMarker);
      }
    });

    return clusters;
  },

  /**
   * 지도 경계 좌표 가져오기
   * @param map - Naver Map 객체
   * @returns 지도 상단좌표, 하단좌표, 좌우 좌표
   */
  getBoundary: (map: naver.maps.Map) => {
    const bounds = map.getBounds();

    const minLat = bounds.getMin().y;
    const maxLat = bounds.getMax().y;
    const minLng = bounds.getMin().x;
    const maxLng = bounds.getMax().x;

    const mapBoundary = {
      topLeft: { lat: maxLat, lng: minLng },
      topRight: { lat: maxLat, lng: maxLng },
      bottomLeft: { lat: minLat, lng: minLng },
      bottomRight: { lat: minLat, lng: maxLng },
    };

    return mapBoundary;
  },

  // 지도 영역 내 건물 정보 검색
  // DB에서 불러오기 주석처리됨 일단 보류
  // searchBuildingsInBounds: async (map: naver.maps.Map): Promise<Array<MarkerDataType>> => {
  //   const buildings: Array<{
  //     jibunAddress: string;
  //     roadAddress: string;
  //     latlng: naver.maps.LatLng;
  //     buildingName?: string;
  //   }> = [];

  //   // 줌 레벨에 따른 격자 크기 조정
  //   const currentZoom = map.getZoom();
  //   let gridSize;

  //   if (currentZoom >= 20) {
  //     gridSize = 0.0001; // 약 10m 간격 (줌 레벨 20 이상)
  //   } else if (currentZoom >= 19) {
  //     gridSize = 0.0003; // 약 50m 간격 (줌 레벨 19)
  //   } else if (currentZoom >= 17) {
  //     gridSize = 0.0006; // 약 100m 간격 (줌 레벨 17-18)
  //   } else if (currentZoom >= 15) {
  //     gridSize = 0.001; // 약 200m 간격 (줌 레벨 15-16)
  //   } else {
  //     gridSize = 0.0025; // 약 500m 간격 (줌 레벨 15 미만)
  //   }

  //   const mapBoundary = mapUtil.getBoundary(map);
  //   const minLat = mapBoundary.bottomLeft.lat;
  //   const maxLat = mapBoundary.topRight.lat;
  //   const minLng = mapBoundary.bottomLeft.lng;
  //   const maxLng = mapBoundary.topRight.lng;

  //   // DB에서 해당 영역의 건물 정보 미리 조회
  //   // const api = new Api();
  //   // let dbBuildings: any[] = [];
  //   // try {
  //   //   const response = await api.getEstateBySquareUsingGet({
  //   //     minLat: minLat,
  //   //     maxLat: maxLat,
  //   //     minLng: minLng,
  //   //     maxLng: maxLng,
  //   //   });
  //   //   if (response.data && response.data.data) {
  //   //     dbBuildings = response.data.data;
  //   //   }
  //   // } catch (error) {
  //   //   console.error("DB 건물 정보 조회 실패:", error);
  //   // }

  //   // 격자 기반으로 더 많은 지점 검색
  //   const searchPoints: naver.maps.LatLng[] = [];
  //   for (let lat = minLat; lat <= maxLat; lat += gridSize) {
  //     for (let lng = minLng; lng <= maxLng; lng += gridSize) {
  //       searchPoints.push(new naver.maps.LatLng(lat + gridSize / 2, lng + gridSize / 2));
  //     }
  //   }

  //   // 각 지점에서 주소 검색
  //   for (let i = 0; i < searchPoints.length; i++) {
  //     const point = searchPoints[i];
  //     const buildingInfo = await mapUtil.searchCoordinateToAddress(point);

  //     // 주소가 유효한지 확인
  //     if (
  //       buildingInfo.jibunAddress &&
  //       buildingInfo.jibunAddress.trim() !== "" &&
  //       !buildingInfo.jibunAddress.includes("undefined")
  //     ) {
  //       const accurateInfo = await mapUtil.searchAddressToCoordinate(buildingInfo.jibunAddress);

  //       // 중복 제거
  //       const isAlreadyAdded = buildings.some((building) => {
  //         const latMatch = building.latlng.lat() === accurateInfo.latlng.lat();
  //         const lngMatch = building.latlng.lng() === accurateInfo.latlng.lng();
  //         return latMatch && lngMatch;
  //       });
  //       // DB에 존재하는지 확인
  //       // const existsInDB = dbBuildings.some((dbBuilding) => {
  //       //   // 좌표 비교
  //       //   const latMatch = Math.abs(dbBuilding.latitude - buildingInfo.latlng.lat()) < 0.0001;
  //       //   const lngMatch = Math.abs(dbBuilding.longitude - buildingInfo.latlng.lng()) < 0.0001;

  //       //   return latMatch && lngMatch;
  //       // });

  //       // if (existsInDB) {

  //       // 정확한 좌표로 주소 검색하여 정확한 위치 가져오기
  //       if (!isAlreadyAdded) {
  //         buildings.push({
  //           jibunAddress: accurateInfo.jibunAddress,
  //           roadAddress: accurateInfo.roadAddress,
  //           latlng: accurateInfo.latlng, // 정확한 좌표 사용
  //           buildingName: accurateInfo.buildingName,
  //         });
  //       }
  //       // }
  //     }
  //   }

  //   return buildings;
  // },

  /**
   * 지도 범위 내 건물 검색
   * @param map - Naver Map 객체
   * @returns MarkerDataType 배열
   */
  searchBuildingsInBounds: async (map: naver.maps.Map): Promise<Array<MarkerDataType>> => {
    const mapBoundary = mapUtil.getBoundary(map);
    const minLat = mapBoundary.bottomLeft.lat;
    const maxLat = mapBoundary.topRight.lat;
    const minLng = mapBoundary.bottomLeft.lng;
    const maxLng = mapBoundary.topRight.lng;

    // DB에서 해당 영역의 건물 정보 조회
    const api = new Api();
    let dbBuildings: any[] = [];

    try {
      const response = await api.getEstateBySquareUsingGet({
        minLat: minLat,
        maxLat: maxLat,
        minLng: minLng,
        maxLng: maxLng,
      });

      if (response.data && response.data.data) {
        dbBuildings = response.data.data;
      }
    } catch (error) {
      console.error("DB 건물 정보 조회 실패:", error);
      return [];
    }

    // DB 데이터에서 중복 제거 (좌표 기준)
    const uniqueBuildings = dbBuildings.filter((building, index, self) => {
      return (
        index ===
        self.findIndex(
          (b) =>
            Math.abs(b.latitude - building.latitude) < 0.0001 &&
            Math.abs(b.longitude - building.longitude) < 0.0001,
        )
      );
    });

    // 중복 제거된 데이터로 네이버 API 호출
    const buildings: Array<MarkerDataType> = [];

    for (const building of uniqueBuildings) {
      try {
        const latlng = new naver.maps.LatLng(building.latitude, building.longitude);

        // 네이버 API로 좌표에 해당하는 정확한 주소 정보 가져오기
        const addressInfo = await mapUtil.searchCoordinateToAddress(latlng);

        if (addressInfo) {
          buildings.push({
            jibunAddress: addressInfo.jibunAddress,
            roadAddress: addressInfo.roadAddress || "",
            latlng: latlng,
            buildingName: building.buildingName || building.name || undefined,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    return buildings;
  },

  /**
   * 좌표 -> 주소 변환
   * @param latlng - Naver Map LatLng 객체
   * @returns MarkerDataType 객체 (주소 포함)
   */
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

  /**
   * 주소 -> 좌표 변환
   * @param address - 변환할 주소 문자열
   * @returns MarkerDataType 객체 (좌표 포함)
   */
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

          const address = response.v2.addresses[0];
          const jibunAddress = address.jibunAddress;
          const roadAddress = address.roadAddress;
          const latlng = new naver.maps.LatLng(parseFloat(address.y), parseFloat(address.x));

          resolve({ jibunAddress, roadAddress, latlng });
        },
      );
    });
  },

  /**
   * 현재 위치 가져오기 (GPS)
   * @returns 현재 위치 LatLng
   */
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

  /**
   * 주소 또는 좌표에 따라 정보 반환
   * @param item - 주소 문자열, LatLng 객체 또는 null
   * @returns MarkerDataType 객체
   */
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

  /**
   * 주소 생성 헬퍼 함수
   * @param item - 지도 API 응답 아이템
   * @returns 생성된 주소 문자열
   */
  makeAddress: (item: any) => {
    if (!item) {
      return;
    }

    const name = item.name,
      region = item.region,
      land = item.land,
      isRoadAddress = name === "roadaddr";

    let sido = "",
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
