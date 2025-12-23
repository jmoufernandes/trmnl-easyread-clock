function atualizar() {
    const agora = new Date();
    const h24 = agora.getHours();
    const min = agora.getMinutes();

    // 1. SEGMENTO DO DIA
    let seg = "";
    if (h24 >= 4 && h24 < 7) seg = "É DE MADRUGADA";
    else if (h24 >= 7 && h24 < 13) seg = "É DE MANHÃ";
    else if (h24 >= 13 && h24 < 20) seg = "É DE TARDE";
    else seg = "É DE NOITE";
    document.getElementById("segmento").innerText = seg;

    // 2. FRASE PRINCIPAL (TABELA)
    let prefixo = "";
    let sufMin = "";
    let hAlvo = h24;

    if (min >= 53) hAlvo = (h24 + 1) % 24;

    // Regras de Minutos
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
    
    // Conector DA/DAS
    let conector = (hAlvo === 0 || hAlvo === 1 || hAlvo === 12 || hAlvo === 13) ? "DA " : "DAS ";
    
    // Construção da Frase
    let final = "";
    if (prefixo === "QUASE ") {
        final = "QUASE " + nomes[hAlvo] + sufMin;
    } else {
        final = "CERCA " + conector + nomes[hAlvo] + sufMin;
    }

    // Se for hora exata, acrescentar período
    if (sufMin === "" && hAlvo !== 0 && hAlvo !== 12) {
        if (hAlvo >= 4 && hAlvo < 7) final += " DA MADRUGADA";
        else if (hAlvo >= 7 && hAlvo < 13) final += " DA MANHÃ";
        else if (hAlvo >= 13 && hAlvo < 20) final += " DA TARDE";
        else final += " DA NOITE";
    }

    document.getElementById("frase-principal").innerText = final;

    // 3. DIGITAL
    const mDig = min.toString().padStart(2, '0');
    document.getElementById("digital").innerText = `ou seja, são ${h24}h${mDig}`;
}

setInterval(atualizar, 1000);
atualizar();
