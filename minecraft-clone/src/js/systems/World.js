import * as THREE from 'three';
import { Chunk } from './Chunk.js';
import { NoiseGenerator } from '../utils/NoiseGenerator.js';

export class World {
    constructor(game) {
        this.game = game;
        this.chunks = new Map();
        this.noise = new NoiseGenerator();
        this.viewDistance = this.game.settings.renderDistance;
        this.textureAtlas = null;
    }

    async initTextures() {
        const loader = new THREE.TextureLoader();
        this.textureAtlas = await loader.loadAsync('assets/textures/block_atlas.png');

        // Critical texture settings
        this.textureAtlas.wrapS = THREE.RepeatWrapping;
        this.textureAtlas.wrapT = THREE.RepeatWrapping;
        this.textureAtlas.magFilter = THREE.NearestFilter;
        this.textureAtlas.minFilter = THREE.NearestFilter;
    }

    async initialLoad() {
        const playerChunkX = Math.floor(this.game.player.position.x / 16);
        const playerChunkZ = Math.floor(this.game.player.position.z / 16);

        for (let x = playerChunkX - 2; x <= playerChunkX + 2; x++) {
            for (let z = playerChunkZ - 2; z <= playerChunkZ + 2; z++) {
                const chunk = new Chunk(this, x, z);
                chunk.generate(this.noise);
                chunk.buildMesh();
                this.chunks.set(`${x},${z}`, chunk);
            }
        }
    }

    updateChunks() {
        const px = Math.floor(this.game.player.position.x / 16);
        const pz = Math.floor(this.game.player.position.z / 16);

        for (let x = px - this.viewDistance; x <= px + this.viewDistance; x++) {
            for (let z = pz - this.viewDistance; z <= pz + this.viewDistance; z++) {
                const key = `${x},${z}`;
                if (!this.chunks.has(key)) {
                    const chunk = new Chunk(this, x, z);
                    chunk.generate(this.noise);
                    chunk.buildMesh();
                    this.chunks.set(key, chunk);
                }
            }
        }
    }

    createMaterial() {
        return new THREE.MeshBasicMaterial({
            map: this.textureAtlas,
            transparent: true,
            alphaTest: 0.1
        });
    }
}