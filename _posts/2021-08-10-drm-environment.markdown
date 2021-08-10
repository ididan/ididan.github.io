---
layout: post
title: "요즘 DRM 에서 CDM 을 알아보자"
date: 2021-08-10 17:23:56 +0900
categories: DRM
tags: [DRM, CDM]
---

# CDM(Content Decryption Module) 혹은 EME(Encrypted Media Extentions)

CDM 종류
- Widevine(구글): 크롬, 파이어폭스, 안드로이드
- Playready(MS): 윈도우즈, Explorer, Xbox
- Fairplay(애플): mac, iPhone, iPad

상황이 이러다 보니 CP 에서는 구글, MS, 애플 기기에도 모두 지원하기 위해<br>
보통 one source multi use 정책에 따라 multi drm 을 지원하고 있다.<br>
(그리고 PallyCon 같은 이런 packaging 을 전문으로 하는 업체도 생겨난것 같다)

- azure
https://docs.microsoft.com/ko-kr/azure/media-services/previous/media-services-protect-with-playready-widevine
- aws https://docs.aws.amazon.com/speke/latest/documentation/customer-onboarding.html
- google cloud https://cloud.google.com/transcoder/docs/how-to/configure-drm?hl=ko

보통 안드로이드의 경우 Widevine 을 hw layer 에서 지원하고 있고,<br>
Playready 의 경우 별도 지원 SOC 가 없으면 App 에 직접 적용해야 하며<br>
이 경우 보안 강도는 HW 에 비해 낮아진다

아래 Playready 의 경우 각 case 별 그림이다

<image src="https://docs.microsoft.com/en-us/playready/images/client_level_app_os_soc.png">

CDM 이 삼국지로 나뉘다보니 "CMAF"(Common Media Application Format) 라는<br>
새로운 표준으로 "멀티 DRM 콘텐츠 단일화" 가 추진되고 MPEG 에 의해 2018년 1월 정식으로 발표된다

CMAF 에는 "fMP4"(Fragmented MP4) 컨테이너 포맷이 사용되어<br>
DASH(2015), HLS(2016) 양쪽 모두 단일 컨테이너 적용이 가능해 졌다
<p>
references<br>
- <a href=https://ko.wikipedia.org/wiki/CDM_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99)>https://ko.wikipedia.org/wiki/CDM_(%EC%BB%B4%ED%93%A8%ED%84%B0_%EA%B3%BC%ED%95%99)</a><br>


[https://www.widevine.com](https://www.widevine.com/).


- <https://www.microsoft.com/playready/features/EnhancedContentProtection.aspx>
- https://docs.microsoft.com/en-us/playready/overview/security-level
- https://docs.microsoft.com/en-us/playready/overview/clients
-https://ko.wikipedia.org/wiki/%ED%8E%98%EC%96%B4%ED%94%8C%EB%A0%88%EC%9D%B4_(%EC%95%A0%ED%94%8C)
- https://daniel-inka.medium.com/%EB%A9%80%ED%8B%B0-drm-%EA%B5%AC%EC%84%B1-%EC%9A%94%EC%86%8C%EC%9D%98-%EC%9D%B4%ED%95%B4-4%EB%B6%80-drm-%ED%8C%A8%ED%82%A4%EC%A7%95%EA%B3%BC-cpix-speke-api-dfdb8b603ff8
- https://pallycon.tistory.com/entry/%EB%84%B7%ED%94%8C%EB%A6%AD%EC%8A%A4%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EC%BD%98%ED%85%90%EC%B8%A0%EB%A5%BC-%EB%B3%B4%ED%98%B8%ED%95%98%EB%8A%94%EA%B0%80-%EC%A0%9C1%EB%B6%80
- https://daniel-inka.medium.com/saas-drm-%EB%9D%BC%EC%9D%B4%EC%84%A0%EC%8A%A4-%EB%B9%84%EC%9A%A9%EC%97%90-%EB%8C%80%ED%95%9C-%EC%9D%B4%ED%95%B4-2120d83fbf48
- https://pallycon.com/ko/blog/%eb%a9%80%ed%8b%b0-drm-%ec%bd%98%ed%85%90%ec%b8%a0-cmaf%ec%9c%bc%eb%a1%9c-%eb%8b%a8%ec%9d%bc%ed%99%94%ed%95%a0-%ec%88%98-%ec%9e%88%ec%9d%84%ea%b9%8c
</p>

용어
- TEE(Trusted Exucution Environment)
- TZ(Trusted Zone)