import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Castle, ChevronLeft, RotateCcw } from "lucide-react";
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
import {
  H,
  MAX_TOWER_LEVEL,
  SLOT_HIT_R,
  START_GOLD,
  START_LIVES,
  TOWER_STATS,
  W,
  WAVES,
  towerStatsForLevel,
  upgradeCostForLevel,
  type TowerKind,
} from "../lib/constants";
import {
  DEFAULT_MAP_ID,
  MAP_ORDER,
  MAPS,
  getMap,
  type MapId,
} from "../lib/maps";
import { distSq, positionOnPath, type PathMeta, type Vec } from "../lib/pathMath";

type Enemy = {
  id: number;
  u: number;
  hp: number;
  maxHp: number;
  baseSpeed: number;
  reward: number;
  slowUntil: number;
  /** Movement multiplier while slowed (from last frost hit). */
  slowMoveMul: number;
};

type Tower = {
  id: number;
  slot: number;
  kind: TowerKind;
  /** 1 = base build; upgrades increase up to MAX_TOWER_LEVEL. */
  level: number;
  cd: number;
};

type Bullet = {
  x: number;
  y: number;
  targetId: number;
  damage: number;
  speed: number;
  slowMul?: number;
  slowDur?: number;
  /** Blast: splash uses impact point (primary target position). */
  splashRadius?: number;
  splashDamageRatio?: number;
};

type GameModel = {
  mapId: MapId;
  gold: number;
  lives: number;
  waveIdx: number;
  waveActive: boolean;
  spawnLeft: number;
  spawnCd: number;
  enemies: Enemy[];
  towers: Tower[];
  bullets: Bullet[];
  nextEnemyId: number;
  nextTowerId: number;
  result: null | "win" | "lose";
  shop: TowerKind | null;
  occupied: boolean[];
  time: number;
};

function initGame(mapId: MapId): GameModel {
  const slots = getMap(mapId).buildSlots;
  return {
    mapId,
    gold: START_GOLD,
    lives: START_LIVES,
    waveIdx: -1,
    waveActive: false,
    spawnLeft: 0,
    spawnCd: 0,
    enemies: [],
    towers: [],
    bullets: [],
    nextEnemyId: 1,
    nextTowerId: 1,
    result: null,
    shop: "dart",
    occupied: slots.map(() => false),
    time: 0,
  };
}

function pickTarget(
  pathMeta: PathMeta,
  tx: number,
  ty: number,
  range: number,
  enemies: Enemy[],
): Enemy | null {
  const r2 = range * range;
  let best: Enemy | null = null;
  let bestU = -1;
  for (const e of enemies) {
    if (e.hp <= 0) continue;
    const p = positionOnPath(pathMeta, e.u);
    if (distSq({ x: tx, y: ty }, p) <= r2 && e.u > bestU) {
      best = e;
      bestU = e.u;
    }
  }
  return best;
}

function draw(ctx: CanvasRenderingContext2D, g: GameModel) {
  const { path, buildSlots, pathMeta } = getMap(g.mapId);

  ctx.fillStyle = "hsl(220 18% 10%)";
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "hsl(220 12% 22%)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "hsl(35 40% 35% / 0.85)";
  ctx.lineWidth = 44;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(path[0]!.x, path[0]!.y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i]!.x, path[i]!.y);
  }
  ctx.stroke();

  ctx.strokeStyle = "hsl(35 25% 20% / 0.5)";
  ctx.lineWidth = 36;
  ctx.beginPath();
  ctx.moveTo(path[0]!.x, path[0]!.y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i]!.x, path[i]!.y);
  }
  ctx.stroke();

  for (let i = 0; i < buildSlots.length; i++) {
    const s = buildSlots[i]!;
    const occ = g.occupied[i];
    const tw = occ ? g.towers.find((t) => t.slot === i) : undefined;
    const canBuild =
      !occ &&
      g.shop &&
      g.gold >= TOWER_STATS[g.shop].cost &&
      g.result === null;
    const canUpgrade =
      !!tw &&
      tw.level < MAX_TOWER_LEVEL &&
      g.gold >= upgradeCostForLevel(tw.kind, tw.level) &&
      g.result === null;
    ctx.beginPath();
    ctx.arc(s.x, s.y, SLOT_HIT_R, 0, Math.PI * 2);
    ctx.strokeStyle = occ
      ? canUpgrade
        ? "hsl(38 90% 52%)"
        : "hsl(0 0% 40%)"
      : canBuild
        ? "hsl(142 60% 45%)"
        : "hsl(220 10% 35%)";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (!occ && g.shop && canBuild) {
      ctx.fillStyle = "hsl(142 50% 45% / 0.12)";
      ctx.fill();
    } else if (occ && canUpgrade) {
      ctx.fillStyle = "hsl(38 90% 52% / 0.1)";
      ctx.fill();
    }
  }

  for (const t of g.towers) {
    const s = buildSlots[t.slot]!;
    const st = TOWER_STATS[t.kind];
    ctx.beginPath();
    ctx.arc(s.x, s.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${st.hue} 65% 48%)`;
    ctx.fill();
    ctx.strokeStyle = "hsl(0 0% 100% / 0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (t.level > 1) {
      ctx.fillStyle = "hsl(0 0% 100% / 0.9)";
      ctx.font =
        t.level >= 10
          ? "bold 9px system-ui, sans-serif"
          : "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(t.level), s.x, s.y + 1);
    }
  }

  for (const e of g.enemies) {
    const p = positionOnPath(pathMeta, e.u);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    const chill = g.time < e.slowUntil;
    ctx.fillStyle = chill
      ? "hsl(200 70% 55%)"
      : "hsl(0 72% 48%)";
    ctx.fill();
    ctx.strokeStyle = "hsl(0 0% 0% / 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    const bw = 28;
    const bh = 4;
    ctx.fillStyle = "hsl(0 0% 15%)";
    ctx.fillRect(p.x - bw / 2, p.y - 22, bw, bh);
    ctx.fillStyle = "hsl(142 70% 42%)";
    ctx.fillRect(p.x - bw / 2, p.y - 22, bw * (e.hp / e.maxHp), bh);
  }

  for (const b of g.bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "hsl(48 95% 58%)";
    ctx.fill();
  }
}

function slotAt(mx: number, my: number, buildSlots: Vec[]): number {
  for (let i = 0; i < buildSlots.length; i++) {
    const s = buildSlots[i]!;
    if (distSq({ x: mx, y: my }, s) <= SLOT_HIT_R * SLOT_HIT_R) return i;
  }
  return -1;
}

type Hud = {
  mapId: MapId;
  mapName: string;
  canChangeMap: boolean;
  gold: number;
  lives: number;
  waveLabel: string;
  shop: TowerKind | null;
  waveActive: boolean;
  canStartNext: boolean;
  gameOver: boolean;
};

export default function TowerDefensePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameModel>(initGame(DEFAULT_MAP_ID));
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const hudAccRef = useRef(0);
  const lastResultRef = useRef<null | "win" | "lose">(null);
  const [hud, setHud] = useState<Hud>({
    mapId: DEFAULT_MAP_ID,
    mapName: MAPS[DEFAULT_MAP_ID].name,
    canChangeMap: true,
    gold: START_GOLD,
    lives: START_LIVES,
    waveLabel: "—",
    shop: "dart",
    waveActive: false,
    canStartNext: true,
    gameOver: false,
  });
  const [winOpen, setWinOpen] = useState(false);
  const [loseOpen, setLoseOpen] = useState(false);

  const syncHud = useCallback((g: GameModel) => {
    const m = getMap(g.mapId);
    setHud({
      mapId: g.mapId,
      mapName: m.name,
      canChangeMap:
        g.waveIdx < 0 && g.towers.length === 0 && g.result === null,
      gold: g.gold,
      lives: g.lives,
      waveLabel:
        g.waveIdx < 0
          ? "—"
          : g.waveIdx >= WAVES.length
            ? "Done"
            : `${g.waveIdx + 1}/${WAVES.length}`,
      shop: g.shop,
      waveActive: g.waveActive,
      canStartNext:
        !g.waveActive &&
        g.waveIdx + 1 < WAVES.length &&
        g.result === null,
      gameOver: g.result !== null,
    });
    if (g.result && g.result !== lastResultRef.current) {
      lastResultRef.current = g.result;
      if (g.result === "win") setWinOpen(true);
      if (g.result === "lose") setLoseOpen(true);
    }
  }, []);

  const resetGame = useCallback(() => {
    const id = gameRef.current.mapId;
    gameRef.current = initGame(id);
    lastResultRef.current = null;
    setWinOpen(false);
    setLoseOpen(false);
    syncHud(gameRef.current);
  }, [syncHud]);

  const selectMap = useCallback(
    (id: MapId) => {
      const g = gameRef.current;
      if (
        g.waveIdx >= 0 ||
        g.towers.length > 0 ||
        g.result !== null
      ) {
        return;
      }
      gameRef.current = initGame(id);
      hudAccRef.current = 0;
      syncHud(gameRef.current);
    },
    [syncHud],
  );

  const startWave = useCallback(() => {
    const g = gameRef.current;
    if (g.result !== null) return;
    if (g.waveActive) return;
    if (g.waveIdx + 1 >= WAVES.length) return;
    const next = g.waveIdx + 1;
    const w = WAVES[next]!;
    g.waveIdx = next;
    g.waveActive = true;
    g.spawnLeft = w.count;
    g.spawnCd = 0;
    hudAccRef.current = 0;
    syncHud(g);
  }, [syncHud]);

  useEffect(() => {
    syncHud(gameRef.current);
  }, [syncHud]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const loop = (now: number) => {
      if (!lastRef.current) lastRef.current = now;
      const dt = Math.min(0.05, (now - lastRef.current) / 1000);
      lastRef.current = now;

      const g = gameRef.current;
      const map = getMap(g.mapId);
      if (g.result === null) {
        g.time += dt;

        if (g.waveActive && g.waveIdx >= 0 && g.waveIdx < WAVES.length) {
          const w = WAVES[g.waveIdx]!;
          if (g.spawnLeft > 0) {
            g.spawnCd -= dt;
            if (g.spawnCd <= 0) {
              g.enemies.push({
                id: g.nextEnemyId++,
                u: 0,
                hp: w.baseHp,
                maxHp: w.baseHp,
                baseSpeed: w.speed,
                reward: w.reward,
                slowUntil: 0,
                slowMoveMul: 1,
              });
              g.spawnLeft--;
              g.spawnCd = w.interval;
            }
          }
          if (g.spawnLeft === 0 && g.enemies.length === 0) {
            g.waveActive = false;
            if (g.waveIdx >= WAVES.length - 1) {
              g.result = "win";
            }
          }
        }

        const leaked: number[] = [];
        for (const e of g.enemies) {
          const moveMul = g.time < e.slowUntil ? e.slowMoveMul : 1;
          e.u += e.baseSpeed * moveMul * dt;
          if (e.u >= 1) {
            g.lives -= 1;
            leaked.push(e.id);
            if (g.lives <= 0) g.result = "lose";
          }
        }
        if (leaked.length) {
          g.enemies = g.enemies.filter((e) => !leaked.includes(e.id));
        }

        for (const t of g.towers) {
          const s = map.buildSlots[t.slot]!;
          const st = towerStatsForLevel(t.kind, t.level);
          t.cd -= dt;
          if (t.cd <= 0) {
            const tgt = pickTarget(
              map.pathMeta,
              s.x,
              s.y,
              st.range,
              g.enemies,
            );
            if (tgt) {
              t.cd = st.cooldown;
              g.bullets.push({
                x: s.x,
                y: s.y,
                targetId: tgt.id,
                damage: st.damage,
                speed: st.projectileSpeed,
                slowMul: st.slowMul,
                slowDur: st.slowDuration,
                splashRadius: st.splashRadius,
                splashDamageRatio: st.splashDamageRatio,
              });
            }
          }
        }

        const nextBullets: Bullet[] = [];
        for (const b of g.bullets) {
          const tgt = g.enemies.find((e) => e.id === b.targetId && e.hp > 0);
          if (!tgt) continue;
          const tp = positionOnPath(map.pathMeta, tgt.u);
          const dx = tp.x - b.x;
          const dy = tp.y - b.y;
          const d = Math.hypot(dx, dy);
          const step = b.speed * dt;
          if (d < 0.001 || d <= step + 8) {
            tgt.hp -= b.damage;
            if (b.slowMul != null && b.slowDur != null) {
              tgt.slowUntil = g.time + b.slowDur;
              tgt.slowMoveMul = b.slowMul;
            }
            if (
              b.splashRadius != null &&
              b.splashRadius > 0 &&
              b.splashDamageRatio != null &&
              b.splashDamageRatio > 0
            ) {
              const r2 = b.splashRadius * b.splashRadius;
              const splashDmg = b.damage * b.splashDamageRatio;
              for (const e of g.enemies) {
                if (e.id === tgt.id || e.hp <= 0) continue;
                const p = positionOnPath(map.pathMeta, e.u);
                if (distSq(p, tp) <= r2) e.hp -= splashDmg;
              }
            }
          } else {
            b.x += (dx / d) * step;
            b.y += (dy / d) * step;
            nextBullets.push(b);
          }
        }
        let goldGain = 0;
        g.enemies = g.enemies.filter((e) => {
          if (e.hp <= 0) {
            goldGain += e.reward;
            return false;
          }
          return true;
        });
        g.gold += goldGain;
        g.bullets = nextBullets;
      }

      draw(ctx, g);

      hudAccRef.current += dt;
      if (hudAccRef.current >= 0.12) {
        hudAccRef.current = 0;
        syncHud(g);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [syncHud]);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const g = gameRef.current;
    if (g.result !== null) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const buildSlots = getMap(g.mapId).buildSlots;
    const r = canvas.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width) * W;
    const my = ((e.clientY - r.top) / r.height) * H;
    const si = slotAt(mx, my, buildSlots);
    if (si < 0) return;

    if (g.occupied[si]) {
      const tw = g.towers.find((t) => t.slot === si);
      if (!tw || tw.level >= MAX_TOWER_LEVEL) return;
      const upCost = upgradeCostForLevel(tw.kind, tw.level);
      if (g.gold < upCost) return;
      g.gold -= upCost;
      tw.level += 1;
      hudAccRef.current = 0;
      syncHud(g);
      return;
    }

    if (!g.shop) return;
    const cost = TOWER_STATS[g.shop].cost;
    if (g.gold < cost) return;
    g.gold -= cost;
    g.occupied[si] = true;
    g.towers.push({
      id: g.nextTowerId++,
      slot: si,
      kind: g.shop,
      level: 1,
      cd: 0,
    });
    hudAccRef.current = 0;
    syncHud(g);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background px-4 pb-16 pt-24 text-foreground md:pt-28">
      <PageMeta
        title="Tower Defense"
        description="Tower defense with multiple maps — place dart, blast, and frost towers along different routes."
        path="/tower-defense"
      />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2 gap-1">
            <Link to="/games">
              <ChevronLeft className="h-4 w-4" aria-hidden />
              Games
            </Link>
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={resetGame}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden />
            Reset
          </Button>
        </header>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Castle className="h-8 w-8 text-primary" aria-hidden />
            <h1 className="font-serif text-3xl font-semibold tracking-tight">
              Tower Defense
            </h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a map before your first wave. Pick a tower type, then click a green ring to
            build; click a tower to upgrade (max {MAX_TOWER_LEVEL}). Start each wave when ready.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Map
          </p>
          <div className="flex max-w-full flex-wrap justify-center gap-2">
            {MAP_ORDER.map((id) => {
              const def = MAPS[id];
              const sel = hud.mapId === id;
              return (
                <Button
                  key={id}
                  type="button"
                  size="sm"
                  variant={sel ? "default" : "outline"}
                  disabled={!hud.canChangeMap}
                  title={def.blurb}
                  onClick={() => selectMap(id)}
                  className="max-w-[11rem] shrink-0 text-left"
                >
                  <span className="block truncate font-medium">{def.name}</span>
                </Button>
              );
            })}
          </div>
          {!hud.canChangeMap ? (
            <p className="text-center text-xs text-muted-foreground">
              Reset run to change the map.
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium tabular-nums">
            Gold: {hud.gold}
          </span>
          <span className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium tabular-nums">
            Lives: {hud.lives}
          </span>
          <span className="rounded-lg border border-border bg-card px-3 py-1.5 font-medium">
            Wave: {hud.waveLabel}
          </span>
          <span
            className="max-w-[14rem] truncate rounded-lg border border-border bg-card px-3 py-1.5 text-center text-muted-foreground"
            title={MAPS[hud.mapId].blurb}
          >
            {hud.mapName}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {(["dart", "blast", "frost"] as const).map((k) => {
            const st = TOWER_STATS[k];
            const sel = hud.shop === k;
            return (
              <Button
                key={k}
                type="button"
                size="sm"
                variant={sel ? "default" : "outline"}
                disabled={hud.gameOver}
                onClick={() => {
                  gameRef.current.shop = k;
                  setHud((h) => ({ ...h, shop: k }));
                }}
                className="gap-1"
              >
                {st.name}{" "}
                <span className="text-xs opacity-80">({st.cost}g)</span>
              </Button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onClick={onCanvasClick}
            className="max-w-full cursor-crosshair rounded-xl border border-border bg-card shadow-md"
            style={{ width: "min(100%, 720px)", height: "auto", aspectRatio: `${W} / ${H}` }}
            aria-label="Tower defense map — click build rings to place towers"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            size="lg"
            onClick={startWave}
            disabled={!hud.canStartNext || hud.waveActive || hud.gameOver}
          >
            {hud.gameOver
              ? "Game ended"
              : !hud.canStartNext && !hud.waveActive
                ? "All waves cleared"
                : "Start next wave"}
          </Button>
        </div>
      </div>

      <Dialog open={winOpen} onOpenChange={setWinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You held the line</DialogTitle>
            <DialogDescription>
              Every wave cleared. The path is safe — for now.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={resetGame}>
              Play again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={loseOpen} onOpenChange={setLoseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Too many leaks</DialogTitle>
            <DialogDescription>
              Enemies reached the exit. Try different tower mixes or earlier waves.
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
