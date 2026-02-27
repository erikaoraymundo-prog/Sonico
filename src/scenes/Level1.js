import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';

export default class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1');
    }

    preload() {
        // No assets yet, using Graphics/Rectangles
    }

    create() {
        this.add.text(16, 16, 'Use Setas para Mover | Pule nos inimigos!', { fontSize: '18px', fill: '#fff' });

        // Ground platform
        this.platforms = this.physics.add.staticGroup();
        const ground = this.add.rectangle(400, 580, 1600, 40, 0x00ff00);
        this.platforms.add(ground);

        // Player
        this.player = new Player(this, 100, 450);

        // Enemies
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        this.enemies.add(new Enemy(this, 400, 450));
        this.enemies.add(new Enemy(this, 700, 450));

        // Boss (start further right)
        this.boss = new Boss(this, 1200, 500);

        // Collisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.boss, this.platforms);

        // Interaction: Player vs Enemy
        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);

        // Interaction: Player vs Boss
        this.physics.add.overlap(this.player, this.boss, this.handlePlayerBossCollision, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        // Camera
        this.cameras.main.setBounds(0, 0, 1600, 600);
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.cameras.main.startFollow(this.player);
    }

    update(time, delta) {
        this.player.update(this.cursors);
        this.enemies.children.iterate(enemy => {
            if (enemy) enemy.update();
        });
        if (this.boss && this.boss.active) {
            this.boss.update(time, delta);
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        // Combat (Enemy Stomp)
        // Se o Player colidir com o Inimigo por cima (velocidade vertical Vy > 0)
        if (player.body.velocity.y > 0 && player.y < enemy.y - 20) {
            enemy.die();
            player.body.setVelocityY(-300); // Impulso para cima
        } else {
            // Se colidir pelas laterais: O Player sofre dano.
            player.takeDamage();
        }
    }

    handlePlayerBossCollision(player, boss) {
        if (boss.isVulnerable) {
            // Se o Player colidir por cima: boss.health -= 1
            if (player.body.velocity.y > 0 && player.y < boss.y - 40) {
                if (boss.takeHit()) {
                    player.body.setVelocityY(-300);
                }
            } else {
                player.takeDamage();
            }
        } else {
            // Colisões com o Player resultam em dano para o jogador.
            player.takeDamage();
        }
    }
}
