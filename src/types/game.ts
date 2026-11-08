export type Position = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export interface PlayerSkills {
  three: number;      // 三分投射 (50-99)
  mid: number;        // 中距離 (50-99)
  finishing: number;  // 上籃/禁區終結 (50-99)
  dunk: number;       // 灌籃/爆發力 (50-99)
  pass: number;       // 傳球視野 (50-99)
  defense: number;    // 防守壓迫 (50-99)
  rebound: number;    // 籃板卡位 (50-99)
  athleticism: number;// 速度與運動能力 (50-99)
}

export interface PlayerStats {
  games: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fgPct: number;
  tpPct: number;
}

export interface Player {
  id: string;
  name: string;
  nameZh: string;
  pos: Position;
  age: number;
  ovr: number;        // 綜合評分 (50-99)
  pot: number;        // 潛力上限 (50-99)
  salary: number;     // 年薪 (百萬美元，如 15.5)
  years: number;      // 合約剩餘年限 (1-5)
  teamId: string;     // 球隊 ID，或 'FA' (自由球員) 或 'DRAFT' (選秀池)
  skills: PlayerSkills;
  stats: PlayerStats;
  injuredGames: number; // 傷病缺席場次 (0 為健康)
  isStarter?: boolean;
}

export interface TeamColors {
  primary: string;
  secondary: string;
  text: string;
}

export interface Team {
  id: string;
  name: string;
  nameZh: string;
  city: string;
  cityZh: string;
  abbr: string;
  conference: 'EAST' | 'WEST';
  colors: TeamColors;
  wins: number;
  losses: number;
  playoffWins: number;
  roster: Player[];
  championships: number;
  isUser: boolean;
  draftPicks: {
    year: number;
    round: 1 | 2;
    originalTeam: string;
  }[];
}

export interface Tactics {
  pace: 'fast' | 'balanced' | 'slow';         // 節奏：跑轟、均衡、慢速陣地
  focus: 'three' | 'paint' | 'balanced' | 'star'; // 進攻重心：外線魔球、禁區內線、團隊均衡、巨星單打
  defense: 'switch' | 'drop' | 'press' | 'zone'; // 防守策略：無限換防、沉退護框、全場壓迫、區域聯防
  trainingIntensity: 'high' | 'normal' | 'light'; // 訓練強度：高強度提振手感、正常維持、輕量恢復體能
}

export interface PlayByPlayLog {
  quarter: number;
  timeRemaining: string; // e.g. "04:32"
  teamId: string;
  action: string;
  scoreHome: number;
  scoreAway: number;
  isScore: boolean;
  isHighlight?: boolean;
}

export interface GameResult {
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  logs: PlayByPlayLog[];
  topScorer: {
    nameZh: string;
    teamId: string;
    points: number;
  };
}

export interface PlayoffMatchup {
  id: string;
  round: number; // 1: 八強, 2: 分區決賽, 3: 總冠軍賽
  team1Id: string;
  team2Id: string;
  team1Wins: number;
  team2Wins: number;
  winnerId?: string;
  gameHistory: GameResult[];
}

export interface Trophy {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedYear?: number;
}

export interface SeasonHistory {
  year: number;
  wins: number;
  losses: number;
  standing: number;
  playoffResult: string;
  mvp: string;
  champion: string;
  userRosterSummary: string;
}

export type GamePhase =
  | 'WELCOME'          // 首頁簡介
  | 'TEAM_SETUP'        // 自訂擴張隊加盟
  | 'INITIAL_DRAFT'     // 開局擴張選秀
  | 'REGULAR_SEASON'    // 例行賽主頁（陣容、交易、戰績、模擬比賽）
  | 'PLAYOFFS'          // 季後賽對戰與戰術設定
  | 'GAME_SIMULATION'   // 像素球場現場模擬
  | 'OFFSEASON'         // 休賽季（成長老化、選秀、自由球員）
  | 'DYNASTY_COMPLETE'; // 二十季終局王朝評估
