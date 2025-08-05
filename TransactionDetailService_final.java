package com.lighthouse.transactions.service;

import com.lighthouse.transactions.dto.TransactionRequestDTO;
import com.lighthouse.transactions.dto.TransactionResponseDTO;
import com.lighthouse.transactions.mapper.TransactionDetailMapper;
import com.lighthouse.transactions.vo.TransactionGraphVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@RequiredArgsConstructor
@Service
public class TransactionDetailService {
    private final TransactionDetailMapper transactionDetailMapper;

    /**
     * lat/lng으로 buildingName 조회 (오차보정)
     */
    public String findBuildingNameByLatLng(double lat, double lng) {
        try {
            return transactionDetailMapper.findBuildingNameByLatLng(lat, lng);
        } catch (Exception e) {
            log.error("buildingName 조회 실패: lat={}, lng={}", lat, lng, e);
            return null;
        }
    }

    /**
     * buildingName 기준으로 거래 데이터 조회
     */
    public List<TransactionResponseDTO> getFilteredTransactionsByBuildingName(TransactionRequestDTO request, String buildingName) {
        // 날짜 기본값 설정
        if (request.getStartDate() == null || request.getEndDate() == null) {
            LocalDate now = LocalDate.now();
            request.setEndDate(now.toString());
            request.setStartDate(now.minusYears(1).toString());
        }

        List<TransactionGraphVO> rawList = transactionDetailMapper.findDateByBuildingName(
            buildingName,
            request.getTradeType(),
            request.getStartDate(),
            request.getEndDate()
        );

        return convertToResponseDTO(rawList);
    }

    /**
     * lat/lng 기준으로 거래 데이터 조회
     */
    public List<TransactionResponseDTO> getFilteredTransactionsByLatLng(TransactionRequestDTO request, double lat, double lng) {
        // 날짜 기본값 설정
        if (request.getStartDate() == null || request.getEndDate() == null) {
            LocalDate now = LocalDate.now();
            request.setEndDate(now.toString());
            request.setStartDate(now.minusYears(1).toString());
        }

        List<TransactionGraphVO> rawList = transactionDetailMapper.findDateByLatLng(
            lat,
            lng,
            request.getTradeType(),
            request.getStartDate(),
            request.getEndDate()
        );

        return convertToResponseDTO(rawList);
    }

    /**
     * VO를 DTO로 변환
     */
    private List<TransactionResponseDTO> convertToResponseDTO(List<TransactionGraphVO> rawList) {
        return rawList.stream()
            .map(vo -> {
                String date = String.format("%04d-%02d-%02d", vo.getDealYear(), vo.getDealMonth(), vo.getDealDay());
                String type = vo.getTradeType() == 1 ? "매매" : "전월세";
                int price = (vo.getTradeType() == 1)
                    ? vo.getDealAmount()
                    : (vo.getDeposit() != null ? vo.getDeposit() : 0);

                return TransactionResponseDTO.builder()
                    .date(date)
                    .type(type)
                    .price(price)
                    .build();
            })
            .collect(Collectors.toList());
    }
} 