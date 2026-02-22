import { db } from "./firebase-config.js";
import { doc, setDoc, getDocs, collection, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const nifInput = document.getElementById("vendedorNif");
const nomeInput = document.getElementById("vendedorNome");
const emailInput = document.getElementById("vendedorEmail");
const btnSalvar = document.getElementById("btnSalvar");
const tabelaCorpo = document.getElementById("tabelaCorpo");

async function salvarVendedor() {
    const nif = nifInput.value.trim();
    if (!nif) return alert("O NIF é obrigatório!");

    try {
        await setDoc(doc(db, "vendedores", nif), {
            nome: nomeInput.value,
            email: emailInput.value,
            status: "ativo"
        }, { merge: true });
        
        alert("Vendedor guardado!");
        nifInput.value = ""; nomeInput.value = ""; emailInput.value = "";
        carregarVendedores();
    } catch (e) { alert("Erro ao salvar: " + e.message); }
}

async function carregarVendedores() {
    tabelaCorpo.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "vendedores"));
    querySnapshot.forEach((doc) => {
        const v = doc.data();
        tabelaCorpo.innerHTML += `
            <tr>
                <td>${doc.id}</td>
                <td>${v.nome}</td>
                <td>${v.status}</td>
                <td><button onclick="desativar('${doc.id}')">Desativar</button></td>
            </tr>`;
    });
}

btnSalvar.addEventListener("click", salvarVendedor);
window.onload = carregarVendedores;