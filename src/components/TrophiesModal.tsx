import React, { useState } from 'react';
import { Trophy, SeasonHistory } from '../types/game';
import { Award, Medal, Download, Upload, Copy, Check, History } from 'lucide-react';

interface TrophiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  trophies: Trophy[];
  history: SeasonHistory[];
  onImportSave: (saveData: string) => void;
  exportSaveData: () => string;
}

export const TrophiesModal: React.FC<TrophiesModalProps> = ({
  isOpen,
  onClose,
  trophies,
  history,
  onImportSave,
  exportSaveData
}) => {
  const [activeTab, setActiveTab] = useState<'TROPHIES' | 'HISTORY' | 'SAVE_LOAD'>('TROPHIES');
  const [copied, setCopied] = useState(false);
  const [importCode, setImportCode] = useState('');

  if (!isOpen) return null;

  const handleCopy = () => {
    const data = exportSaveData();
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDoImport = () => {
    if (!importCode.trim()) return;
    try {
      onImportSave(importCode.trim());
      alert('✅ 存檔讀取成功！');
      onClose();
    } catch (e) {
      alert('❌ 存檔格式錯誤，無法讀取。');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* 頂部 Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="text-amber-500 w-6 h-6" />
            <h3 className="text-xl font-black text-white">王朝榮譽殿堂 · 隊史紀錄</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* 導航分頁 */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('TROPHIES')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'TROPHIES'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Medal size={15} /> 勳章徽章成就
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'HISTORY'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <History size={15} /> 二十季隊史走廊
          </button>
          <button
            onClick={() => setActiveTab('SAVE_LOAD')}
            className={`pb-2.5 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'SAVE_LOAD'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Download size={15} /> 存檔匯出與匯入
          </button>
        </div>

        {/* 內容區 */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'TROPHIES' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trophies.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                    t.unlocked
                      ? 'border-amber-500/50 bg-amber-500/10'
                      : 'border-slate-800 bg-slate-950/40 opacity-50'
                  }`}
                >
                  <div className="text-2xl w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0">
                    {t.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{t.title}</span>
                      {t.unlocked && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                          第 {t.unlockedYear || 1} 季解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-2">
              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  尚無歷季完賽紀錄。請完成第 1 賽季以在隊史留名！
                </div>
              ) : (
                history.map((h) => (
                  <div
                    key={h.year}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-400 block text-sm">
                        第 {h.year} 賽季
                      </span>
                      <span className="text-slate-300">
                        例行賽 {h.wins}勝-{h.losses}負 · {h.playoffResult}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">總冠軍: {h.champion}</span>
                      <span className="text-[11px] text-slate-500">MVP: {h.mvp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'SAVE_LOAD' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block">匯出存檔代碼</span>
                <p className="text-slate-400">
                  複製下方代碼即可在任何瀏覽器恢復你的球隊進度與隊史勳章。
                </p>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? '已複製到剪貼簿！' : '一鍵複製存檔代碼'}
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-slate-200 block">匯入存檔代碼</span>
                <textarea
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value)}
                  placeholder="在此貼上導出的存檔字串..."
                  className="w-full h-20 p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleDoImport}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition flex items-center gap-1.5"
                >
                  <Upload size={14} /> 讀取存檔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
