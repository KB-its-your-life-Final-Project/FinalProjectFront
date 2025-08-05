package com.lighthouse.transactions.controller;

import com.lighthouse.common.geocoding.service.GeoCodingService;
import com.lighthouse.transactions.dto.TransactionRequestDTO;
import com.lighthouse.transactions.dto.TransactionResponseDTO;
import com.lighthouse.transactions.service.TransactionDetailService;
import com.lighthouse.transactions.service.AddressService; // 주소 조회 서비스 추가

import com.lighthouse.transactions.vo.TransactionGraphVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@Slf4j
@RequiredArgsConstructor
public class TransactionDetailController {
    private final TransactionDetailService transactionDetailService;
    private final GeoCodingService geoCodingService;
    private final AddressService addressService; // 주소 조회 서비스

    @PostMapping("/detail")
    public List<TransactionResponseDTO> getFilteredData(@RequestBody TransactionRequestDTO request) {
        log.info("요청 들어옴: {}", request);

        double lat = 0.0;
        double lng = 0.0;

        // 1. DB에서 주소 정보 조회
        String buildingName = request.getBuildingName();
        Map<String, Object> addressInfo = addressService.getAddressByBuildingName(buildingName);
        
        if (addressInfo != null && addressInfo.get("lat") != null && addressInfo.get("lng") != null) {
            // DB에 저장된 주소 정보가 있는 경우
            lat = (Double) addressInfo.get("lat");
            lng = (Double) addressInfo.get("lng");
            log.info("DB에서 조회한 좌표 사용 lat={}, lng={}", lat, lng);
        } else {
            // DB에 없는 경우 네이버 API 호출
            if (request.getJibunAddress() != null && !request.getJibunAddress().isEmpty()) {
                Map<String, Double> coordinates = geoCodingService.getCoordinateFromAddress(request.getJibunAddress());
                lat = coordinates.get("lat");
                lng = coordinates.get("lng");
                log.info("네이버 API 주소 변환 결과 lat={}, lng={}", lat, lng);
                
                // DB에 저장
                addressService.saveAddress(buildingName, request.getJibunAddress(), lat, lng);
            } else if (request.getLat() != null && request.getLng() != null && 
                       request.getLat() != 0.0 && request.getLng() != 0.0) {
                // 프론트에서 좌표를 바로 전달한 경우
                lat = request.getLat();
                lng = request.getLng();
                log.info("프론트 전달 좌표 사용 lat={}, lng={}", lat, lng);
            } else {
                // 모든 정보가 없는 경우 기본값 사용
                log.warn("주소 정보가 없어서 기본 좌표(서울시청)를 사용합니다.");
                lat = 37.5665;
                lng = 126.978;
            }
        }

        return transactionDetailService.getFilteredTransactions(request, lat, lng);
    }
} 