const branches = [...document.querySelectorAll('.examples-tree > details')];
const initial = new URLSearchParams(location.search).get('tipo');
const selected = branches.find(branch => branch.id === initial);
if (selected) selected.open = true;

for (const branch of branches) {
 branch.querySelector('summary')?.addEventListener('click',() => {
  if (!branch.open) window.portfolioCampaign?.galleryEvent('solucao',branch.id);
 });
 branch.addEventListener('toggle', () => {
  if (!branch.open) return;
  for (const other of branches) {
   if (branch !== other) other.open = false;
  }
  const url = new URL(location.href);
  url.searchParams.set('tipo', branch.id);
  history.replaceState(null, '', url);
 });
}

const search = document.querySelector('#examples-search');
const searchPanel = search.closest('.examples-search');
const industryGroups = [...document.querySelectorAll('#orcamento .examples-branch')];
const searchText = text => text.toLocaleLowerCase('pt-BR').normalize('NFD')
 .replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim();

search.addEventListener('input', () => {
 const query = searchText(search.value);
 let matches = 0;
 for (const group of industryGroups) {
  let visible = 0;
  for (const item of group.querySelectorAll('li')) {
   const text = searchText(item.textContent + ' ' + (item.dataset.aliases ?? ''));
   item.hidden = !text.includes(query);
   if (!item.hidden) visible++;
  }
  group.hidden = visible === 0;
  matches += visible;
 }
 searchPanel.querySelector('[role=status]').textContent = matches ? '' : 'Não encontrei esse ramo. Tente um nome mais curto.';
});
searchPanel.hidden = false;
