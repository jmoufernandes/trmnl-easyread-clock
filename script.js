function horaPorExtenso(h) {
  if (h === 0) return "MEIA-NOITE";
  if (h === 12) return "MEIO-DIA";

  const mapa = [
    "DOZE", "UMA", "DUAS", "TRÊS", "QUATRO", "CINCO",
    "SEIS", "SETE", "OITO", "NOVE", "DEZ", "ONZE"
  ];
  return mapa[h % 12];
}

function artigoDe(horaTexto) {
  if (horaTexto === "UMA") return "DA";
  if (horaTexto === "MEIA-NOITE") return "DA";
  if (horaTexto === "MEIO-DIA") return "DO";
  return "DAS";
}

function atualizarRelogio() {
  const agora = new Date();
  const h = agora.getHours();
  const m = agora.getMinutes();

  /* PERÍODO */
  let periodo = "É DE TARDE";
  if (h >= 20 || h <= 3) periodo = "É DE NOITE";
  else if (h >= 4 && h <= 6) periodo = "É DE MADRUGADA";
  else if (h >= 7 && h <= 12) periodo = "É DE MANHÃ";

  document.getElementById("periodo").innerText = periodo;

  /* MARCO SEGUINTE */
  let alvoMin = Math.ceil(m / 10) * 10;
  let alvoHora = h;

  if (alvoMin === 60) {
    alvoMin = 0;
    alvoHora = h + 1;
  }

  const horaTexto = horaPorExtenso(alvoHora);
  const artigo = artigoDe(horaTexto);

  let aproximacao = m < alvoMin ? "QUASE" : "CERCA";

  let textoHora =
    alvoMin === 0
      ? `${horaTexto}`
      : `${horaTexto} E ${alvoMin}`;

  document.getElementById("horaTexto").innerHTML =
    `SÃO ${aproximacao} <span class="hora">${artigo} ${textoHora}</span>`;

  document.getElementById("horaDigital").innerText =
    `ou seja, ${String(h).padStart(2, "0")}h${String(m).padStart(2, "0")}`;

  /* RELÓGIO ANALÓGICO */
  const minDeg = m * 6;
  const horaDeg = (h % 12) * 30 + m * 0.5;

  document.querySelector(".ponteiro.minutos").style.transform =
    `rotate(${minDeg}deg)`;

  document.querySelector(".ponteiro.horas").style.transform =
    `rotate(${horaDeg}deg)`;
}

atualizarRelogio();
setInterval(atualizarRelogio, 30000);
