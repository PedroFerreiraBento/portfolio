const form = document.querySelector("form[data-flow]");

if (form) {
  const flow = form.dataset.flow;
  const fields = form.querySelector("[data-fields]");
  const receipt = form.querySelector("[data-receipt]");
  const summary = form.querySelector("[data-summary]");
  const status = form.querySelector("[data-status]");
  const error = form.querySelector("[data-error]");
  let editFocus;

  const garmentZones = {
    Blazer: [
      ["Mangas", 88, 169],
      ["Laterais", 206, 150],
      ["Comprimento", 155, 216],
    ],
    Calça: [
      ["Cintura", 155, 50],
      ["Laterais", 216, 115],
      ["Barra", 195, 220],
    ],
    Camisa: [
      ["Mangas", 88, 180],
      ["Laterais", 206, 150],
      ["Comprimento", 155, 222],
    ],
  };
  const selectedZones = new Map();
  const repairOptions = {
    Calça: ["Ajustar barra", "Ajustar cintura", "Trocar zíper"],
    Camisa: ["Ajustar mangas", "Ajustar laterais", "Trocar botão"],
    Vestido: ["Ajustar barra", "Ajustar alças", "Trocar zíper"],
    Jaqueta: ["Consertar costura", "Ajustar mangas", "Trocar zíper"],
  };
  const repairs = new Map();
  const slots = {
    "Avaliação e prova": {
      Terça: ["10h30", "15h"],
      Quinta: ["11h", "16h30"],
      Sábado: ["09h30", "11h30"],
    },
    Retirada: {
      Terça: ["09h", "13h30", "17h"],
      Quinta: ["09h", "14h", "17h30"],
      Sábado: ["09h", "12h"],
    },
  };

  function updateMap() {
    const garment = form.elements.roupa.value;
    const marked = selectedZones.get(garment) || new Set();
    for (const svg of form.querySelectorAll("[data-garment]")) {
      svg.toggleAttribute("hidden", svg.dataset.garment !== garment);
      for (const mark of svg.querySelectorAll("[data-zone]")) {
        mark.classList.toggle("active", marked.has(mark.dataset.zone));
      }
    }
    for (const box of form.querySelectorAll("[data-area]")) {
      box.checked = marked.has(box.value);
    }
    for (const button of form.querySelectorAll("[data-point]")) {
      button.setAttribute(
        "aria-pressed",
        String(marked.has(button.dataset.point)),
      );
    }
    form.querySelector("[data-map-caption]").textContent =
      garment +
      " · " +
      (marked.size ? [...marked].join(", ") : "nenhum ponto marcado");
  }

  function renderZones() {
    const garment = form.elements.roupa.value;
    const zoneFields = form.querySelector("[data-zones]");
    const points = form.querySelector("[data-points]");
    zoneFields.replaceChildren();
    points.replaceChildren();
    for (const [zone, x, y] of garmentZones[garment]) {
      const label = document.createElement("label");
      const check = document.createElement("input");
      check.type = "checkbox";
      check.value = zone;
      check.dataset.area = "";
      label.append(check, document.createTextNode(zone));
      zoneFields.append(label);

      const point = document.createElement("button");
      point.type = "button";
      point.dataset.point = zone;
      point.setAttribute("aria-label", zone);
      point.style.left = (x / 310) * 100 + "%";
      point.style.top = (y / 265) * 100 + "%";
      points.append(point);
    }
    updateMap();
  }

  function markZone(zone, checked) {
    const garment = form.elements.roupa.value;
    const marked = selectedZones.get(garment) || new Set();
    if (checked) marked.add(zone);
    else marked.delete(zone);
    selectedZones.set(garment, marked);
    error.textContent = "";
    updateMap();
  }

  function renderRepairOptions() {
    form.elements.conserto.replaceChildren(
      ...repairOptions[form.elements.peca.value].map(
        (name) => new Option(name, name),
      ),
    );
  }

  function renderRepairs() {
    const list = form.querySelector("[data-items]");
    list.replaceChildren(
      ...[...repairs].map(([key, repair]) => {
        const line = document.createElement("li");
        const title = document.createElement("div");
        const name = document.createElement("strong");
        name.textContent = repair.piece;
        const detail = document.createElement("span");
        detail.textContent = repair.service + " · " + repair.quantity;
        title.append(name, document.createElement("br"), detail);
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Remover";
        remove.dataset.remove = key;
        remove.setAttribute(
          "aria-label",
          "Remover " + repair.piece + " · " + repair.service,
        );
        line.append(title, remove);
        return line;
      }),
    );
    const total = [...repairs.values()].reduce(
      (sum, repair) => sum + repair.quantity,
      0,
    );
    form.querySelector("[data-total]").textContent = total
      ? total + (total === 1 ? " peça na lista" : " peças na lista")
      : "Nenhuma peça na lista";
  }

  function renderSlots() {
    const visit = form.elements.visita.value;
    const hours = slots[visit][form.elements.dia.value];
    form.querySelector("[data-slots]").replaceChildren(
      ...hours.map((hour) => {
        const label = document.createElement("label");
        label.className = "choice";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "horario";
        input.value = hour;
        input.required = true;
        const text = document.createElement("span");
        text.textContent = hour;
        label.append(input, text);
        return label;
      }),
    );
    form.querySelector("[data-visit-note]").textContent =
      visit === "Retirada"
        ? "Combine a retirada quando o ateliê avisar que a peça está pronta."
        : "Leve a roupa e os acessórios que costuma usar com ela.";
  }

  function getRows() {
    if (flow === "map") {
      const garment = form.elements.roupa.value;
      const zones = selectedZones.get(garment);
      return zones?.size
        ? [
            ["Peça", garment],
            ["Pontos", [...zones].join(", ")],
          ]
        : [];
    }
    if (flow === "list") {
      return [...repairs.values()].map(({ piece, service, quantity }) => [
        piece + " · " + service,
        String(quantity),
      ]);
    }
    return [
      ["Visita", form.elements.visita.value],
      ["Dia fictício", form.elements.dia.value],
      ["Horário fictício", form.elements.horario.value],
    ];
  }

  form.addEventListener("change", (event) => {
    const input = event.target;
    if (error) error.textContent = "";
    if (input.name === "roupa") renderZones();
    if (input.hasAttribute("data-area")) markZone(input.value, input.checked);
    if (input.name === "peca") renderRepairOptions();
    if (input.name === "visita" || input.name === "dia") renderSlots();
  });

  form.addEventListener("click", (event) => {
    const point = event.target.closest("[data-point]");
    if (point)
      markZone(
        point.dataset.point,
        point.getAttribute("aria-pressed") === "false",
      );
    const add = event.target.closest("[data-add]");
    if (add) {
      const quantity = form.elements.quantidade;
      if (!quantity.reportValidity()) return;
      const piece = form.elements.peca.value;
      const service = form.elements.conserto.value;
      const key = piece + "|" + service;
      const prior = repairs.get(key)?.quantity || 0;
      repairs.set(key, {
        piece,
        service,
        quantity: prior + quantity.valueAsNumber,
      });
      quantity.value = "1";
      error.textContent = "";
      renderRepairs();
    }
    const remove = event.target.closest("[data-remove]");
    if (remove) {
      repairs.delete(remove.dataset.remove);
      renderRepairs();
      form.querySelector("[data-remove], [data-add]").focus();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const rows = getRows();
    if (!rows.length) {
      error.textContent =
        flow === "map"
          ? "Marque ao menos um ponto na peça."
          : "Adicione ao menos um conserto à lista.";
      return;
    }
    summary.replaceChildren(
      ...rows.map(([label, value]) => {
        const row = document.createElement("div");
        const key = document.createElement("dt");
        const description = document.createElement("dd");
        key.textContent = label;
        description.textContent = value;
        row.append(key, description);
        return row;
      }),
    );
    editFocus = document.activeElement;
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  function edit(focus) {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = "";
    (focus || fields.querySelector("input, select, button")).focus();
  }

  form
    .querySelector("[data-edit]")
    .addEventListener("click", () => edit(editFocus));
  form.querySelector("[data-reset]").addEventListener("click", () => {
    form.reset();
    selectedZones.clear();
    repairs.clear();
    if (error) error.textContent = "";
    if (flow === "map") renderZones();
    if (flow === "list") {
      renderRepairOptions();
      renderRepairs();
    }
    if (flow === "fitting") renderSlots();
    edit();
  });

  form.querySelector("[data-copy]").addEventListener("click", async () => {
    const text = [
      "Ponto de Fio · PF-DEMO-001",
      ...getRows().map(([label, value]) => label + ": " + value),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Ficha copiada.";
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(summary);
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Use a opção Copiar do seu dispositivo.";
    }
  });

  if (flow === "map") renderZones();
  if (flow === "list") {
    renderRepairOptions();
    renderRepairs();
  }
  if (flow === "fitting") renderSlots();
}
