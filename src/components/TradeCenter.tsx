import React, { useState } from 'react';
import { Team, Player } from '../types/game';
import { calculatePlayerTradeValue } from '../utils/engine';
import { RefreshCw, ArrowLeftRight, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface TradeCenterProps {
  userTeam: Team;
  allTeams: Team[];
  onExecuteTrade: (userPlayersOut: Player[], targetTeam: Team, targetPlayersIn: Player[]) => void;
}

export const TradeCenter: React.FC<TradeCenterProps> = ({ userTeam, allTeams, onExecuteTrade }) => {
  const otherTeams = allTeams.filter((t) => t.id !== userTeam.id);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(otherTeams[0]?.id || '');
  const [userOfferPlayerIds, setUserOfferPlayerIds] = useState<string[]>([]);
  const [targetWantPlayerIds, setTargetWantPlayerIds] = useState<string[]>([]);
  const [tradeMessage, setTradeMessage] = useState<{ text: string; success: boolean } | null>(null);

  const targetTeam = otherTeams.find((t) => t.id === selectedTeamId) || otherTeams[0];

  const userOfferPlayers = userTeam.roster.filter((p) => userOfferPlayerIds.includes(p.id));
  const targetWantPlayers = targetTeam ? targetTeam.roster.filter((p) => targetWantPlayerIds.includes(p.id)) : [];

  const userValue = userOfferPlayers.reduce((acc, p) => acc + calculatePlayerTradeValue(p), 0);
  const targetValue = targetWantPlayers.reduce((acc, p) => acc + calculatePlayerTradeValue(p), 0);

  const userSalaryOut = Number(userOfferPlayers.reduce((acc, p) => acc + p.salary, 0).toFixed(1));
  const targetSalaryIn = Number(targetWantPlayers.reduce((acc, p) => acc + p.salary, 0).toFixed(1));

  // 薪資對等判斷 (在 130% 浮動範圍內)
  const isSalaryValid =
    userOfferPlayers.length === 0 || targetWantPlayers.length === 0
      ? false
      : Math.abs(userSalaryOut - targetSalaryIn) <= Math.max(7.5, userSalaryOut * 0.35);

  const toggleUserPlayer = (id: string) => {
    setUserOfferPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setTradeMessage(null);
  };

  const toggleTargetPlayer = (id: string) => {
    setTargetWantPlayerIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
    setTradeMessage(null);
  };

  const handleProposeTrade = () => {
    if (userOfferPlayers.length === 0 || targetWantPlayers.length === 0) return;

    if (!isSalaryValid) {
      setTradeMessage({
        text: `聯盟總部退回：薪資不對等！送出 $${userSalaryOut}M vs 接收 $${targetSalaryIn}M，差距過大超出薪資匹配規則。`,
        success: false
      });
      return;
    }

    // 評估對方 GM 接受意願：對方給出的價值不能大幅高於我們給出的價值 (至多讓步 10 點)
    if (userValue < targetValue - 8) {
      setTradeMessage({
        text: `【${targetTeam.nameZh}總經理】: 「這筆報價毫無吸引力。我們不可能平白賤賣陣中主力！」`,
        success: false
      });
      return;
    }

    // 成功完成交易
    setTradeMessage({
      text: `🎉 重磅交易達成！聯盟辦公室已核准本筆交易，球員已完成換隊報到！`,
      success: true
    });

    setTimeout(() => {
      onExecuteTrade(userOfferPlayers, targetTeam, targetWantPlayers);
      setUserOfferPlayerIds([]);
      setTargetWantPlayerIds([]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <ArrowLeftRight className="text-amber-500" /> NBA 交易談判中心
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            挑選交易對象球隊，搭配合約薪資與球員價值，談成跨隊重磅交易！
          </p>
        </div>

        {/* 挑選談判對象球隊 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">談判對手:</span>
          <select
            value={selectedTeamId}
            onChange={(e) => {
              setSelectedTeamId(e.target.value);
              setTargetWantPlayerIds([]);
              setTradeMessage(null);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-bold focus:outline-none focus:border-amber-500"
          >
            {otherTeams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.cityZh} {t.nameZh} ({t.abbr})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 交易雙方談判台 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 我方出價台 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-500 uppercase font-mono">送出球員</span>
              <h3 className="text-lg font-bold text-white">{userTeam.cityZh}{userTeam.nameZh}</h3>
            </div>
            <div className="text-right text-xs">
              <span className="text-slate-400">送出薪資: </span>
              <span className="font-mono font-bold text-amber-400">${userSalaryOut}M</span>
              <div className="text-[10px] text-slate-500">交易總戰力分: {userValue}</div>
            </div>
          </div>

          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
            {userTeam.roster.map((p) => {
              const isSelected = userOfferPlayerIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => toggleUserPlayer(p.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{p.nameZh}</span>
                      <span className="text-xs px-1 rounded bg-slate-800 font-mono text-slate-300">{p.pos}</span>
                    </div>
                    <span className="text-xs text-slate-400">{p.age}歲 · ${p.salary}M/年</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-emerald-400">OVR {p.ovr}</span>
                    <span className="block text-[10px] text-slate-500">評分 {calculatePlayerTradeValue(p)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 對方索取台 */}
        {targetTeam && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono">獲得球員</span>
                <h3 className="text-lg font-bold text-white">{targetTeam.cityZh}{targetTeam.nameZh}</h3>
              </div>
              <div className="text-right text-xs">
                <span className="text-slate-400">接收薪資: </span>
                <span className="font-mono font-bold text-amber-400">${targetSalaryIn}M</span>
                <div className="text-[10px] text-slate-500">目標總戰力分: {targetValue}</div>
              </div>
            </div>

            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
              {targetTeam.roster.map((p) => {
                const isSelected = targetWantPlayerIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleTargetPlayer(p.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">{p.nameZh}</span>
                        <span className="text-xs px-1 rounded bg-slate-800 font-mono text-slate-300">{p.pos}</span>
                      </div>
                      <span className="text-xs text-slate-400">{p.age}歲 · ${p.salary}M/年</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-emerald-400">OVR {p.ovr}</span>
                      <span className="block text-[10px] text-slate-500">評分 {calculatePlayerTradeValue(p)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 交易回饋訊息 */}
      {tradeMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            tradeMessage.success
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
              : 'bg-rose-950/40 border-rose-500 text-rose-200'
          }`}
        >
          {tradeMessage.success ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
          <span>{tradeMessage.text}</span>
        </div>
      )}

      {/* 送出交易按鈕 */}
      <div className="flex justify-end">
        <button
          onClick={handleProposeTrade}
          disabled={userOfferPlayers.length === 0 || targetWantPlayers.length === 0}
          className={`px-8 py-3.5 rounded-xl font-black text-sm shadow-xl transition flex items-center gap-2 ${
            userOfferPlayers.length > 0 && targetWantPlayers.length > 0
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <RefreshCw size={16} /> 呈報聯盟辦公室，發送正式交易報價
        </button>
      </div>
    </div>
  );
};
