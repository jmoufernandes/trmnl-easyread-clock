function atualizarRelogio() {
    const agora = new Date();
    const horas = agora.getHours();
    const minutos = agora.getMinutes();

    // 1. Segmento do Dia
    let segmento = "";
    if (horas >= 4 && horas < 7) segmento = "MADRUGADA";
    else if (horas >= 7 && horas < 13) segmento = "MANHÃ";
    else if (horas >= 13 && horas < 20) segmento = "TARDE";
    else segmento = "NOITE";

    document.getElementById("segmento-dia").innerText = `É DE ${segmento}`;

    // 2. Lógica de Texto (Tabela de Minutos)
    let prefixo = "";
    let minutosTexto = "";
    let horaReferencia = horas;

    // Determinar o patamar de minutos e o prefixo
    if (minutos >= 58 || minutos <= 2) {
        prefixo = "CERCA "; 
        minutosTexto = "";
        if (minutos >= 53) horaReferencia = (horas + 1) % 24; 
    } else if (minutos >= 3 && minutos <= 7) {
        prefixo = "QUASE ";
        minutosTexto = " E DEZ";
    } else if (minutos >= 8 && minutos <= 12) {
        prefixo = "CERCA ";
        minutosTexto = " E DEZ";
    } else if (minutos >= 13 && minutos <= 17) {
        prefixo = "QUASE ";
        minutosTexto = " E VINTE";
    } else if (minutos >= 18 && minutos <= 22) {
        prefixo = "CERCA ";
        minutosTexto = " E VINTE";
    } else if (minutos >= 23 && minutos <= 27) {
        prefixo = "QUASE ";
        minutosTexto = " E MEIA";
    } else if (minutos >= 28 && minutos <= 32) {
        prefixo = "CERCA ";
        minutosTexto = " E MEIA";
    } else if (minutos >= 33 && minutos <= 37) {
        prefixo = "QUASE ";
        minutosTexto = " E QUARENTA";
    } else if (minutos >= 38 && minutos <= 42) {
        prefixo = "CERCA ";
        minutosTexto = " E QUARENTA";
    } else if (minutos >= 43 && minutos <= 47) {
        prefixo = "QUASE ";
        minutosTexto = " E CINQUENTA";
    } else if (minutos >= 48 && minutos <= 52) {
        prefixo = "CERCA ";
        minutosTexto = " E CINQUENTA";
    } else if (minutos >= 53 && minutos <= 57) {
        prefixo = "QUASE ";
        minutosTexto = "";
        horaReferencia = (horas + 1) % 24;
    }

    // Nomes das Horas e Conectores
    const nomes = ["MEIA-NOITE", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE", "MEIO-DIA", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE"];
    
    // Regra do conector: "DA" para Meia-noite, Uma, Meio-dia. "DAS" para o resto.
    let conector = (horaReferencia === 0 || horaReferencia === 1 || horaReferencia === 12 || horaReferencia === 13) ? "DA " : "DAS ";
    
    // Se for "QUASE", removemos o "DAS" para soar melhor (ex: QUASE DEZ E DEZ)
    // Se for "CERCA", mantemos o "DAS" (ex: CERCA DAS DEZ E DEZ)
    let fraseFinal = "";
    if (prefixo === "QUASE ") {
        fraseFinal = `QUASE ${nomes[horaReferencia]}${minutosTexto}`;
    } else {
        fraseFinal = `CERCA ${conector}${nomes[horaReferencia]}${minutosTexto}`;
    }

    // Adição de "DA NOITE/MANHÃ" se for hora exata (sem minutosTexto)
    if (minutosTexto === "") {
        if (horaReferencia >= 20 || horaReferencia <= 3) fraseFinal += " DA NOITE";
        else if (horaReferencia >= 13 && horaReferencia < 20) fraseFinal += " DA TARDE";
        else if (horaReferencia > 0 && horaReferencia < 12) fraseFinal += " DA MANHÃ";
    }

    document.getElementById("frase-principal").innerText = fraseFinal.toUpperCase();

    // 3. Digital
    const horaDigital = agora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    document.getElementById("hora-digital").innerText = `ou seja, são ${horaDigital}`;
}
