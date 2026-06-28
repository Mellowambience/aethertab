// html6/games/rose-runner.js — tiny lane runner

export function createGame({ input, screen, palette }) {
  const colors = {
    bg: palette[0] || '#0d0d14',
    primary: palette[1] || '#7c3aed',
    soft: palette[2] || '#c4b5fd',
    text: palette[3] || '#e8e0f0',
    danger: palette[4] || '#f87171'
  };

  const lanes = [42, 80, 118];
  const state = {
    lane: 1,
    playerY: screen.height - 24,
    objects: [],
    spawnTimer: 0,
    score: 0,
    distance: 0,
    speed: 54,
    gameOver: false,
    previousLeft: false,
    previousRight: false,
    best: Number(localStorage.getItem('html6:rose-runner:best') || 0)
  };

  return {
    init() {},

    update(dt) {
      const left = input.isDown('ArrowLeft', 'KeyA');
      const right = input.isDown('ArrowRight', 'KeyD');

      if (state.gameOver) {
        if (input.isDown('Space')) reset(state);
        state.previousLeft = left;
        state.previousRight = right;
        return;
      }

      if (left && !state.previousLeft) state.lane = Math.max(0, state.lane - 1);
      if (right && !state.previousRight) state.lane = Math.min(lanes.length - 1, state.lane + 1);
      state.previousLeft = left;
      state.previousRight = right;

      state.distance += dt * state.speed;
      state.speed = Math.min(96, state.speed + dt * 1.8);
      state.score = Math.floor(state.distance / 10);

      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0) {
        state.spawnTimer = Math.max(0.42, 1.05 - state.score * 0.008);
        const lane = Math.floor(Math.random() * lanes.length);
        state.objects.push({
          lane,
          y: -12,
          kind: Math.random() < 0.72 ? 'thorn' : 'rose'
        });
      }

      for (const object of state.objects) object.y += state.speed * dt;

      state.objects = state.objects.filter((object) => {
        const sameLane = object.lane === state.lane;
        const nearPlayer = object.y > state.playerY - 10 && object.y < state.playerY + 10;
        if (sameLane && nearPlayer) {
          if (object.kind === 'thorn') {
            state.gameOver = true;
            state.best = Math.max(state.best, state.score);
            localStorage.setItem('html6:rose-runner:best', String(state.best));
          } else {
            state.score += 5;
            state.distance += 50;
          }
          return false;
        }
        return object.y < screen.height + 16;
      });
    },

    draw(ctx) {
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, screen.width, screen.height);

      ctx.strokeStyle = '#241d39';
      ctx.lineWidth = 2;
      for (const laneX of lanes) {
        ctx.beginPath();
        ctx.moveTo(laneX, 20);
        ctx.lineTo(laneX, screen.height - 12);
        ctx.stroke();
      }

      for (const object of state.objects) {
        const x = lanes[object.lane];
        if (object.kind === 'thorn') {
          ctx.fillStyle = colors.danger;
          ctx.beginPath();
          ctx.moveTo(x, object.y - 6);
          ctx.lineTo(x + 7, object.y + 6);
          ctx.lineTo(x - 7, object.y + 6);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = colors.soft;
          ctx.beginPath();
          ctx.arc(x, object.y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = colors.primary;
          ctx.fillRect(x - 1, object.y - 7, 2, 14);
        }
      }

      const playerX = lanes[state.lane];
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.arc(playerX, state.playerY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.text;
      ctx.fillRect(playerX - 2, state.playerY - 10, 4, 6);

      ctx.fillStyle = colors.text;
      ctx.font = '8px monospace';
      ctx.fillText(`RUN ${state.score}`, 6, 12);
      ctx.fillText(`BEST ${state.best}`, screen.width - 50, 12);

      if (state.gameOver) {
        ctx.fillStyle = 'rgba(13, 13, 20, 0.78)';
        ctx.fillRect(28, 46, screen.width - 56, 48);
        ctx.fillStyle = colors.soft;
        ctx.fillText('THORNS GOT YOU', 42, 62);
        ctx.fillText(`BEST ${state.best}`, 58, 75);
        ctx.fillText('SPACE RESTART', 44, 88);
      }
    },

    destroy() {}
  };
}

function reset(state) {
  state.lane = 1;
  state.objects = [];
  state.spawnTimer = 0;
  state.score = 0;
  state.distance = 0;
  state.speed = 54;
  state.gameOver = false;
  state.previousLeft = false;
  state.previousRight = false;
}
