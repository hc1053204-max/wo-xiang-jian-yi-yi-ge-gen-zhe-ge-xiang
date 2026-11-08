import { Team, Player, Tactics, GameResult, PlayByPlayLog } from '../types/game';

// 計算先發與輪替戰力值
export const calculateTeamRating = (team: Team, tactics?: Tactics): number => {
  if (!team.roster || team.roster.length === 0) return 60;

  // 排序前 5 名為先發，其餘為替補
  const sorted = [...team.roster].sort((a, b) => b.ovr - a.ovr);
  const starters = sorted.slice(0, 5);
  const bench = sorted.slice(5, 10);

  const starterAvg = starters.reduce((acc, p) => acc + (p.injuredGames > 0 ? p.ovr * 0.7 : p.ovr), 0) / Math.max(1, starters.length);
  const benchAvg = bench.length > 0
    ? bench.reduce((acc, p) => acc + (p.injuredGames > 0 ? p.ovr * 0.7 : p.ovr), 0) / bench.length
    : 65;

  let baseRating = starterAvg * 0.75 + benchAvg * 0.25;

  if (tactics) {
    if (tactics.trainingIntensity === 'high') baseRating += 1.5;
    if (tactics.trainingIntensity === 'light') baseRating -= 0.5;
  }

  return Math.round(baseRating);
};

// 產生單場比賽的即時 play-by-play 與結果
export const simulateSingleGame = (
  homeTeam: Team,
  awayTeam: Team,
  homeTactics?: Tactics,
  awayTactics?: Tactics
): GameResult => {
  const homeRating = calculateTeamRating(homeTeam, homeTactics);
  const awayRating = calculateTeamRating(awayTeam, awayTactics);

  // 主場優勢 +2
  const diff = (homeRating + 2) - awayRating;
  
  // 決定節奏與分數基準
  const isFastPaced = homeTactics?.pace === 'fast' || awayTactics?.pace === 'fast';
  const paceFactor = isFastPaced ? 1.08 : 1.0;

  const baseHome = 105 + diff * 1.2 + (Math.random() * 20 - 10);
  const baseAway = 103 - diff * 1.2 + (Math.random() * 20 - 10);

  let homeScore = Math.max(80, Math.round(baseHome * paceFactor));
  let awayScore = Math.max(80, Math.round(baseAway * paceFactor));

  // 避免平手
  if (homeScore === awayScore) {
    if (Math.random() > 0.5) homeScore += 2;
    else awayScore += 2;
  }

  // 產生 10-15 條精彩回合日誌
  const logs: PlayByPlayLog[] = [];
  const quarters = [1, 2, 3, 4];
  let curHome = Math.round(homeScore * 0.2);
  let curAway = Math.round(awayScore * 0.2);

  const homeStarters = homeTeam.roster.slice(0, 5);
  const awayStarters = awayTeam.roster.slice(0, 5);

  const getShooter = (team: Team) => {
    const pool = team.roster.slice(0, 5);
    return pool[Math.floor(Math.random() * pool.length)] || { nameZh: team.nameZh + '球員' };
  };

  const getDefender = (team: Team) => {
    const pool = team.roster.slice(0, 5);
    return pool[Math.floor(Math.random() * pool.length)] || { nameZh: team.nameZh + '防守者' };
  };

  const playTypes = [
    { type: 'three', desc: '在弧頂接球，後撤步三分起跳出手... 空心入網！', pts: 3, highlight: true },
    { type: 'dunk', desc: '切入吸引協防，突進起跳！雙手暴扣得手！', pts: 2, highlight: true },
    { type: 'jumper', desc: '中距離急停跳投，教科書般的手感，穩穩命中。', pts: 2, highlight: false },
    { type: 'floater', desc: '藉由高位擋拆擺脫防守，拋投擦板入網！', pts: 2, highlight: false },
    { type: 'block', desc: '躍起護框，空中送上一記雷霆萬鈞的麻辣火鍋！', pts: 0, highlight: true },
    { type: 'steal', desc: '精準判讀傳球路線，抄截得手發動快攻！', pts: 2, highlight: true },
    { type: 'miss', desc: '受到嚴密干擾，後仰跳投彈框而出。', pts: 0, highlight: false }
  ];

  quarters.forEach(q => {
    const eventsCount = 3;
    for (let i = 0; i < eventsCount; i++) {
      const isHomeAction = Math.random() > 0.48;
      const actingTeam = isHomeAction ? homeTeam : awayTeam;
      const defendingTeam = isHomeAction ? awayTeam : homeTeam;
      const shooter = getShooter(actingTeam);
      const defender = getDefender(defendingTeam);
      const play = playTypes[Math.floor(Math.random() * playTypes.length)];

      let actionText = '';
      if (play.type === 'block') {
        actionText = `🛡️ [${defendingTeam.abbr}] ${defender.nameZh} 躍起，給了 [${actingTeam.abbr}] ${shooter.nameZh} 一記大火鍋！`;
      } else if (play.type === 'steal') {
        actionText = `⚡ [${actingTeam.abbr}] ${shooter.nameZh} 成功抄截，一條龍快攻上籃命中！`;
      } else if (play.pts > 0) {
        actionText = `🎯 [${actingTeam.abbr}] ${shooter.nameZh} ${play.desc}`;
      } else {
        actionText = `❌ [${actingTeam.abbr}] ${shooter.nameZh} ${play.desc}`;
      }

      if (isHomeAction) {
        curHome = Math.min(homeScore, curHome + play.pts);
      } else {
        curAway = Math.min(awayScore, curAway + play.pts);
      }

      logs.push({
        quarter: q,
        timeRemaining: `0${Math.floor(Math.random() * 9)}:${Math.floor(10 + Math.random() * 49)}`,
        teamId: actingTeam.id,
        action: actionText,
        scoreHome: curHome,
        scoreAway: curAway,
        isScore: play.pts > 0,
        isHighlight: play.highlight
      });
    }
  });

  // 最終比分寫入最後一刻
  logs.push({
    quarter: 4,
    timeRemaining: '00:00',
    teamId: homeScore > awayScore ? homeTeam.id : awayTeam.id,
    action: `🏁 全場比賽結束！[${homeTeam.abbr}] ${homeScore} : ${awayScore} [${awayTeam.abbr}]。`,
    scoreHome: homeScore,
    scoreAway: awayScore,
    isScore: false,
    isHighlight: true
  });

  // 分配球員數據
  const winningTeam = homeScore > awayScore ? homeTeam : awayTeam;
  const bestPlayer = winningTeam.roster[0] || { nameZh: '王牌球員' };
  const topPoints = Math.floor(24 + Math.random() * 18);

  return {
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    homeScore,
    awayScore,
    logs,
    topScorer: {
      nameZh: bestPlayer.nameZh,
      teamId: winningTeam.id,
      points: topPoints
    }
  };
};

// 快速模擬多場例行賽
export const simulateGamesBatch = (
  teams: Team[],
  userTactics: Tactics,
  gamesPerTeam: number = 5
): { teams: Team[]; userGameResults: GameResult[] } => {
  const updatedTeams = teams.map(t => ({ ...t, roster: [...t.roster] }));
  const userResults: GameResult[] = [];
  const userTeam = updatedTeams.find(t => t.isUser);

  for (let round = 0; round < gamesPerTeam; round++) {
    // 兩兩配對對戰
    const shuffled = [...updatedTeams].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      const home = shuffled[i];
      const away = shuffled[i + 1];
      if (!home || !away) continue;

      const isHomeUser = home.isUser;
      const isAwayUser = away.isUser;

      const res = simulateSingleGame(
        home,
        away,
        isHomeUser ? userTactics : undefined,
        isAwayUser ? userTactics : undefined
      );

      if (res.homeScore > res.awayScore) {
        home.wins += 1;
        away.losses += 1;
      } else {
        away.wins += 1;
        home.losses += 1;
      }

      // 更新球員個人例行賽平均累計數據
      [home, away].forEach((t, tIdx) => {
        const teamScore = tIdx === 0 ? res.homeScore : res.awayScore;
        t.roster.slice(0, 8).forEach((p, pIdx) => {
          p.stats.games += 1;
          const ptsShare = pIdx === 0 ? 0.28 : pIdx === 1 ? 0.22 : pIdx === 2 ? 0.16 : 0.1;
          const gamePts = Math.round(teamScore * ptsShare * (0.85 + Math.random() * 0.3));
          p.stats.pts = Number(((p.stats.pts * (p.stats.games - 1) + gamePts) / p.stats.games).toFixed(1));
          
          const gameReb = Math.round((p.skills.rebound / 10) * (0.8 + Math.random() * 0.4));
          p.stats.reb = Number(((p.stats.reb * (p.stats.games - 1) + gameReb) / p.stats.games).toFixed(1));

          const gameAst = Math.round((p.skills.pass / 12) * (0.8 + Math.random() * 0.4));
          p.stats.ast = Number(((p.stats.ast * (p.stats.games - 1) + gameAst) / p.stats.games).toFixed(1));

          // 傷病隨機觸發 (機率約 1.5%)
          if (p.injuredGames > 0) {
            p.injuredGames = Math.max(0, p.injuredGames - 1);
          } else if (Math.random() < 0.015) {
            p.injuredGames = Math.floor(3 + Math.random() * 7); // 缺席 3-10 場
          }
        });
      });

      if (isHomeUser || isAwayUser) {
        userResults.push(res);
      }
    }
  }

  return { teams: updatedTeams, userGameResults: userResults };
};

// 季末球員成長與老化機制 (Progression & Regression)
export const processPlayerProgression = (player: Player): { player: Player; change: number } => {
  let change = 0;
  if (player.age <= 23) {
    // 年輕新秀成長期：潛力越高、成長越快
    const gap = player.pot - player.ovr;
    change = Math.max(1, Math.min(6, Math.floor(gap * 0.35 + Math.random() * 2)));
  } else if (player.age <= 28) {
    // 黃金顛峰期：小幅進步或微調維持
    if (player.ovr < player.pot) {
      change = Math.floor(Math.random() * 3);
    } else {
      change = Math.floor(Math.random() * 2) - 1; // -1, 0, +1
    }
  } else if (player.age <= 33) {
    // 30歲後開始緩慢退化
    change = -Math.floor(1 + Math.random() * 2);
  } else {
    // 34歲以上大幅衰退
    change = -Math.floor(2 + Math.random() * 3);
  }

  const newOvr = Math.max(55, Math.min(99, player.ovr + change));
  const newSkills = { ...player.skills };
  
  // 同步微調各項技能
  Object.keys(newSkills).forEach(k => {
    const key = k as keyof typeof newSkills;
    newSkills[key] = Math.max(50, Math.min(99, newSkills[key] + change));
  });

  return {
    player: {
      ...player,
      age: player.age + 1,
      ovr: newOvr,
      skills: newSkills,
      years: Math.max(0, player.years - 1),
      injuredGames: 0,
      stats: {
        games: 0,
        pts: 0,
        reb: 0,
        ast: 0,
        stl: 0,
        blk: 0,
        fgPct: 0.46,
        tpPct: 0.36
      }
    },
    change
  };
};

// 計算球隊薪資總額
export const calculateTotalSalary = (roster: Player[]): number => {
  return Number(roster.reduce((acc, p) => acc + p.salary, 0).toFixed(1));
};

// 評估交易價值
export const calculatePlayerTradeValue = (p: Player): number => {
  const potBonus = Math.max(0, p.pot - p.ovr) * 1.5;
  const agePenalty = p.age > 30 ? (p.age - 30) * 4 : 0;
  return Math.round(p.ovr * 1.2 + potBonus - agePenalty);
};
