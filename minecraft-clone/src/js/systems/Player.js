import * as THREE from 'three';
import { checkCollisions } from '../utils/Collisions.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.position = new THREE.Vector3(8, 100, 8);
        this.velocity = new THREE.Vector3();
        this.onGround = false;
        this.height = 1.8;
    }

    update() {
        this.applyGravity();
        this.processMovement();
        this.updateCamera();
        checkCollisions(this);
    }

    applyGravity() {
        if (!this.onGround) {
            this.velocity.y -= this.game.settings.gravity;
        }
    }

    processMovement() {
        const direction = new THREE.Vector3();
        const angle = this.game.camera.rotation.y;

        if (this.game.controls.moveState.forward) {
            direction.z -= Math.cos(angle);
            direction.x -= Math.sin(angle);
        }
        if (this.game.controls.moveState.backward) {
            direction.z += Math.cos(angle);
            direction.x += Math.sin(angle);
        }
        if (this.game.controls.moveState.left) {
            direction.x -= Math.cos(angle);
            direction.z += Math.sin(angle);
        }
        if (this.game.controls.moveState.right) {
            direction.x += Math.cos(angle);
            direction.z -= Math.sin(angle);
        }

        direction.normalize();
        direction.multiplyScalar(this.game.settings.moveSpeed);
        this.velocity.x = direction.x;
        this.velocity.z = direction.z;
        this.position.add(this.velocity);
    }

    updateCamera() {
        this.game.camera.position.copy(this.position);
        if (this.game.controls.isLocked) {
            this.game.camera.rotation.x = this.game.controls.lookDirection.y;
            this.game.camera.rotation.y = this.game.controls.lookDirection.x;
        }
    }

    jump() {
        if (this.onGround) {
            this.velocity.y = this.game.settings.jumpForce;
            this.onGround = false;
        }
    }
}