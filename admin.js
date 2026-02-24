import { db, auth } from "./firebase-config.js";
import { doc, setDoc, getDoc, getDocs, collection, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const nifInput = document.getElementById("vendedorNif");
const nomeInput = document.getElementById("vendedorNome");
const emailInput = document.getElementById("vendedorEmail");
const tabelaCorpo = document.getElementById("tabelaCorpo");

// --- SALVAR VENDEDOR ---
async function salvarVendedor() {
    const nif = nifInput.value.trim();
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    if (!nif || !nome || !email) {
        return alert("Preencha todos os campos!");
    }

    try {
        await setDoc(doc(db, "vendedores", nif), {
            nome: nome,
            email: email,
            status: "ativo"
        }, { merge: true });
        
        alert("Vendedor guardado com sucesso!");
        limparForm();
        carregarVendedores(); // Atualiza a lista na hora
    } catch (e) { 
        alert("Erro ao salvar: " + e.message); 
    }
}

// --- CARREGAR LISTA ---
async function carregarVendedores() {
    tabelaCorpo.innerHTML = ""; // Limpa a tabela antes de carregar
    try {
        const snap = await getDocs(collection(db, "vendedores"));
        snap.forEach((docV) => {
            const v = docV.data();
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${docV.id}</td>
                <td>${v.nome}</td>
                <td><span style="color: ${v.status === 'ativo' ? 'green' : 'red'}; font-weight:bold;">${v.status}</span></td>
                <td>
                    <button onclick="mudarEstado('${docV.id}', '${v.status}')">Alternar</button>
                </td>
            `;
            tabelaCorpo.appendChild(linha);
        });
    } catch (e) {
        console.error(e);
    }
}

// --- PESQUISAR ---
async function pesquisarVendedor() {
    const nif = document.getElementById("pesquisaNif").value.trim();
    if (!nif) return;

    const docSnap = await getDoc(doc(db, "vendedores", nif));
    if (docSnap.exists()) {
        const v = docSnap.data();
        nifInput.value = docSnap.id;
        nifInput.disabled = true;
        nomeInput.value = v.nome;
        emailInput.value = v.email;
    } else {
        alert("NIF não encontrado.");
    }
}

// --- ESTADO E LOGOUT ---
window.mudarEstado = async (nif, status) => {
    const novo = status === "ativo" ? "inativo" : "ativo";
    await updateDoc(doc(db, "vendedores", nif), { status: novo });
    carregarVendedores();
};

document.getElementById("btnLogout").addEventListener("click", () => {
    signOut(auth).then(() => window.location.href = "index.html");
});

function limparForm() {
    nifInput.value = ""; nifInput.disabled = false;
    nomeInput.value = ""; emailInput.value = "";
}

document.getElementById("btnSalvar").addEventListener("click", salvarVendedor);
document.getElementById("btnPesquisar").addEventListener("click", pesquisarVendedor);
document.getElementById("btnLimpar").addEventListener("click", limparForm);
window.onload = carregarVendedores;