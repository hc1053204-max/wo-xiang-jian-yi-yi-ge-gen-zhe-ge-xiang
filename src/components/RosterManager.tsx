import React, { useState } from 'react';
import { Team, Player, Position } from '../types/game';
import { ArrowUpDown, UserMinus, ShieldAlert, Award, Star, Activity, Sparkles } from 'lucide-react';
import { calculateTotalSalary } from '../utils/engine';

interface RosterManagerProps {
  userTeam: Team;
  onUpdateRoster: (newRoster: Player[]) => void;
}

export const RosterManager: React.FC<RosterManagerProps> = ({ userTeam, onUpdateRoster }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(userTeam.roster[0] || null);

  const totalSalary = calculateTotalSalary(userTeam.roster);
  const SALARY_CAP = 140.0;
  const LUXURY_TAX = 170.0;

  // 切換先發順序（向上移動）
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newRoster = [...userTeam.roster];
    const temp = newRoster[index - 1];
    newRoster[index - 1] = newRoster[index];
    newRoster[index] = temp;
    onUpdateRoster(newRoster);
  };

  // 裁掉球員 (Waive)
  const handleWaive = (player: Player) => {
    if (userTeam.roster.length <= 5) {
      alert('陣容至少須保留 5 名球員！');
      return;
    }
    if (confirm(`確定要裁掉 ${player.nameZh} 嗎？他的剩餘合約薪資仍將計入薪資簿。`)) {
      const updated = userTeam.roster.filter((p) => p.id !== player.id);
      onUpdateRoster(updated);
      if (selectedPlayer?.id === player.id) {
        setSelectedPlayer(updated[0] || null);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 左側與中間：陣容名單與輪替名次 */}
      <div className="lg:col-span-2 space-y-4">
        {/* 薪資狀態列 */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">球隊總薪資 (團隊工資帽)</span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-black font-mono ${
                  totalSalary > LUXURY_TAX ? 'text-rose-500' : totalSalary > SALARY_CAP ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                ${totalSalary}M
              </span>
              <span className="text-xs text-slate-500 font-mono">/ 上限 $140M (稅線 $170M)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {totalSalary > LUXURY_TAX && (
              <span className="px-2.5 py-1 bg-rose-950/60 border border-rose-800 text-rose-300 rounded font-bold flex items-center gap-1">
                <ShieldAlert size={14} /> 觸發奢侈稅懲罰
              </span>
            )}
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded font-mono">
              名冊球員: {userTeam.roster.length} 人
            </span>
          </div>
        </div>

        {/* 球員名單表 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">先發五虎與替補輪替順位</h3>
            <span className="text-xs text-slate-400">前 5 位球員為比賽先發主將</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {userTeam.roster.map((player, index) => {
              const isStarter = index < 5;
              const isSelected = selectedPlayer?.id === player.id;
              return (
                <div
                  key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className={`p-3 sm:px-4 flex items-center justify-between gap-3 cursor-pointer transition ${
                    isSelected
                      ? 'bg-amber-500/10 border-l-4 border-amber-500'
                      : 'hover:bg-slate-800/40 bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-bold ${
                        isStarter ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{player.nameZh}</span>
                        <span className="text-xs font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {player.pos}
                        </span>
                        {player.injuredGames > 0 && (
                          <span className="text-[10px] bg-rose-950 border border-rose-800 text-rose-300 px-1.5 rounded">
                            傷缺 {player.injuredGames} 場
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {player.name} · {player.age}歲 · 合約 {player.years}年 (${player.salary}M/年)
                      </div>
                    </div>
                  </div>

                  {/* 戰力評分與操作 */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black font-mono text-emerald-400 block leading-tight">
                        {player.ovr}
                      </span>
                      <span className="text-[10px] text-blue-400 font-mono">POT {player.pot}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveUp(index);
                          }}
                          title="升格前一位順位"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
                        >
                          <ArrowUpDown size={14} />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWaive(player);
                        }}
                        title="裁掉球員"
                        className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded transition"
                      >
                        <UserMinus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 右側：選中球員詳細技能卡片 */}
      <div className="space-y-4">
        {selectedPlayer ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-amber-500">{selectedPlayer.pos} 核心</span>
                <h3 className="text-xl font-black text-white">{selectedPlayer.nameZh}</h3>
                <p className="text-xs text-slate-400">{selectedPlayer.name}</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black font-mono text-emerald-400">{selectedPlayer.ovr}</span>
                <span className="text-xs text-slate-500 block font-mono">潛力上限 {selectedPlayer.pot}</span>
              </div>
            </div>

            {/* 本季例行賽平均數據 */}
            <div className="grid grid-cols-3 gap-2 my-4 text-center">
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">場均得分</span>
                <span className="text-base font-bold font-mono text-white">{selectedPlayer.stats.pts}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">場均籃板</span>
                <span className="text-base font-bold font-mono text-white">{selectedPlayer.stats.reb}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 block">場均助攻</span>
                <span className="text-base font-bold font-mono text-white">{selectedPlayer.stats.ast}</span>
              </div>
            </div>

            {/* 八維技能雷達指標進度條 */}
            <div className="space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-400 uppercase text-[11px] mb-1">球員技術能力評鑑</h4>
              {[
                { label: '三分遠投 (3PT)', val: selectedPlayer.skills.three },
                { label: '中距離跳投 (MID)', val: selectedPlayer.skills.mid },
                { label: '禁區終結 (FIN)', val: selectedPlayer.skills.finishing },
                { label: '暴力灌籃 (DNK)', val: selectedPlayer.skills.dunk },
                { label: '組織傳導 (PAS)', val: selectedPlayer.skills.pass },
                { label: '防守壓迫 (DEF)', val: selectedPlayer.skills.defense },
                { label: '籃板衝搶 (REB)', val: selectedPlayer.skills.rebound },
                { label: '體能爆發 (ATH)', val: selectedPlayer.skills.athleticism }
              ].map((skill) => (
                <div key={skill.label}>
                  <div className="flex justify-between text-slate-300 mb-0.5">
                    <span>{skill.label}</span>
                    <span className="font-mono font-bold text-amber-400">{skill.val}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        skill.val >= 90
                          ? 'bg-amber-400'
                          : skill.val >= 80
                          ? 'bg-emerald-400'
                          : skill.val >= 70
                          ? 'bg-blue-400'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.min(100, (skill.val / 99) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 合約與續約狀態 */}
            <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>年薪總額:</span>
                <span className="font-mono font-bold text-white">${selectedPlayer.salary}M / 年</span>
              </div>
              <div className="flex justify-between">
                <span>合約剩餘:</span>
                <span className="font-mono font-bold text-white">{selectedPlayer.years} 賽季</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500">
            請點擊左側球員檢視詳細屬性
          </div>
        )}
      </div>
    </div>
  );
};
