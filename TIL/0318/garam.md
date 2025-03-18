## KPT

### Keep

- apigateway-service에 해당하는 spring cloud 서버 생성 및 설정 
- service-discovery에 해당하는 eureka 서버 생성 및 등록 완료
- user-service 프로젝트 새로 생성해서 gitlab 브랜치에 옮기는 중
- MSA 레퍼런스 보면서 무작정 해보니까 그래도 감은 잡힘

### Problem

- 서비스간의 통신은 어떤식으로 해야할지 더 찾아봐야할듯 restApi 방식과 message큐 방식 둘 다 사용해야 할 수도 있음
- apigateway에서 먼저 클라이언트의 request를 받기 때문에 api 명세서에 있는 uri 수정 필요함

### Try

- 내일 user-service에 해당하는 api uri 수정하기 

- 서비스간의 통신 어떤 식으로 하는지 찾아보고 테스트 해보기

