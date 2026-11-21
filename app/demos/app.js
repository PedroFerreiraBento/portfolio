(() => {
  const form = document.querySelector('form[data-lead-form]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-nav]');
  function closeMenu(restoreFocus = false) {
    const wasExpanded = toggle?.getAttribute('aria-expanded') === 'true';
    if (menu) menu.hidden = true;
    toggle?.setAttribute('aria-expanded', 'false');
    if (restoreFocus && wasExpanded) toggle.focus();
  }
  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    if (menu) menu.hidden = !expanded;
  });
  menu?.addEventListener('click', e => {
    if (e.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      e.preventDefault();
      closeMenu(true);
    }
  });
  document.querySelectorAll('a[href="#orcamento"]').forEach(link => link.addEventListener('click', () => {
    closeMenu();
    requestAnimationFrame(() => form?.elements.namedItem('nome')?.focus({ preventScroll: true }));
  }));
  document.querySelectorAll('[data-service-select]').forEach(control => control.addEventListener('change', () => {
    const select = form?.elements.namedItem('tipo_servico');
    if (select) select.value = control.value;
  }));
  if (!form) return;
  const status = form.querySelector('[data-form-status]');
  const phone = form.elements.namedItem('whatsapp');
  const service = form.elements.namedItem('tipo_servico');
  const quickControls = [...document.querySelectorAll('[data-service-select]')];
  const example = document.querySelector('[data-fill-example]');
  const receipt = document.querySelector('[data-receipt]');
  const newQuote = receipt.querySelector('[data-new-quote]');
  let sequence = 0;

  function clearReceipt() {
    status.textContent = '';
    delete status.dataset.state;
    receipt.hidden = true;
  }

  function synchronizeService() {
    quickControls.forEach(control => {
      if (control.type === 'radio') control.checked = control.value === service.value;
      else control.value = service.value;
    });
  }

  example.hidden = false;
  example.addEventListener('click', () => {
    form.elements.nome.value = 'Camila Exemplo';
    form.elements.empresa.value = 'Edifício Aurora (fictício)';
    phone.value = '(11) 00000-0000';
    phone.setCustomValidity('');
    if (!service.value) service.value = 'preventiva';
    form.elements.mensagem.value = 'Precisamos revisar os aparelhos das áreas comuns.';
    synchronizeService();
    clearReceipt();
    service.focus();
  });
  newQuote.addEventListener('click', () => {
    clearReceipt();
    form.elements.nome.focus();
  });
  form.addEventListener('input', () => {
    phone.setCustomValidity('');
    clearReceipt();
  });
  service.addEventListener('change', synchronizeService);
  quickControls.forEach(control => control.addEventListener('change', clearReceipt));

  form.addEventListener('submit', event => {
    event.preventDefault();
    const digits = phone.value.replace(/\D/g, '');
    phone.setCustomValidity(/^\d{10,13}$/.test(digits) && /^[+\d\s().-]+$/.test(phone.value) ? '' : 'Informe um WhatsApp com DDD.');
    if (!form.reportValidity()) return;
    const serviceName = service.selectedOptions[0].textContent.trim();
    const company = form.elements.empresa.value.trim();
    sequence += 1;
    receipt.querySelector('[data-receipt-id]').textContent = 'CP-DEMO-' + String(sequence).padStart(3, '0');
    receipt.querySelector('[data-receipt-service]').textContent = serviceName;
    receipt.querySelector('[data-receipt-company]').textContent = company;
    form.reset();
    synchronizeService();
    receipt.hidden = false;
    status.textContent = 'Pedido simulado com sucesso. Nenhuma mensagem foi enviada.';
    status.dataset.state = 'success';
    newQuote.focus();
  });
})();
