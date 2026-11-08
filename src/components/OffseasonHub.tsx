import React, { useState } from 'react';
import { Team, Player } from '../types/game';
import { generateDraftClass } from '../data/nbaData';
import { processPlayerProgression, calculateTotalSalary } from '../utils/engine';
import { TrendingUp, TrendingDown, UserPlus, Sparkles, ArrowRight, Award, DollarSign } from 'lucide-react';

interface OffseasonHubProps {
  userTeam: Team;
  seasonYear: number;
  onProceedToNextSeason: (updatedTeam: Team) => void;
}

export const OffseasonHub: React.FC<OffseasonHubProps> = ({
  userTeam,
  seasonYear,
  onProceedToNextSeason
}) => {
  const [activeTab, setActiveTab] = useState<'PROGRESSION' | 'DRAFT' | 'FREE_AGENCY'>('PROGRESSION');

  // 計算並儲存球員進步/退化報告
  const [progressionReport] = useState(() => {
    return userTeam.roster.map((p) => {
      const res = processPlayerProgression(p);
      return {
        original: p,
        updated: res.player,
        change: res.change
      };
    });
  });

  // 當年度選秀新秀庫
  const [draftPool, setDraftPool] = useState<Player[]>(() => generateDraftClass(seasonYear + 1));
  const [draftedRookie, setDraftedRookie] = useState<Player | null>(null);

  // 自由球員市場名單
  const [freeAgents, setFreeAgents] = useState<Player[]>([
    {
      id: `fa_${seasonYear}_1`,
      name: 'Kelly Oubre Jr.',
      nameZh: '烏布雷',
      pos: 'SF',
      age: 28,
      ovr: 81,
      pot: 82,
      salary: 14.5,
      years: 2,
      teamId: 'FA',
      skills: { three: 84, mid: 82, finishing: 86, dunk: 90, pass: 75, defense: 83, rebound: 80, athleticism: 88 },
      stats: { games: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, fgPct: 0.45, tpPct: 0.35 },
      injuredGames: 0
    },
    {
      id: `fa_${seasonYear}_2`,
      name: 'Monte Morris',
      nameZh: '莫里斯',
      pos: 'PG',
      age: 29,
      ovr: 79,
      pot: 79,
      salary: 7.5,
      years: 1,
      teamId: 'FA',
      skills: { three: 85, mid: 83, finishing: 80, dunk: 65, pass: 89, defense: 78, rebound: 65, athleticism: 78 },
      stats: { games: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, fgPct: 0.47, tpPct: 0.38 },
      injuredGames: 0
    },
    {
      id: `fa_${seasonYear}_3`,
      name: 'Mason Plumlee',
      nameZh: '普朗姆利',
      pos: 'C',
      age: 34,
      ovr: 78,
      pot: 78,
      salary: 5.0,
      years: 1,
      teamId: 'FA',
      skills: { three: 50, mid: 70, finishing: 84, dunk: 85, pass: 82, defense: 80, rebound: 88, athleticism: 75 },
      stats: { games: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, fgPct: 0.58, tpPct: 0.1 },
      injuredGames: 0
    }
  ]);

  // 當前累積名單
  const [currentRoster, setCurrentRoster] = useState<Player[]>(() =>
    progressionReport.map((item) => item.updated)
  );

  const totalSalary = calculateTotalSalary(currentRoster);
  const remainingCap = Number((140.0 - totalSalary).toFixed(1));

  // 執行新秀選秀
  const handleDraftPlayer = (rookie: Player) => {
    if (draftedRookie) return;
    const signedRookie = { ...rookie, teamId: userTeam.id };
    setCurrentRoster((prev) => [...prev, signedRookie]);
    setDraftPool((prev) => prev.filter((p) => p.id !== rookie.id));
    setDraftedRookie(signedRookie);
  };

  // 簽約自由球員
  const handleSignFA = (fa: Player) => {
    if (currentRoster.length >= 15) {
      alert('球隊陣容名冊已達 15 人上限！');
      return;
    }
    if (remainingCap < fa.salary) {
      alert('薪資空間不足以簽下該球員！');
      return;
    }
    const signed = { ...fa, teamId: userTeam.id };
    setCurrentRoster((prev) => [...prev, signed]);
    setFreeAgents((prev) => prev.filter((p) => p.id !== fa.id));
  };

  const handleFinishOffseason = () => {
    const updatedTeam: Team = {
      ...userTeam,
      wins: 0,
      losses: 0,
      playoffWins: 0,
      roster: currentRoster
    };
    onProceedToNextSeason(updatedTeam);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 頂部休賽季大會 Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">Offseason Conference</span>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            休賽季大會 · 迎向第 {seasonYear + 1} 賽季
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            審視球員成長衰退報告、參與年度新人選秀會、運作自由市場補強陣容。
          </p>
        </div>

        <button
          onClick={handleFinishOffseason}
          className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-sm shadow-xl transition flex items-center gap-2 shrink-0"
        >
          完成休賽季作業，開季！ <ArrowRight size={16} />
        </button>
      </div>

      {/* 導航分頁 */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('PROGRESSION')}
          className={`pb-3 px-4 text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'PROGRESSION'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp size={16} /> 球員成長與老化報告
        </button>
        <button
          onClick={() => setActiveTab('DRAFT')}
          className={`pb-3 px-4 text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'DRAFT'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles size={16} /> 年度新人選秀會 {draftedRookie && '✓'}
        </button>
        <button
          onClick={() => setActiveTab('FREE_AGENCY')}
          className={`pb-3 px-4 text-sm font-bold transition border-b-2 flex items-center gap-2 ${
            activeTab === 'FREE_AGENCY'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <UserPlus size={16} /> 自由球員簽約市場
        </button>
      </div>

      {/* 分頁 1: 球員成長與老化 */}
      {activeTab === 'PROGRESSION' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg p-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            球員夏訓成果與生理年齡報告
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {progressionReport.map((item) => {
              const isUp = item.change > 0;
              const isDown = item.change < 0;
              return (
                <div
                  key={item.original.id}
                  className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.original.nameZh}</span>
                      <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 font-mono text-slate-300">
                        {item.original.pos}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      年齡: {item.original.age} → {item.updated.age} 歲 · 合約尚餘 {item.updated.years} 年
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-xs text-slate-500 block">
                        {item.original.ovr} → {item.updated.ovr}
                      </span>
                      <span
                        className={`text-sm font-black flex items-center justify-end gap-1 ${
                          isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-slate-400'
                        }`}
                      >
                        {isUp && <TrendingUp size={14} />}
                        {isDown && <TrendingDown size={14} />}
                        {item.change > 0 ? `+${item.change}` : item.change}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 分頁 2: 選秀大會 */}
      {activeTab === 'DRAFT' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white">第 {seasonYear + 1} 屆 NBA 新秀選秀大會</h3>
              <p className="text-xs text-slate-400">你擁有一枚首輪選秀籤，挑選一位潛力基石加入陣容！</p>
            </div>
            {draftedRookie && (
              <span className="text-xs px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full font-bold">
                已選中: {draftedRookie.nameZh} (首輪新秀)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {draftPool.slice(0, 9).map((rookie, i) => (
              <div
                key={rookie.id}
                className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-amber-500 font-bold">第 {i + 1} 順位預測</span>
                    <span className="px-1.5 rounded bg-slate-800 text-slate-300 font-mono">{rookie.pos}</span>
                  </div>
                  <h4 className="text-base font-black text-white">{rookie.nameZh}</h4>
                  <p className="text-xs text-slate-400">{rookie.name} · {rookie.age} 歲</p>

                  <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">目前總評</span>
                      <span className="text-lg font-black font-mono text-emerald-400">{rookie.ovr}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">球探潛力</span>
                      <span className="text-lg font-black font-mono text-blue-400">{rookie.pot}</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!!draftedRookie}
                  onClick={() => handleDraftPlayer(rookie)}
                  className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition ${
                    draftedRookie
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {draftedRookie ? '選秀權已使用' : '行使選秀權指名入隊'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 分頁 3: 自由球員市場 */}
      {activeTab === 'FREE_AGENCY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white">自由球員簽約中心</h3>
              <p className="text-xs text-slate-400">目前薪資空間餘額: ${remainingCap}M</p>
            </div>
          </div>

          <div className="space-y-3">
            {freeAgents.map((fa) => (
              <div
                key={fa.id}
                className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{fa.nameZh}</span>
                    <span className="text-xs px-1.5 rounded bg-slate-800 text-slate-300 font-mono">{fa.pos}</span>
                    <span className="text-xs font-black font-mono text-emerald-400">OVR {fa.ovr}</span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {fa.name} · {fa.age}歲 · 期望合約 ${fa.salary}M / 年 ({fa.years}年)
                  </span>
                </div>

                <button
                  onClick={() => handleSignFA(fa)}
                  disabled={remainingCap < fa.salary}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    remainingCap >= fa.salary
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  簽署加盟合約
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
