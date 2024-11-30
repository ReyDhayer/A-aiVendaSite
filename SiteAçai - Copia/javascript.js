const carrossel = document.querySelector('.carrossel');
const itens = document.querySelectorAll('.carrossel-item');
const btnAnterior = document.querySelector('.anterior');
const btnProximo = document.querySelector('.proximo');

let indiceAtual = 0;
let largura;
let intervalo; // Variável para o intervalo automático

let inicioX = 0; // Coordenada X do início do toque
let fimX = 0; // Coordenada X do final do toque

// Atualiza a posição do carrossel
function atualizarCarrossel() {
    largura = carrossel.clientWidth;
    carrossel.style.transform = `translateX(-${indiceAtual * largura}px)`;
}

// Movimenta para o item anterior
function handleAnteriorClick() {
    indiceAtual = (indiceAtual + itens.length - 1) % itens.length;
    atualizarCarrossel();
    reiniciarIntervalo(); // Reinicia o intervalo automático ao clicar
}

// Movimenta para o próximo item
function handleProximoClick() {
    indiceAtual = (indiceAtual + 1) % itens.length;
    atualizarCarrossel();
    reiniciarIntervalo(); // Reinicia o intervalo automático ao clicar
}

// Inicia o carrossel automático
function iniciarRotacaoAutomatica() {
    intervalo = setInterval(() => {
        handleProximoClick();
    }, 3000); // Altere o valor 3000 para ajustar o intervalo (em milissegundos)
}

// Reinicia o intervalo automático
function reiniciarIntervalo() {
    clearInterval(intervalo);
    iniciarRotacaoAutomatica();
}

// Detecta o início do toque
function touchStart(event) {
    inicioX = event.touches[0].clientX; // Armazena a posição do toque inicial
}

// Detecta o movimento do toque
function touchMove(event) {
    fimX = event.touches[0].clientX; // Armazena a posição do toque enquanto se move
}

// Detecta o final do toque e realiza a navegação
function touchEnd() {
    if (inicioX - fimX > 50) {
        // Deslizar para a esquerda (próximo)
        handleProximoClick();
    } else if (fimX - inicioX > 50) {
        // Deslizar para a direita (anterior)
        handleAnteriorClick();
    }
}

// Inicializa o carrossel
function init() {
    btnAnterior.addEventListener('click', handleAnteriorClick);
    btnProximo.addEventListener('click', handleProximoClick);
    window.addEventListener('resize', atualizarCarrossel);

    // Adiciona os eventos de toque para dispositivos móveis
    carrossel.addEventListener('touchstart', touchStart);
    carrossel.addEventListener('touchmove', touchMove);
    carrossel.addEventListener('touchend', touchEnd);

    atualizarCarrossel();
    iniciarRotacaoAutomatica(); // Ativa a rotação automática
}

init();
function touchMove(event) {
    event.preventDefault(); // Impede a rolagem da página
    fimX = event.touches[0].clientX;
}

