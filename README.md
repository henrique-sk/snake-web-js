# Snake RGB Project

Este projeto foi desenvolvido como parte da disciplina de Construção de Páginas Web 2, ministrada pelo professor Rodrigo Prestes Machado no curso de Sistemas para Internet do IFRS-Poa.

## Sobre o Projeto

O projeto consiste na implementação de um jogo da cobra utilizando JavaScript. A proposta permitia o uso de códigos de terceiros, desde que houvesse referências adequadas ao código de origem.

## Créditos e Fontes de Inspiração

### Tutorial Inicial

O projeto teve como base um tutorial disponível no YouTube. O tutorial foi ministrado por [Manual do Dev](https://www.youtube.com/watch?v=LyWSsZktVOg&list=PLkM1rvAuKdWe9VvJn73Wa1b9NTC9_Ex8a&index=1) e o código-fonte original pode ser encontrado [clicando aqui](https://github.com/manualdodev/snake-game).

Durante o desenvolvimento, algumas alterações foram realizadas em relação ao tutorial para aprimorar a estrutura e legibilidade do código:

#### Alterações Realizadas no Código Original:

1. Criação de variáveis e funções para valores ou cálculos utilizados mais de uma vez utilizando escopo global.

2. Decisão de alterações pontuais no código:
    - Na função `randomColor`, foi criada uma arrow function para retornar o valor RGB, e o método `join` para utilizar uma string.
    - Na verificação do `moveSnake`, foi utilizado um `switch case` ao invés de `if else if` para melhor legibilidade.
    - Na função `checkEat`, o método `some` foi substituído por `find`, para obter retorno booleano.

### Correção de Bugs e Aprimoramento

Durante o desenvolvimento, um bug foi identificado e corrigido com base em um fork do projeto disponível [neste repositório](https://github.com/MatheusHDC/snake-game). O bug permitia que a cobra voltasse na direção oposta e colidisse com seu próprio corpo caso as setas fossem pressionadas rapidamente. A solução proposta por [MatheusHDC] foi adotada para evitar esse comportamento indesejado.

## Novas Funcionalidades

1. Comidas Especiais (R, G, B):
    - R (Vermelha): Pode adicionar 3 quadrados ao corpo ou remover 30 pontos.
    - G (Verde): Pode ter efeitos positivos ou negativos, semelhantes a R e B.
    - B (Azul): Pode adicionar 30 pontos ou remover 3 quadrados do corpo.
As comidas especiais têm 50% de chance de aparecer a cada 5 segundos.

2. Seletor de Velocidade:
    - Escolha entre 5 níveis de velocidade.
    - Velocidades mais rápidas podem proporcionar pontuações mais altas.

3. Seletor de Dificuldade:
    - Fácil: Comidas vermelhas não aparecem.
    - Normal: Modo padrão.
    - Difícil: Comidas azuis não aparecem.

4. Efeitos Sonoros:
    - Efeitos positivos e negativos ao comer comidas especiais.
    - Som de Game Over.

5. Músicas:
    - Três opções de músicas.
    - Botões para play/pause e próxima música.
    - Inicia com música ao abrir a página.

6. Pontuação Mais Alta (High Score):
    - A pontuação mais alta é salva no Local Storage.
    - A pontuação mais alta é exibida durante o jogo.

## Como Jogar

1. Clone o repositório.
2. Abra o arquivo `index.html` em seu navegador.

Divirta-se jogando o Snake RGB!