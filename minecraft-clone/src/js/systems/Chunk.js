import * as THREE from 'three';

export class Chunk {
    constructor(world, x, z) {
        this.world = world;
        this.x = x;
        this.z = z;
        this.blocks = new Map();
        this.mesh = null;
    }

    generate(noise) {
        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
                const height = noise.getHeight(this.x * 16 + x, this.z * 16 + z);
                for (let y = 0; y < height; y++) {
                    const type = y === 0 ? 'bedrock' :
                        y > height - 4 ? 'dirt' : 'stone';
                    this.blocks.set(`${x},${y},${z}`, type);
                }
                if (height > 0) this.blocks.set(`${x},${height},${z}`, 'grass');
            }
        }
    }

    buildMesh() {
        const mergedGeometry = new THREE.BufferGeometry();
        const material = new THREE.MeshBasicMaterial({ map: this.world.textures.grass });

        this.blocks.forEach((_, key) => {
            const [x, y, z] = key.split(',').map(Number);
            const box = new THREE.BoxGeometry(1, 1, 1);
            box.translate(x, y, z);
            mergedGeometry.merge(box);
        });

        this.mesh = new THREE.Mesh(mergedGeometry, material);
    }

    addBlockGeometry(x, y, z, type) {
        const faces = [
            { // Top
                verts: [
                    x + 1, y + 1, z,
                    x, y + 1, z,
                    x, y + 1, z + 1,
                    x + 1, y + 1, z + 1
                ],
                uv: TextureAtlas.getUVs(type, 'top')
            },
            { // Bottom
                verts: [
                    x, y, z,
                    x + 1, y, z,
                    x + 1, y, z + 1,
                    x, y, z + 1
                ],
                uv: TextureAtlas.getUVs(type, 'bottom')
            },
            // Add other faces (front, back, left, right) similarly
        ];

        faces.forEach(face => this.addFaceGeometry(face.verts, face.uv));
    }

    addFaceGeometry(vertices, uv) {
        // Positions
        this.geometry.attributes.position.array.set(vertices, this.vertexIndex * 3);

        // UVs
        this.geometry.attributes.uv.array.set(uv, this.vertexIndex * 2);

        this.vertexIndex += 4; // 4 vertices per face
    }
}