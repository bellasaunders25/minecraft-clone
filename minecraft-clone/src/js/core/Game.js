import * as THREE from 'three';
import { World } from '../systems/World.js';
import { Player } from '../systems/Player.js';
import { Controls } from '../systems/Controls.js';

export class Game {
    constructor() {
        this.settings = {
            gravity: 0.03,
            moveSpeed: 0.12,
            jumpForce: 0.25,
            renderDistance: 6,
            chunkSize: 16
        };

        // Init Three.js core first
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({
            antialias: false,
            powerPreference: "high-performance"
        });
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        // Init systems with settings reference
        this.world = new World(this);
        this.player = new Player(this);
        this.controls = new Controls(this);

        this.init();
    }

    async init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        document.body.appendChild(this.renderer.domElement);

        // Async initialization
        await this.world.initTextures();
        await this.world.initialLoad();

        this.camera.rotation.order = 'YXZ';
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.world.updateChunks();
        this.player.update();
        this.renderer.render(this.scene, this.camera);
    }
}