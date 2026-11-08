import React, { useEffect, useRef, useState } from 'react';
import { Team, Tactics, GameResult, PlayByPlayLog } from '../types/game';
import { Play, Pause, FastForward, SkipForward, Volume2, Shield, Target, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourtSimulationProps {
  homeTeam: Team;
  awayTeam: Team;
  tactics: Tactics;
  onFinish: (result: GameResult) => void;
  gameTitle?: string;
}

export const CourtSimulation: React.FC<CourtSimulationProps> = ({
  homeTeam,
  awayTeam,
  tactics,
  onFinish,
  gameTitle = '季後賽生死戰'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);
  const [currentQuarter, setCurrentQuarter] = useState<number>(1);
  const [gameClock, setGameClock] = useState<number>(720); // 12 分鐘 = 720 秒
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [commentaryLogs, setCommentaryLogs] = useState<PlayByPlayLog[]>([]);
  const [highlightText, setHighlightText] = useState<string>('裁判吹哨，比賽正式開始！');
  const [activeTacticBoost, setActiveTacticBoost] = useState<string>('戰術執行中');

  // 比賽動畫球場物件狀態
  const stateRef = useRef({
    ball: { x: 300, y: 200, z: 0, targetX: 300, targetY: 200, inAir: false },
    shotClock: 24,
    homePositions: [
      { x: 260, y: 190, num: 'PG', name: homeTeam.roster[0]?.nameZh || '控衛' },
      { x: 340, y: 130, num: 'SG', name: homeTeam.roster[1]?.nameZh || '得分' },
      { x: 350, y: 260, num: 'SF', name: homeTeam.roster[2]?.nameZh || '小前' },
      { x: 440, y: 150, num: 'PF', name: homeTeam.roster[3]?.nameZh || '大前' },
      { x: 470, y: 200, num: 'C', name: homeTeam.roster[4]?.nameZh || '中鋒' },
    ],
    awayPositions: [
      { x: 280, y: 190, num: 'PG', name: awayTeam.roster[0]?.nameZh || '客控' },
      { x: 360, y: 140, num: 'SG', name: awayTeam.roster[1]?.nameZh || '客分' },
      { x: 370, y: 250, num: 'SF', name: awayTeam.roster[2]?.nameZh || '客前' },
      { x: 430, y: 160, num: 'PF', name: awayTeam.roster[3]?.nameZh || '客大' },
      { x: 450, y: 200, num: 'C', name: awayTeam.roster[4]?.nameZh || '客中' },
    ],
    lastEventTick: 0
  });

  // 繪製像素風格籃球場
  const drawCourt = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 復古木紋地板底色
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 0, width, height);

    // 繪製木質條紋質感
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 球場邊線 (白色)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // 中線與中圈
    ctx.beginPath();
    ctx.moveTo(width / 2, 20);
    ctx.lineTo(width / 2, height - 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 45, 0, Math.PI * 2);
    ctx.stroke();

    // 左右籃框與禁區 (右側半場)
    const rightRimX = width - 55;
    const rightRimY = height / 2;

    // 右側禁區油漆區
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(width - 150, (height / 2) - 45, 130, 90);
    ctx.strokeRect(width - 150, (height / 2) - 45, 130, 90);

    // 罰球圈
    ctx.beginPath();
    ctx.arc(width - 150, height / 2, 45, 0, Math.PI * 2);
    ctx.stroke();

    // 三分線 (右側)
    ctx.beginPath();
    ctx.arc(rightRimX, rightRimY, 150, Math.PI * 0.55, Math.PI * 1.45, false);
    ctx.stroke();

    // 右籃板與籃框 (Pixel style)
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width - 40, rightRimY - 22);
    ctx.lineTo(width - 40, rightRimY + 22);
    ctx.stroke();

    // 籃框圈 (亮橘色)
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(rightRimX, rightRimY, 10, 0, Math.PI * 2);
    ctx.stroke();

    // 左側半場簡略線條
    const leftRimX = 55;
    const leftRimY = height / 2;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(20, (height / 2) - 45, 130, 90);
    ctx.strokeRect(20, (height / 2) - 45, 130, 90);

    ctx.beginPath();
    ctx.arc(leftRimX, leftRimY, 150, -Math.PI * 0.45, Math.PI * 0.45, false);
    ctx.stroke();

    // 繪製主隊隊員 (圓圈 + 號碼)
    stateRef.current.homePositions.forEach((pos) => {
      ctx.fillStyle = homeTeam.colors.primary || '#2563eb';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pos.num, pos.x, pos.y);
    });

    // 繪製客隊隊員
    stateRef.current.awayPositions.forEach((pos) => {
      ctx.fillStyle = awayTeam.colors.primary || '#dc2626';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pos.num, pos.x, pos.y);
    });

    // 繪製籃球 (帶著陰影與高光)
    const ball = stateRef.current.ball;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(ball.x, ball.y + 4, 6, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y - ball.z, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7c2d12';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // 動畫主迴圈
  useEffect(() => {
    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          drawCourt(ctx, canvas.width, canvas.height);
        }
      }
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [homeTeam, awayTeam]);

  // 比賽計時與事件推進計時器
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setGameClock((prev) => {
        const newClock = prev - (4 * speed);

        // 每隔幾秒觸發一次進攻戰況
        const tick = Math.floor((720 - newClock) / 20);
        if (tick !== stateRef.current.lastEventTick && newClock > 0) {
          stateRef.current.lastEventTick = tick;
          triggerRandomPossession();
        }

        if (newClock <= 0) {
          if (currentQuarter < 4) {
            setCurrentQuarter((q) => q + 1);
            setHighlightText(`第 ${currentQuarter} 節結束，雙方交換場地！`);
            return 720; // 新的一節
          } else {
            // 比賽結束
            handleGameOver();
            return 0;
          }
        }
        return newClock;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, speed, currentQuarter, homeScore, awayScore]);

  // 觸發進攻回合與動畫位移
  const triggerRandomPossession = () => {
    const isHomeAttacking = Math.random() > 0.47;
    const offenseTeam = isHomeAttacking ? homeTeam : awayTeam;
    const defenseTeam = isHomeAttacking ? awayTeam : homeTeam;

    const shooter = offenseTeam.roster[Math.floor(Math.random() * Math.min(5, offenseTeam.roster.length))] || { nameZh: '球員' };
    const roll = Math.random();

    // 移動球與球員位置
    const targetRimX = isHomeAttacking ? 545 : 55;
    const targetRimY = 200;

    stateRef.current.ball.targetX = targetRimX + (Math.random() * 60 - 30);
    stateRef.current.ball.targetY = targetRimY + (Math.random() * 60 - 30);
    stateRef.current.ball.x = stateRef.current.ball.targetX;
    stateRef.current.ball.y = stateRef.current.ball.targetY;

    let pts = 0;
    let logMsg = '';
    let isHighlight = false;

    if (roll < 0.32) {
      // 三分命中
      pts = 3;
      logMsg = `🎯 [${offenseTeam.abbr}] ${shooter.nameZh} 側翼接球，拔蔥三分命中！`;
      isHighlight = true;
    } else if (roll < 0.65) {
      // 兩分命中 (切入暴扣或中距離)
      pts = 2;
      const isDunk = Math.random() > 0.6;
      logMsg = isDunk
        ? `🔥 [${offenseTeam.abbr}] ${shooter.nameZh} 禁區霸氣單手暴扣！掀翻全場！`
        : `⚡ [${offenseTeam.abbr}] ${shooter.nameZh} 借擋拆突破急停拋投得分！`;
      isHighlight = isDunk;
    } else if (roll < 0.85) {
      // 投籃不進
      pts = 0;
      logMsg = `🛡️ [${defenseTeam.abbr}] 嚴密包夾！${shooter.nameZh} 難度後仰出手彈框而出！`;
    } else {
      // 抄截或失誤
      pts = 0;
      logMsg = `⚠️ [${defenseTeam.abbr}] 防守斷球成功！迫使 [${offenseTeam.abbr}] 發生失誤！`;
      isHighlight = true;
    }

    if (pts > 0) {
      if (isHomeAttacking) {
        setHomeScore((s) => s + pts);
      } else {
        setAwayScore((s) => s + pts);
      }
    }

    setHighlightText(logMsg);

    const newLog: PlayByPlayLog = {
      quarter: currentQuarter,
      timeRemaining: formatTime(gameClock),
      teamId: offenseTeam.id,
      action: logMsg,
      scoreHome: isHomeAttacking ? homeScore + pts : homeScore,
      scoreAway: isHomeAttacking ? awayScore : awayScore + pts,
      isScore: pts > 0,
      isHighlight
    };

    setCommentaryLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    let finalHome = homeScore;
    let finalAway = awayScore;
    if (finalHome === finalAway) {
      finalHome += 2; // 延長加時分出勝負
      setHomeScore(finalHome);
    }

    const winner = finalHome > finalAway ? homeTeam : awayTeam;
    setHighlightText(`🏆 比賽結束！${winner.cityZh}${winner.nameZh} 奪得勝利！`);

    if (winner.isUser) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    setTimeout(() => {
      onFinish({
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        homeScore: finalHome,
        awayScore: finalAway,
        logs: commentaryLogs,
        topScorer: {
          nameZh: homeTeam.roster[0]?.nameZh || '核心球員',
          teamId: homeTeam.id,
          points: Math.floor(25 + Math.random() * 15)
        }
      });
    }, 2000);
  };

  const handleFastSkip = () => {
    setIsPlaying(false);
    // 快速生成合理比分
    const addHome = Math.max(85, homeScore + Math.floor(Math.random() * 35 + 20));
    const addAway = Math.max(83, awayScore + Math.floor(Math.random() * 35 + 18));
    setHomeScore(addHome);
    setAwayScore(addAway);
    setCurrentQuarter(4);
    setGameClock(0);
    handleGameOver();
  };

  const handleTacticChange = (tacticName: string) => {
    setActiveTacticBoost(`教練指令：已切換至【${tacticName}】！`);
    setTimeout(() => {
      setActiveTacticBoost('戰術執行中');
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto p-4 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      {/* 頂部賽事資訊與記分板 */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400">{homeTeam.cityZh}</span>
            <div className="text-xl font-black" style={{ color: homeTeam.colors.primary }}>
              {homeTeam.nameZh} ({homeTeam.abbr})
            </div>
          </div>
          <div className="text-3xl font-mono font-bold text-amber-400 bg-slate-900 px-4 py-1 rounded-lg border border-slate-700">
            {homeScore}
          </div>
        </div>

        {/* 賽節與計時器 */}
        <div className="flex flex-col items-center my-2 md:my-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">{gameTitle}</span>
          <div className="text-2xl font-mono font-extrabold text-white">
            Q{currentQuarter} · {formatTime(gameClock)}
          </div>
          <span className="text-xs text-emerald-400 font-medium">{activeTacticBoost}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-3xl font-mono font-bold text-amber-400 bg-slate-900 px-4 py-1 rounded-lg border border-slate-700">
            {awayScore}
          </div>
          <div className="text-left">
            <span className="text-xs text-slate-400">{awayTeam.cityZh}</span>
            <div className="text-xl font-black" style={{ color: awayTeam.colors.primary }}>
              {awayTeam.nameZh} ({awayTeam.abbr})
            </div>
          </div>
        </div>
      </div>

      {/* 像素籃球場 Canvas 模擬區 */}
      <div className="relative w-full aspect-[16/9] max-h-[420px] bg-slate-950 rounded-xl overflow-hidden border border-slate-700 shadow-inner flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={600}
          height={380}
          className="w-full h-full object-contain pixelated"
        />

        {/* 懸浮比分即時焦點條 */}
        <div className="absolute bottom-3 left-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-amber-500/30 text-center">
          <span className="text-sm font-semibold text-amber-300 animate-pulse">{highlightText}</span>
        </div>
      </div>

      {/* 控制工具列與戰術微調 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 播映速度與暫停控制 */}
        <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? '暫停' : '繼續'}
          </button>

          <button
            onClick={() => setSpeed(speed === 1 ? 2 : speed === 2 ? 5 : 1)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-sm transition"
          >
            <FastForward size={16} />
            速度 {speed}x
          </button>

          <button
            onClick={handleFastSkip}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-medium rounded-lg text-sm ml-auto transition"
          >
            <SkipForward size={16} />
            直接終場
          </button>
        </div>

        {/* 現場教練臨時戰術微調指令 */}
        <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 overflow-x-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">教練指令:</span>
          <button
            onClick={() => handleTacticChange('外線三分狂潮')}
            className="px-2.5 py-1.5 bg-blue-900/40 hover:bg-blue-800/60 text-blue-300 border border-blue-700/50 rounded text-xs whitespace-nowrap flex items-center gap-1"
          >
            <Target size={12} /> 魔球三分
          </button>
          <button
            onClick={() => handleTacticChange('禁區肉搏衝擊')}
            className="px-2.5 py-1.5 bg-orange-900/40 hover:bg-orange-800/60 text-orange-300 border border-orange-700/50 rounded text-xs whitespace-nowrap flex items-center gap-1"
          >
            <Flame size={12} /> 衝擊禁區
          </button>
          <button
            onClick={() => handleTacticChange('全場窒息壓迫')}
            className="px-2.5 py-1.5 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 rounded text-xs whitespace-nowrap flex items-center gap-1"
          >
            <Shield size={12} /> 緊迫防守
          </button>
        </div>
      </div>

      {/* 即時文字轉播紀錄牆 */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">賽事实況轉播紀錄</h4>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-2 text-xs">
          {commentaryLogs.map((log, i) => (
            <div
              key={i}
              className={`p-1.5 rounded flex items-center justify-between ${
                log.isHighlight ? 'bg-amber-950/30 text-amber-200 border-l-2 border-amber-500' : 'text-slate-300'
              }`}
            >
              <span>{log.action}</span>
              <span className="font-mono text-slate-500 text-[10px] ml-2 shrink-0">
                {log.scoreHome} - {log.scoreAway}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
