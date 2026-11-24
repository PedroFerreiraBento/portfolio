(() => {
  const form = document.querySelector(".intake");
  const service = form.querySelector("#service");
  const finish = form.querySelector("#finish");
  const period = form.querySelector("#period");
  const example = document.querySelector("[data-example]");
  const submit = form.querySelector("[type=submit]");
  const receipt = document.querySelector(".receipt");
  const carry = form.querySelector("[data-carry]");
  const copyStatus = receipt.querySelector(".copy-status");
  const info = {
    vinho: {
      name: "Amora · cremoso brilhante",
      alt: "Mão sobre veludo cinza com unhas curtas esmaltadas em vinho",
    },
    rosa: {
      name: "Névoa rosada · translúcido",
      alt: "Mão sobre tecido lilás com esmalte rosa translúcido",
    },
    cobre: {
      name: "Cobre leve · perolado",
      alt: "Mão sobre seda terracota com esmalte cobre perolado",
    },
    conversa: { name: "Decidir no atendimento" },
  };
  let reference = "";
  let sequence = 0;
  function finishOptions() {
    finish.disabled = !service.value;
    finish.replaceChildren(
      new Option(
        service.value
          ? "Selecione a referência"
          : "Selecione o serviço primeiro",
        "",
      ),
    );
    if (service.value)
      for (const [value, item] of Object.entries(info))
        finish.add(new Option(item.name, value));
  }
  function updateLook() {
    carry.hidden = !reference;
    carry.textContent = reference;
    const look = document.querySelector(".look");
    if (!look) return;
    const name = service.value
      ? service.selectedOptions[0].textContent
      : "A escolher";
    const tone = info[finish.value]?.name || "A escolher";
    look.querySelector("[data-look-service]").textContent = name;
    look.querySelector("[data-look-finish]").textContent = tone;
    look.querySelector("[data-look-period]").textContent =
      period.value || "A escolher";
    look.querySelector("[data-composition]").textContent =
      service.value && finish.value
        ? name + " com " + tone.toLocaleLowerCase("pt-BR") + "."
        : "Escolha o serviço e o acabamento para montar uma referência.";
    const image = look.querySelector("img");
    const visual = info[finish.value]?.alt ? finish.value : "rosa";
    image.srcset = visual + "-720.webp 720w, " + visual + "-1440.webp 1440w";
    image.src = visual + "-720.webp";
    image.alt = info[visual].alt;
  }
  function clearReceipt() {
    receipt.hidden = true;
    copyStatus.textContent = "";
  }
  const sampleButtons = [...document.querySelectorAll("[data-sample]")];
  const panels = [...document.querySelectorAll("[data-panel]")];
  sampleButtons.forEach((button) =>
    button.addEventListener("click", () => {
      sampleButtons.forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      panels.forEach(
        (panel) =>
          (panel.hidden = panel.dataset.panel !== button.dataset.sample),
      );
    }),
  );
  document.querySelectorAll("[data-pick]").forEach((link) =>
    link.addEventListener("click", () => {
      if (!service.value) {
        service.value = "maos";
        finishOptions();
      }
      finish.value = link.dataset.pick;
      reference = "Referência escolhida: " + info[finish.value].name;
      clearReceipt();
      updateLook();
    }),
  );
  form.addEventListener("change", (event) => {
    if (event.target === service) {
      const previous = finish.value;
      finishOptions();
      if (service.value) finish.value = previous;
    }
    if (event.target === finish || !finish.value) reference = "";
    clearReceipt();
    updateLook();
  });
  example.hidden = false;
  submit.disabled = false;
  example.addEventListener("click", () => {
    if (!service.value) {
      service.value = "maos";
      finishOptions();
    }
    if (!finish.value) finish.value = "rosa";
    if (!period.value) period.value = "À tarde";
    clearReceipt();
    updateLook();
    submit.focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const code = "LO-DEMO-" + String(++sequence).padStart(3, "0");
    const rows = [
      ["Protocolo de teste", code],
      ["Serviço", service.selectedOptions[0].textContent],
      ["Acabamento", info[finish.value].name],
      ["Período", period.value],
    ];
    if (reference) rows.push(["Escolha da versão", reference]);
    receipt.querySelector("[data-summary]").replaceChildren(
      ...rows.map(([name, value]) => {
        const group = document.createElement("div");
        const term = document.createElement("dt");
        term.textContent = name;
        const detail = document.createElement("dd");
        detail.textContent = value;
        group.append(term, detail);
        return group;
      }),
    );
    receipt.querySelector("[data-message]").textContent =
      "Olá! Quero conversar sobre um atendimento. " +
      rows
        .slice(1)
        .map(([name, value]) => name + ": " + value + ".")
        .join(" ");
    receipt.hidden = false;
    copyStatus.textContent = "";
    receipt.querySelector("h3").focus();
  });
  receipt.querySelector("[data-edit]").addEventListener("click", () => {
    clearReceipt();
    service.focus();
  });
  receipt.querySelector("[data-reset]").addEventListener("click", () => {
    form.reset();
    reference = "";
    finishOptions();
    updateLook();
    clearReceipt();
    service.focus();
  });
  receipt.querySelector("[data-copy]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        receipt.querySelector("[data-message]").textContent,
      );
      copyStatus.textContent = "Pedido copiado.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(receipt.querySelector("[data-message]"));
      const selection = getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent =
        "Texto selecionado. Use o comando de copiar do dispositivo.";
    }
  });
})();
