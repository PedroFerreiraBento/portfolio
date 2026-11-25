const form = document.querySelector("[data-flow]");

if (form) {
  const mode = form.dataset.flow;
  const fields = form.querySelector("[data-fields]");
  const receipt = form.querySelector("[data-receipt]");
  const summary = form.querySelector("[data-summary]");
  const status = form.querySelector("[data-status]");
  const error = form.querySelector("[data-error]");
  const loads = [...form.querySelectorAll("[data-load]")];
  const pieceDetails = {
    Blazer: [
      "blazer.webp",
      "Blazer de tecido escuro em um cabide",
      "Observe se há forro, estrutura no ombro ou detalhes que merecem atenção na avaliação.",
    ],
    "Camisa delicada": [
      "camisa.webp",
      "Camisa clara dobrada junto a uma etiqueta e tecido índigo",
      "Confira a etiqueta. Detalhes como bordados, botões ou áreas de desgaste ajudam a orientar a conversa.",
    ],
    "Vestido de festa": [
      "vestido.webp",
      "Vestido de festa em cetim azul-petróleo",
      "Informe se a peça tem adornos, camadas ou forro. Se houver uma área que preocupa, indique qual na avaliação.",
    ],
  };
  const periods = {
    "Coleta em casa": {
      "Terça-feira": ["08h–11h", "14h–17h"],
      "Quinta-feira": ["09h–12h", "15h–18h"],
      Sábado: ["09h–12h"],
    },
    "Entrega no balcão": {
      "Terça-feira": ["09h–12h", "13h–16h", "16h–19h"],
      "Quinta-feira": ["09h–12h", "13h–16h", "16h–19h"],
      Sábado: ["09h–12h", "12h–15h"],
    },
  };
  const formatWeight = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1,
  });
  const weight = (n) => formatWeight.format(n) + " kg";
  let focusBeforeSummary;

  function checkWeight() {
    if (loads.some((input) => !input.validity.valid)) return null;
    return loads.reduce((total, input) => total + input.valueAsNumber, 0);
  }

  function updateBasket() {
    const total = checkWeight();
    form.querySelector("[data-total]").textContent =
      total === null ? "Confira os pesos" : weight(total) + " estimados";
    error.textContent = "";
  }

  function updatePiece() {
    const piece = form.elements.peca.value;
    const [source, description, note] = pieceDetails[piece];
    const image = form.querySelector("[data-piece-image]");
    if (image.getAttribute("src") !== source) {
      image.src = source;
      image.alt = description;
    }
    form.querySelector("[data-piece-caption]").textContent =
      piece + " · referência de peça";
    form.querySelector("[data-piece-name]").textContent = piece;
    form.querySelector("[data-piece-note]").textContent = note;
  }

  function refreshPeriods() {
    const day = form.elements.dia.value;
    const modality = form.elements.modalidade.value;
    const options = periods[modality][day];
    const labels = options.map((period) => {
      const label = document.createElement("label");
      const choice = document.createElement("input");
      choice.type = "radio";
      choice.name = "periodo";
      choice.value = period;
      choice.required = true;
      const text = document.createElement("span");
      text.textContent = period;
      label.className = "period";
      label.append(choice, text);
      return label;
    });
    form.querySelector("[data-periods]").replaceChildren(...labels);
    form.querySelector("[data-availability]").textContent =
      options.length +
      (options.length === 1 ? " período fictício" : " períodos fictícios") +
      " disponíveis para " +
      modality.toLowerCase() +
      ".";
  }

  function rows() {
    if (mode === "cesto") {
      const weightRows = loads
        .filter((input) => input.valueAsNumber > 0)
        .map((input) => [input.dataset.load, weight(input.valueAsNumber)]);
      return [
        ...weightRows,
        ["Serviço", form.elements.servico.value],
        ["Total aproximado", weight(checkWeight())],
      ];
    }
    if (mode === "pecas") {
      return [
        ["Peça", form.elements.peca.value],
        ["Observação", form.elements.observacao.value],
      ];
    }
    return [
      ["Modalidade", form.elements.modalidade.value],
      ["Dia", form.elements.dia.value],
      ["Período fictício", form.elements.periodo.value],
    ];
  }

  function edit() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = "";
    (focusBeforeSummary || fields.querySelector("input")).focus();
  }

  function reset() {
    form.reset();
    if (mode === "cesto") updateBasket();
    if (mode === "pecas") updatePiece();
    if (mode === "coleta") refreshPeriods();
    focusBeforeSummary = null;
    edit();
  }

  form.addEventListener("input", (event) => {
    if (mode === "cesto") updateBasket();
    if (mode === "pecas" && event.target.name === "peca") updatePiece();
    if (
      mode === "coleta" &&
      (event.target.name === "dia" || event.target.name === "modalidade")
    )
      refreshPeriods();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (mode === "cesto" && !checkWeight()) {
      error.textContent = "Informe pelo menos um peso acima de zero.";
      loads[0].focus();
      return;
    }
    summary.replaceChildren(
      ...rows().map(([label, value]) => {
        const row = document.createElement("div");
        const term = document.createElement("dt");
        const detail = document.createElement("dd");
        term.textContent = label;
        detail.textContent = value;
        row.append(term, detail);
        return row;
      }),
    );
    focusBeforeSummary = event.submitter;
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  form.querySelector("[data-edit]").addEventListener("click", edit);
  form.querySelector("[data-reset]").addEventListener("click", reset);
  form.querySelector("[data-copy]").addEventListener("click", async () => {
    const text = [
      "Linha Clara · LC-DEMO-001",
      ...rows().map(([label, value]) => label + ": " + value),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Resumo copiado.";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Use a opção Copiar do seu dispositivo.";
    }
  });

  if (mode === "coleta") refreshPeriods();
}
