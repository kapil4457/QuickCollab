# Stage 1: Build
FROM openjdk:21-slim AS build
WORKDIR /app

# Install Maven
RUN apt-get update && \
    apt-get install -y maven

# Copy source code and build
COPY . .
RUN mvn clean package

# Stage 2: Run
FROM openjdk:21-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
