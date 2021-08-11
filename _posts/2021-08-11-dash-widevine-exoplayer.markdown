---
layout: post
title: "[번역] Playing Widevine(DRM) enabled DASH Streams with Exoplayer on Android"
date: 2021-08-11 17:23:56 +0900
categories: DRM
tags: [번역, DRM, ExoPlayer, Widevine]
---

Playing Widevine (DRM) enabled DASH Streams with Exoplayer on Android
===

출처: https://medium.com/@burak.oguz/playing-widevine-drm-enabled-dash-streams-with-exoplayer-on-android-5541d7199ef0


Digital rights management (DRM) 은 일반적으로 온라인에서 독점 하드웨어 또는 저작권 자료에 대한 접근 제어를 생성하는 도구 및 기술 set 입니다. 
Dynamic Adaptive Streaming over HTTP (DASH) 는 contents 를 작은 단위로 나누어 하나의 연속된 흐름으로 만들어 여러 bit rate 지원할수 있는 고품질 streaming 을 HTTP 로 전달하는 Apple 의 HTTP Live Streaming (HLS) 와 비슷한 adaptive streaming 기술입니다.

Exoplayer 는 Android framework 의 MediaPlayer 를 대체할수 있는 유명한 application level 의 video player 이고 Wiidevine 은 가장 널리쓰이는 구글의 digital rights management technology 입니다.
Widevine 은 구글의 Chrome, Firefox Android, Android TV 에서 사용중입니다. 

이 문서에서는 DRM 의 작동방식과 MediaDRM 을 사용하여 Exoplayer 및 Widevine content 를 온라인 및 다운로드 가능한 콘텐츠 사용 사례와 통합하는 방법을 설명하는데 중점을 두겠습니다.

이 문서의 코드 sample 은 Exoplayer 및 종속성 주입에 대한 지식이 필요합니다.
또, 라이센스 및 content server 설정의 복잡성 때문에, 전체 예제가 아닙니다.


DRM Workflow and License 
---
Widevine streaming 에는 네가지 주요 요소가 있습니다.:
- Content 를 재생하려는 Client
- Client 의 요청 parameter 기반한 복호화키 생성 lisence server
- 장치 고유 자격 증명을 배포해야 하는 경우 Provisioning(요구에 대해 미리 준비해서 즉시 제공하는) server
- 암호화된 content 를 제공하는 Content server

클라이언트가 제공된 DrmSessionManager와 함께 DashMediaSource를 통해 콘텐츠 서버에서 보호된 콘텐츠를 재생하려고 하면 클라이언트는 MediaDrmCallback을 통해 DRM 라이선스 요청을 자동으로 시작합니다. 
그 동안 장치에 프로비저닝이 필요한 경우 콜백을 통해 프로비저닝 서버에 대한 요청이 수행됩니다. 

MediaDRM 클라이언트가 라이선스를 받은 후 미디어 소스를 통해 Exoplayer에 전달하고 미디어 재생이 시작됩니다. 

비영구 라이선스의 경우 미디어 재생 요청이 있을 때마다 이 절차가 반복됩니다. 
영구 라이선스의 경우 애플리케이션은 영구 라이선스를 저장할 수 있으며 만료될 때까지 라이선스를 재사용할 수 있습니다. 

또한 영구 라이선스 요청의 경우 비디오 초기화가 콜백의 성공적인 라이선스 가져오기 작업에 의존하지 않도록 비디오 재생이 OfflineLicenseHelper로 시작되기 전에 라이선스를 가져올 수 있습니다. 
이제 우리는 이러한 클래스가 어떻게 활용될 것인지 자세히 설명할 것입니다.

Playing DASH content in Exoplayer
---
제품 및 시스템 요구 사항에 따라 라이선스 교환을 매우 다양한 방식으로 관리하는 비즈니스 로직을 구현할 수 있습니다. 그러나 라이센스 교환을 수행하는 가장 기본적인 방법은 HttpMediaDrmCallback을 사용하는 것입니다. 

이 방법은 라이선스 서버에서 라이선스 교환 요청에 대한 사용자 지정 처리가 필요하지 않은 경우 사용할 수 있습니다. 
아래에서 볼 수 있듯이 HttpMediaDrmCallback을 사용하여 DefaultDrmSessionManager로 DashMediaSource를 빌드하는 것은 매우 간단합니다. 
예에서 플레이어가 DashMediaSource를 로드할 때 재생에 라이선스가 필요한 암호화된 콘텐츠를 발견하면 DefaultDrmSessionManager에 라이선스 제공을 요청하고 DefaultDrmSessionManager는 HttpMediaDrmCallback을 사용하여 제공된 라이선스 URL에서 라이선스를 가져옵니다. 
null 라이선스 데이터로 setMode를 호출하면 라이선스 요청이 있을 때 DefaultDrmSessionManager가 HttpMediaDrmCallback을 사용하도록 강제합니다. 
setMode에 라이선스가 제공되면 DefaultDrmSessionManager가 먼저 라이선스를 사용하려고 시도하고 라이선스가 콘텐츠를 성공적으로 해독하지 못하면 제공된 MediaDrmCallback을 사용하여 새 라이선스를 가져오려고 다시 시도합니다.

```
@Singleton
internal class FooDownloader @Inject constructor(private val customHttpDrmMediaCallback: CustomHttpDrmMediaCallback) {
    fun download(context: Context, downloadUrl: Uri) {
        val sessionManager = DefaultDrmSessionManager.Builder().build(customHttpDrmMediaCallback)
        sessionManager.setMode(DefaultDrmSessionManager.MODE_DOWNLOAD, null)
        DownloadHelper.forMediaItem(
            MediaItem.fromUri(downloadUrl),
            DefaultTrackSelector.Parameters.getDefaults(context),
            DefaultRenderersFactory(context),
            DefaultHttpDataSourceFactory("userAgent"),
            sessionManager)
    }
}
```

Custom MediaDrmCallback
---
물론 위의 예가 기능적으로 완전한 것은 아닙니다. 
대부분의 경우 라이선스 서버에는 라이선스 교환 요청 대상 미디어에 기반한 인증 토큰 또는 기타 정보가 필요합니다. 이를 달성하기 위해 내장 HttpMediaDrmCallback을 사용하거나 사용자 정의 MediaDrmCallback을 구현할 수 있습니다. 
HttpMediaDrmCallback을 사용하여 사용자 정의 MediaDrmCallback을 빌드하는 것도 가능합니다. 
아래 콜백에서 executeKeyRequest 및 executeProvisioningRequest 메서드는 백그라운드 스레드에서 실행됩니다. 
이를 통해 스레드 전환 없이 네트워크 호출 또는 데이터베이스/파일 IO 액세스와 관련된 추가 비즈니스 로직을 수행할 수 있습니다. 아래에서 볼 수 있듯이 executeKeyRequest가 완료되면 원격 API에서 인증 토큰을 가져오고 업데이트된 라이선스 URL로 키 요청을 실행합니다. 
동일한 흐름이 executeProvisioningRequest에도 적용됩니다.

```
@Singleton
internal class CustomHttpDrmMediaCallback @Inject constructor(@Named(“drm”) private val factory:OkHttpDataSourceFactory, private val apiClient: VideoApiClient) : MediaDrmCallback {
    companion object {
        private const val defaultLicenseUrl = “https://license.url/server/fetch-license"
    }
    private val httpMediaDrmCallback = HttpMediaDrmCallback(defaultLicenseUrl, false, factory)
    
    override fun executeKeyRequest(uuid: UUID, request: ExoMediaDrm.KeyRequest): ByteArray {
        val authenticationToken = apiClient.getLicenseAuthenticationToken()
        val licenseUrl = Uri.parse(defaultLicenseUrl)
            .buildUpon()
            .appendQueryParameter(“token”, authenticationToken)
            .build()
            .toString()
        val updatedRequest = ExoMediaDrm.KeyRequest(request.data, licenseUrl)
        return httpMediaDrmCallback.executeKeyRequest(uuid, updatedRequest)
    }
    
    override fun executeProvisionRequest(uuid: UUID, request: ExoMediaDrm.ProvisionRequest): ByteArray {
        val authenticationToken = apiClient.getLicenseAuthenticationToken()
        val licenseUrl = Uri.parse(defaultLicenseUrl)
            .buildUpon()
            .appendQueryParameter(“token”, authenticationToken)
            .build()
            .toString()
        val updatedRequest = ExoMediaDrm.ProvisionRequest(request.data, drmLicenseUrl)
        return httpMediaDrmCallback.executeProvisionRequest(uuid, updatedRequest)
    }
}
```
Utilizing Offline Licenses
---
지금까지 다룬 사례에서 애플리케이션은 재생 시 라이선스 교환 작업을 위해 온라인 액세스가 필요했습니다. 제품 및 시스템 요구 사항에 따라 비디오 재생 전에 라이선스를 가져와 나중에 사용할 수 있도록 캐시할 수 있습니다. 이것은 또한 비디오 재생 시작 시간에 긍정적인 영향을 미칩니다. DrmSessionManager 또는 MediaDrmCallback 없이 라이선스를 가져오기 위해 라이선스 교환 작업을 실행하는 사용자 지정 클라이언트를 구축할 수 있습니다. 그러나 이 프로세스를 신속하게 처리하기 위해 OfflineLicenseHelper라는 클래스가 이미 있습니다. 아래 그림과 같이 주어진 DRM 라이선스 가져오기 URL과 동영상 경로 URI를 사용하여 먼저 Wideview 라이선스 다운로드를 지원하는 새 인스턴스를 생성해야 하며 그런 다음 downloadLicense 메서드로 라이선스를 다운로드하고 getLicenseDurationRemainingSec으로 만료 날짜를 추출할 수 있습니다.

```
@Singleton
internal class OfflineRemoteLicenseFetcher @Inject constructor(
@Named(“drm”) private val okHttpDataSourceFactory: OkHttpDataSourceFactory,
) {
    fun downloadLicense(drmLicenseUrl: String, videoPath: Uri): Pair<ByteArray?, Long>? {
        val offlineLicenseHelper = OfflineLicenseHelper.newWidevineInstance(drmLicenseUrl,
        okHttpDataSourceFactory, DrmSessionEventListener.EventDispatcher())
        val dataSource = okHttpDataSourceFactory.createDataSource()
        val dashManifest = DashUtil.loadManifest(dataSource, videoPath)
        val drmInitData = DashUtil.loadFormatWithDrmInitData(dataSource, dashManifest.getPeriod(0))
        val licenseData = drmInitData?.let {
            offlineLicenseHelper.downloadLicense(it)
        }
        val licenseExpiration = if (licenseData != null) {
            System.currentTimeMillis() + (offlineLicenseHelper.getLicenseDurationRemainingSec(licenseData).first * 1000)
        } else {
            0
        }
        return Pair(licenseData, licenseExpiration)
    }
}
```
라이선스를 가져오면 캐싱이 가능합니다. 다음에 해당 콘텐츠에 접근할 때 캐싱된 라이선스를 아래의 setMode 메소드를 통해 DrmSessionManager에 제공할 수 있습니다. 위에서 언급했듯이 캐시된 라이선스 데이터가 무효화되면 DrmSessionManager는 MediaDrmCallback을 사용하여 새 라이선스를 가져옵니다.
sessionManager.setMode(DefaultDrmSessionManager.MODE_PLAYBACK, licenseData)

Handling Errors
---
추가된 작업 계층으로 인해 추가된 수의 오류 사례가 발생할 수 있으며 이러한 오류를 적절하게 처리해야 한다는 점을 명심하는 것이 중요합니다. DRM 라이선스 관련 재생 오류는 Exoplayer의 Player.EventListener.onPlayerError 메서드에서 끝납니다. MediaCodec.CryptoException 및 DrmSession.DrmSessionException은 플레이어 흐름에서 처리해야 하는 일반적인 예외입니다. 또한 사용자 정의 DrmSessionManager를 구현하는 것이 선호되는 경우 DrmSessionEventListener에 대한 이벤트 핸들러를 등록하고 onDrmSessionManagerError에서 오류를 처리해야 합니다.

Utilizing DrmSessionManager with Exoplayer DownloadHelper
---
Exoplayer가 제공하는 또 다른 중요한 기능은 적응형 스트림을 클라이언트에 다운로드할 수 있다는 것입니다. Exoplayer는 HLS 및 DASH 스트림 다운로드를 모두 지원합니다. DownloadHelper에는 기본 인터페이스가 있지만 특히 DRM 지원 DASH 콘텐츠를 다운로드하는 동안 제품 및 시스템 요구 사항과 통합하는 것이 복잡해질 수 있습니다. DrmSessionManager가 DownloadHelper.forMediaItem 메소드에 제공되어야 함을 명심하세요

```
@Singleton
internal class DashDownloader @Inject constructor(
private val customHttpDrmMediaCallback: CustomHttpDrmMediaCallback
) {
    fun download(context: Context, downloadUrl: Uri) {
        val sessionManager = DefaultDrmSessionManager.Builder().build(customHttpDrmMediaCallback)
        sessionManager.setMode(DefaultDrmSessionManager.MODE_DOWNLOAD, null)
        DownloadHelper.forMediaItem(
            MediaItem.fromUri(downloadUrl),
            DefaultTrackSelector.Parameters.getDefaults(context),
            DefaultRenderersFactory(context),
            DefaultHttpDataSourceFactory(“userAgent”),
            sessionManager)
    }
}
```
다운로드한 DRM 콘텐츠와 관련하여 기억해야 할 또 다른 중요한 사항은 사용자가 연결되어 있지 않을 때 암호화된 콘텐츠를 재생할 수 있도록 라이선스 데이터를 캐시하는 것입니다. 
마지막으로, 라이선스 만료 요구 사항에 따라 사용자가 연결할 때마다 오프라인 라이선스를 새로 고치도록 WorkManager를 통해 주기적 작업자를 설정하는 것을 잊지 마세요.