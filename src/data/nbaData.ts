import { Team, Player, Position, Trophy } from '../types/game';

export const INITIAL_NBA_TEAMS: Omit<Team, 'roster' | 'draftPicks'>[] = [
  // 東區聯盟 EAST
  { id: 'BOS', name: 'Celtics', nameZh: '塞爾提克', city: 'Boston', cityZh: '波士頓', abbr: 'BOS', conference: 'EAST', colors: { primary: '#007A33', secondary: '#BA9653', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 18, isUser: false },
  { id: 'NYK', name: 'Knicks', nameZh: '尼克', city: 'New York', cityZh: '紐約', abbr: 'NYK', conference: 'EAST', colors: { primary: '#006BB6', secondary: '#F58426', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 2, isUser: false },
  { id: 'MIL', name: 'Bucks', nameZh: '公鹿', city: 'Milwaukee', cityZh: '密爾瓦基', abbr: 'MIL', conference: 'EAST', colors: { primary: '#00471B', secondary: '#EEE1C6', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 2, isUser: false },
  { id: 'CLE', name: 'Cavaliers', nameZh: '騎士', city: 'Cleveland', cityZh: '克里夫蘭', abbr: 'CLE', conference: 'EAST', colors: { primary: '#860038', secondary: '#FDBB30', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false },
  { id: 'PHI', name: '76ers', nameZh: '七六人', city: 'Philadelphia', cityZh: '費城', abbr: 'PHI', conference: 'EAST', colors: { primary: '#006BB6', secondary: '#ED174C', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 3, isUser: false },
  { id: 'IND', name: 'Pacers', nameZh: '溜馬', city: 'Indiana', cityZh: '印第安那', abbr: 'IND', conference: 'EAST', colors: { primary: '#002D62', secondary: '#FDBB30', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'MIA', name: 'Heat', nameZh: '熱火', city: 'Miami', cityZh: '邁阿密', abbr: 'MIA', conference: 'EAST', colors: { primary: '#98002E', secondary: '#F9A01B', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 3, isUser: false },
  { id: 'ORL', name: 'Magic', nameZh: '魔術', city: 'Orlando', cityZh: '奧蘭多', abbr: 'ORL', conference: 'EAST', colors: { primary: '#0077C0', secondary: '#C4CED4', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'ATL', name: 'Hawks', nameZh: '老鷹', city: 'Atlanta', cityZh: '亞特蘭大', abbr: 'ATL', conference: 'EAST', colors: { primary: '#E03A3E', secondary: '#C1D32F', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false },
  { id: 'CHI', name: 'Bulls', nameZh: '公牛', city: 'Chicago', cityZh: '芝加哥', abbr: 'CHI', conference: 'EAST', colors: { primary: '#CE1141', secondary: '#000000', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 6, isUser: false },
  { id: 'TOR', name: 'Raptors', nameZh: '暴龍', city: 'Toronto', cityZh: '多倫多', abbr: 'TOR', conference: 'EAST', colors: { primary: '#CE1141', secondary: '#000000', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false },
  { id: 'BKN', name: 'Nets', nameZh: '籃網', city: 'Brooklyn', cityZh: '布魯克林', abbr: 'BKN', conference: 'EAST', colors: { primary: '#000000', secondary: '#FFFFFF', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'DET', name: 'Pistons', nameZh: '活塞', city: 'Detroit', cityZh: '底特律', abbr: 'DET', conference: 'EAST', colors: { primary: '#1D42BA', secondary: '#C8102E', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 3, isUser: false },
  { id: 'CHA', name: 'Hornets', nameZh: '黃蜂', city: 'Charlotte', cityZh: '夏洛特', abbr: 'CHA', conference: 'EAST', colors: { primary: '#1D1160', secondary: '#00788C', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'WAS', name: 'Wizards', nameZh: '巫師', city: 'Washington', cityZh: '華盛頓', abbr: 'WAS', conference: 'EAST', colors: { primary: '#002B5C', secondary: '#E31837', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false },

  // 西區聯盟 WEST
  { id: 'OKC', name: 'Thunder', nameZh: '雷霆', city: 'Oklahoma City', cityZh: '奧克拉荷馬', abbr: 'OKC', conference: 'WEST', colors: { primary: '#007AC1', secondary: '#EF3B24', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false },
  { id: 'DEN', name: 'Nuggets', nameZh: '金塊', city: 'Denver', cityZh: '丹佛', abbr: 'DEN', conference: 'WEST', colors: { primary: '#0E2240', secondary: '#FEC524', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false },
  { id: 'MIN', name: 'Timberwolves', nameZh: '灰狼', city: 'Minnesota', cityZh: '明尼蘇達', abbr: 'MIN', conference: 'WEST', colors: { primary: '#0C2340', secondary: '#236192', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'DAL', name: 'Mavericks', nameZh: '獨行俠', city: 'Dallas', cityZh: '達拉斯', abbr: 'DAL', conference: 'WEST', colors: { primary: '#00538C', secondary: '#002B5E', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false },
  { id: 'LAL', name: 'Lakers', nameZh: '湖人', city: 'Los Angeles', cityZh: '洛杉磯', abbr: 'LAL', conference: 'WEST', colors: { primary: '#552583', secondary: '#FDB927', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 17, isUser: false },
  { id: 'GSW', name: 'Warriors', nameZh: '勇士', city: 'Golden State', cityZh: '金州', abbr: 'GSW', conference: 'WEST', colors: { primary: '#1D428A', secondary: '#FFC72C', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 7, isUser: false },
  { id: 'PHX', name: 'Suns', nameZh: '太陽', city: 'Phoenix', cityZh: '鳳凰城', abbr: 'PHX', conference: 'WEST', colors: { primary: '#1D1160', secondary: '#E56020', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'LAC', name: 'Clippers', nameZh: '快艇', city: 'LA Clippers', cityZh: '快艇', abbr: 'LAC', conference: 'WEST', colors: { primary: '#C8102E', secondary: '#1D428A', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'NOP', name: 'Pelicans', nameZh: '鵜鶘', city: 'New Orleans', cityZh: '紐奧良', abbr: 'NOP', conference: 'WEST', colors: { primary: '#0C2340', secondary: '#C8102E', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'SAC', name: 'Kings', nameZh: '國王', city: 'Sacramento', cityZh: '沙加緬度', abbr: 'SAC', conference: 'WEST', colors: { primary: '#5A2D81', secondary: '#63727A', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false },
  { id: 'HOU', name: 'Rockets', nameZh: '火箭', city: 'Houston', cityZh: '休士頓', abbr: 'HOU', conference: 'WEST', colors: { primary: '#CE1141', secondary: '#000000', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 2, isUser: false },
  { id: 'MEM', name: 'Grizzlies', nameZh: '灰熊', city: 'Memphis', cityZh: '曼菲斯', abbr: 'MEM', conference: 'WEST', colors: { primary: '#5D76A9', secondary: '#12173F', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'SAS', name: 'Spurs', nameZh: '馬刺', city: 'San Antonio', cityZh: '聖安東尼奧', abbr: 'SAS', conference: 'WEST', colors: { primary: '#C4CED4', secondary: '#000000', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 5, isUser: false },
  { id: 'UTA', name: 'Jazz', nameZh: '爵士', city: 'Utah', cityZh: '猶他', abbr: 'UTA', conference: 'WEST', colors: { primary: '#002B5C', secondary: '#00471B', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 0, isUser: false },
  { id: 'POR', name: 'Trail Blazers', nameZh: '拓荒者', city: 'Portland', cityZh: '波特蘭', abbr: 'POR', conference: 'WEST', colors: { primary: '#E03A3E', secondary: '#000000', text: '#ffffff' }, wins: 0, losses: 0, playoffWins: 0, championships: 1, isUser: false }
];

export const EXPANSION_CITIES = [
  { city: 'Taipei', cityZh: '台北', name: 'Bears', nameZh: '黑熊隊', abbr: 'TPE', primary: '#10b981', secondary: '#064e3b' },
  { city: 'Seattle', cityZh: '西雅圖', name: 'Supersonics', nameZh: '超音速隊', abbr: 'SEA', primary: '#15803d', secondary: '#facc15' },
  { city: 'Las Vegas', cityZh: '拉斯維加斯', name: 'Outlaws', nameZh: '暴徒隊', abbr: 'LVO', primary: '#b45309', secondary: '#18181b' },
  { city: 'Vancouver', cityZh: '溫哥華', name: 'Grizzlies', nameZh: '白熊隊', abbr: 'VAN', primary: '#0ea5e9', secondary: '#0f172a' },
  { city: 'Tokyo', cityZh: '東京', name: 'Samurais', nameZh: '武士隊', abbr: 'TYO', primary: '#e11d48', secondary: '#0f172a' },
  { city: 'Mexico City', cityZh: '墨西哥城', name: 'Aztecs', nameZh: '阿茲特克', abbr: 'MEX', primary: '#047857', secondary: '#b91c1c' }
];

const createPlayerHelper = (
  id: string,
  name: string,
  nameZh: string,
  pos: Position,
  age: number,
  ovr: number,
  pot: number,
  salary: number,
  years: number,
  teamId: string,
  skillsBias: Partial<Player['skills']> = {}
): Player => {
  const base = ovr;
  const skills = {
    three: Math.min(99, Math.max(50, Math.round(base + (pos === 'PG' || pos === 'SG' ? 4 : -6) + (Math.random() * 8 - 4)))),
    mid: Math.min(99, Math.max(50, Math.round(base + (Math.random() * 6 - 3)))),
    finishing: Math.min(99, Math.max(50, Math.round(base + (pos === 'C' || pos === 'PF' ? 5 : 0) + (Math.random() * 6 - 3)))),
    dunk: Math.min(99, Math.max(50, Math.round(base + (pos === 'SF' || pos === 'PF' || pos === 'C' ? 6 : -8) + (Math.random() * 8 - 4)))),
    pass: Math.min(99, Math.max(50, Math.round(base + (pos === 'PG' ? 8 : -5) + (Math.random() * 6 - 3)))),
    defense: Math.min(99, Math.max(50, Math.round(base + (Math.random() * 8 - 4)))),
    rebound: Math.min(99, Math.max(50, Math.round(base + (pos === 'C' ? 10 : pos === 'PF' ? 6 : -10) + (Math.random() * 6 - 3)))),
    athleticism: Math.min(99, Math.max(50, Math.round(base - (age > 33 ? (age - 33) * 2 : 0) + (Math.random() * 6 - 3)))),
    ...skillsBias
  };

  return {
    id,
    name,
    nameZh,
    pos,
    age,
    ovr,
    pot,
    salary,
    years,
    teamId,
    skills,
    stats: {
      games: 0,
      pts: 0,
      reb: 0,
      ast: 0,
      stl: 0,
      blk: 0,
      fgPct: 0.46,
      tpPct: 0.36
    },
    injuredGames: 0
  };
};

export const RAW_ROSTER_SEED: Player[] = [
  // 聯盟超級巨星與核心球員
  createPlayerHelper('jokic', 'Nikola Jokic', '約基奇', 'C', 29, 98, 98, 51.4, 4, 'DEN', { pass: 98, rebound: 96, mid: 95, finishing: 97, three: 84 }),
  createPlayerHelper('luka', 'Luka Doncic', '唐西奇', 'PG', 25, 97, 99, 43.0, 3, 'DAL', { pass: 97, three: 92, mid: 94, finishing: 95, athleticism: 85 }),
  createPlayerHelper('giannis', 'Giannis Antetokounmpo', '安戴托昆波', 'PF', 29, 97, 98, 48.7, 3, 'MIL', { dunk: 99, finishing: 98, defense: 95, athleticism: 96, three: 68 }),
  createPlayerHelper('sga', 'Shai Gilgeous-Alexander', '亞歷山大', 'PG', 26, 96, 98, 35.8, 3, 'OKC', { mid: 98, finishing: 96, defense: 91, pass: 90, three: 87 }),
  createPlayerHelper('embiid', 'Joel Embiid', '恩比德', 'C', 30, 96, 96, 51.4, 3, 'PHI', { mid: 95, finishing: 96, defense: 93, rebound: 95, three: 80 }),
  createPlayerHelper('tatum', 'Jayson Tatum', '泰坦', 'SF', 26, 95, 97, 34.8, 4, 'BOS', { three: 91, defense: 90, finishing: 92, athleticism: 92 }),
  createPlayerHelper('curry', 'Stephen Curry', '柯瑞', 'PG', 36, 95, 95, 55.7, 2, 'GSW', { three: 99, mid: 97, pass: 92, finishing: 90, athleticism: 83 }),
  createPlayerHelper('lebron', 'LeBron James', '詹姆斯', 'SF', 39, 95, 95, 48.7, 2, 'LAL', { pass: 96, dunk: 92, finishing: 95, athleticism: 86, defense: 88 }),
  createPlayerHelper('edwards', 'Anthony Edwards', '愛德華茲', 'SG', 23, 94, 98, 35.2, 5, 'MIN', { dunk: 97, athleticism: 96, three: 89, defense: 89 }),
  createPlayerHelper('wemby', 'Victor Wembanyama', '溫班亞瑪', 'C', 20, 92, 99, 12.7, 3, 'SAS', { defense: 97, rebound: 93, dunk: 95, three: 84, athleticism: 90 }),
  createPlayerHelper('durant', 'Kevin Durant', '杜蘭特', 'PF', 35, 94, 94, 51.1, 2, 'PHX', { mid: 98, three: 93, finishing: 92, defense: 87 }),
  createPlayerHelper('davis', 'Anthony Davis', '戴維斯', 'C', 31, 94, 95, 43.2, 3, 'LAL', { defense: 96, rebound: 95, finishing: 94, dunk: 92 }),
  createPlayerHelper('brunson', 'Jalen Brunson', '布朗森', 'PG', 27, 93, 95, 24.9, 4, 'NYK', { mid: 95, three: 90, pass: 89, finishing: 91 }),
  createPlayerHelper('booker', 'Devin Booker', '布克', 'SG', 27, 93, 95, 49.3, 4, 'PHX', { mid: 96, three: 91, finishing: 89, pass: 87 }),
  createPlayerHelper('brown', 'Jaylen Brown', '布朗', 'SG', 27, 92, 94, 49.7, 5, 'BOS', { dunk: 93, defense: 91, finishing: 91, three: 86 }),
  createPlayerHelper('mitchell', 'Donovan Mitchell', '米契爾', 'SG', 27, 92, 94, 35.4, 3, 'CLE', { three: 91, dunk: 93, finishing: 90, pass: 86 }),
  createPlayerHelper('haliburton', 'Tyrese Haliburton', '哈利伯頓', 'PG', 24, 91, 96, 35.2, 5, 'IND', { pass: 97, three: 91, mid: 88, finishing: 85 }),
  createPlayerHelper('morant', 'Ja Morant', '莫蘭特', 'PG', 25, 91, 95, 36.7, 4, 'MEM', { dunk: 97, athleticism: 98, finishing: 92, pass: 89, three: 80 }),
  createPlayerHelper('maxey', 'Tyrese Maxey', '馬克西', 'PG', 23, 90, 95, 35.1, 5, 'PHI', { three: 91, athleticism: 96, finishing: 89, pass: 86 }),
  createPlayerHelper('banchero', 'Paolo Banchero', '班切羅', 'PF', 21, 90, 97, 11.6, 2, 'ORL', { finishing: 91, pass: 87, rebound: 88, mid: 88 }),
  createPlayerHelper('holmgren', 'Chet Holmgren', '霍姆格倫', 'C', 22, 89, 96, 10.8, 2, 'OKC', { defense: 93, three: 87, rebound: 89, finishing: 87 }),
  createPlayerHelper('adebayo', 'Bam Adebayo', '阿德巴約', 'C', 27, 90, 93, 34.8, 3, 'MIA', { defense: 94, rebound: 92, pass: 88, finishing: 88 }),
  createPlayerHelper('butler', 'Jimmy Butler', '巴特勒', 'SF', 34, 90, 90, 48.7, 2, 'MIA', { defense: 92, mid: 90, finishing: 91, pass: 87 }),
  createPlayerHelper('sabonis', 'Domantas Sabonis', '沙波尼斯', 'C', 28, 90, 92, 40.5, 4, 'SAC', { rebound: 96, pass: 92, finishing: 90, mid: 83 }),
  createPlayerHelper('fox', 'DeAaron Fox', '福克斯', 'PG', 26, 90, 93, 34.8, 2, 'SAC', { athleticism: 98, mid: 90, finishing: 91, three: 85 }),
  createPlayerHelper('murray_jamal', 'Jamal Murray', '莫瑞', 'PG', 27, 88, 91, 36.0, 4, 'DEN', { three: 90, mid: 91, finishing: 88, pass: 86 }),
  createPlayerHelper('trae', 'Trae Young', '楊恩', 'PG', 25, 89, 93, 43.0, 3, 'ATL', { three: 93, pass: 95, finishing: 86, defense: 65 }),
  createPlayerHelper('gobert', 'Rudy Gobert', '戈貝爾', 'C', 32, 88, 88, 43.8, 2, 'MIN', { defense: 96, rebound: 95, finishing: 86, three: 50 }),
  createPlayerHelper('towns', 'Karl-Anthony Towns', '唐斯', 'C', 28, 89, 91, 49.3, 4, 'NYK', { three: 92, rebound: 90, mid: 89, finishing: 89 }),
  createPlayerHelper('george', 'Paul George', '喬治', 'SF', 34, 89, 89, 49.2, 4, 'PHI', { three: 90, defense: 89, mid: 88, finishing: 86 }),
  createPlayerHelper('harden', 'James Harden', '哈登', 'PG', 35, 88, 88, 35.0, 2, 'LAC', { pass: 94, three: 88, mid: 87, finishing: 86 }),
  createPlayerHelper('kawhi', 'Kawhi Leonard', '雷納德', 'SF', 33, 91, 91, 49.2, 3, 'LAC', { defense: 95, mid: 95, three: 89, finishing: 90 }),
  createPlayerHelper('zion', 'Zion Williamson', '威廉森', 'PF', 24, 89, 94, 36.7, 4, 'NOP', { dunk: 98, finishing: 96, athleticism: 94, rebound: 87, three: 60 }),
  createPlayerHelper('ingram', 'Brandon Ingram', '英格拉姆', 'SF', 26, 87, 90, 36.0, 2, 'NOP', { mid: 92, three: 86, finishing: 87, pass: 85 }),
  createPlayerHelper('sengun', 'Alperen Sengun', '申京', 'C', 22, 88, 95, 35.0, 5, 'HOU', { pass: 90, rebound: 91, finishing: 90, mid: 84 }),
  createPlayerHelper('green_jalen', 'Jalen Green', '格林', 'SG', 22, 86, 93, 12.4, 3, 'HOU', { dunk: 95, athleticism: 96, three: 86, finishing: 87 }),
  createPlayerHelper('barnes_scottie', 'Scottie Barnes', '巴恩斯', 'PF', 23, 88, 94, 38.6, 5, 'TOR', { defense: 89, rebound: 88, pass: 87, finishing: 88 }),
  createPlayerHelper('cunningham', 'Cade Cunningham', '康寧漢', 'PG', 23, 88, 95, 13.9, 5, 'DET', { pass: 92, mid: 88, three: 87, finishing: 87 }),
  createPlayerHelper('ball_lamelo', 'LaMelo Ball', '博爾', 'PG', 23, 88, 94, 35.1, 5, 'CHA', { pass: 94, three: 90, finishing: 86, athleticism: 88 }),
  createPlayerHelper('markkanen', 'Lauri Markkanen', '馬卡南', 'PF', 27, 88, 90, 42.0, 4, 'UTA', { three: 92, mid: 88, rebound: 88, finishing: 87 }),

  // 優質先發與角色球員
  createPlayerHelper('white_derrick', 'Derrick White', '懷特', 'PG', 30, 87, 87, 28.1, 4, 'BOS', { defense: 91, three: 88, pass: 86 }),
  createPlayerHelper('holiday', 'Jrue Holiday', '哈勒戴', 'PG', 34, 87, 87, 30.0, 4, 'BOS', { defense: 95, three: 87, pass: 86 }),
  createPlayerHelper('porzingis', 'Kristaps Porzingis', '波辛吉斯', 'C', 29, 87, 88, 29.3, 2, 'BOS', { three: 88, defense: 90, finishing: 86 }),
  createPlayerHelper('anunoby', 'OG Anunoby', '阿奴諾比', 'SF', 27, 86, 88, 36.6, 5, 'NYK', { defense: 94, three: 88 }),
  createPlayerHelper('bridges_mikal', 'Mikal Bridges', '布里吉斯', 'SG', 28, 86, 88, 23.3, 2, 'NYK', { defense: 91, three: 88, mid: 86 }),
  createPlayerHelper('lillard', 'Damian Lillard', '里拉德', 'PG', 34, 88, 88, 48.7, 3, 'MIL', { three: 94, mid: 90, finishing: 87 }),
  createPlayerHelper('middleton', 'Khris Middleton', '米德爾頓', 'SF', 33, 85, 85, 31.0, 2, 'MIL', { mid: 90, three: 87 }),
  createPlayerHelper('garland', 'Darius Garland', '賈蘭德', 'PG', 24, 86, 91, 36.7, 4, 'CLE', { three: 89, pass: 89 }),
  createPlayerHelper('mobley', 'Evan Mobley', '莫布里', 'PF', 23, 87, 95, 11.2, 5, 'CLE', { defense: 94, rebound: 89, finishing: 87 }),
  createPlayerHelper('allen_jarrett', 'Jarrett Allen', '艾倫', 'C', 26, 86, 88, 20.0, 3, 'CLE', { rebound: 92, defense: 91, dunk: 90 }),
  createPlayerHelper('siakam', 'Pascal Siakam', '席亞康', 'PF', 30, 87, 87, 42.2, 4, 'IND', { mid: 88, finishing: 89, defense: 86 }),
  createPlayerHelper('turner_myles', 'Myles Turner', '透納', 'C', 28, 84, 85, 19.9, 1, 'IND', { defense: 91, three: 85 }),
  createPlayerHelper('herro', 'Tyler Herro', '希羅', 'SG', 24, 85, 89, 29.0, 3, 'MIA', { three: 89, mid: 87 }),
  createPlayerHelper('wagner_franz', 'Franz Wagner', '瓦格納', 'SF', 23, 87, 93, 38.6, 5, 'ORL', { finishing: 88, defense: 87, three: 85 }),
  createPlayerHelper('suggs', 'Jalen Suggs', '薩格斯', 'SG', 23, 85, 91, 30.0, 5, 'ORL', { defense: 93, three: 86 }),
  createPlayerHelper('johnson_jalen', 'Jalen Johnson', '強森', 'PF', 22, 85, 92, 30.0, 5, 'ATL', { athleticism: 92, rebound: 87 }),
  createPlayerHelper('lavine', 'Zach LaVine', '拉文', 'SG', 29, 84, 85, 43.0, 3, 'CHI', { dunk: 95, three: 88, athleticism: 92 }),
  createPlayerHelper('white_coby', 'Coby White', '懷特', 'PG', 24, 84, 88, 12.0, 2, 'CHI', { three: 88, mid: 85 }),
  createPlayerHelper('quickley', 'Immanuel Quickley', '奎克利', 'PG', 25, 85, 89, 32.5, 5, 'TOR', { three: 88, pass: 85 }),
  createPlayerHelper('claxton', 'Nic Claxton', '克拉克斯頓', 'C', 25, 84, 87, 24.2, 4, 'BKN', { defense: 91, rebound: 89 }),
  createPlayerHelper('duren', 'Jalen Duren', '杜倫', 'C', 20, 84, 93, 4.5, 2, 'DET', { rebound: 93, dunk: 92 }),
  createPlayerHelper('miller_brandon', 'Brandon Miller', '米勒', 'SF', 21, 85, 94, 11.4, 3, 'CHA', { three: 89, mid: 87 }),
  createPlayerHelper('poole', 'Jordan Poole', '普爾', 'SG', 25, 82, 85, 29.6, 3, 'WAS', { three: 86, finishing: 84 }),
  createPlayerHelper('kuzma', 'Kyle Kuzma', '庫茲馬', 'PF', 29, 83, 83, 23.5, 3, 'WAS', { mid: 85, rebound: 84 }),

  // 西區深度名單
  createPlayerHelper('williams_jalen', 'Jalen Williams', '威廉斯', 'SF', 23, 88, 95, 4.7, 2, 'OKC', { mid: 89, defense: 88, finishing: 89 }),
  createPlayerHelper('caruso', 'Alex Caruso', '卡魯索', 'SG', 30, 84, 84, 9.8, 1, 'OKC', { defense: 95, three: 85 }),
  createPlayerHelper('porter_michael', 'Michael Porter Jr.', '波特', 'SF', 26, 85, 88, 35.8, 3, 'DEN', { three: 91, rebound: 85 }),
  createPlayerHelper('gordon_aaron', 'Aaron Gordon', '戈登', 'PF', 29, 85, 85, 22.8, 2, 'DEN', { dunk: 96, defense: 89, athleticism: 91 }),
  createPlayerHelper('mcdaniels', 'Jaden McDaniels', '麥克丹尼爾斯', 'SF', 24, 84, 89, 22.6, 5, 'MIN', { defense: 94, three: 85 }),
  createPlayerHelper('reid_naz', 'Naz Reid', '里德', 'C', 25, 84, 87, 13.9, 2, 'MIN', { three: 87, finishing: 86 }),
  createPlayerHelper('irving', 'Kyrie Irving', '厄文', 'SG', 32, 91, 91, 41.0, 2, 'DAL', { finishing: 96, three: 92, mid: 95, pass: 89 }),
  createPlayerHelper('lively', 'Dereck Lively II', '萊福利', 'C', 20, 83, 93, 5.0, 3, 'DAL', { defense: 89, dunk: 90, rebound: 88 }),
  createPlayerHelper('reaves', 'Austin Reaves', '里夫斯', 'SG', 26, 84, 87, 12.9, 3, 'LAL', { mid: 87, pass: 86, three: 86 }),
  createPlayerHelper('kuminga', 'Jonathan Kuminga', '庫明加', 'PF', 22, 84, 92, 7.6, 1, 'GSW', { dunk: 94, athleticism: 94, finishing: 86 }),
  createPlayerHelper('green_draymond', 'Draymond Green', '格林', 'PF', 34, 84, 84, 24.1, 3, 'GSW', { defense: 94, pass: 90, rebound: 86 }),
  createPlayerHelper('beal', 'Bradley Beal', '比爾', 'SG', 31, 85, 85, 50.2, 3, 'PHX', { mid: 88, three: 87 }),
  createPlayerHelper('zubac', 'Ivica Zubac', '祖巴茨', 'C', 27, 84, 86, 11.7, 3, 'LAC', { rebound: 91, defense: 87 }),
  createPlayerHelper('murray_dejounte', 'Dejounte Murray', '莫瑞', 'PG', 28, 86, 88, 25.5, 4, 'NOP', { defense: 90, pass: 88, mid: 86 }),
  createPlayerHelper('mccollum', 'CJ McCollum', '麥卡倫', 'SG', 33, 83, 83, 33.3, 2, 'NOP', { three: 89, mid: 88 }),
  createPlayerHelper('derozan', 'DeMar DeRozan', '德羅展', 'SF', 35, 85, 85, 23.3, 3, 'SAC', { mid: 95, finishing: 88, pass: 86 }),
  createPlayerHelper('monk', 'Malik Monk', '蒙克', 'SG', 26, 84, 86, 17.4, 4, 'SAC', { three: 88, athleticism: 89 }),
  createPlayerHelper('vanvleet', 'Fred VanVleet', '范弗利特', 'PG', 30, 84, 84, 42.8, 2, 'HOU', { defense: 87, three: 87, pass: 87 }),
  createPlayerHelper('thompson_amen', 'Amen Thompson', '湯普森', 'SG', 21, 84, 94, 9.2, 3, 'HOU', { athleticism: 97, defense: 90, dunk: 92 }),
  createPlayerHelper('jackson_jaren', 'Jaren Jackson Jr.', '傑克森', 'PF', 25, 88, 92, 25.2, 2, 'MEM', { defense: 95, three: 85, dunk: 88 }),
  createPlayerHelper('bane', 'Desmond Bane', '貝恩', 'SG', 26, 87, 89, 34.0, 5, 'MEM', { three: 93, mid: 88 }),
  createPlayerHelper('vassell', 'Devin Vassell', '瓦塞爾', 'SG', 24, 85, 90, 29.3, 5, 'SAS', { three: 89, mid: 87 }),
  createPlayerHelper('george_keyonte', 'Keyonte George', '喬治', 'PG', 21, 82, 91, 4.0, 3, 'UTA', { three: 87, pass: 85 }),
  createPlayerHelper('sexton', 'Collin Sexton', '塞克斯頓', 'SG', 25, 83, 86, 18.1, 2, 'UTA', { athleticism: 91, finishing: 86 }),
  createPlayerHelper('sharpe', 'Shaedon Sharpe', '夏普', 'SG', 21, 83, 93, 6.6, 2, 'POR', { dunk: 96, athleticism: 95, three: 86 }),
  createPlayerHelper('scoot', 'Scoot Henderson', '亨德森', 'PG', 20, 82, 93, 10.2, 3, 'POR', { athleticism: 94, pass: 86 }),
  createPlayerHelper('ayton', 'Deandre Ayton', '艾頓', 'C', 26, 83, 85, 34.0, 2, 'POR', { mid: 86, rebound: 89, finishing: 86 })
];

// 產生選秀大會新人庫
export const generateDraftClass = (year: number): Player[] => {
  const firstNames = ['Marcus', 'Jaylen', 'Elijah', 'Trevon', 'Darius', 'Koa', 'Julian', 'Isaiah', 'Xavier', 'Mateo', 'Kobe', 'Zion', 'Tyler', 'Noah', 'Jaxson'];
  const lastNames = ['Sterling', 'Cross', 'Hampton', 'Vaughn', 'Mercer', 'Bishop', 'Chen', 'Lin', 'Tanaka', 'Fontaine', 'Okonkwo', 'Kovacs', 'Santos', 'Reyes', 'Novak'];
  const firstNamesZh = ['馬可斯', '傑倫', '以利亞', '崔馮', '達利烏斯', '柯亞', '朱利安', '以賽亞', '澤維爾', '馬提歐', '科比', '錫安', '泰勒', '諾亞', '傑克森'];
  const lastNamesZh = ['史特林', '克羅斯', '漢普頓', '沃恩', '梅瑟', '畢夏普', '陳', '林', '田中', '馮泰恩', '奧康科沃', '科瓦奇', '桑托斯', '雷耶斯', '諾瓦克'];
  
  const positions: Position[] = ['PG', 'SG', 'SF', 'PF', 'C'];

  return Array.from({ length: 30 }, (_, index) => {
    const fnIdx = Math.floor(Math.random() * firstNames.length);
    const lnIdx = Math.floor(Math.random() * lastNames.length);
    const pos = positions[index % positions.length];
    
    // 前幾位有超級潛力新秀 (Generational Talent)
    const isTopProspect = index < 3;
    const isLottery = index < 10;
    
    const ovr = isTopProspect 
      ? Math.floor(78 + Math.random() * 6)  // 78-83
      : isLottery 
        ? Math.floor(73 + Math.random() * 6)  // 73-78
        : Math.floor(68 + Math.random() * 6); // 68-73

    const pot = isTopProspect 
      ? Math.floor(92 + Math.random() * 7)  // 92-98
      : isLottery 
        ? Math.floor(86 + Math.random() * 10) // 86-95
        : Math.floor(77 + Math.random() * 12);// 77-88

    return createPlayerHelper(
      `rookie_${year}_${index}`,
      `${firstNames[fnIdx]} ${lastNames[lnIdx]}`,
      `${lastNamesZh[lnIdx]} ${firstNamesZh[fnIdx]}`,
      pos,
      19 + Math.floor(Math.random() * 3), // 19-21歲
      ovr,
      pot,
      Number((isLottery ? 8.5 - index * 0.5 : 2.5).toFixed(1)),
      3,
      'DRAFT'
    );
  });
};

// 產生擴張選秀池（供使用者挑選起步球員）
export const generateExpansionDraftPool = (): Player[] => {
  const poolNames = [
    { name: 'Spencer Dinwiddie', nameZh: '丁威迪', pos: 'PG' as Position, age: 31, ovr: 79, pot: 79, salary: 6.2 },
    { name: 'Dennis Schroder', nameZh: '施羅德', pos: 'PG' as Position, age: 30, ovr: 80, pot: 80, salary: 13.0 },
    { name: 'Tre Jones', nameZh: '瓊斯', pos: 'PG' as Position, age: 24, ovr: 79, pot: 84, salary: 9.1 },
    { name: 'Cole Anthony', nameZh: '安東尼', pos: 'PG' as Position, age: 24, ovr: 78, pot: 83, salary: 12.9 },
    { name: 'Gary Trent Jr.', nameZh: '特倫特', pos: 'SG' as Position, age: 25, ovr: 79, pot: 83, salary: 2.6 },
    { name: 'Buddy Hield', nameZh: '希爾德', pos: 'SG' as Position, age: 31, ovr: 80, pot: 80, salary: 8.8 },
    { name: 'Bruce Brown', nameZh: '布朗', pos: 'SG' as Position, age: 27, ovr: 79, pot: 81, salary: 23.0 },
    { name: 'Luke Kennard', nameZh: '肯納德', pos: 'SG' as Position, age: 28, ovr: 78, pot: 79, salary: 11.0 },
    { name: 'Rui Hachimura', nameZh: '八村壘', pos: 'PF' as Position, age: 26, ovr: 80, pot: 83, salary: 17.0 },
    { name: 'Dorian Finney-Smith', nameZh: '芬尼史密斯', pos: 'SF' as Position, age: 31, ovr: 79, pot: 79, salary: 14.9 },
    { name: 'Harrison Barnes', nameZh: '巴恩斯', pos: 'SF' as Position, age: 32, ovr: 79, pot: 79, salary: 18.0 },
    { name: 'Corey Kispert', nameZh: '基斯珀特', pos: 'SF' as Position, age: 25, ovr: 78, pot: 83, salary: 5.7 },
    { name: 'Kelly Olynyk', nameZh: '奧利尼克', pos: 'PF' as Position, age: 33, ovr: 78, pot: 78, salary: 12.8 },
    { name: 'Nazr Mohammed Jr', nameZh: '莫哈默德', pos: 'PF' as Position, age: 23, ovr: 77, pot: 85, salary: 3.5 },
    { name: 'Bobby Portis', nameZh: '波提斯', pos: 'PF' as Position, age: 29, ovr: 81, pot: 81, salary: 12.6 },
    { name: 'Larry Nance Jr.', nameZh: '南斯', pos: 'PF' as Position, age: 31, ovr: 78, pot: 78, salary: 11.2 },
    { name: 'Daniel Gafford', nameZh: '加福德', pos: 'C' as Position, age: 25, ovr: 81, pot: 84, salary: 13.4 },
    { name: 'Isaiah Hartenstein', nameZh: '哈騰斯坦', pos: 'C' as Position, age: 26, ovr: 82, pot: 85, salary: 29.0 },
    { name: 'Jonas Valanciunas', nameZh: '瓦蘭丘納斯', pos: 'C' as Position, age: 32, ovr: 80, pot: 80, salary: 9.9 },
    { name: 'Goga Bitadze', nameZh: '比塔吉', pos: 'C' as Position, age: 25, ovr: 77, pot: 82, salary: 8.3 },
    { name: 'T.J. McConnell', nameZh: '麥克康諾', pos: 'PG' as Position, age: 32, ovr: 80, pot: 80, salary: 9.3 },
    { name: 'Bojan Bogdanovic', nameZh: '波格丹諾維奇', pos: 'SF' as Position, age: 35, ovr: 78, pot: 78, salary: 19.0 },
    { name: 'Al Horford', nameZh: '霍福德', pos: 'C' as Position, age: 38, ovr: 79, pot: 79, salary: 9.5 },
    { name: 'Matisse Thybulle', nameZh: '塞布爾', pos: 'SG' as Position, age: 27, ovr: 77, pot: 79, salary: 11.0 }
  ];

  return poolNames.map((p, idx) => 
    createPlayerHelper(`exp_${idx}`, p.name, p.nameZh, p.pos, p.age, p.ovr, p.pot, p.salary, 2, 'DRAFT')
  );
};

export const INITIAL_ACHIEVEMENTS: Trophy[] = [
  { id: 'first_win', title: '球隊首勝', desc: '在例行賽奪得隊史第一場勝利', icon: '🏀', unlocked: false },
  { id: 'playoff_bound', title: '挺進季後賽', desc: '以分區前八之姿挺進季後賽', icon: '🎟️', unlocked: false },
  { id: 'first_ring', title: '歐布萊恩金盃', desc: '奪得隊史第一座 NBA 總冠軍', icon: '🏆', unlocked: false },
  { id: 'dynasty_3peat', title: '三連霸王朝', desc: '連續三個賽季拿下總冠軍', icon: '👑', unlocked: false },
  { id: 'record_73_wins', title: '歷史級統治', desc: '單季取得 70 場以上勝利', icon: '⚡', unlocked: false },
  { id: 'mvp_cultivated', title: '傳奇推手', desc: '培育出自己隊上的年度最有價值球員 (MVP)', icon: '⭐', unlocked: false },
  { id: 'rebuild_master', title: '極限重建', desc: '在薪資上限未繳奢侈稅的情況下奪冠', icon: '💼', unlocked: false },
  { id: 'twenty_seasons', title: '二十季功勳', desc: '完成整整二十個賽季的球隊總經理生涯', icon: '🎖️', unlocked: false }
];
