import { useNavigate } from "react-router";
import { LucideArrowLeft, LucideCat } from "lucide-react";
import { Button } from "../components/ui/button";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50/50 flex flex-col items-center justify-center px-6 overflow-hidden relative font-sans">
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          {
            top: "8%",
            left: "5%",
            rotate: "-20deg",
            size: "26px",
            delay: "0s",
          },
          {
            top: "15%",
            left: "88%",
            rotate: "30deg",
            size: "20px",
            delay: "0.4s",
          },
          {
            top: "70%",
            left: "6%",
            rotate: "10deg",
            size: "18px",
            delay: "0.8s",
          },
          {
            top: "80%",
            left: "90%",
            rotate: "-35deg",
            size: "22px",
            delay: "0.2s",
          },
          {
            top: "40%",
            left: "92%",
            rotate: "15deg",
            size: "16px",
            delay: "1s",
          },
          {
            top: "55%",
            left: "2%",
            rotate: "-10deg",
            size: "18px",
            delay: "0.6s",
          },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute animate-bounce"
            style={{
              top: p.top,
              left: p.left,
              transform: `rotate(${p.rotate})`,
              fontSize: p.size,
              animationDelay: p.delay,
              animationDuration: "3s",
              opacity: 0.25,
            }}
          >
            🐾
          </span>
        ))}
      </div>

      <div className="relative z-10 bg-white border border-blue-100/60 rounded-3xl shadow-xl shadow-blue-100/50 p-10 flex flex-col items-center text-center max-w-2xl w-full">
        <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">
          Page Not Found
        </p>

        <div
          className="relative mb-4 "
          style={{ animation: "floaty 4s ease-in-out infinite" }}
        >
          <div className="absolute inset-0 bg-blue-200 rounded-full blur-2xl opacity-60 scale-75 translate-y-6" />
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-7xl font-black text-blue-500 leading-none select-none"
            style={{ letterSpacing: "-4px" }}
          >
            4
          </span>
          <span
            className="text-4xl select-none"
            style={{
              animation: "spin-slow 8s linear infinite",
              display: "inline-block",
            }}
          >
            🐱
          </span>
          <span
            className="text-7xl font-black text-blue-500 leading-none select-none"
            style={{ letterSpacing: "-4px" }}
          >
            4
          </span>
        </div>

        <h1 className="text-xl font-bold text-slate-800 mb-2 leading-snug">
          Oops! This page ran away!
        </h1>

        <p className="text-slate-500 text-sm leading-relaxed mb-1">
          Looks like this page is hiding somewhere, just like a cat that doesn't
          want to be found 🙈
        </p>
        <p className="text-slate-400 text-xs mb-8">
          But don't worry, there are still lots of furry friends waiting for
          your help! ~
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Button
            onClick={() => navigate("/")}
            className="flex items-center px-4 justify-center gap-2 h-10 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-200 transition-all"
          >
            <LucideArrowLeft /> Back to Home
          </Button>
          <Button
            onClick={() => navigate("/campaigns")}
            className="flex items-center px-4 justify-center gap-2 h-10 bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-600 text-xs font-bold rounded-xl border border-blue-100 transition-all"
          >
            <LucideCat /> See Campaigns
          </Button>
        </div>

        <p className="mt-8 text-[10px] font-bold tracking-widest text-slate-300 uppercase">
          Every paw counts 🐾
        </p>
      </div>

      <style>{`
        @keyframes floaty {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
