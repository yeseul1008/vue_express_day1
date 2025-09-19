# 툰플레이스
![메인화면](https://github.com/yeseul1008/vue_express_day1/blob/main/%EB%A9%94%EC%9D%B8%ED%99%94%EB%A9%B4.PNG)
> 웹툰 통합 별점&리뷰 플랫폼

---


## ❕ 개설 목적
네이버, 카카오, 레진코믹스 등등.. 수십개의 웹툰 플랫폼이 현재 존재하고있습니다. 하지만 모든 플랫폼들을 왔다갔다하며 무엇이 인기많은지, 어떤 리뷰가 달리는지 아는것은 매우 피곤할 것 입니다. 이러한 점을 보완하여 한 곳에 모아 모든 웹툰들에게 리뷰&별점을 달아줄 수 있는 사이트를 개설하였습니다. 

## 🔷 개발 기간
**2025.09.12 ~ 2025.09.18**

## 🔷 주요 기능
- **웹툰 검색** : 제목으로 빠르게 원하는 웹툰을 검색할 수 있습니다.
- **장르 검색** : 장르별로 웹툰을 찾아볼 수 있습니다.
- **평점 정렬** : 별점 순으로 웹툰을 정렬하여 인기 작품을 쉽게 확인할 수 있습니다.
- **리뷰 작성/조회/수정** : 회원은 자신이 본 웹툰에 대한 리뷰를 남기고 수정할 수 있습니다.
- **웹툰 등록** : 새롭게 출간된 웹툰들을 이용자가 쉽게 등록 할 수 있습니다.
- **회원 관리** : 회원가입, 로그인, 정보 수정, 로그아웃 기능을 제공합니다.
- **웹툰 관리** : 등록된 웹툰들의 정보를 수정하는 기능을 제공합니다.
- **마이페이지** : 내가 작성한 리뷰와 정보를 한눈에 확인할 수 있습니다.

## 🛠 사용 기술

| 구분        | 사용 기술 |
|-------------|-----------|
| **Frontend** | Vue.js, jQuery, HTML5, CSS3 |
| **Backend**  | Node.js (Express) |
| **Database** | Oracle |
| **버전 관리** | Git & GitHub |


---


💥 페이지별 주요 기능
### 0. 로그인 & 회원가입
| ![회원가입](https://github.com/yeseul1008/vue_express_day1/blob/main/%EA%B0%9C%EC%9D%B8%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85.PNG) | ![로그인](https://github.com/yeseul1008/vue_express_day1/blob/main/%EA%B0%9C%EC%9D%B8%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EB%A1%9C%EA%B7%B8%EC%9D%B8.PNG) |
|--------------------------|--------------------------|
- 아이디 중복확인기능
- 비밀번호 영어+숫자 포함해야하는 정규식 사용
- 공란 존재하면 안됨
- 위 조건을 모두 만족하면 회원가입버튼 활성화

### 1. 메인화면
![메인화면](https://github.com/yeseul1008/vue_express_day1/blob/main/%EB%A9%94%EC%9D%B8%ED%99%94%EB%A9%B4.PNG)
- 웹툰 리스트
- 장르별 정렬/별점순 정렬
- 웹툰명 검색 기능
- 사용자 닉네임 출력
- 리뷰추가/웹툰추가 버튼 (로그아웃 상태에서 클릭 -> "로그인 후 이용 가능합니다.")

### 2. 웹툰 상세화면
![웹툰상세화면](https://github.com/yeseul1008/vue_express_day1/blob/main/%EC%9B%B9%ED%88%B0%EC%83%81%EC%84%B8%ED%99%94%EB%A9%B4.PNG)
- 웹툰 상세정보(제목, 작가, 장르, 플랫폼, 줄거리, 총 별점)
- 사용자별 리뷰(평가, 별점)
- 리뷰쓰기(바로 해당 웹툰명으로 선택되서 넘어감)
- 페이징 기능

### 3. 리뷰 추가화면
![리뷰추가](https://github.com/yeseul1008/vue_express_day1/blob/main/%EA%B0%9C%EC%9D%B8%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EB%A6%AC%EB%B7%B0%EC%B6%94%EA%B0%80%ED%99%94%EB%A9%B4.PNG)
- 제목 선택가능
- 한줄평
- 0~5 별점 선택 가능
- 공란 발생시 등록 불가

### 4. 웹툰 추가화면
![웹툰추가](https://github.com/yeseul1008/vue_express_day1/blob/main/%EA%B0%9C%EC%9D%B8%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EC%9B%B9%ED%88%B0%EC%B6%94%EA%B0%80%ED%99%94%EB%A9%B4.PNG)
- 웹툰제목 중복검사
- 작가명
- 장르
- 플랫폼
- 줄거리
- 웹툰 표지 첨부(직접 다운로드후 첨부할 필요 없이 url형색으로 첨부)
- 공란 발생시 등록 불가

### 5 - 1. 마이페이지(작성리뷰)
![작성리뷰](https://github.com/yeseul1008/vue_express_day1/blob/main/%EA%B0%9C%EC%9D%B8%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%A6%AC%EB%B7%B0.PNG)
- 작성한 리뷰 한눈에 보기 가능
- 리뷰수정 버튼(리뷰추가화면으로 리뷰 내용과 함께 넘어감)


### 5 - 2. 마이페이지(사용자 정보 수정)
![정보수정](https://github.com/yeseul1008/vue_express_day1/blob/main/%EA%B0%9C%EC%9D%B8%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%A0%95%EB%B3%B4.PNG)
- 아이디 수정 (+ 중복확인)
- 비밀번호 수정
- 닉네임 수정
- 성별 수정

### 6 - 1. 회원관리(관리자 전용)
![회원관리](https://github.com/yeseul1008/vue_express_day1/blob/main/%EA%B0%9C%EC%9D%B8%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80_%ED%9A%8C%EC%9B%90_%EB%A7%88%EC%8A%A4%ED%84%B0.PNG)
- 유저의 전체 정보 수정&삭제 가능

### 6 - 2. 웹툰관리(관리자 전용)
![웹툰관리](https://github.com/yeseul1008/vue_express_day1/blob/main/%EA%B0%9C%EC%9D%B8%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80_%EC%9B%B9%ED%88%B0_%EB%A7%88%EC%8A%A4%ED%84%B0.PNG)
- 웹툰의 정보 수정 가능 (제목명, 작가명, 장르, 플랫폼, 썸네일)
