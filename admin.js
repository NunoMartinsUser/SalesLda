import { db } from "./firebase-config.js";
import { doc, setDoc, getDoc, getDocs, collection, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const nifInput = document.getElementById("vendedorNif");
const nomeInput = document.getElementById("vendedorNome");
const emailInput = document.getElementById("vendedorEmail");
const tabelaCorpo = document.getElementById("tabelaCorpo");

// --- SALVAR (CRIAR OU EDITAR) ---
async function salvarVendedor() {
    const nif = nifInput.value.trim();
    if (!nif) return alert("O NIF é obrigatório!");

    try {
        // Usar o NIF como ID do documento garante que não há duplicados
        await setDoc(doc(db, "vendedores", nif), {
            nome: nomeInput.value,
            email: emailInput.value,
            status: "ativo"
        }, { merge: true });
        
        alert("Vendedor guardado com sucesso!");
        limparForm();
        carregarVendedores();
    } catch (e) { alert("Erro ao salvar: " + e.message); }
}

// --- PESQUISAR POR NIF ---
async function pesquisarVendedor() {
    const nif = document.getElementById("pesquisaNif").value.trim();
    const docRef = doc(db, "vendedores", nif);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const v = docSnap.data();
        nifInput.value = docSnap.id;
        nifInput.disabled = true; // Não deixa mudar o NIF na edição
        nomeInput.value = v.nome;
        emailInput.value = v.email;
    } else {
        alert("NIF não encontrado!");
    }
}

// --- LISTAR VENDEDORES ---
async function carregarVendedores() {
    tabelaCorpo.innerHTML = "";
    const snap = await getDocs(collection(db, "vendedores"));
    snap.forEach((doc) => {
        const v = doc.data();
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${doc.id}</td>
            <td>${v.nome}</td>
            <td class="${v.status}">${v.status}</td>
            <td>
                <button onclick="mudarEstado('${doc.id}', '${v.status}')">
                    ${v.status === 'ativo' ? 'Desativar' : 'Ativar'}
                </button>
            </td>
        `;
        tabelaCorpo.appendChild(linha);
    });
}

// --- DESATIVAR (ALTERAR STATUS) ---
window.mudarEstado = async (nif, statusAtual) => {
    const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo";
    await updateDoc(doc(db, "vendedores", nif), { status: novoStatus });
    carregarVendedores();
};

function limparForm() {
    nifInput.value = ""; nifInput.disabled = false;
    nomeInput.value = ""; emailInput.value = "";
}

document.getElementById("btnSalvar").addEventListener("click", salvarVendedor);
document.getElementById("btnPesquisar").addEventListener("click", pesquisarVendedor);
document.getElementById("btnLimpar").addEventListener("click", limparForm);
window.onload = carregarVendedores;