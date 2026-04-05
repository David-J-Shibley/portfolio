import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Gamepad2, RotateCcw } from "lucide-react";
import { PageMeta } from "@/components/PageMeta";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const W = 400;
const H = 520;
const PADDLE_W = 76;
const PADDLE_H = 11;
const PADDLE_Y = H - 42;
const BALL_R = 6;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const PAD_X = 10;
const TOP = 52;
const GAP = 4;

type Brick = { x: number; y: number; w: number; h: number; alive: boolean };

function makeBricks(): Brick[] {
  const bw = (W - 2 * PAD_X - GAP * (BRICK_COLS - 1)) / BRICK_COLS;
  const bh = 17;
  const list: Brick[] = [];
  for (let r = 0; r < BRICK_ROWS; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      list.push({
        x: PAD_X + c * (bw + GAP),
        y: TOP + r * (bh + GAP),
        w: bw,
        h: bh,
        alive: true,
      });
    }
  }
  return list;
}

type Game = {
  paddleX: number;
  ballX: number;
  ballY: number;
  ballVx: number;
  ballVy: number;
  bricks: Brick[];
  lives: number;
  score: number;
  running: boolean;
  ballAttached: boolean;
};

function initGame(): Game {
  return {
    paddleX: W / 2 - PADDLE_W / 2,
    ballX: W / 2,
    ballY: PADDLE_Y - BALL_R - 2,
    ballVx: 0,
    ballVy: 0,
    bricks: makeBricks(),
    lives: 3,
    score: 0,
    running: false,
    ballAttached: true,
  };
}

function drawFrame(c: CanvasRenderingContext2D, g: Game) {
  c.fillStyle = "hsl(222 25% 12%)";
  c.fillRect(0, 0, W, H);

  for (const b of g.bricks) {
    if (!b.alive) continue;
    const hue = 200 + (Math.floor(b.y) % 120);
    c.fillStyle = `hsl(${hue} 70% 52%)`;
    c.fillRect(b.x, b.y, b.w, b.h);
    c.strokeStyle = "hsl(0 0% 100% / 0.15)";
    c.strokeRect(b.x + 0.5, b.y + 0.5, b.w - 1, b.h - 1);
  }

  c.fillStyle = "hsl(210 20% 88%)";
  c.fillRect(g.paddleX, PADDLE_Y, PADDLE_W, PADDLE_H);
  c.beginPath();
  c.arc(g.ballX, g.ballY, BALL_R, 0, Math.PI * 2);
  c.fillStyle = "hsl(48 95% 58%)";
  c.fill();
}

export default function BreakoutPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(initGame());
  const keysRef = useRef({ left: false, right: false });
  const rafRef = useRef(0);
  const [ui, setUi] = useState({
    score: 0,
    lives: 3,
    won: false,
    lost: false,
  });

  const pushUi = (g: Game) => {
    const won = g.bricks.every((b) => !b.alive);
    const lost = g.lives <= 0 && !won;
    setUi((prev) => {
      if (
        prev.score === g.score &&
        prev.lives === g.lives &&
        prev.won === won &&
        prev.lost === lost
      ) {
        return prev;
      }
      return { score: g.score, lives: g.lives, won, lost };
    });
  };

  const resetGame = () => {
    gameRef.current = initGame();
    pushUi(gameRef.current);
    const c = canvasRef.current?.getContext("2d");
    if (c) drawFrame(c, gameRef.current);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas?.getContext("2d");
    if (!canvas || !c) return;

    const launchBall = () => {
      const g = gameRef.current;
      if (!g.ballAttached || g.lives <= 0) return;
      g.ballAttached = false;
      g.running = true;
      const angle = (Math.random() * 0.5 + 0.25) * Math.PI;
      const speed = 5.2;
      g.ballVx = Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1);
      g.ballVy = -Math.sin(angle) * speed;
    };

    const movePaddleFromClientX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      const scale = W / rect.width;
      const x = (clientX - rect.left) * scale - PADDLE_W / 2;
      const g = gameRef.current;
      g.paddleX = Math.max(0, Math.min(W - PADDLE_W, x));
      if (g.ballAttached) {
        g.ballX = g.paddleX + PADDLE_W / 2;
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = true;
      if (e.key === "ArrowRight") keysRef.current.right = true;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        launchBall();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keysRef.current.left = false;
      if (e.key === "ArrowRight") keysRef.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    const loop = () => {
      const g = gameRef.current;
      const ctx = c;

      if (keysRef.current.left) {
        g.paddleX = Math.max(0, g.paddleX - 7);
        if (g.ballAttached) g.ballX = g.paddleX + PADDLE_W / 2;
      }
      if (keysRef.current.right) {
        g.paddleX = Math.min(W - PADDLE_W, g.paddleX + 7);
        if (g.ballAttached) g.ballX = g.paddleX + PADDLE_W / 2;
      }

      if (!g.running || g.ballAttached) {
        g.ballX = g.paddleX + PADDLE_W / 2;
        g.ballY = PADDLE_Y - BALL_R - 2;
        drawFrame(ctx, g);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      let { ballX, ballY, ballVx, ballVy } = g;
      ballX += ballVx;
      ballY += ballVy;

      if (ballX < BALL_R) {
        ballX = BALL_R;
        ballVx *= -1;
      }
      if (ballX > W - BALL_R) {
        ballX = W - BALL_R;
        ballVx *= -1;
      }
      if (ballY < BALL_R) {
        ballY = BALL_R;
        ballVy *= -1;
      }

      const py = PADDLE_Y;
      const px = g.paddleX;
      if (
        ballY + BALL_R >= py &&
        ballY - BALL_R <= py + PADDLE_H &&
        ballX >= px - 4 &&
        ballX <= px + PADDLE_W + 4 &&
        ballVy > 0
      ) {
        ballY = py - BALL_R - 0.1;
        ballVy *= -1;
        const hit = (ballX - (px + PADDLE_W / 2)) / (PADDLE_W / 2);
        ballVx += hit * 2.2;
        ballVx = Math.max(-6.5, Math.min(6.5, ballVx));
      }

      if (ballY > H + 24) {
        g.lives -= 1;
        g.ballAttached = true;
        g.running = g.lives > 0;
        ballX = g.paddleX + PADDLE_W / 2;
        ballY = PADDLE_Y - BALL_R - 2;
        ballVx = 0;
        ballVy = 0;
        pushUi(g);
      }

      for (const b of g.bricks) {
        if (!b.alive) continue;
        if (
          ballX + BALL_R > b.x &&
          ballX - BALL_R < b.x + b.w &&
          ballY + BALL_R > b.y &&
          ballY - BALL_R < b.y + b.h
        ) {
          b.alive = false;
          g.score += 10;
          const cx = b.x + b.w / 2;
          const cy = b.y + b.h / 2;
          const dx = ballX - cx;
          const dy = ballY - cy;
          if (Math.abs(dx / b.w) > Math.abs(dy / b.h)) {
            ballVx *= -1;
          } else {
            ballVy *= -1;
          }
          break;
        }
      }

      g.ballX = ballX;
      g.ballY = ballY;
      g.ballVx = ballVx;
      g.ballVy = ballVy;

      if (g.bricks.every((b) => !b.alive)) {
        g.running = false;
      }

      drawFrame(ctx, g);
      pushUi(g);
      rafRef.current = requestAnimationFrame(loop);
    };

    drawFrame(c, gameRef.current);
    rafRef.current = requestAnimationFrame(loop);

    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      if (gameRef.current.ballAttached) launchBall();
      movePaddleFromClientX(e.clientX);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (canvas.hasPointerCapture(e.pointerId)) {
        movePaddleFromClientX(e.clientX);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Breakout"
        description="Bounce the ball into bricks — mouse, touch, or keys."
        path="/breakout"
      />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={resetGame}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Breakout
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Move the paddle · tap or space to launch · ← → keys
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Score </span>
            <span className="font-bold tabular-nums">{ui.score}</span>
          </div>
          <div className="rounded-md border border-border bg-muted/50 px-3 py-2">
            <span className="text-muted-foreground">Lives </span>
            <span className="font-bold tabular-nums">{ui.lives}</span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md touch-none select-none">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            className="w-full cursor-pointer rounded-lg border border-border bg-black/80"
            style={{ aspectRatio: `${W} / ${H}` }}
            role="application"
            aria-label="Breakout game canvas"
          />
        </div>
      </div>

      <Dialog open={ui.won} onOpenChange={(o) => !o && resetGame()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cleared!</DialogTitle>
            <DialogDescription>
              Final score:{" "}
              <span className="font-semibold text-foreground">{ui.score}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={resetGame}>
              Play again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={ui.lost} onOpenChange={(o) => !o && resetGame()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Game over</DialogTitle>
            <DialogDescription>
              Score:{" "}
              <span className="font-semibold text-foreground">{ui.score}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={resetGame}>
              Try again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
