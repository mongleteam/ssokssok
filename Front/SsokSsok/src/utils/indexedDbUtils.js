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