import { db, auth } from "./firebase-config.js";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const nifInput = document.getElementById("vendedorNif");
const nomeInput = document.getElementById("vendedorNome");
const emailInput = document.getElementById("vendedorEmail");
const btnSalvar = document.getElementById("btnSalvar");
const tabelaCorpo = document.getElementById("tabelaCorpo");

// SALVAR OU ATUALIZAR
async function salvarVendedor() {
    const nif = nifInput.value.trim();
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    if (!nif || !nome) return alert("NIF e Nome são obrigatórios!");

    // doc(db, "coleção", "ID_DOCUMENTO") -> O ID será o NIF
    const docRef = doc(db, "vendedores", nif);
    
    try {
        await setDoc(docRef, {
            nome: nome,
            email: email,
            status: "ativo",
            ultimaAtualizacao: new Date()
        }, { merge: true });

        alert("Vendedor guardado!");
        nifInput.value = ""; nomeInput.value = ""; emailInput.value = "";
        nifInput.disabled = false;
        carregarVendedores();
    } catch (e) { alert("Erro: " + e.message); }
}

// LISTAR NA TABELA
async function carregarVendedores() {
    tabelaCorpo.innerHTML = "";
    const snap = await getDocs(collection(db, "vendedores"));
    snap.forEach(v => {
        const d = v.data();
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.id}</td>
            <td>${d.nome}</td>
            <td>${d.status}</td>
            <td>
                <button onclick="prepararEdicao('${v.id}', '${d.nome}', '${d.email}')">Editar</button>
                <button onclick="mudarStatus('${v.id}', '${d.status}')">Alternar Estado</button>
            </td>`;
        tabelaCorpo.appendChild(tr);
    });
}

// Funções globais para os botões da tabela
window.prepararEdicao = (nif, nome, email) => {
    nifInput.value = nif;
    nifInput.disabled = true; // Chave não se altera
    nomeInput.value = nome;
    emailInput.value = email;
};

window.mudarStatus = async (nif, status) => {
    const novo = status === "ativo" ? "inativo" : "ativo";
    await updateDoc(doc(db, "vendedores", nif), { status: novo });
    carregarVendedores();
};

btnSalvar.addEventListener("click", salvarVendedor);
window.onload = carregarVendedores;