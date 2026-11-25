const form = document.querySelector("form[data-flow]");

if (form) {
  const flow = form.dataset.flow;
  const fields = form.querySelector("[data-fields]");
  const receipt = form.querySelector("[data-receipt]");
  const summary = form.querySelector("[data-summary]");
  const status = form.querySelector("[data-status]");
  const error = form.querySelector("[data-error]");
  const inputs = form.elements;
  const formats = { Postal: [148, 105], Convite: [105, 148], Cartão: [90, 50] };
  const eventItems = [
    ["Crachás", "cracha"],
    ["Programas", "programa"],
    ["Placas de mesa", "placas"],
  ];
  const hasNumbers = (input) => input.validity.valid;
  const units = (count) => count + (count === 1 ? " impresso" : " impressos");
  let lastFocus;

  function updateShelf() {
    for (const item of form.querySelectorAll("[data-group]")) {
      const control = item.querySelector("input");
      item.hidden = item.dataset.group !== inputs.uso.value;
      control.disabled = item.hidden;
      if (item.hidden) control.checked = false;
    }
  }

  function updateProof() {
    const size = formats[inputs.formato.value];
    const trim = form.querySelector("[data-trim]");
    trim.style.width = (size[0] / 297) * 100 + "%";
    trim.style.height = (size[1] / 210) * 100 + "%";
    form.querySelector("[data-sheet-name]").textContent = inputs.formato.value;
    form.querySelector("[data-dimension]").textContent =
      inputs.formato.value + " · " + size.join(" × ") + " mm";

    const unsupported = inputs.papel.value === "Papel texturizado 300 g/m²";
    inputs.acabamento.options[1].disabled = unsupported;
    if (unsupported) inputs.acabamento.value = "Sem laminação";
    trim.classList.toggle("textured", unsupported);
    trim.classList.toggle(
      "laminated",
      inputs.acabamento.value === "Laminação fosca",
    );
    form.querySelector("[data-stock]").textContent = unsupported
      ? "Nesta demonstração, o papel texturizado fica sem laminação."
      : "Escolha se quer manter o papel aparente ou aplicar laminação fosca.";
  }

  function eventTotal() {
    const numbers = eventItems.map(([, key]) => inputs[key]);
    return numbers.every(hasNumbers)
      ? numbers.reduce((sum, input) => sum + input.valueAsNumber, 0)
      : null;
  }

  function updateEvent() {
    const total = eventTotal();
    form.querySelector("[data-total]").textContent =
      total === null ? "Confira as quantidades" : units(total);
    error.textContent = "";
  }

  const refresh = {
    shelf: updateShelf,
    proof: updateProof,
    event: updateEvent,
  }[flow];

  function makeRows() {
    if (flow === "shelf") {
      const item = form.querySelector("[name=impresso]:checked");
      return [
        ["Uso", inputs.uso.value],
        ["Impresso", item.value],
        ["Formato", item.dataset.measure],
        ["Exemplares", inputs.tiragem.value],
      ];
    }
    if (flow === "proof")
      return [
        ["Formato", form.querySelector("[data-dimension]").textContent],
        ["Papel", inputs.papel.value],
        ["Acabamento", inputs.acabamento.value],
      ];
    return [
      ["Participantes", inputs.participantes.value],
      ["Mesas", inputs.mesas.value],
      ...eventItems.map(([label, key]) => [label, inputs[key].value]),
      ["Total", units(eventTotal())],
    ];
  }

  form.addEventListener("input", refresh);
  if (flow === "event") {
    form.querySelector("[data-estimate]").addEventListener("click", () => {
      if (
        !inputs.participantes.reportValidity() ||
        !inputs.mesas.reportValidity()
      )
        return;
      inputs.cracha.value = inputs.participantes.value;
      inputs.programa.value = inputs.participantes.value;
      inputs.placas.value = inputs.mesas.value;
      updateEvent();
    });
  }

  function edit(reset = false) {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = "";
    (reset || !lastFocus
      ? fields.querySelector("input, select")
      : lastFocus
    ).focus();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (flow === "event" && eventTotal() === 0) {
      error.textContent = "Inclua pelo menos um impresso na ficha.";
      inputs.cracha.focus();
      return;
    }
    lastFocus = document.activeElement;
    summary.replaceChildren(
      ...makeRows().map(([label, value]) => {
        const row = document.createElement("div");
        const term = document.createElement("dt");
        const detail = document.createElement("dd");
        term.textContent = label;
        detail.textContent = value;
        row.append(term, detail);
        return row;
      }),
    );
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  form.querySelector("[data-edit]").addEventListener("click", () => edit());
  form.querySelector("[data-reset]").addEventListener("click", () => {
    form.reset();
    refresh();
    edit(true);
  });
  form.querySelector("[data-copy]").addEventListener("click", async () => {
    const copy = [
      "Margem Comum · MC-DEMO-001",
      ...makeRows().map(([label, value]) => label + ": " + value),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(copy);
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

  refresh();
}
