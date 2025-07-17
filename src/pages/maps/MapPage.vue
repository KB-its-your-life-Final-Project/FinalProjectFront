<script setup lang="ts">
import { ref, onMounted } from "vue";
import $ from "jquery";

import addressApi from "@/api/mapAddressApi";

import type { MapAddressType } from "@/types/mapAddressType"; //temp
const addressData = ref<MapAddressType[]>([
  { umdNm: "홍파동", jibun: 199, aptNm: "경희궁자이 (2단지)" },
  { umdNm: "명륜 2가", jibun: 4, aptNm: "아남1" },
  { umdNm: "평동", jibun: 233, aptNm: "경희궁자이 (3단지)" },
]);

const mapEl = ref<HTMLDivElement | null>(null);
const markers = ref<Array<any>>([]);
let map: any;
let infoWindow: any;

onMounted(() => {
  // 네이버 지도 API 스크립트 로드
  if (!window.naver) {
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=55s76chbvh&submodules=geocoder`;
    script.async = true;
    script.onload = () => {
      setTimeout(() => {
        initMap(mapEl.value);
      }, 300);
    };
    document.head.appendChild(script);
  } else {
    initMap(mapEl.value);
  }
});

//지도 생성하기
function initMap(mapEl: HTMLDivElement | null) {
  if (!mapEl) {
    return;
  }

  map = new naver.maps.Map(mapEl, {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 13,
    zoomControl: true,
    zoomControlOptions: {
      position: naver.maps.Position.LEFT_BOTTOM,
    },
  });

  infoWindow = new naver.maps.InfoWindow({
    content: "", // 필수 속성 추가
    anchorSkew: true,
  });

  // naver.maps.onJSContentLoaded = initGeocoder;
  initGeocoder();
}

//좌표 기반 주소 검색
function searchCoordinateToAddress(latlng: any) {
  infoWindow.close();

  naver.maps.Service.reverseGeocode(
    {
      coords: latlng,
      orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(","),
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
        address = makeAddress(item) || "";
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
}

//주소 기반 좌표 검색
function searchAddressToCoordinate(address: any) {
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
}

function initGeocoder() {
  map.addListener("click", function (e: any) {
    searchCoordinateToAddress(e.coord);
  });

  $("#address").on("keydown", function (e: any) {
    var keyCode = e.which;

    if (keyCode === 13) {
      // Enter Key
      searchAddressToCoordinate($("#address").val());
    }
  });

  $("#submit").on("click", function (e: any) {
    e.preventDefault();
    searchAddressToCoordinate($("#address").val());
  });

  addressData.value.forEach((address) => {
    searchAddressToCoordinate(`${address.umdNm} ${address.jibun} ${address.aptNm}`);
  });

  // searchAddressToCoordinate("명륜 2가 4 102");
}

function makeAddress(item: any) {
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

  if (hasArea(region.area1)) {
    sido = region.area1.name;
  }

  if (hasArea(region.area2)) {
    sigugun = region.area2.name;
  }

  if (hasArea(region.area3)) {
    dongmyun = region.area3.name;
  }

  if (hasArea(region.area4)) {
    ri = region.area4.name;
  }

  if (land) {
    if (hasData(land.number1)) {
      if (hasData(land.type) && land.type === "2") {
        rest += "산";
      }

      rest += land.number1;

      if (hasData(land.number2)) {
        rest += "-" + land.number2;
      }
    }

    if (isRoadAddress === true) {
      if (checkLastString(dongmyun, "면")) {
        ri = land.name;
      } else {
        dongmyun = land.name;
        ri = "";
      }

      if (hasAddition(land.addition0)) {
        rest += " " + land.addition0.value;
      }
    }
  }

  return [sido, sigugun, dongmyun, ri, rest].join(" ");
}

function hasArea(area: any) {
  return !!(area && area.name && area.name !== "");
}

function hasData(data: any) {
  return !!(data && data !== "");
}

function checkLastString(word: any, lastString: any) {
  return new RegExp(lastString + "$").test(word);
}

function hasAddition(addition: any) {
  return !!(addition && addition.value);
}
</script>

<template>
  <!--상위 요소-->
  <div class="relative w-full h-screen">
    <div>asdf</div>
    <!--  지도 표시-->
    <div id="map" ref="mapEl" class="w-full h-full"></div>
  </div>
</template>

<style scoped></style>
