function atualizarRelogio() {
    const agora = new Date();
    const horas = agora.getHours();
    const minutos = agora.getMinutes();

    // 1. Definir Segmento do Dia
    let segmento = "";
    if (horas >= 4 && horas < 7) segmento = "MADRUGADA";
    else if (horas >= 7 && horas < 13) segmento = "MANHÃ";
    else if (horas >= 13 && horas < 20) segmento = "TARDE";
    else segmento = "NOITE";

    document.getElementById("segmento-dia").innerText = segmento;

    // 2. Lógica de Arredondamento e Frase Principal
    let frasePrincipal = "";
    let horaReferencia = horas;
    let minutosArredondados = 0;

    // Se estivermos nos minutos finais, a referência passa para a hora seguinte
    if (minutos >= 53) {
        horaReferencia = (horas + 1) % 24;
        minutosArredondados = 0;
    } else {
        // Arredonda para o múltiplo de 10 mais próximo (10, 20, 30...)
        minutosArredondados = Math.round(minutos / 10) * 10;
    }

    // Tradução da hora para texto e conectores
    const nomesHoras = ["MEIA-NOITE", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE", "MEIO-DIA", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO", "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE"];
    const conectores = (h) => (h === 0 || h === 12 || h === 1 || h === 13) ? "DA" : "DAS";
    
    let baseHora = nomesHoras[horaReferencia];
    let sufixoDia = "";
    
    // Adiciona "da manhã/tarde/noite" apenas se for hora exata ou perto disso
    if (minutosArredondados === 0) {
        if (horaReferencia > 0 && horaReferencia < 12) sufixoDia = " DA MANHÃ";
        else if (horaReferencia > 12 && horaReferencia < 20) sufixoDia = " DA TARDE";
        else if (horaReferencia >= 20 || horaReferencia === 0) sufixoDia = " DA NOITE";
    }

    // Construção da frase de minutos
    let textoMinutos = "";
    if (minutosArredondados === 30) textoMinutos = " E MEIA";
    else if (minutosArredondados > 0) textoMinutos = ` E ${minutosArredondados}`;

    // Prefixo "Quase" ou "Cerca de"
    let prefixo = "";
    const resto = minutos % 10;
    if (minutos >= 53 && minutos <= 57) prefixo = "QUASE ";
    else if (minutos >= 58 || minutos <= 2) prefixo = "CERCA " + conectores(horaReferencia) + " ";
    else if (resto >= 3 && resto <= 7) prefixo = "QUASE ";
    else prefixo = "CERCA " + conectores(horaReferencia) + " ";

    frasePrincipal = `${prefixo}${baseHora}${textoMinutos}${sufixoDia}`;
    document.getElementById("frase-principal").innerText = frasePrincipal.toUpperCase();

    // 3. Hora Digital (O "Ou seja")
    const horaDigital = agora.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    document.getElementById("hora-digital").innerText = `ou seja, são ${horaDigital}`;
}

// Atualiza a cada segundo
setInterval(atualizarRelogio, 1000);
atualizarRelogio();
