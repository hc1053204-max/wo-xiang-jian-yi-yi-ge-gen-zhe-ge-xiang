import React from 'react';
import { Trophy, Play, Sparkles, BookOpen, Shield, Flame, RotateCcw } from 'lucide-react';

interface WelcomeSplashProps {
  onStartNewGame: () => void;
  onContinueGame?: () => void;
  hasExistingSave: boolean;
  onOpenTrophies: () => void;
}

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({
  onStartNewGame,
  onContinueGame,
  hasExistingSave,
  onOpenTrophies
}) => {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center p-4">
      {/* 背景裝飾光暈 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-2xl w-full text-center space-y-6 bg-slate-900/90 border border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full text-xs font-mono font-bold uppercase tracking-widest">
          <Flame size={14} /> NBA FANTASY · FRONT OFFICE GM
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          NBA 王朝 · 二十季重建聯盟
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          帶領自訂擴張球隊加盟現代 NBA 30 隊，在嚴謹薪資上限體系下運籌帷幄。經歷擴張選秀、球員交易、自由市場談判、新秀培育與像素戰術季後賽，挑戰二十個賽季的史詩王朝競逐！
        </p>

        {/* 遊戲特色亮點三格 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left py-2">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5 mb-1">
              <Shield size={16} /> 擴張自訂隊
            </div>
            <p className="text-xs text-slate-400">
              台北、西雅圖、拉斯維加斯等主場自訂，成為第 31 支加盟軍。
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mb-1">
              <Sparkles size={16} /> 像素戰術球場
            </div>
            <p className="text-xs text-slate-400">
              即時 2D 像素籃球動態球場，下達防守與跑轟戰術，決戰季後賽！
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl">
            <div className="text-blue-400 font-bold text-sm flex items-center gap-1.5 mb-1">
              <Trophy size={16} /> 20 季王朝歷史
            </div>
            <p className="text-xs text-slate-400">
              成長老化衰退、年度選秀大會、榮譽勳章隨瀏覽器永續保存。
            </p>
          </div>
        </div>

        {/* 啟動主按鈕 */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          {hasExistingSave && onContinueGame && (
            <button
              onClick={onContinueGame}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl text-base shadow-xl transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> 繼續隊史存檔進度
            </button>
          )}

          <button
            onClick={onStartNewGame}
            className={`w-full sm:w-auto px-8 py-3.5 font-black rounded-xl text-base shadow-xl transition flex items-center justify-center gap-2 ${
              hasExistingSave
                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950'
            }`}
          >
            <Play size={18} /> 開啟新球季征途
          </button>

          <button
            onClick={onOpenTrophies}
            className="w-full sm:w-auto px-5 py-3.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <Trophy size={16} className="text-amber-500" /> 王朝勳章殿堂
          </button>
        </div>

        <div className="pt-2 text-[11px] text-slate-500">
          免註冊 · 本地自動存檔 · 支援手機與電腦全螢幕遊玩
        </div>
      </div>
    </div>
  );
};
