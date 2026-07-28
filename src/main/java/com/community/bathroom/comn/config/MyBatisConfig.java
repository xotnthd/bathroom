package com.community.bathroom.comn.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.sql.DataSource;

/*
 * 작업 경로: src/main/java/com/community/bathroom/comn/config/MyBatisConfig.java
 * 설명: Spring Boot 버전 고도화에 따른 MyBatis 수동 Bean 등록 설정 파일
 */
@Configuration
@MapperScan(basePackages = {
        "com.community.bathroom.comn.**.mapper",
        "com.community.bathroom.admin.**.mapper",
        "com.community.bathroom.user.**.mapper"
}) // 기존 메인 클래스에 있던 어노테이션을 이쪽으로 옮깁니다. (메인에서는 삭제해도 무방)
public class MyBatisConfig {

    @Bean
    public SqlSessionFactory sqlSessionFactory(DataSource dataSource) throws Exception {
        SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
        sessionFactory.setDataSource(dataSource);

        // 핵심: application.yaml을 무시하고, 여기서 강제로 XML 경로를 주입합니다.
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        sessionFactory.setMapperLocations(resolver.getResources("classpath*:mapper/**/*.xml"));

        // 카멜케이스 자동 매핑 설정도 여기서 강제 주입
        org.apache.ibatis.session.Configuration configuration = new org.apache.ibatis.session.Configuration();
        configuration.setMapUnderscoreToCamelCase(true);
        sessionFactory.setConfiguration(configuration);

        return sessionFactory.getObject();
    }
}