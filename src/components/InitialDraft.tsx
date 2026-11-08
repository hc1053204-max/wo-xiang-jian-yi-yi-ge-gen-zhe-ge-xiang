import React, { useState } from 'react';
import { Player, Position } from '../types/game';
import { generateExpansionDraftPool } from '../data/nbaData';
import { Check, Plus, AlertCircle, DollarSign, UserCheck, Flame, Star } from 'lucide-react';

interface InitialDraftProps {
  userTeamName: string;
  onDraftComplete: (selectedPlayers: Player[]) => void;
}

export const InitialDraft: React.FC<InitialDraftProps> = ({ userTeamName, onDraftComplete }) => {
  const [pool] = useState<Player[]>(() => generateExpansionDraftPool());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'ALL' | Position>('ALL');

  const REQUIRED_COUNT = 8;
  const SALARY_CAP = 140.0; // 百萬美元

  const selectedPlayers = pool.filter((p) => selectedIds.includes(p.id));
  const currentTotalSalary = Number(selectedPlayers.reduce((acc, p) => acc + p.salary, 0).toFixed(1));
  const remainingCap = Number((SALARY_CAP - currentTotalSalary).toFixed(1));

  const toggleSelectPlayer = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= REQUIRED_COUNT) return;
      setSelectedIds([...selectedIds, id]);
    }
  };

  const filteredPool = activeFilter === 'ALL' ? pool : pool.filter((p) => p.pos === activeFilter);

  // 驗證位置覆蓋率
  const hasPG = selectedPlayers.some((p) => p.pos === 'PG');
  const hasSG = selectedPlayers.some((p) => p.pos === 'SG');
  const hasSF = selectedPlayers.some((p) => p.pos === 'SF');
  const hasPF = selectedPlayers.some((p) => p.pos === 'PF');
  const hasC = selectedPlayers.some((p) => p.pos === 'C');
  const allPositionsCovered = hasPG && hasSG && hasSF && hasPF && hasC;

  const canProceed = selectedIds.length === REQUIRED_COUNT && remainingCap >= 0;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      {/* 頂部說明與名額薪資儀表 */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Expansion Draft</span>
          <h2 className="text-2xl md:text-3xl font-black text-white">{userTeamName} · 開局擴張選秀</h2>
          <p className="text-xs text-slate-400 mt-1">
            從 30 支球隊釋出的候選池中挑選 8 位基石球員（須注意位置配置與薪資上限上限 $140M）。
          </p>
        </div>

        {/* 狀態數據小卡 */}
        <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800 self-stretch md:self-auto justify-around">
          <div className="text-center">
            <span className="text-[10px] uppercase text-slate-500 block">已挑選人數</span>
            <span className="text-xl font-bold font-mono text-white">
              {selectedIds.length} / {REQUIRED_COUNT}
            </span>
          </div>
          <div className="w-[1px] h-8 bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] uppercase text-slate-500 block">剩餘薪資空間</span>
            <span
              className={`text-xl font-bold font-mono ${
                remainingCap < 0 ? 'text-rose-500' : 'text-emerald-400'
              }`}
            >
              ${remainingCap}M
            </span>
          </div>
        </div>
      </div>

      {/* 位置短缺提醒與確認按鈕列 */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 my-2">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">位置配置:</span>
          <span className={`px-2 py-0.5 rounded font-mono ${hasPG ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>PG</span>
          <span className={`px-2 py-0.5 rounded font-mono ${hasSG ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>SG</span>
          <span className={`px-2 py-0.5 rounded font-mono ${hasSF ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>SF</span>
          <span className={`px-2 py-0.5 rounded font-mono ${hasPF ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>PF</span>
          <span className={`px-2 py-0.5 rounded font-mono ${hasC ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>C</span>
        </div>

        {/* 篩選標籤 */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['ALL', 'PG', 'SG', 'SF', 'PF', 'C'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setActiveFilter(pos)}
              className={`px-3 py-1 rounded transition ${
                activeFilter === pos
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* 候選球員網格清單 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        {filteredPool.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          return (
            <div
              key={p.id}
              onClick={() => toggleSelectPlayer(p.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition relative flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10 shadow-lg ring-1 ring-amber-500'
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                    {p.pos}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-400 font-mono">{p.age} 歲</span>
                    <span className="text-xs font-bold text-amber-400 font-mono">${p.salary}M</span>
                  </div>
                </div>

                <div className="font-black text-white text-base">{p.nameZh}</div>
                <div className="text-[11px] text-slate-400">{p.name}</div>

                {/* 能力值評分 OVR 與潛力 POT */}
                <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-[10px] text-slate-500 block">目前總評</span>
                    <span className="text-lg font-black font-mono text-emerald-400">{p.ovr}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">潛力上限</span>
                    <span className="text-lg font-black font-mono text-blue-400">{p.pot}</span>
                  </div>
                </div>

                {/* 關鍵特長標籤 */}
                <div className="flex items-center gap-1.5 mt-2 text-[10px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                    三分: {p.skills.three}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                    防守: {p.skills.defense}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs">
                {isSelected ? (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Check size={14} /> 已選中入隊
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-500 group-hover:text-slate-300">
                    <Plus size={14} /> 點擊納入名單
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部確認按鈕 */}
      <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-400">
          {!allPositionsCovered && selectedIds.length === REQUIRED_COUNT && (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertCircle size={14} /> 提示：名單內缺少某些關鍵先發位置，建議五個位置各至少一人。
            </span>
          )}
          {remainingCap < 0 && (
            <span className="text-rose-400 flex items-center gap-1">
              <AlertCircle size={14} /> 薪資總額超出上限上限，無法完成簽約。
            </span>
          )}
        </div>

        <button
          disabled={!canProceed}
          onClick={() => onDraftComplete(selectedPlayers)}
          className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm shadow-xl transition ${
            canProceed
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          確認名單，開啟第 1 賽季例行賽 ({selectedIds.length}/{REQUIRED_COUNT}) →
        </button>
      </div>
    </div>
  );
};
