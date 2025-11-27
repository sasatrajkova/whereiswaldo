Create a project on firebase 
https://firebase.google.com/docs/web/setup

create a Realtimedatabase in the Firebase Console.
Replace the firebaseConfig object in the src/database/database.tsx file with th provided configObject + databaseURL

Replace the rules in th Realtime Database Rules tab with the following:

{
  "rules": {
    ".read": "now < 1766530800000",  // 2025-12-24
    ".write": "now < 1766530800000",  // 2025-12-24
		"answers": {
    	".indexOn": ["from", "to"]
  	}
  },
}