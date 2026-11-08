import React, { useState } from 'react';
import { Team, Tactics, GameResult, PlayoffMatchup } from '../types/game';
import { CourtSimulation } from './CourtSimulation';
import { simulateSingleGame } from '../utils/engine';
import { Trophy, Flame, Play, FastForward, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlayoffBracketProps {
  teams: Team[];
  userTeam: Team;
  tactics: Tactics;
  seasonYear: number;
  onFinishPlayoffs: (wonChampionship: boolean, championTeam: Team) => void;
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({
  teams,
  userTeam,
  tactics,
  seasonYear,
  onFinishPlayoffs
}) => {
  // 建立對戰配對 (Best of 7)
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [activeSimulationGame, setActiveSimulationGame] = useState<{
    homeTeam: Team;
    awayTeam: Team;
    title: string;
  } | null>(null);

  // 初始化季後賽對手
  const [userMatchup, setUserMatchup] = useState<{
    round: number;
    opponent: Team;
    userWins: number;
    oppWins: number;
    roundName: string;
    isFinished: boolean;
  }>(() => {
    // 找出對手 (同分區其他前段球隊)
    const confTeams = teams.filter((t) => t.conference === userTeam.conference && t.id !== userTeam.id);
    const sorted = [...confTeams].sort((a, b) => b.wins - a.wins);
    const opp = sorted[0] || confTeams[0];
    return {
      round: 1,
      opponent: opp,
      userWins: 0,
      oppWins: 0,
      roundName: '分區八強首輪 (Best-of-7)',
      isFinished: false
    };
  });

  const [championAnnouncement, setChampionAnnouncement] = useState<string | null>(null);

  // 模擬單場比賽結果
  const handleGameEnd = (result: GameResult) => {
    setActiveSimulationGame(null);
    const userWon =
      (result.homeTeamId === userTeam.id && result.homeScore > result.awayScore) ||
      (result.awayTeamId === userTeam.id && result.awayScore > result.homeScore);

    const newUserWins = userWon ? userMatchup.userWins + 1 : userMatchup.userWins;
    const newOppWins = !userWon ? userMatchup.oppWins + 1 : userMatchup.oppWins;

    checkSeriesOutcome(newUserWins, newOppWins);
  };

  const handleQuickSimGame = () => {
    const isHome = (userMatchup.userWins + userMatchup.oppWins) % 2 === 0;
    const homeTeam = isHome ? userTeam : userMatchup.opponent;
    const awayTeam = isHome ? userMatchup.opponent : userTeam;

    const res = simulateSingleGame(
      homeTeam,
      awayTeam,
      isHome ? tactics : undefined,
      !isHome ? tactics : undefined
    );

    const userWon =
      (res.homeTeamId === userTeam.id && res.homeScore > res.awayScore) ||
      (res.awayTeamId === userTeam.id && res.awayScore > res.homeScore);

    const newUserWins = userWon ? userMatchup.userWins + 1 : userMatchup.userWins;
    const newOppWins = !userWon ? userMatchup.oppWins + 1 : userMatchup.oppWins;

    checkSeriesOutcome(newUserWins, newOppWins);
  };

  const handleQuickSimSeries = () => {
    let uWins = userMatchup.userWins;
    let oWins = userMatchup.oppWins;

    while (uWins < 4 && oWins < 4) {
      const isHome = (uWins + oWins) % 2 === 0;
      const homeTeam = isHome ? userTeam : userMatchup.opponent;
      const awayTeam = isHome ? userMatchup.opponent : userTeam;
      const res = simulateSingleGame(homeTeam, awayTeam, isHome ? tactics : undefined, !isHome ? tactics : undefined);
      const userWon =
        (res.homeTeamId === userTeam.id && res.homeScore > res.awayScore) ||
        (res.awayTeamId === userTeam.id && res.awayScore > res.homeScore);
      if (userWon) uWins++;
      else oWins++;
    }

    checkSeriesOutcome(uWins, oWins);
  };

  const checkSeriesOutcome = (newUserWins: number, newOppWins: number) => {
    if (newUserWins >= 4) {
      // 使用者贏下此輪
      if (userMatchup.round === 1) {
        // 前往分區冠軍賽
        const nextOppCandidates = teams.filter(
          (t) => t.conference === userTeam.conference && t.id !== userTeam.id && t.id !== userMatchup.opponent.id
        );
        const nextOpp = nextOppCandidates[Math.floor(Math.random() * nextOppCandidates.length)] || teams[0];
        setUserMatchup({
          round: 2,
          opponent: nextOpp,
          userWins: 0,
          oppWins: 0,
          roundName: '分區冠軍決賽 (Conference Finals)',
          isFinished: false
        });
      } else if (userMatchup.round === 2) {
        // 前往總冠軍賽 (對打另一分區最強者)
        const otherConf = userTeam.conference === 'EAST' ? 'WEST' : 'EAST';
        const finalsOpp = teams.filter((t) => t.conference === otherConf).sort((a, b) => b.wins - a.wins)[0] || teams[1];
        setUserMatchup({
          round: 3,
          opponent: finalsOpp,
          userWins: 0,
          oppWins: 0,
          roundName: '🏆 NBA 總冠軍決賽 (NBA Finals)',
          isFinished: false
        });
      } else {
        // 奪得總冠軍！
        setUserMatchup((prev) => ({ ...prev, userWins: newUserWins, isFinished: true }));
        setChampionAnnouncement(`🏆 恭喜！${userTeam.cityZh}${userTeam.nameZh} 榮獲 第 ${seasonYear} 季 NBA 總冠軍！`);
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
      }
    } else if (newOppWins >= 4) {
      // 被淘汰
      setUserMatchup((prev) => ({ ...prev, oppWins: newOppWins, isFinished: true }));
      setChampionAnnouncement(`❌ 季後賽止步於 ${userMatchup.roundName}。期待下個賽季東山再起！`);
    } else {
      setUserMatchup((prev) => ({ ...prev, userWins: newUserWins, oppWins: newOppWins }));
    }
  };

  const startVisualSim = () => {
    const isHome = (userMatchup.userWins + userMatchup.oppWins) % 2 === 0;
    setActiveSimulationGame({
      homeTeam: isHome ? userTeam : userMatchup.opponent,
      awayTeam: isHome ? userMatchup.opponent : userTeam,
      title: `${userMatchup.roundName} · Game ${userMatchup.userWins + userMatchup.oppWins + 1}`
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 像素球場動態對決視窗 */}
      {activeSimulationGame && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <CourtSimulation
              homeTeam={activeSimulationGame.homeTeam}
              awayTeam={activeSimulationGame.awayTeam}
              tactics={tactics}
              onFinish={handleGameEnd}
              gameTitle={activeSimulationGame.title}
            />
          </div>
        </div>
      )}

      {/* 頂部季後賽大廳標題 */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase mb-2">
          <Trophy size={14} /> NBA Playoffs 季後賽舞台
        </div>
        <h2 className="text-3xl font-black text-white">{userMatchup.roundName}</h2>
        <p className="text-xs text-slate-400 mt-1">採七戰四勝制 (Best-of-7)，率先獲得 4 勝者晉級！</p>
      </div>

      {/* 系列賽即時對戰卡片 */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
          {/* 使用者球隊 */}
          <div className="text-center md:text-right">
            <span className="text-xs text-slate-400">{userTeam.cityZh}</span>
            <h3 className="text-2xl font-black" style={{ color: userTeam.colors.primary }}>
              {userTeam.nameZh}
            </h3>
            <span className="text-xs text-slate-500 font-mono">例行賽 {userTeam.wins}勝-{userTeam.losses}負</span>
          </div>

          {/* 當前系列賽大比分 (e.g. 2 - 1) */}
          <div className="flex flex-col items-center justify-center bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs uppercase tracking-widest text-slate-500 mb-1">系列賽總比分</span>
            <div className="text-4xl font-black font-mono text-amber-400 flex items-center gap-4">
              <span>{userMatchup.userWins}</span>
              <span className="text-slate-600">:</span>
              <span>{userMatchup.oppWins}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 font-mono">
              第 {userMatchup.userWins + userMatchup.oppWins + 1} 戰即將開打
            </span>
          </div>

          {/* 對手球隊 */}
          <div className="text-center md:text-left">
            <span className="text-xs text-slate-400">{userMatchup.opponent.cityZh}</span>
            <h3 className="text-2xl font-black" style={{ color: userMatchup.opponent.colors.primary }}>
              {userMatchup.opponent.nameZh}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              例行賽 {userMatchup.opponent.wins}勝-{userMatchup.opponent.losses}負
            </span>
          </div>
        </div>

        {/* 獲勝者或出局結算廣播 */}
        {championAnnouncement && (
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-center">
            <h3 className="text-lg font-black text-amber-300">{championAnnouncement}</h3>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {!userMatchup.isFinished ? (
            <>
              <button
                onClick={startVisualSim}
                className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-xl transition flex items-center justify-center gap-2"
              >
                <Play size={18} /> 進入像素球場即時指揮 (Game {userMatchup.userWins + userMatchup.oppWins + 1})
              </button>

              <button
                onClick={handleQuickSimGame}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                快速模擬本場
              </button>

              <button
                onClick={handleQuickSimSeries}
                className="w-full sm:w-auto px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <FastForward size={16} /> 模擬至系列賽分出勝負
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                onFinishPlayoffs(
                  userMatchup.userWins >= 4 && userMatchup.round === 3,
                  userMatchup.userWins >= 4 ? userTeam : userMatchup.opponent
                )
              }
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-xl transition"
            >
              進入賽季總結算與休賽季大會 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
