export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDisplaySize(40, 40);
        this.body.setCollideWorldBounds(true);
        this.body.setVelocityX(-100);

        this.isDead = false;

        // Timer for random turns
        this.turnTimer = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 5000),
            callback: () => {
                if (!this.isDead) this.body.setVelocityX(-this.body.velocity.x);
            },
            loop: true
        });
    }

    update() {
        if (this.isDead) return;

        // Simple bounce off walls logic
        if (this.body.blocked.left || this.body.blocked.right) {
            this.body.setVelocityX(-this.body.velocity.x);
        }
    }

    die() {
        this.isDead = true;
        this.body.enable = false;
        this.scene.tweens.add({
            targets: this,
            scaleY: 0.1,
            alpha: 0,
            duration: 200,
            onComplete: () => this.destroy()
        });
    }
}
