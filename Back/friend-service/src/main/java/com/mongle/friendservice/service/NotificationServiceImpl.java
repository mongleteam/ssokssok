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

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
        String eventId = userPk + "-" + System.currentTimeMillis();
        SseEmitter emitter = new SseEmitter(DEFAULT_TIMEOUT);
        emitters.put(eventId, emitter);

        emitter.onCompletion(() -> emitters.remove(eventId));
        emitter.onTimeout(() -> emitters.remove(eventId));

        return emitter;
    }
    @Override
    public void createNotification(String userPk, String friendId, boolean isMulti) {
        Long timestamp = System.currentTimeMillis();

        // MySQL에 저장 (friend 상태)
        if (!isMulti) {
            Notification notification = new Notification();
            notification.setUserPk(userPk);
            notification.setFriendId(friendId);
            notificationMapper.insert(notification);
        }

        // Redis에 저장 (multi 상태)
        if (isMulti) {
            try {
                NotificationListResponseDTO redisNotification = new NotificationListResponseDTO("multi", friendId, timestamp);
                String json = objectMapper.writeValueAsString(redisNotification);
                String friendPk = userServiceClient.getUUID(friendId);
                String userId = userServiceClient.getId(userPk);
                redisTemplate.opsForValue().set(REDIS_NOTIFICATION_PREFIX + friendPk + ":" + userId, json);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // SSE를 통해 클라이언트에게 실시간 알림 전송
        sendNotification(userPk);
    }

    @Override
    public void sendNotification(String userPk) {
        SseEmitter emitter = emitters.get(userPk);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event().name("notification").data("새로운 알림이 도착했습니다!"));
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
            friendNotifications.add(NotificationListResponseDTO.fromMySQL(dto.getFriendId(), dto.getTimestamp()));
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
                            notifications.add(NotificationListResponseDTO.fromRedis(redisData.getFriendId(), redisData.getTimestamp()));
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Redis 알림 데이터 파싱 실패: " + e.getMessage());
                }
            }
        }
        return notifications;
    }


    @Getter
    @Setter
    private static class RedisNotificationData {
        private String friendId;
        private Long timestamp;
    }



}
