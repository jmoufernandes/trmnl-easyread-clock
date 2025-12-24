let feriadosPT = [];

async function carregarFeriados() {
    try {
        const ano = new Date().getFullYear();
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${ano}/PT`);
        const dados = await response.json();
        feriadosPT = dados.map(f => f.date); 
        feriadosPT.push(`${ano}-11-19`); // Feriado de Odivelas
    } catch (e) {
        console.error("Erro ao carregar feriados");
    }
}

async function atualizar() {
    const agora = new Date('2025-12-24T05:45:00')
    const h24 = agora.getHours();
    const min = agora.getMinutes();
    const totalMinutos = (h24 * 60) + min; 
    
    const formatar = (d) => {
        const z = n => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`;
    };
    
    function isDiaLivre(data) {
        const diaSemana = data.getDay();
        return (diaSemana === 0 || diaSemana === 6 || feriadosPT.includes(formatar(data)));
    }

    const amanha = new Date(agora);
    amanha.setDate(agora.getDate() + 1);
    const hojeTem = !isDiaLivre(agora);
    const amanhaTem = !isDiaLivre(amanha);

    // --- 1. LÓGICA DO TOPO (A sua nova tabela de horários) ---
    let seg = "";
    if (hojeTem) {
        // Dias com Curpio
        if (totalMinutos >= 490 && totalMinutos <= 540) { seg = "É HORA DE ACORDAR"; }
        else if (totalMinutos > 540 && totalMinutos <= 779) { seg = "É DE MANHÃ"; }
        else if (totalMinutos >= 780 && totalMinutos <= 1199) { seg = "É DE TARDE"; }
        else if (totalMinutos >= 1200 && totalMinutos <= 1290) { seg = "É DE NOITE 🌙"; }
        else { seg = "É HORA DE DORMIR 🌙"; }
    } else {
        // Dias sem Curpio (Fim de semana/Feriados)
        if (totalMinutos >= 480 && totalMinutos <= 779) { seg = "É DE MANHÃ"; }
        else if (totalMinutos >= 780 && totalMinutos <= 1199) { seg = "É DE TARDE"; }
        else if (totalMinutos >= 1200 && totalMinutos <= 1290) { seg = "É DE NOITE 🌙"; }
        else { seg = "É HORA DE DORMIR 🌙"; }
    }
    document.getElementById("segmento").innerText = seg;

    // --- 2. LÓGICA DO CURPIO (FUNDO) ---
    let msgCurpio = "";
    if (h24 >= 3 && h24 < 7) {
        msgCurpio = hojeTem ? "LOGO HÁ CURPIO" : "HOJE NÃO HÁ CURPIO";
    } else if (h24 >= 7 && h24 < 10) {
        msgCurpio = hojeTem ? "HOJE HÁ CURPIO" : "HOJE NÃO HÁ CURPIO";
    } else {
        msgCurpio = amanhaTem ? "AMANHÃ HÁ CURPIO" : "AMANHÃ NÃO HÁ CURPIO";
    }
    document.getElementById("status-curpio").innerText = msgCurpio;

    // --- 3. LÓGICA RELÓGIO DE TEXTO (CENTRO) ---
    let hAlvo = (min >= 53) ? (h24 + 1) % 24 : h24;
    let prefixo = "", sufMin = "";

    if (min >= 58 || min <= 2) { prefixo = "CERCA "; }
    else if (min <= 7) { prefixo = "QUASE "; sufMin = " E DEZ"; }
    else if (min <= 12) { prefixo = "CERCA "; sufMin = " E DEZ"; }
    else if (min <= 17) { prefixo = "QUASE "; sufMin = " E VINTE"; }
    else if (min <= 22) { prefixo = "CERCA "; sufMin = " E VINTE"; }
    else if (min <= 27) { prefixo = "QUASE "; sufMin = " E MEIA"; }
    else if (min <= 32) { prefixo = "CERCA "; sufMin = " E MEIA"; }
    else if (min <= 37) { prefixo = "QUASE "; sufMin = " E QUARENTA"; }
    else if (min <= 42) { prefixo = "CERCA "; sufMin = " E QUARENTA"; }
    else if (min <= 47) { prefixo = "QUASE "; sufMin = " E CINQUENTA"; }
    else if (min <= 52) { prefixo = "CERCA "; sufMin = " E CINQUENTA"; }
    else { prefixo = "QUASE "; }

    const nomes = ["MEIA-NOITE", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE", "MEIO-DIA", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE"];
    let conector = (hAlvo === 0 || hAlvo === 1 || hAlvo === 12 || hAlvo === 13) ? "DA " : "DAS ";
    
    let destaque = `${nomes[hAlvo]}${sufMin}`;
    
    if (sufMin === "" && hAlvo !== 0 && hAlvo !== 12) {
        let p = (hAlvo >= 4 && hAlvo < 7) ? " DA MADRUGADA" : (hAlvo >= 7 && hAlvo < 13) ? " DA MANHÃ" : (hAlvo >= 13 && h24 < 20) ? " DA TARDE" : " DA NOITE";
        destaque += p;
    }

    let finalHTML = (prefixo === "QUASE ") ? `QUASE <span class="negrito">${destaque}</span>` : `CERCA ${conector}<span class="negrito">${destaque}</span>`;

    document.getElementById("frase-principal").innerHTML = finalHTML;
    
    // --- 4. HORA DIGITAL ---
    const hDig = h24.toString().padStart(2, '0');
    const mDig = min.toString().padStart(2, '0');
    document.getElementById("digital").innerText = `ou seja, são ${hDig}:${mDig}`;
}

carregarFeriados().then(() => {
    atualizar();
    setInterval(atualizar, 30000); // Atualiza a cada 30 segundos
});
