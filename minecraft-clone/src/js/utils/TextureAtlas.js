export class TextureAtlas {
    static UV_MAP = {
        grass: {
            top: [0.0, 0.0, 0.25, 0.25],
            side: [0.25, 0.0, 0.5, 0.25],
            bottom: [0.5, 0.0, 0.75, 0.25]
        },
        dirt: {
            all: [0.75, 0.0, 1.0, 0.25]
        },
        stone: {
            all: [0.0, 0.25, 0.25, 0.5]
        },
        bedrock: {
            all: [0.25, 0.25, 0.5, 0.5]
        },
        sand: {
            all: [0.5, 0.25, 0.75, 0.5]
        },
        water: {
            all: [0.75, 0.25, 1.0, 0.5]
        }
    };

    static getUVs(blockType, face = 'all') {
        const coords = this.UV_MAP[blockType]?.[face] || this.UV_MAP[blockType]?.all;
        if (!coords) return [0, 0, 1, 1]; // Fallback to full texture

        const [u1, v1, u2, v2] = coords;
        return new Float32Array([
            u1, v2,  // Bottom-left
            u2, v2,  // Bottom-right
            u2, v1,  // Top-right
            u1, v1   // Top-left
        ]);
    }
}