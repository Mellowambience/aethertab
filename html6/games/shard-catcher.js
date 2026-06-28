// html6/games/shard-catcher.js — catch good shards, avoid cursed ones

export function createGame({ input, screen, palette }) {
  const colors = {
    bg: palette[0] || '#0d0d14',
    primary: palette[1] || '#7c3aed',
    soft: palette[2] || '#c4b5fd',
    text: palette[3] || '#e8e0f0',
    danger: palette[4] || '#f87171'
  };

  const state = {
    playerX: screen.width / 2 - 10,
    playerY: screen.height - 18,
    playerW: 20,
    playerH: 5,
    score: 0,
    time: 45,
    spawnTimer: 0,
    shards: [],
    gameOver: false,
    best: Number(localStorage.getItem('html6:shard-catcher:best') || 0)
  };

  return {
    init() {},

    update(dt) {
      if (state.gameOver) {
        if (input.isDown('Space')) reset(state);
        return;
      }

      const speed = 92;
      if (input.isDown('ArrowLeft', 'KeyA')) state.playerX -= speed * dt;
      if (input.isDown('ArrowRight', 'KeyD')) state.playerX += speed * dt;
      state.playerX = clamp(state.playerX, 6, screen.width - state.playerW - 6);

      state.time -= dt;
      if (state.time <= 0) {
        state.time = 0;
        state.gameOver = true;
        state.best = Math.max(state.best, state.score);
        localStorage.setItem('html6:shard-catcher:best', String(state.best));
      }

      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0) {
        state.spawnTimer = Math.max(0.22, 0.72 - state.score * 0.01);
        state.shards.push({
          x: 8 + Math.random() * (screen.width - 16),
          y: -6,
          vy: 42 + Math.random() * 46,
          cursed: Math.random() < 0.18
        });
      }

      for (const shard of state.shards) shard.y += shard.vy * dt;

      state.shards = state.shards.filter((shard) => {
        const caught = overlaps(
          shard.x - 3, shard.y - 3, 6, 6,
          state.playerX, state.playerY, state.playerW, state.playerH
        );

        if (caught) {
          state.score += shard.cursed ? -2 : 1;
          state.score = Math.max(0, state.score);
          return false;
        }
        return shard.y < screen.height + 8;
      });
    },

    draw(ctx) {
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, screen.width, screen.height);

      ctx.fillStyle = '#151022';
      ctx.fillRect(0, screen.height - 24, screen.width, 24);

      for (const shard of state.shards) {
        ctx.fillStyle = shard.cursed ? colors.danger : colors.soft;
        ctx.beginPath();
        ctx.moveTo(shard.x, shard.y - 4);
        ctx.lineTo(shard.x + 4, shard.y);
        ctx.lineTo(shard.x, shard.y + 4);
        ctx.lineTo(shard.x - 4, shard.y);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = colors.primary;
      ctx.fillRect(state.playerX, state.playerY, state.playerW, state.playerH);
      ctx.fillStyle = colors.soft;
      ctx.fillRect(state.playerX + 4, state.playerY - 3, state.playerW - 8, 3);

      ctx.fillStyle = colors.text;
      ctx.font = '8px monospace';
      ctx.fillText(`SHARDS ${state.score}`, 6, 12);
      ctx.fillText(`TIME ${Math.ceil(state.time)}`, screen.width - 48, 12);

      if (state.gameOver) {
        ctx.fillStyle = 'rgba(13, 13, 20, 0.78)';
        ctx.fillRect(24, 46, screen.width - 48, 48);
        ctx.fillStyle = colors.soft;
        ctx.fillText('RUN COMPLETE', 47, 62);
        ctx.fillText(`BEST ${state.best}`, 58, 75);
        ctx.fillText('SPACE RESTART', 44, 88);
      }
    },

    destroy() {}
  };
}

function reset(state) {
  state.playerX = 70;
  state.score = 0;
  state.time = 45;
  state.spawnTimer = 0;
  state.shards = [];
  state.gameOver = false;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function overlaps(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
