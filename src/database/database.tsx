import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set } from "firebase/database";

export const myIdKey = "whereIsWaldoId";
export const myNameKey = "whereIsWaldoName";

export class User {
    constructor(id: string, name: string, image?: string){
        this.id = id;
        this.name = name;
        this.imageBase64 = image;
    }
    readonly id: string;
    readonly name: string;
    readonly imageBase64?: string;
}

export async function getMe(): Promise<User | null> {
    const myId = localStorage.getItem(myIdKey);
    if(myId){
        return getUser(myId);
    }
    return getUser(await createUser(''));
}

export function getUser(userId: string): Promise<User | null> {
    const dbRef = ref(getDatabase())
    return get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val();
    } else {
        console.log("No data available");
        return null;
    }
    }).catch((error) => {
        console.error(error);
        return null;
    });
}

export async function getUsers(): Promise<User[]> {
    const usersRef = ref(getDatabase(), 'users');
    const snapshot = await get(usersRef);
    const users: User[] = [];
    const myId = localStorage.getItem(myIdKey);
    if(snapshot.exists()){
        snapshot.forEach((snap) => {users.push(snap.val());})
    }
    return users.filter((user) => user.id !== myId);
}

export async function createUser(name: string, image?: string): Promise<string> {
    const db = getDatabase();
    const existingId = localStorage.getItem(myIdKey);
    const newId = crypto.randomUUID();
    if(!existingId){
        localStorage.setItem(myIdKey, newId);
    }
    localStorage.setItem(myNameKey, name);
    await set(ref(db, 'users/' + (existingId ?? newId)), {
        id: existingId ?? newId,
        name: name,
        imageBase64: image,
    });
    return newId;
}

export function setupFirebase(){
    const firebaseConfig = {
      apiKey: "AIzaSyAjDP0XEoaOY0DhAPIdsIeotMwNCOuYWDE",
      authDomain: "where-is-waldo-hackathon-2025.firebaseapp.com",
      projectId: "where-is-waldo-hackathon-2025",
      storageBucket: "where-is-waldo-hackathon-2025.firebasestorage.app",
      messagingSenderId: "712756908798",
      appId: "1:712756908798:web:bc8743c60a9b6d535ccbaf",
      databaseURL: 'https://where-is-waldo-hackathon-2025-default-rtdb.europe-west1.firebasedatabase.app'
    };
    
    // Initialize Firebase
    return initializeApp(firebaseConfig);
}