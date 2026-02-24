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
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    if (!nif || !nome || !email) {
        return alert("Por favor, preencha todos os campos (NIF, Nome e Email)!");
    }

    try {
        // Usar o NIF como ID do documento impede duplicados
        await setDoc(doc(db, "vendedores", nif), {
            nome: nome,
            email: email,
            status: "ativo",
            dataCriacao: new Date()
        }, { merge: true });
        
        alert("Vendedor guardado com sucesso!");
        limparForm();
        carregarVendedores();
    } catch (e) { 
        alert("Erro ao salvar: " + e.message); 
    }
}

// --- 2. PESQUISAR POR NIF ---
async function pesquisarVendedor() {
    const nif = document.getElementById("pesquisaNif").value.trim();
    if (!nif) return alert("Introduza um NIF para pesquisar.");

    try {
        const docRef = doc(db, "vendedores", nif);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const v = docSnap.data();
            nifInput.value = docSnap.id;
            nifInput.disabled = true; // Protege o NIF na edição
            nomeInput.value = v.nome;
            emailInput.value = v.email;
            alert("Vendedor encontrado!");
        } else {
            alert("Vendedor não encontrado na base de dados.");
        }
    } catch (e) {
        alert("Erro na pesquisa: " + e.message);
    }
}

// --- 3. LISTAR VENDEDORES NA TABELA ---
async function carregarVendedores() {
    tabelaCorpo.innerHTML = "<tr><td colspan='4'>A carregar...</td></tr>";
    try {
        const snap = await getDocs(collection(db, "vendedores"));
        tabelaCorpo.innerHTML = "";
        snap.forEach((docV) => {
            const v = docV.data();
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${docV.id}</td>
                <td>${v.nome}</td>
                <td><span style="color: ${v.status === 'ativo' ? '#27ae60' : '#e74c3c'}; font-weight:bold;">${v.status}</span></td>
                <td>
                    <button onclick="mudarEstado('${docV.id}', '${v.status}')" style="padding: 5px 10px; cursor:pointer;">Alternar</button>
                </td>
            `;
            tabelaCorpo.appendChild(linha);
        });
    } catch (e) { 
        console.error("Erro ao listar:", e); 
        tabelaCorpo.innerHTML = "<tr><td colspan='4'>Erro ao carregar dados.</td></tr>";
    }
}

// --- 4. ALTERAR STATUS ---
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

// Inicialização
document.getElementById("btnSalvar").addEventListener("click", salvarVendedor);
document.getElementById("btnPesquisar").addEventListener("click", pesquisarVendedor);
document.getElementById("btnLimpar").addEventListener("click", limparForm);
window.onload = carregarVendedores;