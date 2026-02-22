import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const btnEntrar = document.getElementById("btnEntrar");
const mensagem = document.getElementById("mensagem");

btnEntrar.addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    mensagem.innerText = "A verificar...";

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Procura o role no Firestore
        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (docSnap.exists()) {
            const role = docSnap.data().role;
            mensagem.innerText = "Sucesso! A redirecionar...";
            
            if (role === "admin") {
                window.location.href = "admin.html";
            } else if (role === "vendedor") {
                window.location.href = "colaborador.html";
            }
        } else {
            mensagem.innerText = "Erro: Utilizador sem permissões no Firestore.";
        }
    } catch (error) {
        mensagem.innerText = "Erro: " + error.message;
        console.error(error);
    }
});