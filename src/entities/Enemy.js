export default class Enemy extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 40, 40, 0xff0000);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.body.setVelocityX(-100);

        this.isDead = false;
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
