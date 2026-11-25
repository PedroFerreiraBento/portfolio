const form = document.querySelector("[data-booking]");

if (form) {
  const days = [
    ["Terça, 8 de dezembro", "08"],
    ["Quinta, 10 de dezembro", "10"],
    ["Sábado, 12 de dezembro", "12"],
  ];
  const agenda = {
    mentoria: [
      ["14h", "16h30", "10h"],
      ["15h", "18h", "11h"],
      ["16h", "19h", "12h"],
    ],
    comparador: [
      ["14h", "15h30", "09h"],
      ["16h", "18h30", "11h"],
      ["17h30", "19h30", "13h"],
    ],
    dueto: [
      ["14h", "16h", "09h30"],
      ["15h30", "18h", "11h"],
      ["17h", "19h", "13h30"],
    ],
    torno: [
      ["09h", "14h", "10h"],
      ["11h", "16h", "13h"],
      ["13h", "18h", "15h"],
    ],
    esmaltes: [
      ["10h", "14h30", "11h"],
      ["11h", "16h", "12h"],
      ["13h", "17h", "14h"],
    ],
    roda: [
      ["10h", "14h", "09h"],
      ["12h", "15h", "11h"],
      ["14h", "17h", "14h"],
    ],
    salas: [
      ["13h", "16h", "10h"],
      ["14h", "17h", "11h"],
      ["15h", "19h", "13h"],
    ],
    rider: [
      ["10h", "15h30", "12h"],
      ["11h", "16h30", "13h"],
      ["14h", "18h30", "15h"],
    ],
    bloco: [
      ["10h", "14h", "13h"],
      ["11h", "14h30", "13h30"],
      ["12h", "15h", "14h"],
    ],
  };
  const type = form.dataset.booking;
  const list = form.querySelector("[data-slots]");
  const receipt = form.querySelector("[data-receipt]");
  const fields = form.querySelector("[data-fields]");
  const submit = form.querySelector("[data-submit]");
  const status = form.querySelector("[data-status]");
  const timing = form.querySelector("[data-timing]");
  const selection = form.querySelector("[data-selection]");
  const summary = form.querySelector("[data-summary]");
  const reference = form.dataset.code + "-DEMO-001";

  function selectedIndex(name) {
    return [...form.querySelectorAll('[name="' + name + '"]')].findIndex(
      (input) => input.checked,
    );
  }

  function timeOfDay(total) {
    const hour = Math.floor(total / 60);
    const minute = total % 60;
    return hour + "h" + (minute ? String(minute).padStart(2, "0") : "");
  }

  function slotOptions() {
    const first = selectedIndex("choice");
    const second = selectedIndex("detail");
    const values = new FormData(form);
    if (selection) {
      const equipment = values.getAll("extra");
      selection.textContent =
        type === "rider"
          ? equipment.length
            ? equipment.length + " equipamentos selecionados."
            : "Nenhum equipamento extra selecionado."
          : values.get("choice") + " · " + values.get("detail");
    }

    const diagram = form.querySelector("[data-diagram]");
    if (diagram) {
      const partOne = diagram.querySelector("[data-part-one]");
      const partTwo = diagram.querySelector("[data-part-two]");
      if (partOne) partOne.textContent = values.get("choice");
      if (partTwo) partTwo.textContent = values.get("detail");
      if (type === "esmaltes") {
        diagram.dataset.glaze = second;
        partOne.textContent = values.get("detail");
        partTwo.textContent = values.get("choice");
      }
      if (type === "roda") {
        const seats = diagram.querySelector("[data-seats]");
        seats.replaceChildren(
          ...Array.from({ length: 4 }, (_, index) => {
            const seat = document.createElement("i");
            seat.classList.toggle("active", index < first + 2);
            return seat;
          }),
        );
      }
      if (type === "bloco") {
        const length = (first + 2) * 60 + second * 15;
        const label = Math.floor(length / 60) + "h" + (length % 60 || "");
        diagram.querySelector("[data-block-time]").textContent =
          label + " no total";
        diagram.style.setProperty("--pause-mark", second * 12 + "px");
      }
    }

    return agenda[type][first].map((hour, index) => {
      const [hours, minutes] = hour.split("h");
      const start = Number(hours) * 60 + Number(minutes);
      const adjusted = start + second * 15;
      const duration = type === "bloco" ? (first + 2) * 60 + second * 15 : 0;
      const end = duration ? timeOfDay(adjusted + duration) : "";
      return {
        label: days[index][0],
        start: timeOfDay(adjusted),
        end,
      };
    });
  }

  function renderSchedule() {
    list.replaceChildren(
      ...slotOptions().map((slot) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        const date = document.createElement("span");
        const time = document.createElement("time");
        input.type = "radio";
        input.name = "slot";
        input.value =
          slot.label + " · " + slot.start + (slot.end ? "–" + slot.end : "");
        input.required = true;
        date.textContent = slot.label;
        time.textContent = slot.start + (slot.end ? "–" + slot.end : "");
        label.append(input, date, time);
        return label;
      }),
    );
    timing.textContent = "";
    submit.disabled = true;
  }

  function getRows() {
    const data = new FormData(form);
    const rows = ["choice", "detail"].map((name) => [
      form
        .querySelector('[name="' + name + '"]')
        .closest("fieldset")
        .querySelector("legend").textContent,
      data.get(name),
    ]);
    const extras = data.getAll("extra");
    if (type === "rider")
      rows.push(["Equipamentos", extras.join(", ") || "Nenhum extra"]);
    rows.push([
      type === "bloco" ? "Início e fim" : "Horário de exemplo",
      data.get("slot"),
    ]);
    return rows;
  }

  form.addEventListener("change", (event) => {
    if (event.target.name === "slot") {
      submit.disabled = false;
      timing.textContent = event.target.value;
    } else if (event.target.name === "extra") {
      slotOptions();
    } else {
      renderSchedule();
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!new FormData(form).get("slot")) return;
    summary.replaceChildren(
      ...getRows().map(([key, value]) => {
        const row = document.createElement("div");
        const name = document.createElement("dt");
        const detail = document.createElement("dd");
        name.textContent = key;
        detail.textContent = value;
        row.append(name, detail);
        return row;
      }),
    );
    receipt.querySelector("[data-code]").textContent = reference;
    status.textContent = "";
    fields.hidden = true;
    receipt.hidden = false;
    receipt.focus();
  });

  function edit() {
    receipt.hidden = true;
    fields.hidden = false;
    status.textContent = "";
    form.querySelector("input:checked").focus();
  }

  form.querySelector("[data-copy]").addEventListener("click", async () => {
    const text = [
      form.dataset.brand + " · " + form.dataset.kind + " · " + reference,
      ...getRows().map(([key, value]) => key + ": " + value),
      "Simulação de horário.",
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Resumo copiado.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(summary);
      const selected = window.getSelection();
      selected.removeAllRanges();
      selected.addRange(range);
      status.textContent = "Use a opção Copiar do seu dispositivo.";
    }
  });
  form.querySelector("[data-edit]").addEventListener("click", edit);
  form.querySelector("[data-reset]").addEventListener("click", () => {
    form.reset();
    renderSchedule();
    edit();
  });
  renderSchedule();
}
