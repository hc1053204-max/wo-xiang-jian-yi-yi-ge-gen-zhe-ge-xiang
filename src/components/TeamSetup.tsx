import React, { useState } from 'react';
import { EXPANSION_CITIES } from '../data/nbaData';
import { Shield, Sparkles, MapPin, Award } from 'lucide-react';

interface TeamSetupProps {
  onComplete: (teamInfo: {
    city: string;
    cityZh: string;
    name: string;
    nameZh: string;
    abbr: string;
    conference: 'EAST' | 'WEST';
    primaryColor: string;
    secondaryColor: string;
  }) => void;
}

export const TeamSetup: React.FC<TeamSetupProps> = ({ onComplete }) => {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [cityZh, setCityZh] = useState(EXPANSION_CITIES[0].cityZh);
  const [city, setCity] = useState(EXPANSION_CITIES[0].city);
  const [nameZh, setNameZh] = useState(EXPANSION_CITIES[0].nameZh);
  const [name, setName] = useState(EXPANSION_CITIES[0].name);
  const [abbr, setAbbr] = useState(EXPANSION_CITIES[0].abbr);
  const [conference, setConference] = useState<'EAST' | 'WEST'>('WEST');
  const [primaryColor, setPrimaryColor] = useState(EXPANSION_CITIES[0].primary);
  const [secondaryColor, setSecondaryColor] = useState(EXPANSION_CITIES[0].secondary);

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    const p = EXPANSION_CITIES[idx];
    setCity(p.city);
    setCityZh(p.cityZh);
    setName(p.name);
    setNameZh(p.nameZh);
    setAbbr(p.abbr);
    setPrimaryColor(p.primary);
    setSecondaryColor(p.secondary);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      city,
      cityZh,
      name,
      nameZh,
      abbr: abbr.toUpperCase().slice(0, 3),
      conference,
      primaryColor,
      secondaryColor
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles size={14} /> 擴張加盟審查會
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">打造你的第 31 支 NBA 王朝球隊</h2>
        <p className="text-sm text-slate-400 mt-2">
          自訂主場城市、隊名與視覺色彩，以全新擴張加盟隊的身分挑戰現有 30 支傳統勁旅！
        </p>
      </div>

      {/* 推薦擴張城市預設卡片 */}
      <div className="mb-6">
        <label className="text-xs font-bold text-slate-400 uppercase block mb-2">選擇候選城市或客製化</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {EXPANSION_CITIES.map((c, i) => (
            <button
              key={c.abbr}
              type="button"
              onClick={() => handleSelectPreset(i)}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                selectedPreset === i
                  ? 'border-amber-500 bg-amber-500/10 text-white'
                  : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-bold text-sm">{c.cityZh}</div>
                <div className="text-xs text-slate-400">{c.nameZh}</div>
              </div>
              <div
                className="w-5 h-5 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: c.primary }}
              />
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">主場城市 (中文)</label>
            <input
              type="text"
              required
              value={cityZh}
              onChange={(e) => setCityZh(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">球隊吉祥物 / 隊名 (中文)</label>
            <input
              type="text"
              required
              value={nameZh}
              onChange={(e) => setNameZh(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">球隊英文縮寫 (3碼)</label>
            <input
              type="text"
              required
              maxLength={3}
              value={abbr}
              onChange={(e) => setAbbr(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono uppercase focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">主色調</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
              />
              <span className="text-xs font-mono text-slate-400">{primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-1">所屬分區</label>
            <div className="flex rounded-lg overflow-hidden border border-slate-700">
              <button
                type="button"
                onClick={() => setConference('EAST')}
                className={`flex-1 py-2 text-xs font-bold transition ${
                  conference === 'EAST' ? 'bg-blue-600 text-white' : 'bg-slate-950 text-slate-400'
                }`}
              >
                東區 (EAST)
              </button>
              <button
                type="button"
                onClick={() => setConference('WEST')}
                className={`flex-1 py-2 text-xs font-bold transition ${
                  conference === 'WEST' ? 'bg-amber-600 text-white' : 'bg-slate-950 text-slate-400'
                }`}
              >
                西區 (WEST)
              </button>
            </div>
          </div>
        </div>

        {/* 預覽球隊徽章卡片 */}
        <div className="mt-6 p-4 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg border border-white/20"
              style={{ backgroundColor: primaryColor }}
            >
              {abbr || 'NBA'}
            </div>
            <div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {conference === 'EAST' ? '東區分部' : '西區分部'}
              </span>
              <h3 className="text-xl font-black text-white mt-0.5">
                {cityZh} {nameZh}
              </h3>
              <p className="text-xs text-slate-400">
                {city} {name} · GM: 您本人
              </p>
            </div>
          </div>
          <Award className="text-amber-500 w-8 h-8 opacity-70" />
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-base shadow-xl transition"
        >
          簽署盟約，正式進入開局選秀大會 →
        </button>
      </form>
    </div>
  );
};
