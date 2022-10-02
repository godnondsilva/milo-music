# Milo Music

A music streaming web application using Vue and Firebase.

# Frontend Documentation (Vue.js)

- Clone this respository `git clone <SSH/HTTPS URL>`.
- Change directory to the frontend directory `cd milo-music/frontend`.
- Install the dependencies `npm install`.
- Run the application in development mode `npm run serve`.
- Deploy the frontend on [Vercel](https://vercel.com).

# Backend Documentation (Firebase)

- Go to your firebase console and create a new project.
- Create a new web project.
- Make sure to copy and paste the configuration into `src/includes/firebase.js`.
- Go to the Authentication page and click on the Sign-in method tab, enable Email/Password login.
- Go to the Firestore Database page and click on the rules tab, enter the following rules:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
        match /{document=**} {
            allow read: if true;
            allow write: if request.auth.uid == resource.data.uid;
            allow create: if request.auth.uid != null;
            allow delete: if request.auth.uid == resource.data.uid;
        }
    }
  }
  ```
- Go to the Sorage page and click on the Rules page, enter the following rules:
  ```
    rules_version = '2';
    service firebase.storage {
        match /b/{bucket}/o {
            match /{allPaths=\*_} {
                allow read: if true;
                allow write: if request.auth != null &&
                request.resource.contentType == "audio/mpeg" &&
                request.resource.size < 10 _ 1024 \* 1024;
                allow delete: if request.auth != null;
            }
        }
    }
  ```
