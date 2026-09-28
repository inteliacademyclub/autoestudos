// Ao trocar o tema (claro/escuro), cor, fundo, borda e sombra mudam em quase
// todos os elementos de uma vez; com transições ligadas, a troca "borra" em vez
// de acontecer num instante. Desligamos as transições só durante a troca.
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  let ultimoTema = document.documentElement.getAttribute('data-theme');
  new MutationObserver(() => {
    const tema = document.documentElement.getAttribute('data-theme');
    if (tema === ultimoTema) return;
    ultimoTema = tema;
    const style = document.createElement('style');
    style.append(document.createTextNode('*,*::before,*::after{transition:none !important}'));
    document.head.append(style);
    // força o recálculo de estilo enquanto a regra ainda vale
    void document.body.offsetHeight;
    requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
  }).observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
}
