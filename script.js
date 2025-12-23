function horaPorExtenso(h) {
  if (h === 0) return "MEIA-NOITE";
  if (h === 12) return "MEIO-DIA";

  const mapa = [
    "DOZE", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO",
    "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE"
  ];
  return mapa[h % 12];
}

function artigoDe(textoHora) {
  if (textoHora === "UMA") return "DA";
  if (textoHora === "MEIA-NOITE") return "DA";
  if (textoHora === "MEIO-DIA") return "DO";
  return "DAS";
}

function obterRotulo(h, m) {
  const blocos = [0, 10, 20, 30, 40, 50];
  let bloco = 0;

  for (let i = 0; i < blocos.length; i++) {
    if (m >= blocos[i]) bloco = blocos[i];
  }

  let horaTexto = horaPorExtenso(h);
  let textoRotulo =
    bloco === 0 ? horaTexto : `${horaTexto} E ${bloco}`;

  // transição explícita para hora seguinte
  if (bloco === 50 && m >= 55) {
    textoRotulo = horaPorExtenso(h + 1);
  }

  let tipo = m < bloco + 5 ? "QUASE" : "CERCA";

  return { tipo, textoRotulo };
}

function atualizarRelogio() {
  const agora = new Date();
  const h = agora.getHours();
  const m = agora.getMinutes();

  /* PERÍODO DO DIA */
  let periodo = "É DE TARDE";
  if (h >= 20 || h <= 3) periodo = "É DE NOITE";
  else if (h >= 4 && h <= 6) periodo = "É DE MADRUGADA";
  else if (h >= 7 && h <= 12) periodo = "É DE MANHÃ";

  document.getElementById("periodo").innerText = periodo;

  /* TEXTO CENTRAL */
  const { tipo, textoRotulo } = obterRotulo(h, m);
  const artigo = artigoDe(textoRotulo.split(" ")[0]);

  let frase =
    tipo === "QUASE"
      ? `SÃO QUASE <span class="hora">${textoRotulo}</span>`
      : `SÃO CERCA <span class="hora">DE ${artigo} ${textoRotulo}</span>`;

  document.getElementById("horaTexto").innerHTML = frase;

  document.getElementById("horaDigital").innerText =
    `ou seja, ${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;

  /* RELÓGIO DE PONTEIROS — CORRIGIDO */
  const ponteiroMin = document.querySelector(".ponteiro.minutos");
  const ponteiroHora = document.querySelector(".ponteiro.horas");

  const anguloMin = m * 6; // 360 / 60
  const anguloHora = (h % 12) * 30 + m * 0.5; // 360 / 12 + compensação

  ponteiroMin.style.transform =
    `translateY(-50%) rotate(${anguloMin}deg)`;

  ponteiroHora.style.transform =
    `translateY(-50%) rotate(${anguloHora}deg)`;
}

atualizarRelogio();
setInterval(atualizarRelogio, 30000);
