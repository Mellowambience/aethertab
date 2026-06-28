// html6/games/void-pong.js — first playable HTML6 cartridge

export function createGame({ input, screen, palette }) {
  const colors = {
    bg: palette[0] || '#0d0d14',
    primary: palette[1] || '#7c3aed',
    soft: palette[2] || '#c4b5fd',
    text: palette[3] || '#e8e0f0'
  };

  const state = {
    paddleY: screen.height / 2 - 16,
    paddleH: 32,
    paddleW: 5,
    ballX: screen.width / 2,
    ballY: screen.height / 2,
    ballVX: 72,
    ballVY: 48,
    ballR: 3,
    score: 0,
    best: Number(localStorage.getItem('html6:void-pong:best') || 0),
    messageTimer: 2.0
  };

  function resetBall(direction = 1) {
    state.ballX = screen.width / 2;
    state.ballY = screen.height / 2;
    state.ballVX = direction * (70 + Math.min(state.score * 4, 45));
    state.ballVY = (Math.random() > 0.5 ? 1 : -1) * (38 + Math.min(state.score * 2, 30));
  }

  return {
    init() {
      state.score = 0;
      resetBall(1);
    },

    update(dt) {
      const speed = 86;
      if (input.isDown('ArrowUp', 'KeyW')) state.paddleY -= speed * dt;
      if (input.isDown('ArrowDown', 'KeyS')) state.paddleY += speed * dt;
      state.paddleY = clamp(state.paddleY, 8, screen.height - state.paddleH - 8);

      state.ballX += state.ballVX * dt;
      state.ballY += state.ballVY * dt;

      if (state.ballY <= 8 || state.ballY >= screen.height - 8) {
        state.ballVY *= -1;
        state.ballY = clamp(state.ballY, 8, screen.height - 8);
      }

      const paddleX = 12;
      const hitPaddle =
        state.ballX - state.ballR <= paddleX + state.paddleW &&
        state.ballX + state.ballR >= paddleX &&
        state.ballY >= state.paddleY &&
        state.ballY <= state.paddleY + state.paddleH &&
        state.ballVX < 0;

      if (hitPaddle) {
        state.score += 1;
        state.best = Math.max(state.best, state.score);
        localStorage.setItem('html6:void-pong:best', String(state.best));
        const paddleCenter = state.paddleY + state.paddleH / 2;
        const offset = (state.ballY - paddleCenter) / (state.paddleH / 2);
        state.ballVX = Math.abs(state.ballVX) + 4;
        state.ballVY = offset * 80;
        state.ballX = paddleX + state.paddleW + state.ballR + 1;
      }

      if (state.ballX >= screen.width - 8) {
        state.ballVX *= -1;
        state.ballX = screen.width - 8;
      }

      if (state.ballX < -8) {
        state.score = 0;
        state.messageTimer = 1.4;
        resetBall(1);
      }

      if (input.isDown('Space') && Math.abs(state.ballVX) < 74) {
        resetBall(1);
      }

      state.messageTimer = Math.max(0, state.messageTimer - dt);
    },

    draw(ctx) {
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, screen.width, screen.height);

      drawStars(ctx, screen, colors.primary, colors.soft);

      ctx.fillStyle = colors.primary;
      ctx.fillRect(12, state.paddleY, state.paddleW, state.paddleH);

      ctx.fillStyle = colors.soft;
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, state.ballR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#241d39';
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(screen.width / 2, 8);
      ctx.lineTo(screen.width / 2, screen.height - 8);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = colors.text;
      ctx.font = '8px monospace';
      ctx.fillText(`SCORE ${state.score}`, 8, 12);
      ctx.fillText(`BEST ${state.best}`, screen.width - 52, 12);

      if (state.messageTimer > 0) {
        ctx.fillStyle = colors.soft;
        ctx.font = '7px monospace';
        ctx.fillText('VOID PONG', 60, 64);
        ctx.fillText('W/S OR ↑/↓', 55, 76);
      }
    },

    destroy() {}
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function drawStars(ctx, screen, primary, soft) {
  const stars = [
    [30, 25, 1], [78, 18, 1], [132, 31, 1], [115, 82, 1],
    [42, 118, 1], [95, 126, 1], [146, 109, 1], [63, 93, 1]
  ];
  for (const [x, y, r] of stars) {
    ctx.fillStyle = (x + y) % 2 ? primary : soft;
    ctx.globalAlpha = 0.6;
    ctx.fillRect(x, y, r, r);
  }
  ctx.globalAlpha = 1;
}
