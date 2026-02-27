import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';

export default class Level2 extends Phaser.Scene {
    constructor() {
        super('Level2');
    }

    preload() {
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('enemy', 'assets/sprites/enemy.png');
        this.load.image('boss_invulnerable', 'assets/sprites/boss_invulnerable.png');
        this.load.image('boss_vulnerable', 'assets/sprites/boss_vulnerable.png');
    }

    create() {
        this.add.text(16, 16, 'Level 2 - O Desafio Aumenta!', { fontSize: '24px', fill: '#fff' });

        this.platforms = this.physics.add.staticGroup();
        this.platforms.add(this.add.rectangle(200, 580, 400, 40, 0x00aaff));
        this.platforms.add(this.add.rectangle(700, 500, 300, 40, 0x00aaff));
        this.platforms.add(this.add.rectangle(1200, 580, 600, 40, 0x00aaff));

        this.player = new Player(this, 100, 450);

        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        this.enemies.add(new Enemy(this, 700, 400));
        this.enemies.add(new Enemy(this, 1200, 450));
        this.enemies.add(new Enemy(this, 1400, 450));

        this.boss = new Boss(this, 1400, 500);
        this.boss.health = 8;
        this.boss.moveSpeed = 0.004;

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.boss, this.platforms);

        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.boss, this.handlePlayerBossCollision, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        // UI for Health
        this.healthText = this.add.text(16, 45, `Vidas: ${this.player.health}`, { fontSize: '20px', fill: '#ff0' });
        this.healthText.setScrollFactor(0);

        this.events.on('update-ui', (data) => {
            if (data.health !== undefined) {
                this.healthText.setText(`Vidas: ${data.health}`);
            }
        });

        this.cameras.main.setBounds(0, 0, 1600, 600);
        this.physics.world.setBounds(0, 0, 1600, 600);
        this.cameras.main.startFollow(this.player);
    }

    update(time, delta) {
        if (this.player) this.player.update(this.cursors);
        this.enemies.children.iterate(enemy => {
            if (enemy) enemy.update();
        });
        if (this.boss && this.boss.active) {
            this.boss.update(time, delta);
        }
    }

    handlePlayerEnemyCollision(player, enemy) {
        if (player.body.velocity.y > 0 && player.y < enemy.y - 20) {
            enemy.die();
            player.body.setVelocityY(-350);
        } else {
            player.takeDamage();
        }
    }

    handlePlayerBossCollision(player, boss) {
        if (boss.isVulnerable) {
            if (player.body.velocity.y > 0 && player.y < boss.y - 20) {
                if (boss.takeHit()) {
                    player.body.setVelocityY(-450);
                    this.time.delayedCall(1500, () => {
                        if (!boss.active) {
                            this.add.text(800, 300, 'VOCÊ VENCEU!', { fontSize: '64px', fill: '#ff0' }).setOrigin(0.5).setScrollFactor(0);
                            this.time.delayedCall(3000, () => this.scene.start('Level1'));
                        }
                    });
                }
            } else {
                player.takeDamage();
            }
        } else {
            player.takeDamage();
        }
    }
}
