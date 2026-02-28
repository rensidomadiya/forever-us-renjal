import { auth, db, storage } from './firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if(!user){
    window.location.href = "index.html";
  }
}); 

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
  signOut(auth).then(() => window.location.href = "index.html");
});

// Add Memory
document.getElementById('add-memory-btn').addEventListener('click', async () => {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const imageFile = document.getElementById('image').files[0];

  if(!title || !description) return alert('Title and description required');

  let imageUrl = '';
  if(imageFile){
    const storageRef = ref(storage, `memories/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(storageRef);
  }

  await addDoc(collection(db, 'memories'), { title, description, imageUrl, user: auth.currentUser.email, timestamp: Date.now() });
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('image').value = '';
});

// Display Memories (Real-time)
const memoriesList = document.getElementById('memories-list');
onSnapshot(collection(db, 'memories'), snapshot => {
  memoriesList.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    memoriesList.innerHTML += `
      <div class="memory-item">
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        ${data.imageUrl ? `<img src="${data.imageUrl}" width="200"/>` : ''}
      </div>
    `;
  });
});
snapshot.forEach(doc => {
  const data = doc.data();
  memoriesList.innerHTML += `
    <div class="memory-item">
      <h3>${data.title}</h3>
      <p>${data.description}</p>
      ${data.imageUrl ? `<img src="${data.imageUrl}" width="200"/>` : ''}
      <button onclick="editMemory('${doc.id}', '${data.title}', '${data.description}')">Edit</button>
      <button onclick="deleteMemory('${doc.id}')">Delete</button>
    </div>
  `;
});

// Edit Function
window.editMemory = async (id, oldTitle, oldDesc) => {
  const newTitle = prompt("Edit Title:", oldTitle);
  const newDesc = prompt("Edit Description:", oldDesc);
  if(newTitle && newDesc){
    await updateDoc(doc(db, "memories", id), { title: newTitle, description: newDesc });
    alert('Memory Updated ✅');
  }
}

// Delete Function
window.deleteMemory = async (id) => {
  if(confirm("Are you sure you want to delete this memory?")){
    await deleteDoc(doc(db, "memories", id));
    alert('Memory Deleted ❌');
  }
}