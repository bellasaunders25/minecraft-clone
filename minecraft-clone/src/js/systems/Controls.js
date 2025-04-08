import * as THREE from 'three';

export class Controls {
    constructor(game) {
        this.game = game;
        this.moveState = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        this.lookDirection = new THREE.Vector2();
        this.isLocked = false;
        this.init();
    }

    init() {
        document.addEventListener('click', () => {
            if (!this.isLocked) {
                document.body.requestPointerLock();
            }
        });

        document.addEventListener('pointerlockchange', () => {
            this.isLocked = document.pointerLockElement === document.body;
            const message = document.getElementById('pointerLockMessage');
            message.classList.toggle('visible', !this.isLocked);
            document.getElementById('crosshair').style.display =
                this.isLocked ? 'block' : 'none';
        });

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onMouseMove(e) {
        if (!this.isLocked) return;

        const sensitivity = 0.002;
        this.lookDirection.x -= e.movementX * sensitivity;
        this.lookDirection.y -= e.movementY * sensitivity;
        this.lookDirection.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.lookDirection.y));
    }

    onKeyDown(e) {
        switch (e.key.toLowerCase()) {
            case 'w': this.moveState.forward = true; break;
            case 's': this.moveState.backward = true; break;
            case 'a': this.moveState.left = true; break;
            case 'd': this.moveState.right = true; break;
            case ' ': this.game.player.jump(); break;
        }
    }

    onKeyUp(e) {
        switch (e.key.toLowerCase()) {
            case 'w': this.moveState.forward = false; break;
            case 's': this.moveState.backward = false; break;
            case 'a': this.moveState.left = false; break;
            case 'd': this.moveState.right = false; break;
        }
    }
}