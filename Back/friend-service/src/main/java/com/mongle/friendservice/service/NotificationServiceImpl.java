package com.mongle.friendservice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongle.friendservice.client.UserServiceClient;

import com.mongle.friendservice.dto.request.FriendRequestDTO;

import com.mongle.friendservice.dto.response.NotificationListResponseDTO;
import com.mongle.friendservice.entity.Notification;
import com.mongle.friendservice.exception.CustomException;
import com.mongle.friendservice.exception.ErroCode;
import com.mongle.friendservice.mapper.NotificationMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    private final RedisTemplate<String, String> redisTemplate;
    private final NotificationMapper notificationMapper;
    private final ObjectMapper objectMapper;

    private final Map<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    private static final String REDIS_NOTIFICATION_PREFIX = "notification:";
    private static final Long DEFAULT_TIMEOUT = 60000L;
    private final UserServiceClient userServiceClient;

    public SseEmitter connect(String userPk, String lastEventId) {
        // 중복 연결 방지 하기 위해서 이전 emitter 제거
        if (emitters.containsKey(userPk)) {
            emitters.remove(userPk);
        }
        // 1. userPk를 키로 사용하여 emitter 저장
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.put(userPk, emitter);

        // 2. 연결 종료나 타임아웃 시 userPk 키로 제거
        emitter.onCompletion(() -> emitters.remove(userPk));
        emitter.onTimeout(() -> emitters.remove(userPk));
        emitter.onError((e) -> emitters.remove(userPk));

        // 3. 연결 직후 "연결 성공" 이벤트(heartbeat) 전송 – 프론트에서 JSON 파싱 가능하도록 JSON 형식으로 보내기
        try {
            Map<String, Object> initData = new HashMap<>();
            initData.put("message", "connected");
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data(initData));
        } catch (IOException e) {
            emitters.remove(userPk);
        }

        return emitter;
    }

    @Override
    public String createNotification(String userPk, String friendId, boolean isMulti) {
        Long timestamp = System.currentTimeMillis();
        String friendPk = userServiceClient.getUUID(friendId);
        String userId = userServiceClient.getId(userPk);
        String roomId = generateRandomId(friendId);

        // MySQL에 저장 (friend 상태)
        if (!isMulti) {
            Notification notification = new Notification();
            notification.setUserPk(friendPk);
            notification.setFriendId(userId);
            notificationMapper.insert(notification);
        }

        // Redis에 저장 (multi 상태)
        if (isMulti) {
            try {
                NotificationListResponseDTO redisNotification = new NotificationListResponseDTO("multi", friendId, timestamp, roomId);
                String json = objectMapper.writeValueAsString(redisNotification);

                redisTemplate.opsForValue().set(REDIS_NOTIFICATION_PREFIX + friendPk + ":" + userId, json);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // SSE를 통해 클라이언트에게 실시간 알림 전송
        sendNotification(friendPk);

        return roomId;
    }

    @Override
    public void sendNotification(String userPk) {
        SseEmitter emitter = emitters.get(userPk);
        if (emitter != null) {
            try {
                Map<String, String> payload = new HashMap<>();
                payload.put("message", "새로운 알림이 도착했습니다!");
                emitter.send(SseEmitter.event().name("notification").data(payload));
            } catch (IOException e) {
                emitters.remove(userPk);
            }
        }
    }

    @Override
    public void deleteMultiNotification(String userPk, FriendRequestDTO friendRequestDTO) {
        String friendId = friendRequestDTO.getFriendId();


        // Redis 키 생성
        String redisKey = REDIS_NOTIFICATION_PREFIX + userPk + ":" + friendId;

        // 삭제 시도
        Boolean result = redisTemplate.delete(redisKey);

        if (Boolean.FALSE.equals(result)) {
            throw new CustomException(ErroCode.NOTIFICATION_NOT_FOUND);
        }
    }




    @Override
    public List<NotificationListResponseDTO> getNotifications(String userPk) {
        List<NotificationListResponseDTO> mysqlNotifications = notificationMapper.findNotificationsByUserId(userPk);
        List<NotificationListResponseDTO> redisNotifications = findNotificationsByUserId(userPk);

        List<NotificationListResponseDTO> friendNotifications = new ArrayList<>();
        for (NotificationListResponseDTO dto : mysqlNotifications) {
            friendNotifications.add(NotificationListResponseDTO.fromMySQL(dto.getFriendId(), dto.getTimestamp(), dto.getRoomId()));
        }

        // 병합 후 최신순 정렬
        List<NotificationListResponseDTO> allNotifications = new ArrayList<>();
        allNotifications.addAll(friendNotifications); // MySQL에서 가져온 `friend` 알림
        allNotifications.addAll(redisNotifications); // Redis에서 가져온 `multi` 알림

        allNotifications.sort((a, b) -> Long.compare(b.getTimestamp(), a.getTimestamp()));

        return allNotifications;
    }

    public List<NotificationListResponseDTO> findNotificationsByUserId(String userPk) {
        Set<String> keys = redisTemplate.keys(REDIS_NOTIFICATION_PREFIX + userPk + "*");
        List<NotificationListResponseDTO> notifications = new ArrayList<>();

        if (keys != null) {
            for (String key : keys) {
                String json = redisTemplate.opsForValue().get(key);
                try {
                    if (json != null) {
                        RedisNotificationData redisData = objectMapper.readValue(json, RedisNotificationData.class);
                        if (redisData.getFriendId() != null && redisData.getTimestamp() != null) {
                            notifications.add(NotificationListResponseDTO.fromRedis(redisData.getFriendId(), redisData.getTimestamp(), redisData.getRoomId()));
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Redis 알림 데이터 파싱 실패: " + e.getMessage());
                }
            }
        }
        return notifications;
    }

    public static String generateRandomId(String friendId) {
        return friendId + "-" + UUID.randomUUID().toString().substring(0, 8);
    }


    @Getter
    @Setter
    private static class RedisNotificationData {
        private String friendId;
        private Long timestamp;
        private String roomId;
    }

    @Scheduled(fixedRate = 20000)
    public void sendHeartbeatToAll() {
        for (Map.Entry<String, SseEmitter> entry : emitters.entrySet()) {
            String userPk = entry.getKey();
            SseEmitter emitter = entry.getValue();
            try {
                emitter.send(SseEmitter.event().name("heartbeat").data("ping"));
                System.out.println("💓 heartbeat sent to user: " + userPk);
            } catch (IOException e) {
                System.err.println("💔 failed to send heartbeat to user: " + userPk);
                emitters.remove(userPk);
            }
        }
    }



}
