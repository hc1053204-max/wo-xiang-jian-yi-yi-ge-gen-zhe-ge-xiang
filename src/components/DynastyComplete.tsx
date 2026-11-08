import React from 'react';
import { Team, SeasonHistory, Trophy } from '../types/game';
import { Trophy as TrophyIcon, Sparkles, RefreshCcw, Award, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DynastyCompleteProps {
  userTeam: Team;
  history: SeasonHistory[];
  trophies: Trophy[];
  onRestartNewDynasty: () => void;
}

export const DynastyComplete: React.FC<DynastyCompleteProps> = ({
  userTeam,
  history,
  trophies,
  onRestartNewDynasty
}) => {
  React.useEffect(() => {
    confetti({
      particleCount: 250,
      spread: 120,
      origin: { y: 0.4 }
    });
  }, []);

  const totalWins = history.reduce((acc, h) => acc + h.wins, 0);
  const totalLosses = history.reduce((acc, h) => acc + h.losses, 0);
  const totalChampionships = history.filter((h) => h.champion.includes(userTeam.nameZh)).length;
  const unlockedTrophyCount = trophies.filter((t) => t.unlocked).length;

  // 評定王朝等級
  let dynastyGrade = '平凡過客';
  let dynastyColor = 'text-slate-400';
  if (totalChampionships >= 8) {
    dynastyGrade = '🌟 GOAT 史上最強不朽神話王朝';
    dynastyColor = 'text-amber-400';
  } else if (totalChampionships >= 5) {
    dynastyGrade = '👑 傳奇統治級帝國王朝';
    dynastyColor = 'text-yellow-400';
  } else if (totalChampionships >= 3) {
    dynastyGrade = '🏆 經典三連霸黃金盛世';
    dynastyColor = 'text-emerald-400';
  } else if (totalChampionships >= 1) {
    dynastyGrade = '🎖️ 冠軍豪門勁旅';
    dynastyColor = 'text-blue-400';
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold uppercase">
        <Sparkles size={14} /> 二十季總經理生涯圓滿結算
      </div>

      <h1 className="text-3xl md:text-4xl font-black text-white">
        {userTeam.cityZh}{userTeam.nameZh} · 王朝史詩終章
      </h1>

      {/* 王朝等級封號 */}
      <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-xs uppercase text-slate-500 font-mono tracking-widest">王朝綜合評鑑</span>
        <div className={`text-2xl md:text-3xl font-black ${dynastyColor}`}>
          {dynastyGrade}
        </div>
      </div>

      {/* 二十年隊史四大總數據 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">奪冠金盃</span>
          <span className="text-2xl font-black font-mono text-amber-400">{totalChampionships} 座</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">生涯總勝率</span>
          <span className="text-2xl font-black font-mono text-emerald-400">
            {totalWins + totalLosses === 0 ? '.000' : (totalWins / (totalWins + totalLosses)).toFixed(3)}
          </span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">二十年生涯勝場</span>
          <span className="text-2xl font-black font-mono text-white">{totalWins} 勝</span>
        </div>
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-500 block">解鎖榮譽勳章</span>
          <span className="text-2xl font-black font-mono text-blue-400">{unlockedTrophyCount} / {trophies.length}</span>
        </div>
      </div>

      <p className="text-sm text-slate-400 max-w-lg mx-auto">
        從一開始選秀組建擴張隊，經歷無數次戰術調度、薪資規劃、自由球員爭奪與季後賽第七戰絕殺，你完成了二十個漫長賽季的宏偉征途。
      </p>

      <button
        onClick={onRestartNewDynasty}
        className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-base shadow-xl transition flex items-center justify-center gap-2 mx-auto"
      >
        <RefreshCcw size={18} /> 保留勳章成就，開啟下一個二十季新傳奇！
      </button>
    </div>
  );
};
