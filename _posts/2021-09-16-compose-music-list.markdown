---
layout: post
title:  "Music List with android compose"
date:   2021-09-16 23:17:00 +0900
categories: android compose
tags: [android, compose, list, music]
---

Android Compose 첫인상을 보면 React 와 느낌이 비슷하다.<br>
기존 Android UI 구성과 비교해보면, xml 을 따로 작성하지 않고<br>
단순하게 구현할수 있어서 boilerplate 를 확실히 줄이수 있었다.
<br>

우선 Android device 에 저장된 음악 파일들을 불러와 볼까?

```kotlin
  ContentResolverCompat.query(
                    getApplication<Application>().contentResolver,
                    MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                    arrayOf(
                        MediaStore.Audio.Media._ID,
                        MediaStore.Audio.Media.TITLE,
                        MediaStore.Audio.Media.ARTIST,
                        MediaStore.Audio.Media.ALBUM_ID
                    ),
                    null, null, null, null
                )?.use { c ->
                    val idColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
                    val titleColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
                    val artistColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
                    val albumIdColumn = c.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM_ID)

                    Log.d("music", "size: ${c.count}")
                    val songs = mutableListOf<Song>()
                    while (c.moveToNext()) {
                        songs += Song(
                            c.getLong(idColumn),
                            c.getString(titleColumn),
                            c.getString(artistColumn),
                            c.getLong(albumIdColumn)
                        )
                    }
                    songs[0].thumbnailUri
                    _songs.value = songs
                }
```

Data class 인 Song 은 아래와 같다<br>
uri 를 매번 생성하는건 최적화 덕후에겐 맘에 들지 않으니 lazy 로 선언해 준다

```
data class Song(val id: Long, val title: String, val artist: String, val albumId: Long) {
    val uri by lazy { ContentUris.withAppendedId(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, id) }
    val thumbnailUri by lazy { ContentUris.withAppendedId(albumArtBaseUri, albumId) }

    companion object {
        // 신기하게도 안드로이드는 album art 를 불러오는 방법을 왜 상수로 만들지 않았을까?
        private val albumArtBaseUri = Uri.parse("content://media/external/audio/albumart")
    }
}
```

그리도 다음은 album art 를 불러와 봐야지?<br>
여기서는 외부 lib 의 힘을 빌려 온다. 

COIL 이라고... 첫인상은 좋다.<br>
Glide 를 사용할때 Kotlin coroutine 과 궁합이 맞지 않아 답답했었는데,<br>
COIL 자체가 Kotlin Coroutine Image Loader 를 표방하고 있기 때문에 맘에 든다.

```
   Image(
            // COIL 의 힘을 빌어서 thumbnailUri 를 넘겨주고 albumart 를 불러오길 기대한다.
            rememberImagePainter(song.thumbnailUri, builder = {
                // cross fade 효과를 주고, 못불러 오거나 불러 오기 전에는 default image 를 설정할수 있도록 해본다
                crossfade(true)
                fallback(R.drawable.ic_launcher_foreground)
                placeholder(R.drawable.ic_launcher_foreground)
                error(R.drawable.ic_launcher_foreground)
            }),
            "Album image",
            Modifier
                .size(48.dp)
                .padding(5.dp)
                .clip(CircleShape)
        )
```

simple 한 song list 는 구성해 봤다.<br>
다음은 재생?