import { GameEngine } from '../types';
import { saveCookieClickerState, loadCookieClickerState } from '../../storage/cookieClickerStorage';

interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  costMultiplier: number;
  baseProduction: number;
  owned: number;
  description: string;
  emoji: string;
}

interface MultiplierUpgrade {
  id: string;
  name: string;
  cost: number;
  multiplier: number;
  type: 'click' | 'production';
  unlockThreshold: number;
  purchased: boolean;
  description: string;
}

interface ClickParticle {
  x: number;
  y: number;
  lifetime: number;
  maxLifetime: number;
  value: number;
}

interface CookieClickerState {
  cookies: number;
  cookiesPerSecond: number;
  cookiesPerClick: number;
  upgrades: Upgrade[];
  multiplierUpgrades: MultiplierUpgrade[];
  clickMultiplier: number;
  productionMultiplier: number;
  timestamp: number;
}

export class CookieClickerGame implements GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cookies = 0;
  private cookiesPerSecond = 0;
  private cookiesPerClick = 1;
  private clickMultiplier = 1;
  private productionMultiplier = 1;
  private upgrades: Upgrade[] = [];
  private multiplierUpgrades: MultiplierUpgrade[] = [];
  private clickParticles: ClickParticle[] = [];
  private cookieScale = 1;
  private cookieTargetScale = 1;
  private accumulatedTime = 0;
  private scrollOffset = 0;
  private maxScroll = 0;
  private isMouseOverCookie = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.initializeUpgrades();
    this.initializeMultiplierUpgrades();
    this.loadGameState();
    this.setupMouseListeners();
  }

  private initializeUpgrades(): void {
    this.upgrades = [
      {
        id: 'cursor',
        name: 'Cursor',
        baseCost: 15,
        costMultiplier: 1.15,
        baseProduction: 0.1,
        owned: 0,
        description: 'Auto-clicks the cookie',
        emoji: '👆',
      },
      {
        id: 'grandma',
        name: 'Grandma',
        baseCost: 100,
        costMultiplier: 1.15,
        baseProduction: 1,
        owned: 0,
        description: 'Bakes cookies for you',
        emoji: '👵',
      },
      {
        id: 'farm',
        name: 'Farm',
        baseCost: 1100,
        costMultiplier: 1.15,
        baseProduction: 8,
        owned: 0,
        description: 'Grows cookie plants',
        emoji: '🌾',
      },
      {
        id: 'mine',
        name: 'Mine',
        baseCost: 12000,
        costMultiplier: 1.15,
        baseProduction: 47,
        owned: 0,
        description: 'Mines cookie dough',
        emoji: '⛏️',
      },
      {
        id: 'factory',
        name: 'Factory',
        baseCost: 130000,
        costMultiplier: 1.15,
        baseProduction: 260,
        owned: 0,
        description: 'Mass produces cookies',
        emoji: '🏭',
      },
      {
        id: 'bank',
        name: 'Bank',
        baseCost: 1400000,
        costMultiplier: 1.15,
        baseProduction: 1400,
        owned: 0,
        description: 'Generates cookie interest',
        emoji: '🏦',
      },
      {
        id: 'temple',
        name: 'Temple',
        baseCost: 20000000,
        costMultiplier: 1.15,
        baseProduction: 7800,
        owned: 0,
        description: 'Summons cookie gods',
        emoji: '🛕',
      },
      {
        id: 'wizard',
        name: 'Wizard Tower',
        baseCost: 330000000,
        costMultiplier: 1.15,
        baseProduction: 44000,
        owned: 0,
        description: 'Conjures cookies from thin air',
        emoji: '🧙',
      },
    ];
  }

  private initializeMultiplierUpgrades(): void {
    this.multiplierUpgrades = [
      {
        id: 'reinforced_finger',
        name: 'Reinforced Index Finger',
        cost: 100,
        multiplier: 2,
        type: 'click',
        unlockThreshold: 50,
        purchased: false,
        description: 'Doubles clicking power',
      },
      {
        id: 'carpal_tunnel',
        name: 'Carpal Tunnel Prevention',
        cost: 500,
        multiplier: 2,
        type: 'click',
        unlockThreshold: 500,
        purchased: false,
        description: 'Doubles clicking power again',
      },
      {
        id: 'ambidextrous',
        name: 'Ambidextrous',
        cost: 10000,
        multiplier: 2,
        type: 'click',
        unlockThreshold: 5000,
        purchased: false,
        description: 'Use both hands!',
      },
      {
        id: 'grandma_forwards',
        name: 'Forwards from Grandma',
        cost: 1000,
        multiplier: 2,
        type: 'production',
        unlockThreshold: 1000,
        purchased: false,
        description: 'Grandmas are twice as efficient',
      },
      {
        id: 'steel_pins',
        name: 'Steel-plated Rolling Pins',
        cost: 5000,
        multiplier: 2,
        type: 'production',
        unlockThreshold: 5000,
        purchased: false,
        description: 'Grandmas work even harder',
      },
    ];
  }

  private setupMouseListeners(): void {
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('click', this.handleMouseClick.bind(this));
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.lastMouseX = ((e.clientX - rect.left) / rect.width) * this.canvas.width;
    this.lastMouseY = ((e.clientY - rect.top) / rect.height) * this.canvas.height;

    const cookieX = this.canvas.width * 0.3;
    const cookieY = this.canvas.height * 0.5;
    const cookieRadius = 100;

    const dx = this.lastMouseX - cookieX;
    const dy = this.lastMouseY - cookieY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.isMouseOverCookie = distance < cookieRadius;
  }

  private handleMouseClick(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * this.canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * this.canvas.height;

    const cookieX = this.canvas.width * 0.3;
    const cookieY = this.canvas.height * 0.5;
    const cookieRadius = 100;

    const dx = x - cookieX;
    const dy = y - cookieY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < cookieRadius) {
      this.clickCookie(x, y);
    } else {
      this.handleShopClick(x, y);
    }
  }

  private handleWheel(e: WheelEvent): void {
    e.preventDefault();
    this.scrollOffset += e.deltaY * 0.5;
    this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, this.maxScroll));
  }

  private clickCookie(x: number, y: number): void {
    const earnedCookies = this.cookiesPerClick * this.clickMultiplier;
    this.cookies += earnedCookies;
    this.cookieTargetScale = 1.15;

    this.clickParticles.push({
      x,
      y,
      lifetime: 0,
      maxLifetime: 1000,
      value: earnedCookies,
    });

    this.saveGameState();
  }

  private handleShopClick(x: number, y: number): void {
    const shopX = this.canvas.width * 0.6;
    const shopWidth = this.canvas.width * 0.38;
    const itemHeight = 80;
    const startY = 100;

    if (x < shopX || x > shopX + shopWidth) return;

    const allItems = [...this.upgrades, ...this.getAvailableMultiplierUpgrades()];
    const clickedIndex = Math.floor((y + this.scrollOffset - startY) / itemHeight);

    if (clickedIndex >= 0 && clickedIndex < allItems.length) {
      const item = allItems[clickedIndex];
      if ('baseProduction' in item) {
        this.purchaseUpgrade(item.id);
      } else {
        this.purchaseMultiplierUpgrade(item.id);
      }
    }
  }

  private purchaseUpgrade(upgradeId: string): void {
    const upgrade = this.upgrades.find((u) => u.id === upgradeId);
    if (!upgrade) return;

    const cost = this.calculateUpgradeCost(upgrade);
    if (this.cookies >= cost) {
      this.cookies -= cost;
      upgrade.owned++;
      this.recalculateProduction();
      this.saveGameState();
    }
  }

  private purchaseMultiplierUpgrade(upgradeId: string): void {
    const upgrade = this.multiplierUpgrades.find((u) => u.id === upgradeId);
    if (!upgrade || upgrade.purchased) return;

    if (this.cookies >= upgrade.cost) {
      this.cookies -= upgrade.cost;
      upgrade.purchased = true;

      if (upgrade.type === 'click') {
        this.clickMultiplier *= upgrade.multiplier;
      } else {
        this.productionMultiplier *= upgrade.multiplier;
      }

      this.recalculateProduction();
      this.saveGameState();
    }
  }

  private calculateUpgradeCost(upgrade: Upgrade): number {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.owned));
  }

  private recalculateProduction(): void {
    this.cookiesPerSecond = 0;
    for (const upgrade of this.upgrades) {
      this.cookiesPerSecond += upgrade.baseProduction * upgrade.owned;
    }
    this.cookiesPerSecond *= this.productionMultiplier;
  }

  private getAvailableMultiplierUpgrades(): MultiplierUpgrade[] {
    return this.multiplierUpgrades.filter(
      (u) => !u.purchased && this.cookies >= u.unlockThreshold * 0.5
    );
  }

  private saveGameState(): void {
    const state: CookieClickerState = {
      cookies: this.cookies,
      cookiesPerSecond: this.cookiesPerSecond,
      cookiesPerClick: this.cookiesPerClick,
      upgrades: this.upgrades,
      multiplierUpgrades: this.multiplierUpgrades,
      clickMultiplier: this.clickMultiplier,
      productionMultiplier: this.productionMultiplier,
      timestamp: Date.now(),
    };
    saveCookieClickerState(state);
  }

  private loadGameState(): void {
    const state = loadCookieClickerState();
    if (state) {
      this.cookies = state.cookies;
      this.cookiesPerSecond = state.cookiesPerSecond;
      this.cookiesPerClick = state.cookiesPerClick;
      this.clickMultiplier = state.clickMultiplier;
      this.productionMultiplier = state.productionMultiplier;

      for (const savedUpgrade of state.upgrades) {
        const upgrade = this.upgrades.find((u) => u.id === savedUpgrade.id);
        if (upgrade) {
          upgrade.owned = savedUpgrade.owned;
        }
      }

      for (const savedMultiplier of state.multiplierUpgrades) {
        const multiplier = this.multiplierUpgrades.find((u) => u.id === savedMultiplier.id);
        if (multiplier) {
          multiplier.purchased = savedMultiplier.purchased;
        }
      }

      const elapsedSeconds = Math.min((Date.now() - state.timestamp) / 1000, 86400);
      const offlineCookies = this.cookiesPerSecond * elapsedSeconds;
      this.cookies += offlineCookies;

      this.recalculateProduction();
    }
  }

  update(deltaTime: number): void {
    this.accumulatedTime += deltaTime;
    this.cookies += (this.cookiesPerSecond * deltaTime) / 1000;

    this.cookieScale += (this.cookieTargetScale - this.cookieScale) * 0.2;
    if (Math.abs(this.cookieTargetScale - 1) < 0.01) {
      this.cookieTargetScale = 1;
    } else if (this.cookieTargetScale > 1) {
      this.cookieTargetScale -= 0.01;
    }

    this.clickParticles = this.clickParticles.filter((p) => {
      p.lifetime += deltaTime;
      p.y -= deltaTime * 0.05;
      return p.lifetime < p.maxLifetime;
    });

    if (this.accumulatedTime > 5000) {
      this.saveGameState();
      this.accumulatedTime = 0;
    }
  }

  render(): void {
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderCookieCounter();
    this.renderCookie();
    this.renderClickParticles();
    this.renderShop();
  }

  private renderCookieCounter(): void {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.formatNumber(Math.floor(this.cookies)), this.canvas.width * 0.3, 60);

    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = '#aaaaaa';
    this.ctx.fillText(
      `per second: ${this.formatNumber(this.cookiesPerSecond, 1)}`,
      this.canvas.width * 0.3,
      85
    );
  }

  private renderCookie(): void {
    const x = this.canvas.width * 0.3;
    const y = this.canvas.height * 0.5;
    const radius = 100 * this.cookieScale;

    this.ctx.save();
    this.ctx.translate(x, y);

    if (this.isMouseOverCookie) {
      this.ctx.shadowColor = '#ff8800';
      this.ctx.shadowBlur = 20;
    }

    this.ctx.fillStyle = '#d2691e';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#8b4513';
    const chips = 8;
    for (let i = 0; i < chips; i++) {
      const angle = (Math.PI * 2 * i) / chips + Math.PI / 4;
      const chipX = Math.cos(angle) * radius * 0.5;
      const chipY = Math.sin(angle) * radius * 0.5;
      this.ctx.beginPath();
      this.ctx.arc(chipX, chipY, radius * 0.15, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  private renderClickParticles(): void {
    for (const particle of this.clickParticles) {
      const alpha = 1 - particle.lifetime / particle.maxLifetime;
      this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
      this.ctx.font = 'bold 20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`+${this.formatNumber(particle.value, 1)}`, particle.x, particle.y);
    }
  }

  private renderShop(): void {
    const shopX = this.canvas.width * 0.6;
    const shopWidth = this.canvas.width * 0.38;
    const shopHeight = this.canvas.height;

    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.fillRect(shopX, 0, shopWidth, shopHeight);

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Shop', shopX + shopWidth / 2, 40);

    const allItems = [...this.upgrades, ...this.getAvailableMultiplierUpgrades()];
    const itemHeight = 80;
    const startY = 100;

    this.maxScroll = Math.max(0, allItems.length * itemHeight - (shopHeight - startY));

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(shopX, startY, shopWidth, shopHeight - startY);
    this.ctx.clip();

    allItems.forEach((item, index) => {
      const y = startY + index * itemHeight - this.scrollOffset;
      if (y < startY - itemHeight || y > shopHeight) return;

      const isUpgrade = 'baseProduction' in item;
      const cost = isUpgrade
        ? this.calculateUpgradeCost(item as Upgrade)
        : (item as MultiplierUpgrade).cost;
      const canAfford = this.cookies >= cost;

      this.ctx.fillStyle = canAfford ? '#3a3a3a' : '#2a2a2a';
      this.ctx.fillRect(shopX + 5, y, shopWidth - 10, itemHeight - 5);

      if (canAfford) {
        this.ctx.strokeStyle = '#4a4a4a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(shopX + 5, y, shopWidth - 10, itemHeight - 5);
      }

      this.ctx.font = '32px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(
        isUpgrade ? (item as Upgrade).emoji : '⭐',
        shopX + 15,
        y + 40
      );

      this.ctx.fillStyle = canAfford ? '#ffffff' : '#666666';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.fillText(item.name, shopX + 60, y + 25);

      if (isUpgrade) {
        const upgrade = item as Upgrade;
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillText(`Owned: ${upgrade.owned}`, shopX + 60, y + 45);
        this.ctx.fillText(
          `+${this.formatNumber(upgrade.baseProduction, 1)}/s`,
          shopX + 60,
          y + 60
        );
      } else {
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#aaaaaa';
        this.ctx.fillText(item.description, shopX + 60, y + 45);
      }

      this.ctx.font = 'bold 14px Arial';
      this.ctx.fillStyle = canAfford ? '#00ff00' : '#ff0000';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(this.formatNumber(cost), shopX + shopWidth - 15, y + 35);
    });

    this.ctx.restore();
  }

  private formatNumber(num: number, decimals = 0): string {
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
  }

  reset(): void {
    this.cookies = 0;
    this.cookiesPerSecond = 0;
    this.cookiesPerClick = 1;
    this.clickMultiplier = 1;
    this.productionMultiplier = 1;
    this.clickParticles = [];
    this.scrollOffset = 0;
    this.initializeUpgrades();
    this.initializeMultiplierUpgrades();
    this.saveGameState();
  }

  getScore(): number {
    return Math.floor(this.cookies);
  }

  isGameOver(): boolean {
    return false;
  }

  handleKeyDown(_key: string): void {
    // Cookie Clicker doesn't use keyboard controls
  }

  handleKeyUp(_key: string): void {
    // Cookie Clicker doesn't use keyboard controls
  }
}
