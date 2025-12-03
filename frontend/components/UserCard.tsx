"use client";
import { useState, useEffect, CSSProperties } from "react";
import {
  User,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Leaf,
  Zap,
  Droplet,
} from "lucide-react";

interface UserCardProps {
  name: string;
  animal: string;
  type: string;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export default function UserCard({ name, animal, type }: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // 1. สร้างเม็ดฝนเตรียมไว้เลย "ตั้งแต่โหลดเสร็จ" (Pre-calculate)
  // ไม่ต้องรอ Hover แล้วค่อยสร้าง จะได้ไม่หน่วง
  useEffect(() => {
    const timer = setTimeout(() => {
      const generatedParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        // ปรับ Delay ให้น้อยลง (0-100ms) เพื่อให้มาไวๆ
        delay: Math.random() * 100,
        duration: Math.random() * 1000 + 800,
        size: Math.random() * 10 + 10,
        rotation: Math.random() * 360,
      }));

      setParticles(generatedParticles);
    }, 0); // 0ms คือรอให้ React ทำงานหลักเสร็จก่อน แล้วค่อยทำอันนี้ทันที

    return () => clearTimeout(timer); // ล้าง timer ถ้า component ถูกทำลาย
  }, []); // ทำครั้งเดียวตอนหน้าเว็บโหลด

  const handleMouseEnter = () => setIsHovered(true); // แค่เปลี่ยนสถานะ (เร็วปรี๊ด)
  const handleMouseLeave = () => setIsHovered(false);

  const getElementConfig = (t: string) => {
    switch (t) {
      case "D":
        return {
          color: "#ef4444",
          mainIcon: <Flame className={isHovered ? "animate-bounce" : ""} />,
          particleIcon: <Flame fill="currentColor" />,
          animationName: "rise-up",
        };
      case "I":
        return {
          color: "#eab308",
          mainIcon: <Wind className={isHovered ? "animate-pulse" : ""} />,
          particleIcon: <Wind style={{}} />, // กลับด้านลม
          animationName: "slide-right",
        };
      case "S":
        return {
          color: "#22c55e",
          mainIcon: <Mountain className={isHovered ? "animate-bounce" : ""} />,
          particleIcon: <Leaf fill="currentColor" />,
          animationName: "fall-diagonal",
        };
      case "C":
        return {
          color: "#3b82f6",
          mainIcon: <Droplet className={isHovered ? "animate-pulse" : ""} />,
          particleIcon: <Droplet fill="currentColor" />,
          animationName: "fall-down",
        };
      default:
        return {
          color: "#94a3b8",
          mainIcon: <User />,
          particleIcon: null,
          animationName: "",
        };
    }
  };

  const config = getElementConfig(type);

  const getElementColor = (t: string) => {
    switch (t) {
      case "D":
        return "#ef4444";
      case "I":
        return "#eab308";
      case "S":
        return "#22c55e";
      case "C":
        return "#3b82f6";
      default:
        return "#94a3b8";
    }
  };

  const getIcon = (t: string) => {
    switch (t) {
      case "D":
        return <Flame className={isHovered ? "animate-bounce" : ""} />;
      case "I":
        return <Wind className={isHovered ? "animate-pulse" : ""} />;
      case "S":
        return <Mountain className={isHovered ? "animate-bounce" : ""} />;
      case "C":
        return <Droplets className={isHovered ? "animate-pulse" : ""} />;
      default:
        return <User />;
    }
  };

  const themeColor = getElementColor(type);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease-out",
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "20px",
        border: isHovered ? `2px solid ${themeColor}` : "2px solid #e2e8f0",
        transform: isHovered
          ? "translateY(-5px) scale(1.02)"
          : "translateY(0) scale(1)",
        boxShadow: isHovered
          ? `0 10px 25px -5px ${themeColor}40`
          : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        borderLeft: isHovered
          ? `2px solid ${themeColor}`
          : `6px solid ${themeColor}`,
      }}
      className="relative overflow-hidden"
    >
      <style jsx>{`
        @keyframes rise-up {
          0% {
            transform: translateY(100px) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-150px) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes slide-right {
          0% {
            transform: translateX(-50px) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(300px) rotate(10deg);
            opacity: 0;
          }
        }
        @keyframes fall-down {
          0% {
            transform: translateY(-50px);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(200px);
            opacity: 0;
          }
        }
        @keyframes fall-diagonal {
          0% {
            transform: translate(20px, -50px) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translate(-100px, 200px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* Render Particles ตลอดเวลา แต่ซ่อนด้วย Opacity หรือ isHovered */}
      {/* ใช้ isHovered && ... เหมือนเดิมได้ แต่เพราะเราคำนวณไว้แล้ว มันจะเร็วกว่ามาก */}
      {isHovered &&
        particles.map((p) => {
          let startStyle: CSSProperties = {
            opacity: 0,
            pointerEvents: "none",
            position: "absolute",
            zIndex: 0,
          };

          if (type === "D") {
            startStyle = { ...startStyle, bottom: "-20px", left: `${p.left}%` };
          } else if (type === "I") {
            startStyle = { ...startStyle, left: "-20px", top: `${p.top}%` };
          } else {
            startStyle = { ...startStyle, top: "-30px", left: `${p.left}%` };
          }

          return (
            <div
              key={p.id}
              style={{
                ...startStyle,
                color: config.color,
                animation: `${config.animationName} ${p.duration}ms linear infinite`,
                animationDelay: `${p.delay}ms`,
              }}
            >
              <div style={{ width: p.size, height: p.size, opacity: 0.6 }}>
                {config.particleIcon}
              </div>
            </div>
          );
        })}

      <div className="flex items-center justify-between relative z-10">
        <div>
          <h3
            style={{
              color: isHovered ? themeColor : "#1e293b",
              transition: "color 0.2s",
            }}
            className="font-bold text-lg"
          >
            {name}
          </h3>

          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            {animal}
            <span
              style={{
                opacity: isHovered ? 1 : 0,
                transform: isHovered ? "translateX(0)" : "translateX(-10px)",
                transition: "all 0.3s ease",
                color: themeColor,
              }}
              className="text-xs font-semibold flex items-center gap-1"
            >
              • <Zap size={12} /> คลิกเพื่อส่อง
            </span>
          </p>
        </div>

        <div
          style={{
            backgroundColor: isHovered ? `${themeColor}40` : `${themeColor}20`,
            color: themeColor,
            transition: "all 0.3s",
            padding: "12px",
            borderRadius: "50%",
            boxShadow: isHovered ? `0 0 15px ${themeColor}40` : "none",
          }}
        >
          {getIcon(type)}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: "150px",
          height: "150px",
          background: `radial-gradient(circle, ${themeColor}30 0%, transparent 70%)`,
          opacity: isHovered ? 0.6 : 0.3,
          transition: "all 0.5s",
          pointerEvents: "none",
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />
    </div>
  );
}
