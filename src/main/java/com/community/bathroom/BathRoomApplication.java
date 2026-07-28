package com.community.bathroom;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
//@MapperScan("com.community.bathroom.**.mapper")
@MapperScan(basePackages = {
        "com.community.bathroom.admin.**.mapper",
        "com.community.bathroom.comn.**.mapper",
        "com.community.bathroom.user.**.mapper"
})
public class BathRoomApplication {

    public static void main(String[] args) {
        SpringApplication.run(BathRoomApplication.class, args);
    }

}
