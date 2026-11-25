const form = document.querySelector("[data-flow]");

if (form) {
  const flow = form.dataset.flow;
  const fields = form.querySelector("[data-fields]");
  const receipt = form.querySelector("[data-receipt]");
  const summary = form.querySelector("[data-summary]");
  const status = form.querySelector("[data-status]");
  const error = form.querySelector("[data-error]");
  const inputs = form.elements;
  let lastFocus;

  const windowSets = {
    "Equipe da locadora": [
      ["Entrega no evento", "Na véspera · 14h–17h", "No dia · 08h–11h"],
      ["Recolhimento", "No dia · 21h–23h", "No dia seguinte · 09h–12h"],
    ],
    "Retiro e devolvo na loja": [
      ["Retirada na loja", "Na véspera · 09h–12h", "No dia · 09h–11h"],
      ["Devolução na loja", "No dia · 17h–19h", "No dia seguinte · 10h–12h"],
    ],
  };
  const planGroups = Array.from(form.querySelectorAll("[data-zone]"));
  const lookGroups = Array.from(form.querySelectorAll("[data-look]"));
  const lookPhotos = {
    "Varanda natural": [
      "colecao.webp",
      "Poltronas em madeira e palha com sofá de linho numa varanda",
    ],
    "Salão contemporâneo": [
      "salao.webp",
      "Salão amplo com mesas e cadeiras de madeira clara",
    ],
    "Lounge intimista": [
      "lounge.webp",
      "Poltronas baixas e mesas laterais em uma sala de luz quente",
    ],
  };
  const countOf = (n, singular, plural) =>
    n + " " + (n === 1 ? singular : plural);

  function selectedLooks() {
    return lookGroups
      .map((group) => [
        group.dataset.look,
        Array.from(
          group.querySelectorAll("input:checked"),
          (input) => input.value,
        ),
      ])
      .filter(([, pieces]) => pieces.length);
  }

  function showCollection() {
    const current = inputs.colecao.value;
    for (const group of lookGroups)
      group.hidden = group.dataset.look !== current;
    const photo = form.querySelector("[data-look-photo]");
    const [source, description] = lookPhotos[current];
    if (photo.getAttribute("src") !== source) {
      photo.src = source;
      photo.alt = description;
    }
    form.querySelector("[data-look-caption]").textContent =
      current + " · referência de composição";
    const selected = selectedLooks().reduce(
      (n, [, pieces]) => n + pieces.length,
      0,
    );
    form.querySelector("[data-total]").textContent = selected
      ? countOf(selected, "peça na lista", "peças na lista")
      : "Nenhuma peça selecionada";
  }

  function furniture() {
    const count = (name) =>
      inputs[name].validity.valid ? inputs[name].valueAsNumber : 0;
    const chairs = count("lugares");
    const capacity = Number(inputs.capacidade.value);
    const math = {
      chairs,
      tables: Math.ceil(chairs / capacity),
      armchairs: count("poltronas"),
      sofas: count("sofas"),
      highTables: count("mesas-altas"),
      counters: count("balcoes"),
    };
    return { ...math, total: Object.values(math).reduce((a, b) => a + b, 0) };
  }

  function showPlan() {
    for (const group of planGroups)
      group.hidden = group.dataset.zone !== inputs.zona.value;
    const pieces = furniture();
    const counts = {
      jantar: countOf(pieces.chairs, "lugar", "lugares"),
      lounge: countOf(pieces.armchairs + pieces.sofas * 3, "lugar", "lugares"),
      recepcao: countOf(pieces.highTables + pieces.counters, "apoio", "apoios"),
    };
    for (const node of form.querySelectorAll("[data-zone-count]"))
      node.textContent = counts[node.dataset.zoneCount];
    form.querySelector("[data-total]").textContent = countOf(
      pieces.total,
      "móvel na planta",
      "móveis na planta",
    );
  }

  function showWindows() {
    const windows = windowSets[inputs.transporte.value];
    for (const [index, key] of ["ida", "volta"].entries()) {
      const [label, ...options] = windows[index];
      form.querySelector("[data-" + key + "-label]").textContent = label;
      const control = inputs[key];
      control.replaceChildren(
        new Option("Escolha uma janela", ""),
        ...options.map((option) => new Option(option)),
      );
      control.value = "";
    }
  }

  const redraw = {
    collection: showCollection,
    plan: showPlan,
    logistics: showWindows,
  }[flow];

  function rows() {
    if (flow === "collection")
      return selectedLooks().map(([look, pieces]) => [look, pieces.join(", ")]);
    if (flow === "plan") {
      const f = furniture();
      return [
        ["Jantar · Cadeiras", f.chairs],
        ["Jantar · Mesas", f.tables],
        ["Lounge · Poltronas", f.armchairs],
        ["Lounge · Sofás", f.sofas],
        ["Recepção · Mesas altas", f.highTables],
        ["Recepção · Balcões", f.counters],
      ].filter(([, count]) => count > 0);
    }
    const windows = windowSets[inputs.transporte.value];
    return [
      ["Transporte", inputs.transporte.value],
      [windows[0][0], inputs.ida.value],
      [windows[1][0], inputs.volta.value],
    ];
  }

  function edit(reset = false) {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = "";
    (reset ? form.querySelector("input") : lastFocus)?.focus();
  }

  form.addEventListener("input", (event) => {
    if (error) error.textContent = "";
    if (
      flow !== "logistics" ||
      event.target === form.querySelector("[name=transporte]:checked")
    )
      redraw();
  });
  if (flow === "plan")
    form.addEventListener(
      "invalid",
      (event) => {
        const group = event.target.closest("[data-zone]");
        if (!group || fields.querySelector("input:invalid") !== event.target)
          return;
        inputs.zona.value = group.dataset.zone;
        showPlan();
      },
      true,
    );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const breakdown = rows();
    if (!breakdown.length) {
      error.textContent =
        flow === "collection"
          ? "Selecione pelo menos uma peça."
          : "Inclua pelo menos um móvel na planta.";
      return;
    }
    lastFocus = event.submitter || fields.querySelector("input");
    summary.replaceChildren(
      ...breakdown.map(([label, value]) => {
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
    if (error) error.textContent = "";
    redraw();
    edit(true);
  });
  form.querySelector("[data-copy]").addEventListener("click", async () => {
    const copied = [
      "Vão Livre · VL-DEMO-001",
      ...rows().map(([label, value]) => label + ": " + value),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(copied);
      status.textContent = "Resumo copiado.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = "Use a opção Copiar do seu dispositivo.";
    }
  });
  redraw();
}
