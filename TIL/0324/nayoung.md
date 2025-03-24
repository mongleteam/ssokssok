# 2025.03.24(월) s3 싱글모드 story.json 파일 업로드(스토리 진행 가이드)

### KPT 작성

#### `Keep` : 현재 만족하고 있는 부분, 계속 이어갔으면 하는 부분

- Team 🔥

#### `Problem` : 불편하게 느끼는 부분, 개선이 필요하다고 생각되는 부분

- 지금 하려는 방식이 싱글에서도 멀티에서도 사용하기 편하게 하기 위해 짰긴 짰는데 맞나 모르겠다...

- 로그인 정보가 있어야 이어보기 이런게 될거같은데 없이 개발해도 괜찮으려나.... 뭘 우선순위로 둬야할지...몰라무새무새..

#### `Try` : problem에 대한 해결책, 다음 회고 때 판별 가능한 것, 당장 실행 가능한 것

- 일단 s3에 싱글모드일때 사용할 story.json 파일 사용하여 스토리 가이드라인 업로드해서 이 방식이 맞으면 멀티모드에서도 사용하기 편할듯..?

- s3에서 어떤식으로 압축파일 받아와서 활용하는지에 대해 대충 흐름 파악잡았음..

- 이거만 된다하면 이제 기능 개발에 집중 가능할듯... 막막했는데 대충 이렇게 하면될거같은 느낌이 들었따.. 맞겠지..?


---

### 이야기 전개 방식 

1. 사용자가 로그인한 상태로 동화 시작하면

    - s3 zip 파일 다운로드(캐시 없을 경우만)

    - story.json 파일 로딩

    - 동화 진행 상태(ex.nowpage)를 서버에 주기적으로 저장

2. 중간에 나갔거나, 다른 기기에서 로그인을 해도

    - 서버에서 저장된 nowpage를 불러옴

    - 캐시 없으면 zip 파일 재다운로드 -> 압축해제

    - story.json + nowpage기준으로 이어 읽기 시작!


#### 지금 현재 싱글모드 story.json 파일에 대략 

```json
[
    {  
        "id": "page1",
        "image": "page1_illustration.png",
        "hintImage": null,
        "interactionImages": [],
        "textFile": "page1_script.txt",
        "tts": "page1_tts.mp3",
        "sounds": [],
        "mission": null
    },
    {
        "id": "page2",
        "image": "page2_illustration.png",
        "hintImage": null,
        "interactionImages": [],
        "textFile": "page2_script.txt",
        "tts": "page2_tts.mp3",
        "sounds": [],
        "mission": null
    },
    {
        "id": "page3",
        "image": "page3_illustration.png",
        "hintImage": null,
        "interactionImages": [],
        "textFile": "page3_script.txt",
        "tts": "page3_tts.mp3",
        "sounds": [],
        "mission": null
    },
    {
        "id": "page4",
        "image": "page4_illustration.png",
        "hintImage": null,
        "interactionImages": [],
        "textFile": "page4_script.txt",
        "tts": "page4_tts.mp3",
        "sounds": [],
        "mission": null
    },
    {
        "id": "page5",
        "image": "page5_illustration.png",
        "hintImage": null,
        "interactionImages": [],
        "textFile": "page5_script.txt",
        "tts": "page5_tts.mp3",
        "sounds": ["page5_sound.mp3"],
        "mission": null
    },
    ...
]

```

- 이런식으로 짜놨음 그래서 멀티 전용 json 파일도 만들어서 mission에 헨젤과 그레텔 각 미션 구분해놔서 그에 맞는 컴포넌트 불러와서 하면 지영언니랑 나랑 같이 공유하면서 사용해도 될거같아 이렇게 짰는데 일단 이건 낼 지영언니랑 얘기해봐야될거같다..!

- 일단 s3에 해보고 테스트는 해봐야될듯..? 

- 재사용성 측면에서 괜찮아 보이는 방법인듯...!

---
