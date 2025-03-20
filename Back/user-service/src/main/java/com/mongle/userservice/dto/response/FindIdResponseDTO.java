package com.mongle.userservice.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
public class FindIdResponseDTO {

    private String id;
    // 아이디를 마스킹하여 반환하는 메서드 추가
    public String getId() {
        if (id.length() > 3) {
            return id.substring(0, id.length() - 3) + "***"; // 뒷자리 3개 마스킹
        }
        return "***";
    }
}
