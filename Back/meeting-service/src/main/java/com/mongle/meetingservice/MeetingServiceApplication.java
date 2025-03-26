package com.mongle.meetingservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class MeetingServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MeetingServiceApplication.class, args);
    }

}
