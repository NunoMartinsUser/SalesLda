import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

window.fazerLogin = async () => {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;

        // Procura o perfil do utilizador no Firestore para ver o cargo (role)
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            mensagem.innerHTML = "Sucesso! A redirecionar...";
            
            // Redirecionamento baseado no cargo
            if (userData.role === "admin") {
                window.location.href = "admin.html";
            } else if (userData.role === "vendas") {
                window.location.href = "colaborador.html";
            } else {
                window.location.href = "compras.html";
            }
        } else {
            mensagem.innerHTML = "Erro: Perfil não encontrado no banco de dados.";
        }
    } catch (error) {
        mensagem.innerHTML = "Erro ao entrar: " + error.message;
    }
};