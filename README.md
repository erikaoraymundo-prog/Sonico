# Sonic Web Game (Phaser 3)

Este é um jogo web inspirado no Sonic, desenvolvido com Phaser 3 e Arcade Physics.

## Rodando o Jogo
Para rodar localmente, você pode abrir o arquivo `index.html` em um navegador (pode ser necessário um servidor local como o Live Server do VS Code para carregar módulos JS corretamente).

## Mecânicas Implementadas
- **Inércia:** O jogador acelera e desacelera gradualmente.
- **Pulo:** Apenas quando o jogador está tocando o chão.
- **Combate:** Pular em cima dos inimigos os derrota e dá um impulso para cima. Colisões laterais tiram dano.
- **Chefão (Boss):** Segue um ciclo de estados:
    - **Invulnerável:** Movimentação normal, causa dano ao contato.
    - **Transição:** Começa a piscar para indicar vulnerabilidade eminente.
    - **Vulnerável:** Pode ser atingido por cima, perdendo vida.

## Estrutura de Pastas
- `index.html`: Ponto de entrada.
- `src/main.js`: Configuração do Phaser.
- `src/scenes/`: Cenas do jogo (Atualmente apenas Level1).
- `src/entities/`: Classes dos objetos do jogo (Player, Enemy, Boss).
- `assets/`: Espaço reservado para imagens e sons.
