import React from "react";
import {
  AbsoluteFill,
  Composition,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BG = "#07090d";
const CYAN = "#00d4ff";
const GREEN = "#39d98a";
const PURPLE = "#9b7cff";
const WHITE = "#f5f7fa";
const MUTED = "#7f8998";
const RED = "#ff5f6d";
const ORANGE = "#ffb454";

const SCENE_DURATION = 450; // 15 seconds
const TOTAL_SCENES = 40;

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};

const ease = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], clamp);

const slideIn = (frame: number, delay = 0) =>
  interpolate(frame, [delay, delay + 30], [80, 0], clamp);

const fadeIn = (frame: number, delay = 0) =>
  interpolate(frame, [delay, delay + 25], [0, 1], clamp);

const scaleIn = (frame: number, delay = 0) =>
  interpolate(frame, [delay, delay + 35], [0.75, 1], clamp);

const glow = (color: string) =>
  `0 0 30px ${color}55, 0 0 80px ${color}22`;

const SceneTitle = ({
  number,
  title,
  subtitle,
}: {
  number: number;
  title: string;
  subtitle?: string;
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 54,
        left: 70,
        opacity: fadeIn(frame),
        transform: `translateY(${slideIn(frame)}px)`,
      }}
    >
      <div
        style={{
          fontFamily: "Arial",
          fontSize: 15,
          letterSpacing: 4,
          color: CYAN,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        SYSTEMS // {String(number).padStart(2, "0")}
      </div>

      <div
        style={{
          fontFamily: "Arial",
          fontSize: 42,
          fontWeight: 800,
          color: WHITE,
          letterSpacing: -1.5,
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div
          style={{
            marginTop: 10,
            fontFamily: "Arial",
            fontSize: 18,
            color: MUTED,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

const Grid = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `
          linear-gradient(${CYAN}08 1px, transparent 1px),
          linear-gradient(90deg, ${CYAN}08 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        opacity: 0.45,
      }}
    />
  );
};

const Vignette = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(circle at center, transparent 35%, rgba(0,0,0,.58) 100%)",
      pointerEvents: "none",
    }}
  />
);

const Browser = ({
  x = 0,
  y = 0,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: 640 + x,
        top: 390 + y,
        width: 760,
        height: 390,
        transform: `translate(-50%, -50%) scale(${scale})`,
        borderRadius: 18,
        background: "#10141b",
        border: `1px solid ${CYAN}45`,
        boxShadow: glow(CYAN),
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 42,
          background: "#151a22",
          borderBottom: "1px solid #252c38",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
        }}
      >
        <div style={{ width: 10, height: 10, borderRadius: 50, background: RED }} />
        <div style={{ width: 10, height: 10, borderRadius: 50, background: ORANGE }} />
        <div style={{ width: 10, height: 10, borderRadius: 50, background: GREEN }} />

        <div
          style={{
            marginLeft: 20,
            height: 25,
            flex: 1,
            borderRadius: 7,
            background: "#0b0f15",
            border: "1px solid #252c38",
            color: MUTED,
            fontFamily: "monospace",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            paddingLeft: 14,
          }}
        >
          https://inside-systems.com
        </div>
      </div>

      <div
        style={{
          padding: 35,
          fontFamily: "Arial",
          opacity: 0.85 + Math.sin(frame / 30) * 0.03,
        }}
      >
        <div
          style={{
            width: 220,
            height: 22,
            borderRadius: 5,
            background: "#202936",
            marginBottom: 22,
          }}
        />

        <div
          style={{
            width: 480,
            height: 55,
            borderRadius: 8,
            background: "#18212b",
            marginBottom: 14,
          }}
        />

        <div
          style={{
            width: 380,
            height: 16,
            borderRadius: 4,
            background: "#202936",
            marginBottom: 10,
          }}
        />

        <div
          style={{
            width: 300,
            height: 16,
            borderRadius: 4,
            background: "#202936",
          }}
        />
      </div>
    </div>
  );
};

const Packet = ({
  x1,
  y1,
  x2,
  y2,
  delay = 0,
  color = CYAN,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  delay?: number;
  color?: string;
}) => {
  const frame = useCurrentFrame();

  const p = interpolate(
    frame,
    [delay, delay + 90],
    [0, 1],
    clamp
  );

  const x = x1 + (x2 - x1) * p;
  const y = y1 + (y2 - y1) * p;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: color,
        boxShadow: glow(color),
        transform: "translate(-50%, -50%)",
      }}
    />
  );
};

const Line = ({
  x1,
  y1,
  x2,
  y2,
  color = CYAN,
  opacity = 0.45,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  opacity?: number;
}) => {
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  return (
    <div
      style={{
        position: "absolute",
        left: x1,
        top: y1,
        width: length,
        height: 2,
        background: color,
        opacity,
        transformOrigin: "0 50%",
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};

const Node = ({
  x,
  y,
  label,
  color = CYAN,
  size = 90,
}: {
  x: number;
  y: number;
  label: string;
  color?: string;
  size?: number;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: 18,
        transform: "translate(-50%, -50%)",
        background: "#10161e",
        border: `2px solid ${color}88`,
        boxShadow: glow(color),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: WHITE,
        fontFamily: "Arial",
        fontSize: size > 80 ? 15 : 12,
        fontWeight: 700,
      }}
    >
      {label}
    </div>
  );
};

const ServerRack = ({
  x = 900,
  y = 390,
  scale = 1,
}: {
  x?: number;
  y?: number;
  scale?: number;
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        width: 240,
        height: 300,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: i * 72,
            left: 0,
            width: 240,
            height: 58,
            borderRadius: 8,
            background: "#111820",
            border: `1px solid ${CYAN}55`,
            boxShadow: `0 0 20px ${CYAN}10`,
          }}
        >
          <div
            style={{
              width: 150,
              height: 7,
              margin: "14px 0 0 16px",
              background: "#26313d",
              borderRadius: 4,
            }}
          />

          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i % 2 === 0 ? GREEN : CYAN,
              position: "absolute",
              right: 18,
              top: 15,
              boxShadow: glow(i % 2 === 0 ? GREEN : CYAN),
              opacity: 0.7 + Math.sin(frame / 10 + i) * 0.3,
            }}
          />
        </div>
      ))}
    </div>
  );
};

const Database = ({
  x,
  y,
  scale = 1,
}: {
  x: number;
  y: number;
  scale?: number;
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 190,
        height: 180,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: i * 45,
            left: 0,
            width: 190,
            height: 70,
            borderRadius: "50%",
            background: "#111820",
            border: `2px solid ${PURPLE}88`,
            boxShadow: glow(PURPLE),
          }}
        />
      ))}
    </div>
  );
};

const CodePanel = ({
  x = 640,
  y = 410,
  title = "REQUEST",
  lines = 8,
}: {
  x?: number;
  y?: number;
  title?: string;
  lines?: number;
}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 560,
        minHeight: 300,
        transform: "translate(-50%, -50%)",
        background: "#0d1219",
        border: `1px solid ${CYAN}45`,
        borderRadius: 16,
        boxShadow: glow(CYAN),
        padding: 25,
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          color: CYAN,
          fontSize: 14,
          letterSpacing: 3,
          marginBottom: 20,
        }}
      >
        {title}
      </div>

      {Array.from({ length: lines }).map((_, i) => {
        const width = 120 + ((i * 73) % 280);
        return (
          <div
            key={i}
            style={{
              height: 10,
              width,
              marginBottom: 15,
              borderRadius: 4,
              background:
                i % 3 === 0 ? `${PURPLE}88` : `${CYAN}55`,
              opacity: interpolate(
                frame,
                [i * 7, i * 7 + 20],
                [0, 1],
                clamp
              ),
            }}
          />
        );
      })}
    </div>
  );
};

const TransitionOverlay = ({ scene }: { scene: number }) => {
  const frame = useCurrentFrame();

  const enter = interpolate(frame, [0, 24], [1, 0], clamp);
  const exit = interpolate(frame, [426, 449], [0, 1], clamp);

  const type = scene % 6;

  if (type === 0) {
    return (
      <AbsoluteFill
        style={{
          background: CYAN,
          opacity: Math.max(enter, exit),
          transform: `scaleX(${type === 0 ? 1 : 1})`,
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      />
    );
  }

  if (type === 1) {
    return (
      <AbsoluteFill
        style={{
          background: BG,
          opacity: Math.max(enter, exit) * 0.95,
          clipPath:
            frame < 30
              ? `inset(0 ${100 - enter * 100}% 0 0)`
              : `inset(0 ${exit * 100}% 0 0)`,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (type === 2) {
    return (
      <AbsoluteFill
        style={{
          background: PURPLE,
          opacity: Math.max(enter, exit) * 0.8,
          clipPath:
            frame < 30
              ? `polygon(0 0, ${enter * 100}% 0, 0 ${enter * 100}%)`
              : `polygon(100% 100%, 100% ${100 - exit * 100}%, ${
                  100 - exit * 100
                }% 100%)`,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (type === 3) {
    return (
      <AbsoluteFill
        style={{
          border: `${Math.max(enter, exit) * 16}px solid ${CYAN}`,
          opacity: Math.max(enter, exit),
          pointerEvents: "none",
        }}
      />
    );
  }

  if (type === 4) {
    return (
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,212,255,.9), transparent)",
          transform: `translateX(${
            frame < 30
              ? interpolate(frame, [0, 24], [-1400, 1400], clamp)
              : interpolate(frame, [426, 449], [1400, -1400], clamp)
          }px)`,
          opacity: Math.max(enter, exit),
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <AbsoluteFill
      style={{
        background: BG,
        opacity: Math.max(enter, exit) * 0.8,
        transform: `scale(${1 + Math.max(enter, exit) * 0.3})`,
        pointerEvents: "none",
      }}
    />
  );
};

const SceneShell = ({
  children,
  number,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  number: number;
  title: string;
  subtitle?: string;
}) => {
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <Grid />
      <SceneTitle number={number} title={title} subtitle={subtitle} />
      {children}
      <Vignette />
    </AbsoluteFill>
  );
};

const Scene = ({ index }: { index: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
      mass: 0.8,
    },
  });

  switch (index) {
    // 1
    case 0:
      return (
        <SceneShell
          number={1}
          title="You type a URL."
          subtitle="But what actually happens next?"
        >
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 390,
              transform: `translate(-50%, -50%) scale(${scaleIn(frame)})`,
              textAlign: "center",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                fontSize: 48,
                color: CYAN,
                textShadow: glow(CYAN),
              }}
            >
              https://inside-systems.com
            </div>

            <div
              style={{
                marginTop: 35,
                color: MUTED,
                fontSize: 20,
              }}
            >
              One URL → thousands of operations
            </div>
          </div>
        </SceneShell>
      );

    // 2
    case 1:
      return (
        <SceneShell number={2} title="ENTER">
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 390,
              transform: `translate(-50%, -50%) scale(${s})`,
              width: 140,
              height: 140,
              borderRadius: 25,
              border: `3px solid ${CYAN}`,
              boxShadow: glow(CYAN),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Arial",
              fontWeight: 800,
              fontSize: 24,
              color: WHITE,
            }}
          >
            ↵
          </div>

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 560,
              transform: `translateX(-50%)`,
              fontFamily: "monospace",
              color: CYAN,
              fontSize: 18,
            }}
          >
            REQUEST INITIATED
          </div>
        </SceneShell>
      );

    // 3
    case 2:
      return (
        <SceneShell
          number={3}
          title="The browser starts working"
          subtitle="Before the internet is even contacted."
        >
          <Browser scale={1 + ease(frame, 0, 70) * 0.08} />

          <div
            style={{
              position: "absolute",
              left: 100,
              top: 500,
              fontFamily: "monospace",
              color: GREEN,
              fontSize: 18,
            }}
          >
            CHECKING LOCAL DATA...
          </div>

          <div
            style={{
              position: "absolute",
              left: 100,
              top: 535,
              width: 360,
              height: 7,
              background: "#18222d",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: `${ease(frame, 30, 150) * 100}%`,
                height: "100%",
                background: GREEN,
                borderRadius: 10,
              }}
            />
          </div>
        </SceneShell>
      );

    // 4
    case 3:
      return (
        <SceneShell
          number={4}
          title="Into the network"
          subtitle="Now the request needs an address."
        >
          <Node x={180} y={380} label="BROWSER" color={CYAN} />
          <Node x={640} y={380} label="NETWORK" color={PURPLE} size={120} />
          <Node x={1100} y={380} label="INTERNET" color={GREEN} />

          <Line x1={225} y1={380} x2={580} y2={380} />
          <Line x1={700} y1={380} x2={1055} y2={380} />

          <Packet x1={225} y1={380} x2={580} y2={380} color={CYAN} />
          <Packet
            x1={700}
            y1={380}
            x2={1055}
            y2={380}
            delay={60}
            color={GREEN}
          />
        </SceneShell>
      );

    // 5
    case 4:
      return (
        <SceneShell
          number={5}
          title="Browser cache"
          subtitle="Do we already know what we need?"
        >
          <Node x={640} y={250} label="BROWSER" color={CYAN} size={120} />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 480,
              width: 500,
              height: 180,
              transform: "translateX(-50%)",
              borderRadius: 16,
              background: "#10161e",
              border: `1px solid ${GREEN}55`,
              boxShadow: glow(GREEN),
              padding: 25,
              fontFamily: "monospace",
            }}
          >
            <div style={{ color: GREEN, marginBottom: 20 }}>
              CACHE LOOKUP
            </div>

            <div style={{ color: MUTED }}>
              DNS record ........ MISS
            </div>
            <div style={{ color: MUTED, marginTop: 12 }}>
              HTML .............. MISS
            </div>
            <div style={{ color: MUTED, marginTop: 12 }}>
              Assets ............ MISS
            </div>

            <div
              style={{
                position: "absolute",
                right: 25,
                top: 25,
                color: ORANGE,
                fontWeight: 800,
              }}
            >
              MISS
            </div>
          </div>
        </SceneShell>
      );

    // 6
    case 5:
      return (
        <SceneShell
          number={6}
          title="DNS resolver"
          subtitle="Turning a name into an IP address."
        >
          <Node x={180} y={390} label="YOU" color={CYAN} />
          <Node x={500} y={390} label="DNS" color={GREEN} size={120} />
          <Node x={900} y={260} label="ROOT" color={PURPLE} />
          <Node x={900} y={520} label=".COM" color={PURPLE} />

          <Line x1={225} y1={390} x2={440} y2={390} />
          <Line x1={560} y1={370} x2={855} y2={280} />
          <Line x1={560} y1={410} x2={855} y2={500} />

          <Packet x1={225} y1={390} x2={440} y2={390} />
        </SceneShell>
      );

    // 7
    case 6:
      return (
        <SceneShell number={7} title="Root DNS" subtitle="The first level of the hierarchy.">
          <Node x={640} y={360} label="ROOT DNS" color={PURPLE} size={150} />

          {[
            [240, 200],
            [1040, 200],
            [240, 560],
            [1040, 560],
          ].map(([x, y], i) => (
            <React.Fragment key={i}>
              <Line x1={640} y1={360} x2={x} y2={y} color={PURPLE} />
              <Node x={x} y={y} label={`ROOT-${i + 1}`} color={PURPLE} size={80} />
            </React.Fragment>
          ))}
        </SceneShell>
      );

    // 8
    case 7:
      return (
        <SceneShell number={8} title=".COM TLD server" subtitle="Finding the right authority.">
          <Node x={250} y={390} label="ROOT" color={PURPLE} />
          <Node x={640} y={390} label=".COM" color={CYAN} size={130} />
          <Node x={1030} y={390} label="AUTHORITY" color={GREEN} />

          <Line x1={295} y1={390} x2={575} y2={390} />
          <Line x1={705} y1={390} x2={985} y2={390} />

          <Packet x1={295} y1={390} x2={575} y2={390} color={PURPLE} />
          <Packet
            x1={705}
            y1={390}
            x2={985}
            y2={390}
            delay={70}
            color={GREEN}
          />
        </SceneShell>
      );

    // 9
    case 8:
      return (
        <SceneShell
          number={9}
          title="Authoritative DNS"
          subtitle="The server that knows the real answer."
        >
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 390,
              transform: "translate(-50%, -50%)",
              width: 500,
              height: 270,
              borderRadius: 20,
              background: "#10161e",
              border: `2px solid ${GREEN}66`,
              boxShadow: glow(GREEN),
              padding: 35,
              fontFamily: "monospace",
            }}
          >
            <div style={{ color: GREEN, fontSize: 18, marginBottom: 25 }}>
              DNS RESPONSE
            </div>

            <div style={{ color: MUTED }}>domain:</div>
            <div style={{ color: WHITE, marginBottom: 20 }}>
              inside-systems.com
            </div>

            <div style={{ color: MUTED }}>A record:</div>
            <div style={{ color: CYAN, fontSize: 25 }}>
              104.21.45.12
            </div>
          </div>
        </SceneShell>
      );

    // 10
    case 9:
      return (
        <SceneShell
          number={10}
          title="The IP address returns"
          subtitle="The name has been translated into a destination."
        >
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 390,
              transform: `translate(-50%, -50%) scale(${scaleIn(frame)})`,
              fontFamily: "monospace",
              fontSize: 64,
              color: CYAN,
              textShadow: glow(CYAN),
              letterSpacing: 8,
            }}
          >
            104.21.45.12
          </div>

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 500,
              transform: "translateX(-50%)",
              color: GREEN,
              fontFamily: "Arial",
              fontSize: 18,
            }}
          >
            DESTINATION FOUND
          </div>
        </SceneShell>
      );

    // 11
    case 10:
      return (
        <SceneShell
          number={11}
          title="Browser → network"
          subtitle="Now the real connection begins."
        >
          <Node x={170} y={390} label="BROWSER" color={CYAN} />
          <Node x={1100} y={390} label="SERVER" color={GREEN} />

          {[0, 1, 2, 3, 4].map((i) => (
            <Line
              key={i}
              x1={225}
              y1={300 + i * 45}
              x2={1045}
              y2={300 + i * 45}
              color={CYAN}
              opacity={0.18}
            />
          ))}

          <Packet x1={225} y1={390} x2={1045} y2={390} />
        </SceneShell>
      );

    // 12
    case 11:
      return (
        <SceneShell number={12} title="TCP SYN" subtitle="Can we open a connection?">
          <Node x={230} y={390} label="CLIENT" color={CYAN} size={110} />
          <Node x={1050} y={390} label="SERVER" color={GREEN} size={110} />

          <Line x1={290} y1={390} x2={990} y2={390} />

          <div
            style={{
              position: "absolute",
              left: interpolate(frame, [40, 180], [290, 990], clamp),
              top: 375,
              color: CYAN,
              fontFamily: "monospace",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            SYN →
          </div>
        </SceneShell>
      );

    // 13
    case 12:
      return (
        <SceneShell number={13} title="SYN-ACK" subtitle="The server answers back.">
          <Node x={230} y={390} label="CLIENT" color={CYAN} size={110} />
          <Node x={1050} y={390} label="SERVER" color={GREEN} size={110} />

          <Line x1={290} y1={390} x2={990} y2={390} />

          <div
            style={{
              position: "absolute",
              left: interpolate(frame, [40, 180], [990, 290], clamp),
              top: 375,
              color: GREEN,
              fontFamily: "monospace",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            ← SYN-ACK
          </div>
        </SceneShell>
      );

    // 14
    case 13:
      return (
        <SceneShell number={14} title="ACK" subtitle="The connection is confirmed.">
          <Node x={230} y={390} label="CLIENT" color={CYAN} size={110} />
          <Node x={1050} y={390} label="SERVER" color={GREEN} size={110} />

          <Line x1={290} y1={390} x2={990} y2={390} />

          <div
            style={{
              position: "absolute",
              left: interpolate(frame, [40, 180], [290, 990], clamp),
              top: 375,
              color: WHITE,
              fontFamily: "monospace",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            ACK →
          </div>
        </SceneShell>
      );

    // 15
    case 14:
      return (
        <SceneShell
          number={15}
          title="TCP connection established"
          subtitle="A reliable channel now exists."
        >
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 390,
              width: 800,
              height: 150,
              transform: `translate(-50%, -50%) scale(${scaleIn(frame)})`,
              borderRadius: 75,
              border: `3px solid ${GREEN}`,
              boxShadow: glow(GREEN),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: GREEN,
              fontFamily: "Arial",
              fontSize: 30,
              fontWeight: 800,
            }}
          >
            CONNECTION ESTABLISHED
          </div>
        </SceneShell>
      );

    // 16
    case 15:
      return (
        <SceneShell
          number={16}
          title="TLS handshake"
          subtitle="HTTPS now needs encryption."
        >
          <Node x={250} y={390} label="BROWSER" color={CYAN} />
          <Node x={640} y={390} label="TLS" color={PURPLE} size={130} />
          <Node x={1030} y={390} label="SERVER" color={GREEN} />

          <Line x1={295} y1={390} x2={575} y2={390} />
          <Line x1={705} y1={390} x2={985} y2={390} />

          <Packet x1={295} y1={390} x2={575} y2={390} color={PURPLE} />
        </SceneShell>
      );

    // 17
    case 16:
      return (
        <SceneShell number={17} title="Certificate check" subtitle="Is this really the server?">
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 390,
              width: 430,
              height: 300,
              transform: `translate(-50%, -50%) scale(${scaleIn(frame)})`,
              background: "#10161e",
              border: `2px solid ${GREEN}77`,
              borderRadius: 18,
              boxShadow: glow(GREEN),
              padding: 30,
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                color: GREEN,
                fontSize: 22,
                marginBottom: 25,
              }}
            >
              ✓ CERTIFICATE VALID
            </div>

            <div style={{ color: MUTED }}>Issued to</div>
            <div style={{ color: WHITE, marginBottom: 18 }}>
              inside-systems.com
            </div>

            <div style={{ color: MUTED }}>Issuer</div>
            <div style={{ color: WHITE }}>Trusted CA</div>
          </div>
        </SceneShell>
      );

    // 18
    case 17:
      return (
        <SceneShell
          number={18}
          title="Encryption keys"
          subtitle="Both sides agree on a secret."
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 250 + i * 85,
                top: 350 + Math.sin(i) * 70,
                width: 55,
                height: 55,
                borderRadius: 10,
                background: i % 2 ? `${PURPLE}33` : `${CYAN}33`,
                border: `1px solid ${i % 2 ? PURPLE : CYAN}`,
                transform: `rotate(${i * 17}deg)`,
                boxShadow: glow(i % 2 ? PURPLE : CYAN),
              }}
            >
              🔑
            </div>
          ))}
        </SceneShell>
      );

    // 19
    case 18:
      return (
        <SceneShell
          number={19}
          title="HTTPS tunnel"
          subtitle="Your traffic is now protected."
        >
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 390,
              width: 1000,
              height: 250,
              transform: "translate(-50%, -50%)",
              borderRadius: 125,
              border: `3px solid ${CYAN}`,
              boxShadow: glow(CYAN),
            }}
          />

          <Packet x1={180} y1={390} x2={1100} y2={390} color={CYAN} />
          <Packet
            x1={180}
            y1={420}
            x2={1100}
            y2={420}
            delay={30}
            color={PURPLE}
          />
          <Packet
            x1={180}
            y1={360}
            x2={1100}
            y2={360}
            delay={60}
            color={GREEN}
          />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 560,
              transform: "translateX(-50%)",
              color: CYAN,
              fontFamily: "monospace",
              fontSize: 18,
            }}
          >
            ENCRYPTED CHANNEL
          </div>
        </SceneShell>
      );

    // 20
    case 19:
      return (
        <SceneShell
          number={20}
          title="HTTP request"
          subtitle="Now the browser asks for the page."
        >
          <CodePanel title="GET / HTTP/2" lines={10} />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 590,
              transform: "translateX(-50%)",
              fontFamily: "monospace",
              color: GREEN,
              fontSize: 18,
            }}
          >
            GET / HTTP/2
          </div>
        </SceneShell>
      );

    // 21
    case 20:
      return (
        <SceneShell
          number={21}
          title="Request headers"
          subtitle="Extra information travels with the request."
        >
          <CodePanel title="HEADERS" lines={12} />

          <div
            style={{
              position: "absolute",
              left: 160,
              top: 300,
              fontFamily: "monospace",
              color: MUTED,
              fontSize: 16,
              lineHeight: 2,
            }}
          >
            Host<br />
            User-Agent<br />
            Accept<br />
            Cookie<br />
            Authorization
          </div>
        </SceneShell>
      );

    // 22
    case 21:
      return (
        <SceneShell
          number={22}
          title="Packets travel"
          subtitle="The request is broken into tiny pieces."
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <React.Fragment key={i}>
              <Line
                x1={130}
                y1={220 + i * 65}
                x2={1150}
                y2={220 + i * 65}
                opacity={0.18}
              />

              <Packet
                x1={130}
                y1={220 + i * 65}
                x2={1150}
                y2={220 + i * 65}
                delay={i * 18}
                color={i % 2 ? PURPLE : CYAN}
              />
            </React.Fragment>
          ))}
        </SceneShell>
      );

    // 23
    case 22:
      return (
        <SceneShell
          number={23}
          title="CDN check"
          subtitle="Can the edge network answer faster?"
        >
          <Node x={640} y={390} label="CDN" color={CYAN} size={140} />

          {[
            [230, 210],
            [1050, 210],
            [230, 570],
            [1050, 570],
          ].map(([x, y], i) => (
            <React.Fragment key={i}>
              <Line x1={640} y1={390} x2={x} y2={y} color={CYAN} />
              <Node x={x} y={y} label={`EDGE ${i + 1}`} color={CYAN} size={80} />
            </React.Fragment>
          ))}
        </SceneShell>
      );

    // 24
    case 23:
      return (
        <SceneShell
          number={24}
          title="Cache hit or miss?"
          subtitle="The CDN decides whether to fetch from origin."
        >
          <div
            style={{
              position: "absolute",
              left: 330,
              top: 400,
              transform: "translate(-50%, -50%)",
              width: 300,
              height: 190,
              borderRadius: 18,
              background: "#10161e",
              border: `2px solid ${GREEN}`,
              boxShadow: glow(GREEN),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Arial",
            }}
          >
            <div style={{ color: GREEN, fontSize: 28, fontWeight: 800 }}>
              CACHE HIT
            </div>
            <div style={{ color: MUTED, marginTop: 12 }}>
              Serve immediately
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 950,
              top: 400,
              transform: "translate(-50%, -50%)",
              width: 300,
              height: 190,
              borderRadius: 18,
              background: "#10161e",
              border: `2px solid ${ORANGE}`,
              boxShadow: glow(ORANGE),
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Arial",
            }}
          >
            <div style={{ color: ORANGE, fontSize: 28, fontWeight: 800 }}>
              CACHE MISS
            </div>
            <div style={{ color: MUTED, marginTop: 12 }}>
              Ask origin server
            </div>
          </div>
        </SceneShell>
      );

    // 25
    case 24:
      return (
        <SceneShell
          number={25}
          title="Load balancer"
          subtitle="Which server should handle the request?"
        >
          <Node x={230} y={390} label="USER" color={CYAN} />
          <Node x={640} y={390} label="LOAD BALANCER" color={PURPLE} size={150} />

          {[220, 390, 560].map((y, i) => (
            <React.Fragment key={i}>
              <Node x={1040} y={y} label={`SERVER ${i + 1}`} color={GREEN} size={90} />
              <Line x1={715} y1={390} x2={995} y2={y} color={PURPLE} />
            </React.Fragment>
          ))}

          <Line x1={275} y1={390} x2={565} y2={390} />
          <Packet x1={275} y1={390} x2={565} y2={390} />
        </SceneShell>
      );

    // 26
    case 25:
      return (
        <SceneShell
          number={26}
          title="Application server"
          subtitle="Now your actual application starts working."
        >
          <ServerRack x={640} y={420} scale={1.15} />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 610,
              transform: "translateX(-50%)",
              color: CYAN,
              fontFamily: "monospace",
              fontSize: 18,
            }}
          >
            RUNNING APPLICATION LOGIC
          </div>
        </SceneShell>
      );

    // 27
    case 26:
      return (
        <SceneShell
          number={27}
          title="Authentication"
          subtitle="Who are you?"
        >
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 410,
              transform: `translate(-50%, -50%) scale(${scaleIn(frame)})`,
              width: 430,
              height: 260,
              borderRadius: 18,
              background: "#10161e",
              border: `2px solid ${CYAN}77`,
              boxShadow: glow(CYAN),
              padding: 30,
              fontFamily: "monospace",
            }}
          >
            <div style={{ color: CYAN, fontSize: 20, marginBottom: 25 }}>
              AUTH SERVICE
            </div>

            <div style={{ color: MUTED }}>session_token</div>
            <div
              style={{
                marginTop: 8,
                color: WHITE,
                fontSize: 15,
                wordBreak: "break-all",
              }}
            >
              eyJhbGciOiJIUzI1Ni...
            </div>

            <div
              style={{
                marginTop: 30,
                color: GREEN,
                fontSize: 20,
              }}
            >
              ✓ VERIFIED
            </div>
          </div>
        </SceneShell>
      );

    // 28
    case 27:
      return (
        <SceneShell
          number={28}
          title="API layer"
          subtitle="Different services communicate with each other."
        >
          {[
            ["WEB", 180, 390, CYAN],
            ["API", 470, 390, PURPLE],
            ["USERS", 760, 250, GREEN],
            ["PAYMENTS", 760, 390, ORANGE],
            ["CONTENT", 760, 530, CYAN],
            ["DATABASE", 1080, 390, PURPLE],
          ].map(([label, x, y, color], i) => (
            <React.Fragment key={i}>
              <Node
                x={x as number}
                y={y as number}
                label={label as string}
                color={color as string}
                size={i < 2 ? 100 : 85}
              />
            </React.Fragment>
          ))}

          <Line x1={230} y1={390} x2={420} y2={390} />
          <Line x1={520} y1={390} x2={710} y2={250} />
          <Line x1={520} y1={390} x2={710} y2={390} />
          <Line x1={520} y1={390} x2={710} y2={530} />
          <Line x1={810} y1={250} x2={1030} y2={390} />
          <Line x1={810} y1={390} x2={1030} y2={390} />
          <Line x1={810} y1={530} x2={1030} y2={390} />
        </SceneShell>
      );

    // 29
    case 28:
      return (
        <SceneShell
          number={29}
          title="Database"
          subtitle="The application may need stored information."
        >
          <Database x={640} y={400} scale={1.25} />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 590,
              transform: "translateX(-50%)",
              fontFamily: "monospace",
              color: PURPLE,
              fontSize: 18,
            }}
          >
            DATABASE CLUSTER
          </div>
        </SceneShell>
      );

    // 30
    case 29:
      return (
        <SceneShell
          number={30}
          title="SQL query"
          subtitle="The server asks the database a precise question."
        >
          <CodePanel
            title="DATABASE QUERY"
            lines={11}
            x={640}
            y={390}
          />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 600,
              transform: "translateX(-50%)",
              color: PURPLE,
              fontFamily: "monospace",
              fontSize: 17,
            }}
          >
            SELECT * FROM users WHERE id = 42;
          </div>
        </SceneShell>
      );

    // 31
    case 30:
      return (
        <SceneShell
          number={31}
          title="Database response"
          subtitle="Rows come back to the application."
        >
          <Database x={260} y={390} scale={0.8} />
          <Node x={1000} y={390} label="APP SERVER" color={GREEN} size={130} />

          <Line x1={390} y1={390} x2={930} y2={390} color={PURPLE} />

          {[0, 1, 2, 3, 4].map((i) => (
            <Packet
              key={i}
              x1={390}
              y1={350 + i * 20}
              x2={930}
              y2={350 + i * 20}
              delay={i * 15}
              color={PURPLE}
            />
          ))}
        </SceneShell>
      );

    // 32
    case 31:
      return (
        <SceneShell
          number={32}
          title="Server processing"
          subtitle="Logic, data, permissions and templates come together."
        >
          <ServerRack x={640} y={400} scale={1.1} />

          <div
            style={{
              position: "absolute",
              left: 300,
              top: 620,
              color: GREEN,
              fontFamily: "monospace",
              fontSize: 17,
            }}
          >
            PROCESSING...
          </div>

          <div
            style={{
              position: "absolute",
              right: 270,
              top: 620,
              color: CYAN,
              fontFamily: "monospace",
              fontSize: 17,
            }}
          >
            BUILDING RESPONSE...
          </div>
        </SceneShell>
      );

    // 33
    case 32:
      return (
        <SceneShell
          number={33}
          title="HTML response"
          subtitle="The browser receives the structure of the page."
        >
          <CodePanel title="HTML" lines={14} />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 610,
              transform: "translateX(-50%)",
              fontFamily: "monospace",
              color: ORANGE,
              fontSize: 18,
            }}
          >
            &lt;html&gt; ... &lt;/html&gt;
          </div>
        </SceneShell>
      );

    // 34
    case 33:
      return (
        <SceneShell
          number={34}
          title="CSS response"
          subtitle="The browser gets the visual rules."
        >
          <CodePanel title="CSS" lines={12} />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 610,
              transform: "translateX(-50%)",
              fontFamily: "monospace",
              color: PURPLE,
              fontSize: 18,
            }}
          >
            styles.css
          </div>
        </SceneShell>
      );

    // 35
    case 34:
      return (
        <SceneShell
          number={35}
          title="JavaScript"
          subtitle="Now behavior and interactivity enter the picture."
        >
          <CodePanel title="JAVASCRIPT" lines={15} />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 610,
              transform: "translateX(-50%)",
              fontFamily: "monospace",
              color: ORANGE,
              fontSize: 18,
            }}
          >
            EXECUTING CLIENT-SIDE LOGIC
          </div>
        </SceneShell>
      );

    // 36
    case 35:
      return (
        <SceneShell
          number={36}
          title="DOM"
          subtitle="HTML becomes a tree of objects."
        >
          <Node x={640} y={220} label="DOCUMENT" color={CYAN} size={100} />

          {[430, 640, 850].map((x, i) => (
            <React.Fragment key={i}>
              <Line x1={640} y1={270} x2={x} y2={350} color={CYAN} />
              <Node
                x={x}
                y={350}
                label={`DIV ${i + 1}`}
                color={CYAN}
                size={75}
              />
            </React.Fragment>
          ))}

          {[360, 500, 640, 780, 920].map((x, i) => (
            <React.Fragment key={i}>
              <Line
                x1={430 + (i % 3) * 210}
                y1={395}
                x2={x}
                y2={510}
                color={CYAN}
                opacity={0.35}
              />
              <Node
                x={x}
                y={510}
                label="NODE"
                color={CYAN}
                size={55}
              />
            </React.Fragment>
          ))}
        </SceneShell>
      );

    // 37
    case 36:
      return (
        <SceneShell
          number={37}
          title="CSSOM"
          subtitle="The browser builds a model of the styles."
        >
          <div
            style={{
              position: "absolute",
              left: 640,
              top: 390,
              transform: "translate(-50%, -50%)",
              width: 800,
              height: 420,
              display: "flex",
              gap: 80,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 270,
                height: 330,
                border: `2px solid ${CYAN}66`,
                borderRadius: 16,
                background: "#10161e",
                padding: 25,
                fontFamily: "monospace",
              }}
            >
              <div style={{ color: CYAN, marginBottom: 25 }}>DOM</div>
              <div style={{ color: MUTED, lineHeight: 2 }}>
                document
                <br />
                ├─ header
                <br />
                ├─ main
                <br />
                └─ footer
              </div>
            </div>

            <div
              style={{
                width: 270,
                height: 330,
                border: `2px solid ${PURPLE}66`,
                borderRadius: 16,
                background: "#10161e",
                padding: 25,
                fontFamily: "monospace",
              }}
            >
              <div style={{ color: PURPLE, marginBottom: 25 }}>CSSOM</div>
              <div style={{ color: MUTED, lineHeight: 2 }}>
                color
                <br />
                display
                <br />
                position
                <br />
                margin
                <br />
                font
              </div>
            </div>
          </div>
        </SceneShell>
      );

    // 38
    case 37:
      return (
        <SceneShell
          number={38}
          title="Render tree"
          subtitle="Structure and styling merge."
        >
          <Node x={300} y={390} label="DOM" color={CYAN} size={130} />
          <Node x={980} y={390} label="CSSOM" color={PURPLE} size={130} />
          <Node x={640} y={390} label="RENDER TREE" color={GREEN} size={160} />

          <Line x1={365} y1={390} x2={560} y2={390} color={CYAN} />
          <Line x1={720} y1={390} x2={915} y2={390} color={PURPLE} />

          <Packet x1={365} y1={390} x2={560} y2={390} color={CYAN} />
          <Packet
            x1={915}
            y1={390}
            x2={720}
            y2={390}
            delay={40}
            color={PURPLE}
          />
        </SceneShell>
      );

    // 39
    case 38:
      return (
        <SceneShell
          number={39}
          title="Layout → paint → compositing"
          subtitle="Pixels are finally assembled on your screen."
        >
          <div
            style={{
              position: "absolute",
              left: 180,
              top: 390,
              width: 220,
              height: 180,
              borderRadius: 18,
              background: "#10161e",
              border: `2px solid ${CYAN}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: CYAN,
              fontFamily: "Arial",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            LAYOUT
          </div>

          <div
            style={{
              position: "absolute",
              left: 530,
              top: 390,
              width: 220,
              height: 180,
              borderRadius: 18,
              background: "#10161e",
              border: `2px solid ${PURPLE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: PURPLE,
              fontFamily: "Arial",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            PAINT
          </div>

          <div
            style={{
              position: "absolute",
              left: 880,
              top: 390,
              width: 220,
              height: 180,
              borderRadius: 18,
              background: "#10161e",
              border: `2px solid ${GREEN}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: GREEN,
              fontFamily: "Arial",
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            COMPOSITE
          </div>

          <Line x1={400} y1={390} x2={510} y2={390} />
          <Line x1={750} y1={390} x2={860} y2={390} />

          <Packet x1={400} y1={390} x2={510} y2={390} />
          <Packet
            x1={750}
            y1={390}
            x2={860}
            y2={390}
            delay={35}
            color={GREEN}
          />
        </SceneShell>
      );

    // 40
    default:
      return (
        <SceneShell
          number={40}
          title="And finally..."
          subtitle="You see a webpage. In milliseconds, an entire system came alive."
        >
          <Browser
            scale={1.15 + interpolate(frame, [0, 449], [0, 0.06], clamp)}
          />

          <div
            style={{
              position: "absolute",
              left: 640,
              top: 620,
              transform: `translateX(-50%) translateY(${interpolate(
                frame,
                [0, 50],
                [40, 0],
                clamp
              )}px)`,
              opacity: fadeIn(frame),
              fontFamily: "Arial",
              fontSize: 24,
              fontWeight: 800,
              color: CYAN,
              textShadow: glow(CYAN),
            }}
          >
            URL → DNS → TCP → TLS → HTTP → SERVER → DATABASE → BROWSER
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: 640,
              transform: "translateX(-50%)",
              color: MUTED,
              fontFamily: "monospace",
              fontSize: 13,
              letterSpacing: 3,
            }}
          >
            INSIDE SYSTEMS
          </div>
        </SceneShell>
      );
  }
};

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      durationInFrames={18000}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

export const MyComponent = () => {
  const frame = useCurrentFrame();

  const sceneIndex = Math.min(
    TOTAL_SCENES - 1,
    Math.floor(frame / SCENE_DURATION)
  );

  const localFrame = frame - sceneIndex * SCENE_DURATION;

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily: "Arial",
        overflow: "hidden",
      }}
    >
      <Scene index={sceneIndex} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: "#18222d",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((sceneIndex * SCENE_DURATION + localFrame) / 18000) * 100}%`,
            background: CYAN,
            boxShadow: glow(CYAN),
          }}
        />
      </div>

      <TransitionOverlay scene={sceneIndex} />
    </AbsoluteFill>
  );
};