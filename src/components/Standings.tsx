import React, { useState } from 'react';
import { Team, Tactics, GameResult } from '../types/game';
import { Play, FastForward, Award, SlidersHorizontal, AlertCircle, Trophy } from 'lucide-react';

interface StandingsProps {
  teams: Team[];
  userTeam: Team;
  tactics: Tactics;
  onUpdateTactics: (newTactics: Tactics) => void;
  onSimulateGames: (count: number) => void;
  onStartPlayoffs: () => void;
  recentResults: GameResult[];
  seasonYear: number;
}

export const Standings: React.FC<StandingsProps> = ({
  teams,
  userTeam,
  tactics,
  onUpdateTactics,
  onSimulateGames,
  onStartPlayoffs,
  recentResults,
  seasonYear
}) => {
  const [activeConf, setActiveConf] = useState<'ALL' | 'EAST' | 'WEST'>(userTeam.conference);
  const [showTacticsModal, setShowTacticsModal] = useState<boolean>(false);

  const totalGamesPlayed = userTeam.wins + userTeam.losses;
  const SEASON_GAMES_TARGET = 50; // 設定為 50 場精彩緊湊賽程
  const isSeasonFinished = totalGamesPlayed >= SEASON_GAMES_TARGET;

  // 排序球隊戰績榜
  const sortTeams = (list: Team[]) => {
    return [...list].sort((a, b) => {
      const pctA = a.wins + a.losses === 0 ? 0 : a.wins / (a.wins + a.losses);
      const pctB = b.wins + b.losses === 0 ? 0 : b.wins / (b.wins + b.losses);
      if (pctB !== pctA) return pctB - pctA;
      return b.wins - a.wins;
    });
  };

  const eastTeams = sortTeams(teams.filter((t) => t.conference === 'EAST'));
  const westTeams = sortTeams(teams.filter((t) => t.conference === 'WEST'));

  // 計算勝差 GB (Games Behind)
  const calculateGB = (leader: Team, current: Team) => {
    const diff = (leader.wins - current.wins + (current.losses - leader.losses)) / 2;
    return diff <= 0 ? '-' : diff.toFixed(1);
  };

  // 判斷球隊是否進入分區前 8 (季後賽資格)
  const userConfList = userTeam.conference === 'EAST' ? eastTeams : westTeams;
  const userRank = userConfList.findIndex((t) => t.id === userTeam.id) + 1;
  const isPlayoffQualified = userRank <= 8;

  return (
    <div className="space-y-6">
      {/* 頂部賽季進度條與模擬控制列 */}
      <div className="p-4 md:p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
              第 {seasonYear} 賽季 · 例行賽
            </span>
            <span className="text-xs text-slate-400">
              進度: {totalGamesPlayed} / {SEASON_GAMES_TARGET} 場
            </span>
          </div>

          <div className="flex items-baseline gap-3 mt-1">
            <h2 className="text-2xl md:text-3xl font-black text-white">
              {userTeam.cityZh}{userTeam.nameZh}
            </h2>
            <span className="text-xl font-mono font-bold text-emerald-400">
              {userTeam.wins} 勝 {userTeam.losses} 負
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {userTeam.conference === 'EAST' ? '東區' : '西區'} 第 {userRank} 名
            </span>
          </div>
        </div>

        {/* 模擬按鈕組 */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowTacticsModal(true)}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <SlidersHorizontal size={15} /> 戰術方針
          </button>

          {!isSeasonFinished ? (
            <>
              <button
                onClick={() => onSimulateGames(1)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Play size={15} /> 下 1 場
              </button>
              <button
                onClick={() => onSimulateGames(5)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg transition flex items-center gap-1.5"
              >
                <FastForward size={15} /> 推進 5 場
              </button>
              <button
                onClick={() => onSimulateGames(SEASON_GAMES_TARGET - totalGamesPlayed)}
                className="px-3 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition"
              >
                速推至季末
              </button>
            </>
          ) : (
            <button
              onClick={onStartPlayoffs}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-sm shadow-xl transition flex items-center gap-2 animate-bounce"
            >
              <Trophy size={18} />
              {isPlayoffQualified ? '進軍季後賽！開始爭霸 →' : '賽季結束，前往休賽季大會 →'}
            </button>
          )}
        </div>
      </div>

      {/* 分區戰績榜清單 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 東區排行 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" /> 東區聯盟 (Eastern Conference)
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">前 8 名鎖定季後賽門票</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-500 uppercase font-mono border-b border-slate-800/50">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">球隊</th>
                  <th className="py-2.5 px-2 text-center">勝</th>
                  <th className="py-2.5 px-2 text-center">負</th>
                  <th className="py-2.5 px-2 text-center">勝率</th>
                  <th className="py-2.5 px-2 text-center">勝差</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono">
                {eastTeams.map((t, idx) => {
                  const isUser = t.isUser;
                  const games = t.wins + t.losses;
                  const pct = games === 0 ? '.000' : (t.wins / games).toFixed(3).replace('0.', '.');
                  const gb = calculateGB(eastTeams[0], t);

                  return (
                    <tr
                      key={t.id}
                      className={`transition ${
                        isUser
                          ? 'bg-amber-500/15 font-bold text-amber-300'
                          : idx < 8
                          ? 'hover:bg-slate-800/30 text-slate-200'
                          : 'hover:bg-slate-800/20 text-slate-400'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-sans flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: t.colors.primary }}
                        />
                        <span className="font-semibold">{t.cityZh} {t.nameZh}</span>
                        {isUser && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 px-1 rounded font-bold">
                            我的球隊
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center text-emerald-400">{t.wins}</td>
                      <td className="py-2.5 px-2 text-center text-rose-400">{t.losses}</td>
                      <td className="py-2.5 px-2 text-center">{pct}</td>
                      <td className="py-2.5 px-2 text-center text-slate-400">{gb}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 西區排行 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-amber-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> 西區聯盟 (Western Conference)
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">前 8 名鎖定季後賽門票</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-500 uppercase font-mono border-b border-slate-800/50">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">球隊</th>
                  <th className="py-2.5 px-2 text-center">勝</th>
                  <th className="py-2.5 px-2 text-center">負</th>
                  <th className="py-2.5 px-2 text-center">勝率</th>
                  <th className="py-2.5 px-2 text-center">勝差</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 font-mono">
                {westTeams.map((t, idx) => {
                  const isUser = t.isUser;
                  const games = t.wins + t.losses;
                  const pct = games === 0 ? '.000' : (t.wins / games).toFixed(3).replace('0.', '.');
                  const gb = calculateGB(westTeams[0], t);

                  return (
                    <tr
                      key={t.id}
                      className={`transition ${
                        isUser
                          ? 'bg-amber-500/15 font-bold text-amber-300'
                          : idx < 8
                          ? 'hover:bg-slate-800/30 text-slate-200'
                          : 'hover:bg-slate-800/20 text-slate-400'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-sans flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: t.colors.primary }}
                        />
                        <span className="font-semibold">{t.cityZh} {t.nameZh}</span>
                        {isUser && (
                          <span className="text-[10px] bg-amber-500 text-slate-950 px-1 rounded font-bold">
                            我的球隊
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center text-emerald-400">{t.wins}</td>
                      <td className="py-2.5 px-2 text-center text-rose-400">{t.losses}</td>
                      <td className="py-2.5 px-2 text-center">{pct}</td>
                      <td className="py-2.5 px-2 text-center text-slate-400">{gb}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 近期戰果動態速覽 */}
      {recentResults.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">近期球隊戰報速覽</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {recentResults.slice(-3).map((r, i) => (
              <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-200">
                    {r.homeTeamId} {r.homeScore} - {r.awayScore} {r.awayTeamId}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    MVP: {r.topScorer.nameZh} ({r.topScorer.points}分)
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-bold font-mono text-[11px] ${
                    (r.homeTeamId === userTeam.id && r.homeScore > r.awayScore) ||
                    (r.awayTeamId === userTeam.id && r.awayScore > r.homeScore)
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}
                >
                  {(r.homeTeamId === userTeam.id && r.homeScore > r.awayScore) ||
                  (r.awayTeamId === userTeam.id && r.awayScore > r.homeScore)
                    ? 'WIN 勝'
                    : 'LOSS 敗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 戰術策略彈窗 */}
      {showTacticsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <SlidersHorizontal className="text-amber-500" /> 教練團戰術體系設定
              </h3>
              <button
                onClick={() => setShowTacticsModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 進攻節奏 */}
              <div>
                <label className="text-slate-400 font-bold block mb-1.5">進攻節奏 (Pace)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'fast', label: '七秒跑轟 (快節奏)' },
                    { id: 'balanced', label: '攻守均衡 (常規)' },
                    { id: 'slow', label: '慢速陣地 (減速防守)' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => onUpdateTactics({ ...tactics, pace: p.id as any })}
                      className={`p-2 rounded-lg border text-center transition ${
                        tactics.pace === p.id
                          ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 進攻核心焦點 */}
              <div>
                <label className="text-slate-400 font-bold block mb-1.5">進攻發動重心 (Focus)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'three', label: '外線魔球 (重視 3PT)' },
                    { id: 'paint', label: '衝擊油漆區 (禁區硬撼)' },
                    { id: 'star', label: '巨星單打 (王牌終結)' },
                    { id: 'balanced', label: '團隊傳導 (均衡分享)' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => onUpdateTactics({ ...tactics, focus: f.id as any })}
                      className={`p-2 rounded-lg border text-center transition ${
                        tactics.focus === f.id
                          ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 防守陣型 */}
              <div>
                <label className="text-slate-400 font-bold block mb-1.5">防守策略 (Defense)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'switch', label: '全員無限換防' },
                    { id: 'drop', label: '內線沉退護框' },
                    { id: 'press', label: '全場緊迫盯人' },
                    { id: 'zone', label: '區域防守鞏固籃板' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      onClick={() => onUpdateTactics({ ...tactics, defense: d.id as any })}
                      className={`p-2 rounded-lg border text-center transition ${
                        tactics.defense === d.id
                          ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 訓練強度 */}
              <div>
                <label className="text-slate-400 font-bold block mb-1.5">日常球隊訓練強度</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'high', label: '魔鬼訓練 (+戰力/-體力)' },
                    { id: 'normal', label: '標準作息 (平衡)' },
                    { id: 'light', label: '輕量恢復 (防受傷)' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onUpdateTactics({ ...tactics, trainingIntensity: t.id as any })}
                      className={`p-2 rounded-lg border text-center transition ${
                        tactics.trainingIntensity === t.id
                          ? 'border-amber-500 bg-amber-500/20 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTacticsModal(false)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition"
            >
              儲存並套用戰術指令
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
