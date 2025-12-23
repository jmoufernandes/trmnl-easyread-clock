function atualizarRelogio() {
    const agora = new Date();
    const h24 = agora.getHours();
    const min = agora.getMinutes();

    // 1. Segmento do Dia (Frase Garrafal)
    let segmento = "";
    if (h24 >= 4 && h24 < 7) segmento = "DA MADRUGADA";
    else if (h24 >= 7 && h24 < 13) segmento = "DA MANHÃ";
    else if (h24 >= 13 && h24 < 20) segmento = "DA TARDE";
    else segmento = "DA NOITE";
    document.getElementById("segmento-dia").innerText = `É ${segmento}`;

    // 2. Lógica de Texto baseada na tua tabela
    let prefixo = "";
    let sufixoMinutos = "";
    let horaAlvo = h24;

    // Mapeamento exato da tua tabela
    if (min >= 0 && min <= 2)   { prefixo = "CERCA "; sufixoMinutos = ""; }
    else if (min >= 3 && min <= 7)   { prefixo = "QUASE "; sufixoMinutos = " E DEZ"; }
    else if (min >= 8 && min <= 12)  { prefixo = "CERCA "; sufixoMinutos = " E DEZ"; }
    else if (min >= 13 && min <= 17) { prefixo = "QUASE "; sufixoMinutos = " E VINTE"; }
    else if (min >= 18 && min <= 22) { prefixo = "CERCA "; sufixoMinutos = " E VINTE"; }
    else if (min >= 23 && min <= 27) { prefixo = "QUASE "; sufixoMinutos = " E MEIA"; }
    else if (min >= 28 && min <= 32) { prefixo = "CERCA "; sufixoMinutos = " E MEIA"; }
    else if (min >= 33 && min <= 37) { prefixo = "QUASE "; sufixoMinutos = " E QUARENTA"; }
    else if (min >= 38 && min <= 42) { prefixo = "CERCA "; sufixoMinutos = " E QUARENTA"; }
    else if (min >= 43 && min <= 47) { prefixo = "QUASE "; sufixoMinutos = " E CINQUENTA"; }
    else if (min >= 48 && min <= 52) { prefixo = "CERCA "; sufixoMinutos = " E CINQUENTA"; }
    else if (min >= 53 && min <= 57) { prefixo = "QUASE "; sufixoMinutos = ""; horaAlvo = (h24 + 1) % 24; }
    else if (min >= 58 && min <= 59) { prefixo = "CERCA "; sufixoMinutos = ""; horaAlvo = (h24 + 1) % 24; }

    // Nomes das horas (Índice 0 a 23)
    const nomes = [
        "MEIA-NOITE", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE", 
        "MEIO-DIA", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE"
    ];

    // Conector: DA para (0, 1, 12, 13), DAS para os restantes
    const conector = (horaAlvo === 0 || horaAlvo === 1 || horaAlvo === 12 || horaAlvo === 13) ? "DA " : "DAS ";
    
    // Construção da Frase
    let textoHora = nomes[horaAlvo];
    let fraseFinal = "";

    if (prefixo === "QUASE ") {
        // "QUASE DEZ E DEZ" (sem o conector DA/DAS para soar natural como pediste)
        fraseFinal = `QUASE ${textoHora}${sufixoMinutos}`;
    } else {
        // "CERCA DAS DEZ E DEZ"
        fraseFinal = `CERCA ${conector}${textoHora}${sufixoMinutos}`;
    }

    // Se for hora certa (sem minutos extra), adicionamos o período se não for Meio-dia/Meia-noite
    if (sufixoMinutos === "" && horaAlvo !== 0 && horaAlvo !== 12) {
        if (horaAlvo >= 1 && horaAlvo <= 5) fraseFinal += " DA MADRUGADA";
        else if (horaAlvo >= 6 && horaAlvo <= 11) fraseFinal += " DA MANHÃ";
        else if (horaAlvo >= 13 && horaAlvo <= 19) fraseFinal += " DA TARDE";
        else fraseFinal += " DA NOITE";
    }

    document.getElementById("frase-principal").innerText = fraseFinal.toUpperCase();

    // 3. Hora Digital (O "Ou seja")
    const hDigital = h24.toString().padStart(2, '0');
    const mDigital = min.toString().padStart(2, '0');
    document.getElementById("hora-digital").innerText = `ou seja, são ${hDigital}h${mDigital}`;
}

// Atualizar a cada 1 segundo para precisão
setInterval(atualizarRelogio, 1000);
atualizarRelogio();
