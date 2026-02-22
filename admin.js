import { db, auth } from "./firebase-config.js";
import { doc, setDoc, getDoc, getDocs, collection, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Referências da UI
const nifInput = document.getElementById("vendedorNif");
const nomeInput = document.getElementById("vendedorNome");
const emailInput = document.getElementById("vendedorEmail");
const tabelaCorpo = document.getElementById("tabelaCorpo");

// --- 1. SALVAR (CRIAR OU ATUALIZAR) ---
async function salvarVendedor() {
    const nif = nifInput.value.trim();
    if (!nif) return alert("O NIF é obrigatório!");

    try {
        // Usar o NIF como ID do documento impede duplicados
        await setDoc(doc(db, "vendedores", nif), {
            nome: nomeInput.value,
            email: emailEmail.value,
            status: "ativo",
            dataAtualizacao: new Date()
        }, { merge: true });
        
        alert("Vendedor guardado/atualizado!");
        limparForm();
        carregarVendedores();
    } catch (e) { alert("Erro ao salvar: " + e.message); }
}

// --- 2. PESQUISAR POR NIF ---
async function pesquisarVendedor() {
    const nif = document.getElementById("pesquisaNif").value.trim();
    if (!nif) return alert("Introduza um NIF para pesquisar.");

    const docRef = doc(db, "vendedores", nif);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const v = docSnap.data();
        nifInput.value = docSnap.id;
        nifInput.disabled = true; // Impede alterar o NIF na edição
        nomeInput.value = v.nome;
        emailInput.value = v.email;
    } else {
        alert("Vendedor não encontrado!");
    }
}

// --- 3. LISTAR VENDEDORES NA TABELA ---
async function carregarVendedores() {
    tabelaCorpo.innerHTML = "";
    try {
        const snap = await getDocs(collection(db, "vendedores"));
        snap.forEach((docV) => {
            const v = docV.data();
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td style="padding:12px; border-bottom:1px solid #eee;">${docV.id}</td>
                <td style="padding:12px; border-bottom:1px solid #eee;">${v.nome}</td>
                <td style="padding:12px; border-bottom:1px solid #eee;">
                    <span style="color: ${v.status === 'ativo' ? 'green' : 'red'}; font-weight:bold;">${v.status}</span>
                </td>
                <td style="padding:12px; border-bottom:1px solid #eee;">
                    <button onclick="mudarEstado('${docV.id}', '${v.status}')" style="cursor:pointer;">Alternar Estado</button>
                </td>
            `;
            tabelaCorpo.appendChild(linha);
        });
    } catch (e) { console.error("Erro ao carregar lista:", e); }
}

// --- 4. ALTERAR STATUS (ATIVAR/DESATIVAR) ---
window.mudarEstado = async (nif, statusAtual) => {
    const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo";
    try {
        await updateDoc(doc(db, "vendedores", nif), { status: novoStatus });
        carregarVendedores();
    } catch (e) { alert("Erro ao mudar estado: " + e.message); }
};

// --- 5. LOGOUT ---
document.getElementById("btnLogout").addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((e) => alert("Erro ao sair: " + e.message));
});

function limparForm() {
    nifInput.value = ""; 
    nifInput.disabled = false;
    nomeInput.value = ""; 
    emailInput.value = "";
    document.getElementById("pesquisaNif").value = "";
}

// Listeners e Inicialização
document.getElementById("btnSalvar").addEventListener("click", salvarVendedor);
document.getElementById("btnPesquisar").addEventListener("click", pesquisarVendedor);
document.getElementById("btnLimpar").addEventListener("click", limparForm);
window.onload = carregarVendedores;