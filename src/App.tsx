import React, { useState, useEffect } from 'react';
import { Team, Player, Tactics, GameResult, Trophy, SeasonHistory, GamePhase } from './types/game';
import { INITIAL_NBA_TEAMS, RAW_ROSTER_SEED, INITIAL_ACHIEVEMENTS } from './data/nbaData';
import { simulateGamesBatch } from './utils/engine';
import { WelcomeSplash } from './components/WelcomeSplash';
import { TeamSetup } from './components/TeamSetup';
import { InitialDraft } from './components/InitialDraft';
import { Standings } from './components/Standings';
import { RosterManager } from './components/RosterManager';
import { TradeCenter } from './components/TradeCenter';
import { PlayoffBracket } from './components/PlayoffBracket';
import { OffseasonHub } from './components/OffseasonHub';
import { DynastyComplete } from './components/DynastyComplete';
import { TrophiesModal } from './components/TrophiesModal';
import { Trophy as TrophyIcon, Users, Calendar, ArrowLeftRight, Home, RefreshCw, Award } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'nba_dynasty_gm_save_v1';
const TROPHIES_STORAGE_KEY = 'nba_dynasty_medals_v1';
const HISTORY_STORAGE_KEY = 'nba_dynasty_history_v1';

export const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('WELCOME');
  const [activeTab, setActiveTab] = useState<'STANDINGS' | 'ROSTER' | 'TRADE'>('STANDINGS');
  const [seasonYear, setSeasonYear] = useState<number>(1);
  const [showTrophiesModal, setShowTrophiesModal] = useState<boolean>(false);
  const [recentResults, setRecentResults] = useState<GameResult[]>([]);

  // 戰術設定
  const [tactics, setTactics] = useState<Tactics>({
    pace: 'fast',
    focus: 'balanced',
    defense: 'switch',
    trainingIntensity: 'normal'
  });

  // 勳章成就
  const [trophies, setTrophies] = useState<Trophy[]>(() => {
    const saved = localStorage.getItem(TROPHIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  // 歷屆隊史
  const [history, setHistory] = useState<SeasonHistory[]>(() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // 全部 31 隊名單 (初始為 30 隊)
  const [teams, setTeams] = useState<Team[]>(() => {
    return INITIAL_NBA_TEAMS.map((t) => {
      // 從種子庫為各隊分派真實球員
      const teamPlayers = RAW_ROSTER_SEED.filter((p) => p.teamId === t.id);
      return {
        ...t,
        roster: teamPlayers,
        draftPicks: [
          { year: 1, round: 1, originalTeam: t.id },
          { year: 1, round: 2, originalTeam: t.id }
        ]
      };
    });
  });

  // 使用者自訂擴張隊
  const [userTeam, setUserTeam] = useState<Team | null>(null);

  // 初始化儲存與載入
  useEffect(() => {
    localStorage.setItem(TROPHIES_STORAGE_KEY, JSON.stringify(trophies));
  }, [trophies]);

  useEffect(() => {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  // 檢查成就解鎖
  const unlockTrophy = (trophyId: string) => {
    setTrophies((prev) =>
      prev.map((t) => (t.id === trophyId && !t.unlocked ? { ...t, unlocked: true, unlockedYear: seasonYear } : t))
    );
  };

  // 1. 步驟：完成球隊創立
  const handleTeamSetupComplete = (info: {
    city: string;
    cityZh: string;
    name: string;
    nameZh: string;
    abbr: string;
    conference: 'EAST' | 'WEST';
    primaryColor: string;
    secondaryColor: string;
  }) => {
    const newTeam: Team = {
      id: info.abbr,
      name: info.name,
      nameZh: info.nameZh,
      city: info.city,
      cityZh: info.cityZh,
      abbr: info.abbr,
      conference: info.conference,
      colors: {
        primary: info.primaryColor,
        secondary: info.secondaryColor,
        text: '#ffffff'
      },
      wins: 0,
      losses: 0,
      playoffWins: 0,
      roster: [],
      championships: 0,
      isUser: true,
      draftPicks: [
        { year: seasonYear, round: 1, originalTeam: info.abbr },
        { year: seasonYear, round: 2, originalTeam: info.abbr }
      ]
    };

    setUserTeam(newTeam);
    setPhase('INITIAL_DRAFT');
  };

  // 2. 步驟：完成擴張選秀
  const handleInitialDraftComplete = (selectedPlayers: Player[]) => {
    if (!userTeam) return;
    const roster = selectedPlayers.map((p) => ({ ...p, teamId: userTeam.id }));
    const updatedUserTeam = { ...userTeam, roster };
    setUserTeam(updatedUserTeam);
    setTeams((prev) => [...prev.filter((t) => t.id !== userTeam.id), updatedUserTeam]);
    setPhase('REGULAR_SEASON');
    saveGameState(updatedUserTeam, [...teams.filter((t) => t.id !== userTeam.id), updatedUserTeam], seasonYear);
  };

  // 3. 步驟：例行賽模擬比賽批次
  const handleSimulateGames = (count: number) => {
    if (!userTeam) return;

    const res = simulateGamesBatch(teams, tactics, count);
    const updatedUser = res.teams.find((t) => t.isUser) || userTeam;

    setTeams(res.teams);
    setUserTeam(updatedUser);
    setRecentResults((prev) => [...res.userGameResults, ...prev].slice(0, 10));

    // 成就檢查：首勝
    if (updatedUser.wins >= 1) {
      unlockTrophy('first_win');
    }
    // 成就檢查：單季70勝
    if (updatedUser.wins >= 70) {
      unlockTrophy('record_73_wins');
    }

    saveGameState(updatedUser, res.teams, seasonYear);
  };

  // 4. 步驟：例行賽結束進入季後賽或休賽季
  const handleStartPlayoffs = () => {
    if (!userTeam) return;
    const confTeams = teams
      .filter((t) => t.conference === userTeam.conference)
      .sort((a, b) => b.wins - a.wins);
    const rank = confTeams.findIndex((t) => t.id === userTeam.id) + 1;

    if (rank <= 8) {
      unlockTrophy('playoff_bound');
      setPhase('PLAYOFFS');
    } else {
      // 未進季後賽直接進休賽季
      alert(`很遺憾，本季例行賽以分區第 ${rank} 名作收，未能擠進季後賽前八名。即將進入休賽季展開重組！`);
      recordSeasonResult('未進季後賽 (樂透區)', '塞爾提克');
      setPhase('OFFSEASON');
    }
  };

  // 5. 步驟：季後賽完賽結算
  const handleFinishPlayoffs = (wonChampionship: boolean, championTeam: Team) => {
    if (!userTeam) return;

    if (wonChampionship) {
      unlockTrophy('first_ring');
      if (userTeam.roster.reduce((a, b) => a + b.salary, 0) <= 140) {
        unlockTrophy('rebuild_master');
      }
    }

    const playoffDesc = wonChampionship ? '🏆 榮獲 NBA 總冠軍' : '止步季後賽';
    recordSeasonResult(playoffDesc, championTeam.nameZh);

    if (seasonYear >= 20) {
      unlockTrophy('twenty_seasons');
      setPhase('DYNASTY_COMPLETE');
    } else {
      setPhase('OFFSEASON');
    }
  };

  const recordSeasonResult = (playoffResult: string, champion: string) => {
    if (!userTeam) return;
    const bestUserPlayer = [...userTeam.roster].sort((a, b) => b.ovr - a.ovr)[0];
    const newRecord: SeasonHistory = {
      year: seasonYear,
      wins: userTeam.wins,
      losses: userTeam.losses,
      standing: 0,
      playoffResult,
      mvp: bestUserPlayer ? bestUserPlayer.nameZh : '聯盟球星',
      champion,
      userRosterSummary: `${userTeam.roster.length}人陣容`
    };
    setHistory((prev) => [newRecord, ...prev]);
  };

  // 6. 步驟：休賽季完成，推進下個賽季
  const handleProceedToNextSeason = (updatedTeam: Team) => {
    const nextYear = seasonYear + 1;
    setSeasonYear(nextYear);
    setUserTeam(updatedTeam);

    // 重置全部球隊戰績
    const resetTeams = teams.map((t) =>
      t.id === updatedTeam.id
        ? updatedTeam
        : {
            ...t,
            wins: 0,
            losses: 0,
            playoffWins: 0
          }
    );

    setTeams(resetTeams);
    setRecentResults([]);
    setPhase('REGULAR_SEASON');
    saveGameState(updatedTeam, resetTeams, nextYear);
  };

  // 執行跨隊球員交易
  const handleExecuteTrade = (userOut: Player[], targetTeam: Team, targetIn: Player[]) => {
    if (!userTeam) return;

    const userOutIds = userOut.map((p) => p.id);
    const targetInIds = targetIn.map((p) => p.id);

    const newUserRoster = [
      ...userTeam.roster.filter((p) => !userOutIds.includes(p.id)),
      ...targetIn.map((p) => ({ ...p, teamId: userTeam.id }))
    ];

    const newTargetRoster = [
      ...targetTeam.roster.filter((p) => !targetInIds.includes(p.id)),
      ...userOut.map((p) => ({ ...p, teamId: targetTeam.id }))
    ];

    const updatedUser = { ...userTeam, roster: newUserRoster };
    const updatedTarget = { ...targetTeam, roster: newTargetRoster };

    const updatedTeams = teams.map((t) => {
      if (t.id === userTeam.id) return updatedUser;
      if (t.id === targetTeam.id) return updatedTarget;
      return t;
    });

    setUserTeam(updatedUser);
    setTeams(updatedTeams);
    saveGameState(updatedUser, updatedTeams, seasonYear);
  };

  // 儲存與讀取功能
  const saveGameState = (uTeam: Team, allT: Team[], year: number) => {
    const payload = {
      seasonYear: year,
      userTeam: uTeam,
      teams: allT,
      tactics
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  };

  const loadExistingSave = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSeasonYear(parsed.seasonYear || 1);
        setUserTeam(parsed.userTeam);
        setTeams(parsed.teams);
        if (parsed.tactics) setTactics(parsed.tactics);
        setPhase('REGULAR_SEASON');
      } catch (e) {
        console.error('Failed to load save', e);
      }
    }
  };

  const exportSaveData = (): string => {
    const payload = {
      seasonYear,
      userTeam,
      teams,
      history,
      trophies
    };
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  };

  const handleImportSave = (code: string) => {
    const jsonStr = decodeURIComponent(escape(atob(code)));
    const parsed = JSON.parse(jsonStr);
    if (parsed.userTeam && parsed.teams) {
      setSeasonYear(parsed.seasonYear || 1);
      setUserTeam(parsed.userTeam);
      setTeams(parsed.teams);
      if (parsed.history) setHistory(parsed.history);
      if (parsed.trophies) setTrophies(parsed.trophies);
      setPhase('REGULAR_SEASON');
    }
  };

  const hasExistingSave = !!localStorage.getItem(LOCAL_STORAGE_KEY);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 頂部全域導航欄 (在進入遊戲後顯示) */}
      {userTeam && phase !== 'WELCOME' && phase !== 'TEAM_SETUP' && (
        <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            {/* 球隊識別與賽季年度 */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md border border-white/20"
                style={{ backgroundColor: userTeam.colors.primary }}
              >
                {userTeam.abbr}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-base text-white">
                    {userTeam.cityZh}{userTeam.nameZh}
                  </h1>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                    第 {seasonYear} 季
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  {userTeam.wins} 勝 - {userTeam.losses} 負 · {userTeam.conference === 'EAST' ? '東區' : '西區'}
                </div>
              </div>
            </div>

            {/* 核心分頁切換按鈕 (例行賽階段可用) */}
            {phase === 'REGULAR_SEASON' && (
              <nav className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('STANDINGS')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'STANDINGS'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Calendar size={14} /> 戰績賽程
                </button>
                <button
                  onClick={() => setActiveTab('ROSTER')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'ROSTER'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} /> 陣容輪替
                </button>
                <button
                  onClick={() => setActiveTab('TRADE')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'TRADE'
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ArrowLeftRight size={14} /> 交易中心
                </button>
              </nav>
            )}

            {/* 右側輔助工具 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTrophiesModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Award size={15} className="text-amber-400" />
                <span className="hidden sm:inline">隊史勳章</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 主畫面各階段路由 */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {phase === 'WELCOME' && (
          <WelcomeSplash
            onStartNewGame={() => setPhase('TEAM_SETUP')}
            onContinueGame={hasExistingSave ? loadExistingSave : undefined}
            hasExistingSave={hasExistingSave}
            onOpenTrophies={() => setShowTrophiesModal(true)}
          />
        )}

        {phase === 'TEAM_SETUP' && (
          <TeamSetup onComplete={handleTeamSetupComplete} />
        )}

        {phase === 'INITIAL_DRAFT' && userTeam && (
          <InitialDraft
            userTeamName={`${userTeam.cityZh}${userTeam.nameZh}`}
            onDraftComplete={handleInitialDraftComplete}
          />
        )}

        {phase === 'REGULAR_SEASON' && userTeam && (
          <>
            {activeTab === 'STANDINGS' && (
              <Standings
                teams={teams}
                userTeam={userTeam}
                tactics={tactics}
                onUpdateTactics={setTactics}
                onSimulateGames={handleSimulateGames}
                onStartPlayoffs={handleStartPlayoffs}
                recentResults={recentResults}
                seasonYear={seasonYear}
              />
            )}
            {activeTab === 'ROSTER' && (
              <RosterManager
                userTeam={userTeam}
                onUpdateRoster={(newRoster) => {
                  const updated = { ...userTeam, roster: newRoster };
                  setUserTeam(updated);
                  setTeams((prev) => prev.map((t) => (t.id === userTeam.id ? updated : t)));
                  saveGameState(updated, teams, seasonYear);
                }}
              />
            )}
            {activeTab === 'TRADE' && (
              <TradeCenter
                userTeam={userTeam}
                allTeams={teams}
                onExecuteTrade={handleExecuteTrade}
              />
            )}
          </>
        )}

        {phase === 'PLAYOFFS' && userTeam && (
          <PlayoffBracket
            teams={teams}
            userTeam={userTeam}
            tactics={tactics}
            seasonYear={seasonYear}
            onFinishPlayoffs={handleFinishPlayoffs}
          />
        )}

        {phase === 'OFFSEASON' && userTeam && (
          <OffseasonHub
            userTeam={userTeam}
            seasonYear={seasonYear}
            onProceedToNextSeason={handleProceedToNextSeason}
          />
        )}

        {phase === 'DYNASTY_COMPLETE' && userTeam && (
          <DynastyComplete
            userTeam={userTeam}
            history={history}
            trophies={trophies}
            onRestartNewDynasty={() => {
              setPhase('TEAM_SETUP');
              setSeasonYear(1);
            }}
          />
        )}
      </main>

      {/* 王朝勳章與隊史存檔彈窗 */}
      <TrophiesModal
        isOpen={showTrophiesModal}
        onClose={() => setShowTrophiesModal(false)}
        trophies={trophies}
        history={history}
        onImportSave={handleImportSave}
        exportSaveData={exportSaveData}
      />
    </div>
  );
};

export default App;
