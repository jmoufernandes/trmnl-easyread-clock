let feriadosPT = [];

async function carregarFeriados() {
    try {
        const ano = new Date().getFullYear();
        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${ano}/PT`);
        const dados = await response.json();
        feriadosPT = dados.map(f => f.date); 
        feriadosPT.push(`${ano}-11-19`); 
    } catch (e) {
        console.error("Erro ao carregar feriados");
    }
}

async function atualizar() {
    const agora = new Date();
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

    // --- 1. LÓGICA DO TOPO (A TUA TABELA EXATA) ---
    let seg = "";
    
    // Regra Comum para Noite e Madrugada (Igual em todos os dias)
    if (totalMinutos >= 1291 || totalMinutos <= 239) { seg = "É HORA DE DORMIR 🌙"; } // 21:31 > 03:59
    else if (totalMinutos >= 240 && totalMinutos <= 489) { seg = "MADRUGADA - DORMIR MAIS 🌙"; } // 04:00 > 08:09
    
    // Regra Específica para a Manhã (Depende do Curpio)
    else if (totalMinutos >= 490 && totalMinutos <= 540) { // 08:10 > 09:00
        seg = hojeTem ? "É HORA DE ACORDAR" : "É DE MANHÃ"; 
    }
    
    // Regra Comum para o resto do dia
    else if (totalMinutos >= 541 && totalMinutos <= 720) { seg = "É DE MANHÃ"; } // 09:01 > 12:00
    else if (totalMinutos >= 721 && totalMinutos <= 839) { seg = "É HORA DE ALMOÇO"; } // 12:01 > 13:59
    else if (totalMinutos >= 840 && totalMinutos <= 1140) { seg = "É DE TARDE"; } // 14:00 > 19:00
    else if (totalMinutos >= 1141 && totalMinutos <= 1230) { seg = "É HORA DE JANTAR"; } // 19:01 > 20:30
    else if (totalMinutos >= 1231 && totalMinutos <= 1290) { seg = "É DE NOITE 🌙"; } // 20:31 > 21:30

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

// --- 3. LÓGICA RELÓGIO DE TEXTO (CENTRO) - RIGOROSA À TUA TABELA ---
    let hAlvo = (min >= 53) ? (h24 + 1) % 24 : h24;
    let prefixo = "";
    let sufMin = "";

    // Esta parte traduz a tua tabela de 5 em 5 minutos
    if (min >= 58 || min <= 2) { 
        prefixo = "CERCA "; 
        sufMin = ""; 
    } 
    else if (min >= 3 && min <= 7)   { prefixo = "QUASE "; sufMin = " E DEZ"; }
    else if (min >= 8 && min <= 12)  { prefixo = "CERCA "; sufMin = " E DEZ"; }
    else if (min >= 13 && min <= 17) { prefixo = "QUASE "; sufMin = " E VINTE"; }
    else if (min >= 18 && min <= 22) { prefixo = "CERCA "; sufMin = " E VINTE"; }
    else if (min >= 23 && min <= 27) { prefixo = "QUASE "; sufMin = " E MEIA"; }
    else if (min >= 28 && min <= 32) { prefixo = "CERCA "; sufMin = " E MEIA"; }
    else if (min >= 33 && min <= 37) { prefixo = "QUASE "; sufMin = " E QUARENTA"; }
    else if (min >= 38 && min <= 42) { prefixo = "CERCA "; sufMin = " E QUARENTA"; }
    else if (min >= 43 && min <= 47) { prefixo = "QUASE "; sufMin = " E CINQUENTA"; }
    else if (min >= 48 && min <= 52) { prefixo = "CERCA "; sufMin = " E CINQUENTA"; }
    else if (min >= 53 && min <= 57) { prefixo = "QUASE "; sufMin = ""; }

    const nomes = ["MEIA-NOITE", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE", "MEIO-DIA", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE"];
    let conector = (hAlvo === 0 || hAlvo === 1 || hAlvo === 12 || hAlvo === 13) ? "DA " : "DAS ";
    let destaque = `${nomes[hAlvo]}${sufMin}`;
    
    // Adiciona o período do dia (Manhã, Tarde, Noite) apenas nas horas exatas
    if (sufMin === "" && hAlvo !== 0 && hAlvo !== 12) {
        let p = (hAlvo >= 4 && hAlvo < 7) ? " DA MADRUGADA" : (hAlvo >= 7 && hAlvo < 13) ? " DA MANHÃ" : (hAlvo >= 13 && h24 < 20) ? " DA TARDE" : " DA NOITE";
        destaque += p;
    }

    // Montagem final com a regra do "QUASE" sem conector
    if (prefixo === "QUASE ") {
        document.getElementById("frase-principal").innerHTML = `QUASE <span class="negrito">${destaque}</span>`;
    } else {
        document.getElementById("frase-principal").innerHTML = `CERCA ${conector}<span class="negrito">${destaque}</span>`;
    }
    
    // --- 4. HORA DIGITAL ---
    document.getElementById("digital").innerText = `ou seja, são ${h24.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

carregarFeriados().then(() => {
    atualizar();
    setInterval(atualizar, 30000); 
});
