# Snake Game Project

Este projeto foi desenvolvido como parte da disciplina de Construção de Páginas Web 2, ministrada pelo professor Rodrigo Prestes Machado no curso de Sistemas para Internet do IFRS-Poa.

## Sobre o Projeto

O projeto consiste na implementação de um jogo da cobra utilizando JavaScript. A proposta permitia o uso de códigos de terceiros, desde que houvesse referências adequadas ao código de origem.

## Créditos e Fontes de Inspiração

### Tutorial Inicial

O projeto teve como base um tutorial disponível no YouTube. O tutorial foi ministrado por [Manual do Dev](https://www.youtube.com/watch?v=LyWSsZktVOg&list=PLkM1rvAuKdWe9VvJn73Wa1b9NTC9_Ex8a&index=1) e o código-fonte original pode ser encontrado [clicando aqui](https://github.com/manualdodev/snake-game).

Durante o desenvolvimento, algumas alterações foram realizadas em relação ao tutorial para aprimorar a estrutura e legibilidade do código:

#### Alterações Realizadas:

1. Criação de variáveis para valores ou cálculos utilizados mais de uma vez:
    - `canvasSize`: tamanho do canvas, retirada do escopo de função para o escopo global.
    - `canvasLimit`: valor máximo que a cobra pode percorrer nos eixos x e y, retirada do escopo de função para o escopo global.
    - `canvas.height` e `canvas.width`: valores do tamanho do canvas, retirados do escopo de função para o escopo global.

2. Decisão de alterações pontuais no código:
    - Na função `randomColor`, foi criada uma arrow function para retornar o valor RGB, e o método `join` foi utilizado para transformar a array em uma string separada por vírgula.
    - Na verificação do `moveSnake`, foi utilizado um `switch case` ao invés de `if else if` para melhor legibilidade.
    - Na função `checkEat`, o método `some` foi substituído por `find`, embora ambas estivessem corretas, a preferência foi para o retorno booleano.

### Correção de Bugs e Aprimoramento

Durante o desenvolvimento, um bug foi identificado e corrigido com base em um fork do projeto disponível [neste repositório](https://github.com/MatheusHDC/snake-game). O bug permitia que a cobra voltasse na direção oposta e colidisse com seu próprio corpo. A solução proposta por [MatheusHDC] foi adotada para evitar esse comportamento indesejado.

#### Solução Adotada:

- Foi criada uma variável `neck` no evento `keydown` para armazenar a posição do segundo segmento da cobra.
- Verificação adicionada para garantir que a cobra não vá na direção oposta à do pescoço.
- A verificação do `neck` foi condicionada à existência de pelo menos 3 segmentos na cobra.
- Verificação da posição inicial do pescoço para permitir que a cobra inicie para a direita.

**Observação:** O código original do fork condicionava a verificação do `neck` para quando a cobra tinha 3 segmentos ou mais, o que ainda mantinha o bug caso houvesse menos de 3 segmentos. Optei por ajustar para 2 segmentos, o que funcionou, mas causou uma limitação no momento de mudar de direção após pegar comida. Posteriormente, alterei o corpo inicial da cobra para 3 segmentos e ajustei a verificação do `neck` para 3 segmentos ou mais para evitar esse problema. Também adicionei uma verificação da posição inicial do pescoço para permitir que a cobra inicie para a direita.

## Como Jogar

1. Clone o repositório.
2. Abra o arquivo `index.html` em seu navegador.

Divirta-se jogando o Snake Game!