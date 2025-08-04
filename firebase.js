// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber , initializeAppCheck } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAJZJoLvh7DIn_p7LxJMoWAW2ujpOBHDIA",
  authDomain: "doodhandco.firebaseapp.com",
  projectId: "doodhandco",
  storageBucket: "doodhandco.firebasestorage.app",
  messagingSenderId: "517136469798",
  appId: "1:517136469798:web:878c0ff2f9a0b605497be7",
  measurementId: "G-K99PWESZ9M"
};

const app = initializeApp(firebaseConfig);
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LcXeporAAAAAHNXCReYt2LGhhKZtNLusJM-cOuQ'),

  // Optional argument. If true, the SDK automatically refreshes App Check
  // tokens as needed.
  isTokenAutoRefreshEnabled: true
});
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };

