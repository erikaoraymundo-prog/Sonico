export default class Player extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 40, 40, 0x0000ff);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.body.setDragX(0.95); // Custom drag handled in update

        this.speed = 400;
        this.acceleration = 15;
        this.jumpForce = -500;
        this.isDying = false;
    }

    update(cursors) {
        if (this.isDying) return;

        // Inércia do Sonic logic
        if (cursors.left.isDown) {
            this.body.setAccelerationX(-this.acceleration * 60); // Scale for arcade physics
        } else if (cursors.right.isDown) {
            this.body.setAccelerationX(this.acceleration * 60);
        } else {
            this.body.setAccelerationX(0);
            this.body.setVelocityX(this.body.velocity.x * 0.95);
        }

        // Limit speed
        if (Math.abs(this.body.velocity.x) > this.speed) {
            const velX = this.body.velocity.x > 0 ? this.speed : -this.speed;
            this.body.setVelocityX(velX);
        }

        // Pulo (apenas se estiver no chão)
        if (cursors.up.isDown && this.body.touching.down) {
            this.body.setVelocityY(this.jumpForce);
        }
    }

    takeDamage() {
        if (this.isDying) return;
        this.setAlpha(0.5);
        this.scene.time.delayedCall(1000, () => this.setAlpha(1));
        console.log("Player took damage!");
    }
}
