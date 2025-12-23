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
    const agora = new Date();
    const h24 = agora.getHours();
    const min = agora.getMinutes();
    
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

    // Lógica Curpio
    let msgCurpio = "";
    if (h24 >= 3 && h24 < 7) {
        msgCurpio = hojeTem ? "LOGO HÁ CURPIO" : "HOJE NÃO HÁ CURPIO";
    } else if (h24 >= 7 && h24 < 10) {
        msgCurpio = hojeTem ? "HOJE HÁ CURPIO" : "HOJE NÃO HÁ CURPIO";
    } else {
        msgCurpio = amanhaTem ? "AMANHÃ HÁ CURPIO" : "AMANHÃ NÃO HÁ CURPIO";
    }
    document.getElementById("status-curpio").innerText = msgCurpio;

    // Período do Dia (Topo)
    let seg = (h24 >= 4 && h24 < 7) ? "É DE MADRUGADA" : (h24 >= 7 && h24 < 13) ? "É DE MANHÃ" : (h24 >= 13 && h24 < 20) ? "É DE TARDE" : "É DE NOITE";
    document.getElementById("segmento").innerText = seg;

    // Relógio de Texto (Centro)
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
    let finalHTML = (prefixo === "QUASE ") ? `QUASE <span class="negrito">${nomes[hAlvo]}${sufMin}</span>` : `CERCA ${conector}<span class="negrito">${nomes[hAlvo]}${sufMin}</span>`;

    if (sufMin === "" && hAlvo !== 0 && hAlvo !== 12) {
        let p = (hAlvo >= 4 && hAlvo < 7) ? " DA MADRUGADA" : (hAlvo >= 7 && hAlvo < 13) ? " DA MANHÃ" : (hAlvo >= 13 && h24 < 20) ? " DA TARDE" : " DA NOITE";
        finalHTML = finalHTML.replace('</span>', `${p}</span>`);
    }

    document.getElementById("frase-principal").innerHTML = finalHTML;

    // HORA DIGITAL - Agora com o formato HH:MM
    const hDig = h24.toString().padStart(2, '0');
    const mDig = min.toString().padStart(2, '0');
    document.getElementById("digital").innerText = `ou seja, são ${hDig}:${mDig}`;
}

carregarFeriados().then(() => {
    atualizar();
    setInterval(atualizar, 1000);
});
