package com.lighthouse.transactions.controller;

import com.lighthouse.common.geocoding.service.GeoCodingService;
import com.lighthouse.transactions.dto.TransactionRequestDTO;
import com.lighthouse.transactions.dto.TransactionResponseDTO;
import com.lighthouse.transactions.service.TransactionDetailService;

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

    @PostMapping("/detail")
    public List<TransactionResponseDTO> getFilteredData(@RequestBody TransactionRequestDTO request) {
        log.info("요청 들어옴: {}", request);

        double lat = 0.0;
        double lng = 0.0;

        if (request.getJibunAddress() != null && !request.getJibunAddress().isEmpty()) {
            Map<String, Double> coordinates = geoCodingService.getCoordinateFromAddress(request.getJibunAddress());
            lat = coordinates.get("lat");
            lng = coordinates.get("lng");
            log.info("주소 변환 결과 lat={}, lng={}", lat, lng);
        } else if (request.getLat() != null && request.getLng() != null && 
                   request.getLat() != 0.0 && request.getLng() != 0.0) {
            // 프론트에서 좌표를 바로 전달한 경우
            lat = request.getLat();
            lng = request.getLng();
            log.info("프론트 전달 좌표 사용 lat={}, lng={}", lat, lng);
        } else {
            // jibunAddress, lat/lng 둘 다 없는 경우 - 기본값 사용
            log.warn("주소 정보가 없어서 기본 좌표(서울시청)를 사용합니다.");
            lat = 37.5665;  // 서울시청 위도
            lng = 126.978;  // 서울시청 경도
        }

        return transactionDetailService.getFilteredTransactions(request, lat, lng);
    }
} 