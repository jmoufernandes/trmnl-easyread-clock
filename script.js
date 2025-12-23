function atualizar() {
    const agora = new Date();
    const h24 = agora.getHours();
    const min = agora.getMinutes();

    // 1. SEGMENTO DO DIA (A frase que vai para o bloco preto)
    let seg = "";
    if (h24 >= 4 && h24 < 7) seg = "É DE MADRUGADA";
    else if (h24 >= 7 && h24 < 13) seg = "É DE MANHÃ";
    else if (h24 >= 13 && h24 < 20) seg = "É DE TARDE";
    else seg = "É DE NOITE";

    // 2. LÓGICA DA TABELA DE MINUTOS
    let prefixo = "";
    let sufMin = "";
    let hAlvo = h24;

    // Se estiver nos minutos finais (>=53), a referência passa para a hora seguinte
    if (min >= 53) hAlvo = (h24 + 1) % 24;

    // Definição exata dos intervalos da tua tabela
    if (min >= 58 || min <= 2)   { prefixo = "CERCA "; sufMin = ""; }
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
    
    // Conector DA / DAS
    let conector = (hAlvo === 0 || hAlvo === 1 || hAlvo === 12 || hAlvo === 13) ? "DA " : "DAS ";
    
    // Construção da Frase Principal com o destaque em Negrito
    let parteDestaque = nomes[hAlvo] + sufMin;
    let finalHTML = "";

    if (prefixo === "QUASE ") {
        finalHTML = `QUASE <span class="negrito">${parteDestaque}</span>`;
    } else {
        finalHTML = `CERCA ${conector}<span class="negrito">${parteDestaque}</span>`;
    }

    // Adiciona o período (da manhã/tarde...) se for hora exata ou quase a próxima hora
    if (sufMin === "" && hAlvo !== 0 && hAlvo !== 12) {
        let periodo = "";
        if (hAlvo >= 4 && hAlvo < 7) periodo = " DA MADRUGADA";
        else if (hAlvo >= 7 && hAlvo < 13) periodo = " DA MANHÃ";
        else if (hAlvo >= 13 && hAlvo < 20) periodo = " DA TARDE";
        else periodo = " DA NOITE";
        
        finalHTML = finalHTML.replace('</span>', `${periodo}</span>`);
    }

    // 3. ENTREGA DOS TEXTOS PARA O HTML
    // Usamos as IDs que definimos no novo index.html: "segmento", "frase-principal" e "digital"
    document.getElementById("segmento").innerText = seg;
    document.getElementById("frase-principal").innerHTML = finalHTML;
    
    const hDigital = h24.toString().padStart(2, '0');
    const mDigital = min.toString().padStart(2, '0');
    document.getElementById("digital").innerText = `ou seja, são ${hDigital}h${mDigital}`;
}

// Inicia o relógio e atualiza a cada segundo
setInterval(atualizar, 1000);
atualizar();
