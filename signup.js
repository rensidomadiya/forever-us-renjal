import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const signupBtn = document.getElementById('signup-btn');
const email = document.getElementById('email');
const password = document.getElementById('password');
const name = document.getElementById('name');

signupBtn.addEventListener('click', () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(userCredential => {
      const user = userCredential.user;
      alert('Sign Up Successful ❤️');
      window.location.href = "dashboard.html"; // Redirect to dashboard
    })
    .catch(error => {
      alert('Sign Up Failed: ' + error.message);
    });
});