import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById('login-btn');
const email = document.getElementById('email');
const password = document.getElementById('password');

loginBtn.addEventListener('click', () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(userCredential => {
      alert('Login Success ❤️');
      window.location.href = "dashboard.html";
    })
    .catch(error => {
      alert('Login Failed: ' + error.message);
    });
});