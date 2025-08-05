package com.lighthouse.transactions.service;

import com.lighthouse.transactions.mapper.AddressMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;

@RequiredArgsConstructor
@Service
public class AddressService {
    private final AddressMapper addressMapper;

    /**
     * 건물명으로 주소 정보 조회
     */
    public Map<String, Object> getAddressByBuildingName(String buildingName) {
        try {
            return addressMapper.findAddressByBuildingName(buildingName);
        } catch (Exception e) {
            // DB 조회 실패 시 null 반환
            return null;
        }
    }

    /**
     * 주소 정보 저장
     */
    public void saveAddress(String buildingName, String jibunAddress, double lat, double lng) {
        try {
            addressMapper.saveAddress(buildingName, jibunAddress, lat, lng);
        } catch (Exception e) {
            // 저장 실패 시 로그만 출력
            System.err.println("주소 정보 저장 실패: " + e.getMessage());
        }
    }
} 