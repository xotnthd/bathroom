# 1단계: 빌드 (mvnw로 jar 생성)
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# 2단계: 실행 (JDK 없이 JRE만 - 이미지 용량 절감)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/bathroom-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
