# 2025.04.07(월) 싱글모드 전체 UI 정리 및 IndexedDB 저장

### KPT 작성

#### `Keep` : 현재 만족하고 있는 부분, 계속 이어갔으면 하는 부분

- Team 🔥

#### `Problem` : 불편하게 느끼는 부분, 개선이 필요하다고 생각되는 부분

- 싱글 UI 전체 정리중인데 은근 손봐야될거많아서 막막

- 피드백 받은 UI 사실 흐린눈하고있었는데 찔끔함

- 반응형 흐린눈 해야될듯듯

#### `Try` : problem에 대한 해결책, 다음 회고 때 판별 가능한 것, 당장 실행 가능한 것

- 틈틈히 UI 수정하고 반영하기

- 싱글모드는 얼추 다 된거같긴해서 자잘자잘한거 수정하면서 확인하기

---

#### Todo

- 임시로 URL 생성해서 저장했던 거 웹브라우저에 저장할 수 있는 Indexed DB 저장 완료

- 싱글모드 미션에서 오류나는거 잡아내는중(무한랜더링 해결 - 마법대전 / 가위바위보 상태메세지 수정)

---

### Indexed DB 관련 정리리

```
fileMap[fileName] = URL.createObjectURL(contentBlob);
```

- 이렇게 처리하면 브라우저의 메모리(RAM)에 Blob 데이터를 임시로 저장하고, 그걸URL.careateObjectURL()로 참조 가능한 URL로 만든것

- 파일이 디스크에 저장되는게 아니라, 브라우저 메모리(heap)에 있는 거고, createObjectURL()은 그 Blob 객체에 접근할 수 있는 임시  URL을 생성하는는 역할.

- 지금 현재 상태 브라우저 메모리 상의 임시 Blob 객체

    - 이 객체는 페이지 새로고침이나 브라우절르 닫으면 사라짐

    - 크롬 개발자도구 → Application 탭에서 “Frames > top > Blob URLs”로 확인 가능

- 지속적 저장 하려면 → IndexedDB에 직접 저장

    - `idb` 라이브러리나

    - `Dexie.js` 같은 IndexedDB wrapper를 써서,

    - `fileMap[fileName] = Blob`을 DB에 저장해두는 방식으로 바꿔야 함.

- 유지보수 위해 Utils 함수 작성

```
import { openDB } from "idb";

const DB_NAME = "StoryAssetsDB";  // 데이터베이스 이름
const STORE_NAME = "AssetsStore";  // 객체 저장소 이름

// IndexedDB 내부에서 사용할 DB 이름과 store의 이름 정의해둠.
export async function getDB() {
    // DB 스키마 버전 데이터베이스 열거나 없으면 새로 생성성
    return await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
}

// 저장
export async function saveToIndexedDB(key, value) {
    const db = await getDB();
    await db.put(STORE_NAME, value, key);
}

// 데이터 불러오기
export async function getFromIndexedDB(key) {
    const db = await getDB();
    return await db.get(STORE_NAME, key);
}

// 데이터 삭제
export async function deleteFromIndexedDB(key) {
    const db = await getDB();
    await db.delete(STORE_NAME, key);
}

// AssetsStore라는 저장소 들어있는 모든 데이터 삭제
// 캐시 초기화할때 유용
export async function clearIndexedDB() {
    const db = await getDB();
    await db.clear(STORE_NAME);
}

```

---
