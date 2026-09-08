import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Composition } from "remotion";

type Props = {};

const colors = {
  bg: "#0b0d10",
  panel: "#14181e",
  panel2: "#1b2028",
  text: "#f5f7fa",
  muted: "#8d96a5",
  accent: "#00d4ff",
  green: "#39d98a",
  purple: "#9b7cff",
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

const MetricCard: React.FC<{
  title: string;
  value: string;
  change: string;
  delay: number;
}> = ({ title, value, change, delay }) => {
  const frame = useCurrentFrame();

  const progress = spring({
    frame: Math.max(0, frame - delay),
    fps: 30,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);

  return (
    <div
      style={{
        flex: 1,
        background: colors.panel,
        border: "1px solid #252b34",
        borderRadius: 14,
        padding: 20,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          color: colors.muted,
          fontSize: 15,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: colors.text,
          fontSize: 32,
          fontWeight: 700,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: colors.green,
          fontSize: 14,
          marginTop: 8,
        }}
      >
        ↑ {change}
      </div>
    </div>
  );
};

const BarChart: React.FC = () => {
  const frame = useCurrentFrame();

  const bars = [45, 70, 55, 90, 65, 82, 58, 96, 72, 88];

  return (
    <div
      style={{
        height: 230,
        display: "flex",
        alignItems: "flex-end",
        gap: 14,
        padding: "20px 10px",
      }}
    >
      {bars.map((height, index) => {
        const delay = 20 + index * 4;

        const progress = spring({
          frame: Math.max(0, frame - delay),
          fps: 30,
          config: {
            damping: 18,
            stiffness: 80,
          },
        });

        return (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${height * progress}%`,
              borderRadius: "6px 6px 2px 2px",
              background: colors.accent,
              opacity: 0.85,
            }}
          />
        );
      })}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();

  const dashboardOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const dashboardY = interpolate(frame, [0, 25], [50, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: 1080,
        height: 570,
        background: colors.panel,
        borderRadius: 18,
        border: "1px solid #292f38",
        display: "flex",
        overflow: "hidden",
        opacity: dashboardOpacity,
        transform: `translateY(${dashboardY}px)`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 190,
          background: "#101318",
          padding: 25,
          borderRight: "1px solid #252a32",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: colors.accent,
            marginBottom: 45,
          }}
        >
          NEXORA
        </div>

        {[
          "Overview",
          "Analytics",
          "Customers",
          "Revenue",
          "Reports",
        ].map((item, index) => (
          <div
            key={item}
            style={{
              padding: "13px 12px",
              marginBottom: 8,
              borderRadius: 8,
              color: index === 0 ? colors.text : colors.muted,
              background: index === 0 ? "#1c2730" : "transparent",
              fontSize: 14,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main dashboard */}
      <div
        style={{
          flex: 1,
          padding: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 25,
          }}
        >
          <div>
            <div
              style={{
                color: colors.text,
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              Analytics Overview
            </div>

            <div
              style={{
                color: colors.muted,
                fontSize: 14,
                marginTop: 6,
              }}
            >
              Real-time business performance
            </div>
          </div>

          <div
            style={{
              padding: "10px 18px",
              background: "#1b222a",
              borderRadius: 8,
              color: colors.muted,
              fontSize: 13,
            }}
          >
            Last 30 days
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <MetricCard
            title="Revenue"
            value="$284,920"
            change="18.4%"
            delay={10}
          />

          <MetricCard
            title="Customers"
            value="18,429"
            change="12.7%"
            delay={16}
          />

          <MetricCard
            title="Conversion"
            value="8.42%"
            change="4.8%"
            delay={22}
          />
        </div>

        <div
          style={{
            background: "#11151a",
            border: "1px solid #252b34",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div
            style={{
              color: colors.text,
              fontSize: 17,
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Revenue Performance
          </div>

          <BarChart />
        </div>
      </div>
    </div>
  );
};

export const MyComponent: React.FC<Props> = () => {
  const frame = useCurrentFrame();

  // The dashboard restarts every 300 frames.
  // This creates repeated animated scenes across the 10-minute benchmark.
  const sceneFrame = frame % 300;

  const titleOpacity = interpolate(sceneFrame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const titleY = interpolate(sceneFrame, [0, 25], [60, 0], {
    extrapolateRight: "clamp",
  });

  const sceneScale = interpolate(sceneFrame, [0, 30], [0.96, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        color: colors.text,
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: colors.accent,
          opacity: 0.035,
          filter: "blur(100px)",
          left: -150,
          top: -150,
          transform: `translateX(${Math.sin(frame / 80) * 100}px)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: colors.purple,
          opacity: 0.035,
          filter: "blur(100px)",
          right: -150,
          bottom: -150,
          transform: `translateY(${Math.cos(frame / 100) * 100}px)`,
        }}
      />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 35,
          left: 70,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 18,
            color: colors.accent,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          INSIDE SYSTEMS
        </div>

        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            marginTop: 6,
          }}
        >
          How modern SaaS systems work
        </div>
      </div>

      {/* Dashboard */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 115,
          transform: `translateX(-50%) scale(${sceneScale})`,
        }}
      >
        <Dashboard />
      </div>

      {/* Frame indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 18,
          right: 30,
          color: "#59616d",
          fontSize: 12,
        }}
      >
        SYSTEM LIVE • FRAME {frame}
      </div>
    </AbsoluteFill>
  );
};