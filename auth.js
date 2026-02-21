import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");
const msg = document.getElementById("message");

loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Verifica/Cria perfil no Firestore
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                role: "vendedor", // Perfil padrão inicial
                nome: "Utilizador Novo"
            });
        }
        
        msg.innerText = "Sucesso! A redirecionar...";
        // Aqui adicionaremos a lógica de redirecionamento por role no próximo passo
        
    } catch (error) {
        msg.innerText = "Erro: " + error.message;
    }
});