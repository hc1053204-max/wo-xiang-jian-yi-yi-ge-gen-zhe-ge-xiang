import React from 'react';
import { Trophy, Play, Sparkles, Shield, Flame, RotateCcw, ArrowUpRight, Users, Timer, Crown } from 'lucide-react';

interface WelcomeSplashProps {
  onStartNewGame: () => void;
  onContinueGame?: () => void;
  hasExistingSave: boolean;
  onOpenTrophies: () => void;
}

const features = [
  {
    icon: Shield,
    label: '擴張自訂球隊',
    description: '挑選城市、隊名與配色，打造聯盟第 31 支新勢力。',
    accent: 'gold',
    number: '01'
  },
  {
    icon: Sparkles,
    label: '掌控球場戰術',
    description: '調整攻防節奏，帶領球隊一路挺進季後賽。',
    accent: 'mint',
    number: '02'
  },
  {
    icon: Trophy,
    label: '寫下王朝篇章',
    description: '選秀、交易、培養新星，留下二十季隊史。',
    accent: 'blue',
    number: '03'
  }
];

export const WelcomeSplash: React.FC<WelcomeSplashProps> = ({
  onStartNewGame,
  onContinueGame,
  hasExistingSave,
  onOpenTrophies
}) => (
  <div className="welcome-screen">
    <div className="welcome-orbit welcome-orbit-one" aria-hidden="true" />
    <div className="welcome-orbit welcome-orbit-two" aria-hidden="true" />

    <div className="welcome-layout">
      <section className="welcome-copy">
        <div className="welcome-kicker">
          <span className="live-dot" />
          <Flame size={14} /> FRONT OFFICE · DYNASTY MODE
        </div>

        <p className="welcome-eyebrow">YOUR CITY. YOUR TEAM. YOUR LEGACY.</p>
        <h1 className="welcome-title">
          建立你的<br />
          <span>籃球王朝。</span>
        </h1>
        <p className="welcome-description">
          從一支全新的擴張球隊開始。掌握選秀、交易與每一次關鍵決策，讓你的名字留在聯盟史冊。
        </p>

        <div className="welcome-actions">
          {hasExistingSave && onContinueGame && (
            <button onClick={onContinueGame} className="court-button court-button-primary">
              <RotateCcw size={17} /> 繼續我的王朝 <ArrowUpRight size={16} className="button-arrow" />
            </button>
          )}
          <button onClick={onStartNewGame} className={`court-button ${hasExistingSave ? 'court-button-secondary' : 'court-button-primary'}`}>
            <Play size={17} fill="currentColor" /> 開啟新球季 <ArrowUpRight size={16} className="button-arrow" />
          </button>
          <button onClick={onOpenTrophies} className="court-button court-button-quiet">
            <Trophy size={16} /> 勳章殿堂
          </button>
        </div>

        <div className="welcome-trust-row">
          <span><span className="trust-check">✓</span> 免註冊即刻開打</span>
          <span><span className="trust-check">✓</span> 瀏覽器自動存檔</span>
          <span><span className="trust-check">✓</span> 電腦與手機皆適用</span>
        </div>
      </section>

      <aside className="season-feature" aria-label="王朝模式介紹">
        <div className="feature-topline">
          <span><span className="live-dot" /> DYNASTY MODE</span>
          <span className="feature-season">20 SEASONS</span>
        </div>
        <div className="court-art" aria-hidden="true">
          <div className="court-halo" />
          <div className="court-lines">
            <span className="court-midline" />
            <span className="court-center-circle" />
            <span className="court-key court-key-left" />
            <span className="court-key court-key-right" />
            <span className="court-arc court-arc-left" />
            <span className="court-arc court-arc-right" />
          </div>
          <div className="court-ball">🏀</div>
          <div className="court-caption">BUILD THE NEXT<br />GREAT DYNASTY</div>
          <div className="court-coordinate">GM · 001</div>
        </div>
        <div className="season-stats">
          <div className="season-stat">
            <Users size={15} />
            <div><strong>31</strong><span>支球隊</span></div>
          </div>
          <div className="season-stat">
            <Timer size={15} />
            <div><strong>20</strong><span>個賽季</span></div>
          </div>
          <div className="season-stat">
            <Crown size={15} />
            <div><strong>∞</strong><span>種傳奇</span></div>
          </div>
        </div>
        <div className="season-card-footer">
          <span>每個決定，都將改變球隊的未來。</span>
          <span className="footer-pulse" />
        </div>
      </aside>

      <section className="welcome-journey" aria-label="遊戲特色">
        <div className="journey-heading">
          <div>
            <p className="welcome-eyebrow">THE FRONT OFFICE</p>
            <h2>從管理層到冠軍舞台</h2>
          </div>
          <span className="journey-note">一段屬於你的賽季旅程 <ArrowUpRight size={14} /></span>
        </div>
        <div className="journey-grid">
          {features.map(({ icon: Icon, label, description, accent, number }) => (
            <article key={number} className={`journey-card journey-card-${accent}`}>
              <div className="journey-card-head">
                <span className="journey-icon"><Icon size={18} /></span>
                <span className="journey-number">{number}</span>
              </div>
              <h3>{label}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  </div>
);
