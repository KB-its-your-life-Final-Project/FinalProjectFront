import { createApp, h } from "vue";
import MapSearchMarker from "@/pages/mapSearch/_components/MapSearchMarker.vue";

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
      center: { lat: 37.3595704, lng: 127.105399 },
      zoom: 13,
      zoomControl: false,
      zoomControlPosition: naver.maps.Position.LEFT_BOTTOM,
    };

    //생성
    const map = new naver.maps.Map(mapEl, {
      center: new naver.maps.LatLng(defaultOptions.center.lat, defaultOptions.center.lng),
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
    markerDataList: Array<{ lat: number; lng: number; title?: string }>,
    markerType?: "MapSearchMarker",
  ) => {
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

      if (currentZoom >= 15) {
        // 줌 레벨 15 이상: 개별 마커 표시
        console.log("개별 마커 표시");
        currentMarkers = mapUtil.createMarkers(map, markerDataList, markerType);
      } else {
        // 줌 레벨 15 미만: 클러스터 표시
        console.log("클러스터 표시");
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
    markerDataList: Array<{ lat: number; lng: number; title?: string }>,
    markerType?: "MapSearchMarker",
  ) => {
    const markers: naver.maps.Marker[] = []; // 마커 배열 추가

    markerDataList.forEach((markerData, index) => {
      const position = new naver.maps.LatLng(markerData.lat, markerData.lng);

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
              return h(markerIcon, {
                title: markerData.title,
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

      markers.push(marker);

      // 첫 번째 마커로 지도 중심 설정
      if (index === 0) {
        map.setCenter(position);
      }
    });

    return markers; // 이 줄이 빠져있었습니다!
  },

  // 클러스터 생성
  createClusters: (
    map: naver.maps.Map,
    markerDataList: Array<{ lat: number; lng: number; title?: string }>,
  ) => {
    const clusters: any[] = [];

    // 간단한 클러스터링 로직 (격자 기반)
    const gridSize = 0.01; // 격자 크기
    const clusterMap = new Map();

    markerDataList.forEach((markerData) => {
      const gridX = Math.floor(markerData.lat / gridSize);
      const gridY = Math.floor(markerData.lng / gridSize);
      const clusterKey = `${gridX}-${gridY}`;

      if (!clusterMap.has(clusterKey)) {
        clusterMap.set(clusterKey, []);
      }
      clusterMap.get(clusterKey).push(markerData);
    });

    // 클러스터 마커 생성
    clusterMap.forEach((markers, clusterKey) => {
      if (markers.length > 0) {
        const centerLat = markers.reduce((sum: number, m: any) => sum + m.lat, 0) / markers.length;
        const centerLng = markers.reduce((sum: number, m: any) => sum + m.lng, 0) / markers.length;

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

  // 좌표 기반 주소 검색
  searchCoordinateToAddress: (
    latlng: any,
    map: naver.maps.Map,
    infoWindow: naver.maps.InfoWindow,
  ) => {
    infoWindow.close();

    naver.maps.Service.reverseGeocode(
      {
        coords: latlng,
        orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(
          ",",
        ),
      },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something Wrong!");
        }

        var items = response.v2.results,
          address = "",
          htmlAddresses = [];

        for (var i = 0, ii = items.length, item, addrType; i < ii; i++) {
          item = items[i];
          address = mapUtil.makeAddress(item) || "";
          addrType = item.name === "roadaddr" ? "[도로명 주소]" : "[지번 주소]";

          htmlAddresses.push(i + 1 + ". " + addrType + " " + address);
        }

        infoWindow.setContent(
          [
            '<div style="padding:10px;min-width:200px;line-height:150%;">',
            '<h4 style="margin-top:5px;">검색 좌표</h4><br />',
            htmlAddresses.join("<br />"),
            "</div>",
          ].join("\n"),
        );

        infoWindow.open(map, latlng);
      },
    );
  },

  // 주소 기반 좌표 검색
  searchAddressToCoordinate: (
    address: any,
    map: naver.maps.Map,
    infoWindow: naver.maps.InfoWindow,
  ) => {
    naver.maps.Service.geocode(
      {
        query: address,
      },
      function (status, response) {
        if (status === naver.maps.Service.Status.ERROR) {
          return alert("Something Wrong!");
        }

        if (response.v2.meta.totalCount === 0) {
          return alert("totalCount" + response.v2.meta.totalCount);
        }

        var htmlAddresses: any = [],
          item = response.v2.addresses[0],
          point = new naver.maps.Point(parseFloat(item.x), parseFloat(item.y));

        infoWindow.setContent(
          [
            '<div style="padding:10px;min-width:200px;line-height:150%;">',
            '<h4 style="margin-top:5px;">검색 주소 : ' + address + "</h4><br />",
            htmlAddresses.join("<br />"),
            "</div>",
          ].join("\n"),
        );

        map.setCenter(point);
        infoWindow.open(map, point);
      },
    );
  },

  // 주소 생성 헬퍼 함수
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

  // 헬퍼 함수들
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
};

export default mapUtil;
