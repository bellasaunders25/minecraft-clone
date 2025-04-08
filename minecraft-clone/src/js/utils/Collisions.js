export function checkCollisions(player) {
    const world = player.game.world;
    const pos = player.position.clone();
    const size = 0.3;

    checkDirection('y', -1);
    checkDirection('y', 1);
    checkDirection('z', -1);
    checkDirection('z', 1);
    checkDirection('x', -1);
    checkDirection('x', 1);

    function checkDirection(axis, dir) {
        const testPos = pos.clone();
        testPos[axis] += dir * size;

        const blockPos = {
            x: Math.floor(testPos.x),
            y: Math.floor(testPos.y),
            z: Math.floor(testPos.z)
        };

        const chunkX = Math.floor(blockPos.x / 16);
        const chunkZ = Math.floor(blockPos.z / 16);
        const chunkKey = `${chunkX},${chunkZ}`;
        const chunk = world.chunks.get(chunkKey);

        if (chunk) {
            const localX = blockPos.x - (chunkX * 16);
            const localZ = blockPos.z - (chunkZ * 16);

            if (chunk.blocks.has(`${localX},${blockPos.y},${localZ}`)) {
                if (axis === 'y') {
                    player.velocity.y = 0;
                    player.position[axis] = blockPos[axis] + (dir === 1 ? -size : 1 + size);
                    player.onGround = dir === -1;
                } else {
                    player.position[axis] = blockPos[axis] + (dir === 1 ? -size : 1 + size);
                }
            }
        }
    }
}