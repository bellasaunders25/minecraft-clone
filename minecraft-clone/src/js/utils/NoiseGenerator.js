import SimplexNoise from 'simplex-noise';

export class NoiseGenerator {
    constructor(seed = 'minecraft') {
        this.simplex = new SimplexNoise(seed);
    }

    getHeight(x, z) {
        const base = 64 + Math.floor(this.simplex.noise2D(x * 0.01, z * 0.01) * 16);
        const detail = Math.floor(this.simplex.noise2D(x * 0.1, z * 0.1) * 4);
        return Math.max(0, base + detail);
    }
}