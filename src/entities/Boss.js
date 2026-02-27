export default class Boss extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x, y, 80, 80, 0x880088);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // Static body or Kinematic? Let's use regular physics

        this.health = 5;
        this.isVulnerable = false;
        this.state = 'INVULNERABLE'; // INVULNERABLE, TRANSITION, VULNERABLE
        this.timer = 0;

        this.startX = x;
        this.moveRange = 200;
        this.moveSpeed = 0.002;
    }

    update(time, delta) {
        // Move pattern (left/right)
        this.x = this.startX + Math.sin(time * this.moveSpeed) * this.moveRange;

        // FSM Cycle
        this.timer += delta;

        switch (this.state) {
            case 'INVULNERABLE':
                if (this.timer > 5000) { // 5 seconds
                    this.state = 'TRANSITION';
                    this.timer = 0;
                    console.log("Boss transitioning...");
                }
                break;
            case 'TRANSITION':
                // Blinking effect
                this.setAlpha(Math.sin(time * 0.05) * 0.25 + 0.75);
                if (this.timer > 2000) { // 2 seconds transition
                    this.state = 'VULNERABLE';
                    this.isVulnerable = true;
                    this.timer = 0;
                    this.setAlpha(1);
                    this.setFillStyle(0xffff00); // Yellow when vulnerable
                    // trigger sfx here if we had audio: this.scene.sound.play('boss_vulnerable_sfx');
                    console.log("Boss is vulnerable!");
                }
                break;
            case 'VULNERABLE':
                if (this.timer > 3000) { // 3 seconds vulnerable
                    this.resetState();
                }
                break;
        }
    }

    resetState() {
        this.state = 'INVULNERABLE';
        this.isVulnerable = false;
        this.timer = 0;
        this.setFillStyle(0x880088);
        this.setAlpha(1);
    }

    takeHit() {
        if (!this.isVulnerable) return false;

        this.health -= 1;
        console.log(`Boss health: ${this.health}`);

        if (this.health <= 0) {
            this.destroy();
            return true;
        }

        this.resetState();
        return true;
    }
}
