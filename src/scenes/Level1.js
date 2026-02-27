import Player from '../entities/Player.js';
import Enemy from '../entities/Enemy.js';
import Boss from '../entities/Boss.js';

export default class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1');
    }

    preload() {
        this.load.image('player', 'assets/sprites/player.png');
        this.load.image('enemy', 'assets/sprites/enemy.png');
        this.load.image('boss_invulnerable', 'assets/sprites/boss_invulnerable.png');
        this.load.image('boss_vulnerable', 'assets/sprites/boss_vulnerable.png');
    }

    create() {
        this.add.text(16, 16, 'Use Setas para Mover | Pule nos inimigos!', { fontSize: '18px', fill: '#fff' });

        this.platforms = this.physics.add.staticGroup();
        this.platforms.add(this.add.rectangle(400, 580, 700, 40, 0x00ff00));
        this.platforms.add(this.add.rectangle(1300, 580, 700, 40, 0x00ff00));

        this.player = new Player(this, 100, 450);

        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        this.enemies.add(new Enemy(this, 400, 450));
        this.enemies.add(new Enemy(this, 700, 450));

        this.boss = new Boss(this, 1200, 500);

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.boss, this.platforms);

        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerEnemyCollision, null, this);
        this.physics.add.overlap(this.player, this.boss, this.handlePlayerBossCollision, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        // UI for Health
        this.healthText = this.add.text(16, 40, `Vidas: ${this.player.health}`, { fontSize: '20px', fill: '#ff0' });
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
            player.body.setVelocityY(-300);
        } else {
            player.takeDamage();
        }
    }

    handlePlayerBossCollision(player, boss) {
        if (boss.isVulnerable) {
            if (player.body.velocity.y > 0 && player.y < boss.y - 20) {
                if (boss.takeHit()) {
                    player.body.setVelocityY(-400);
                    this.time.delayedCall(1000, () => {
                        if (!boss.active) {
                            this.scene.start('Level2');
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
