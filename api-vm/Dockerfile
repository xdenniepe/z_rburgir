FROM --platform=linux/amd64 openjdk:17-jdk-alpine3.13
COPY target/*.jar vm.jar
ENTRYPOINT ["java","-jar", "/vm.jar"]
EXPOSE 8085