const variants={plano:'Verde',arquitetura:'Editorial',tradicional:'Cobalto'};
document.querySelectorAll('[data-workbench]').forEach(bench=>{
 const preview=bench.querySelector('.lab-screenshot'), pic=preview.querySelector('img'), open=bench.querySelector('.lab-open'), display=bench.querySelector('[data-display]');
 const controls=bench.querySelectorAll('[data-version]');
 controls.forEach(button=>button.addEventListener('click',()=>{
   const key=button.dataset.version;
   if(!Object.hasOwn(variants,key))return;
   controls.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   const path='../../demos/'+key+'/index.html';
   preview.href=open.href=path;
   pic.src='../climapro/'+key+'.webp';pic.alt='Prévia da landing page ClimaPro '+variants[key];
   display.textContent='ClimaPro / '+variants[key];
 }));
});
document.querySelectorAll('.brief').forEach(form=>{
 const fields=form.elements;
 form.querySelector('button[type=submit]').disabled=false;
 const validate=()=>{
  for(const key of ['nome','projeto']){
    const field=fields.namedItem(key);
    field.setCustomValidity(field.value && !field.value.trim()?'Preencha este campo com texto.':'');
  }
 };
 form.addEventListener('input',validate);
 form.addEventListener('submit',event=>{
   event.preventDefault();validate();if(!form.reportValidity())return;
   const get=key=>fields.namedItem(key).value.trim();
   const msg='Olá, Pedro! Quero conversar sobre um projeto.\n\nNome: '+get('nome')+'\nPerfil: '+get('perfil')+'\nProjeto: '+get('projeto');
   const link=document.createElement('a');link.href='https://wa.me/5519974149650?text='+encodeURIComponent(msg);link.target='_blank';link.rel='noopener noreferrer';link.click();
 });
});

