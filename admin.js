import { db, auth } from "./firebase-config.js";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Referências da UI
const nifInput = document.getElementById("vendedorNif");
const nomeInput = document.getElementById("vendedorNome");
const emailInput = document.getElementById("vendedorEmail");
const btnSalvar = document.getElementById("btnSalvar");
const tabelaCorpo = document.getElementById("tabelaCorpo");

// --- 1. CRIAR OU ATUALIZAR VENDEDOR ---
async function salvarVendedor() {
    const nif = nifInput.value.trim();
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    if (!nif || !nome) return alert("NIF e Nome são obrigatórios!");

    const docRef = doc(db, "vendedores", nif);
    
    try {
        // setDoc com merge: true permite atualizar campos sem apagar o resto
        await setDoc(docRef, {
            nome: nome,
            email: email,
            status: "ativo",
            ultimaAtualizacao: new Date()
        }, { merge: true });

        alert("Dados guardados com sucesso!");
        nifInput.disabled = false;
        limparCampos();
        carregarVendedores();
    } catch (error) {
        alert("Erro ao salvar: " + error.message);
    }
}

// --- 2. LISTAR VENDEDORES NA TABELA ---
async function carregarVendedores() {
    tabelaCorpo.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "vendedores"));
    
    querySnapshot.forEach((vendedor) => {
        const data = vendedor.data();
        const nif = vendedor.id;
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${nif}</td>
            <td>${data.nome}</td>
            <td><span class="status-${data.status}">${data.status}</span></td>
            <td>
                <button onclick="editarVendedor('${nif}')">Editar</button>
                <button onclick="alterarStatus('${nif}', '${data.status}')">
                    ${data.status === 'ativo' ? 'Desativar' : 'Ativar'}
                </button>
            </td>
        `;
        tabelaCorpo.appendChild(tr);
    });
}

// --- 3. EDITAR (CARREGAR NO FORMULÁRIO) ---
window.editarVendedor = async (nif) => {
    const docRef = doc(db, "vendedores", nif);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        nifInput.value = nif;
        nifInput.disabled = true; // Não permite alterar o NIF (chave única)
        nomeInput.value = data.nome;
        emailInput.value = data.email;
    }
};

// --- 4. DESATIVAR / ATIVAR ---
window.alterarStatus = async (nif, statusAtual) => {
    const novoStatus = statusAtual === "ativo" ? "inativo" : "ativo";
    const docRef = doc(db, "vendedores", nif);
    
    await updateDoc(docRef, { status: novoStatus });
    carregarVendedores();
};

function limparCampos() {
    nifInput.value = "";
    nifInput.disabled = false;
    nomeInput.value = "";
    emailInput.value = "";
}

// Event Listeners
btnSalvar.addEventListener("click", salvarVendedor);
window.onload = carregarVendedores;
window.logout = () => signOut(auth).then(() => window.location.href = "index.html");