import React, { useState, useEffect, useRef } from 'react';
import { NavigationDock } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Stats } from './components/Stats';
import { Traders, Profile } from './components/Traders';
import { Journal } from './components/Journal';
import { TradeDetail } from './components/TradeDetail';
import { TradeModal, PreferencesModal } from './components/Modals';
import { Trade, Trader } from './types';
import { Settings2, Type, Monitor, Maximize2, Minimize2, MousePointer2, Move, X, Check, Scan, Calendar, Filter, Columns, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [navPosition, setNavPosition] = useState<'bottom' | 'top' | 'left' | 'right'>('bottom');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isDevToolsEnabled, setIsDevToolsEnabled] = useState(false);
  const [isDevToolsExpanded, setIsDevToolsExpanded] = useState(true);

  // Layout & Menu config
  const [menuScale, setMenuScale] = useState(1);
  const [controlsScale, setControlsScale] = useState(1.05);
  const [edgeOffset, setEdgeOffset] = useState(24);

  // Date Toggle Config
  const [dateToggleConfig, setDateToggleConfig] = useState({
      fontSize: 14,
      fontWeight: 500,
      height: 36,
      paddingX: 10
  });

  // Positions Dropdown Config
  const [positionsConfig, setPositionsConfig] = useState({
      fontSize: 14,
      fontWeight: 700,
      height: 30,
      paddingX: 10,
      borderRadius: 12
  });
  
  // Metrics Config
  const [metricsConfig, setMetricsConfig] = useState({
      scale: 0.95,
      marginTop: 24,
      marginBottom: 48,
      fontWeight: 500
  });

  const [layoutConfig, setLayoutConfig] = useState({
      maxWidth: 1440,
      paddingX: 152,
      paddingY: 56,
      chartHeight: 420
  });

  // Journal Config
  const [rightGutter, setRightGutter] = useState(48);
  const [leftGutter, setLeftGutter] = useState(48);
  const [filterBarSpacing, setFilterBarSpacing] = useState({ left: 40, right: 0 });

  const [trades, setTrades] = useState<Trade[]>([]);
  
  // Window Size State
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Typography Config State
  const [textConfig, setTextConfig] = useState({
      headingScale: 1.2,
      bodyScale: 1.2,
      smallScale: 1.2
  });

  // Modals state
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  
  // New entry states
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({ direction: 'Long', style: 'Intraday', risk: 1.0 });

  // Navigation details state
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null);

  // Mock Traders List
  const tradersList: Trader[] = [
      { id: 1, name: 'Tori (You)', initials: 'ME', winrate: 68, pnl: 42.5, trades: 142, rr: '1:2.4', pf: 2.1, isFunded: true },
      { id: 2, name: 'Sarah_Trade', initials: 'ST', winrate: 74, pnl: 125.2, trades: 310, rr: '1:1.8', pf: 2.8, isFunded: false },
      { id: 3, name: 'BearHunter', initials: 'BH', winrate: 45, pnl: 12.4, trades: 89, rr: '1:4.5', pf: 1.9, isFunded: false },
      { id: 4, name: 'CryptoWhale', initials: 'CW', winrate: 52, pnl: -4.5, trades: 215, rr: '1:1.2', pf: 0.8, isFunded: false },
      { id: 5, name: 'ScalpMaster', initials: 'SM', winrate: 81, pnl: 32.1, trades: 850, rr: '1:0.9', pf: 1.5, isFunded: true }
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener('resize', handleResize);

    const savedTrades = localStorage.getItem('garden_trades_final_17');

    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    } else {
      setTrades([
        { id: 7, date: '2025-12-02', entryDate: '2025-12-02T09:30', exitDate: '2025-12-02T16:00', ticker: 'SOL', direction: 'Long', style: 'Intraday', risk: 1.0, pnl: 15.0 },
        { id: 6, date: '2025-12-01', entryDate: '2025-12-01T14:00', exitDate: '2025-12-03T10:00', ticker: 'XRP', direction: 'Short', style: 'Swing', risk: 2.0, pnl: -5.5 },
        { id: 5, date: '2025-11-26', entryDate: '2025-11-26T10:00', exitDate: '2025-11-26T12:00', ticker: 'ETH', direction: 'Long', style: 'Intraday', risk: 0.5, pnl: -2.0 },
        { id: 4, date: '2025-11-25', entryDate: '2025-11-25T18:00', exitDate: '2025-11-26T08:00', ticker: 'BTC', direction: 'Short', style: 'Swing', risk: 1.5, pnl: 8.0 },
        { id: 3, date: '2025-11-24', entryDate: '2025-11-24T15:00', exitDate: '2025-11-28T16:00', ticker: 'AAPL', direction: 'Long', style: 'Swing', risk: 1.0, pnl: 4.5 },
        { id: 2, date: '2025-11-22', entryDate: '2025-11-22T09:45', exitDate: '2025-11-22T10:30', ticker: 'TSLA', direction: 'Short', style: 'Intraday', risk: 1.0, pnl: -3.2 },
        { id: 1, date: '2025-11-20', entryDate: '2025-11-20T11:00', exitDate: '2025-11-20T14:45', ticker: 'NVDA', direction: 'Long', style: 'Intraday', risk: 1.0, pnl: 12.5 },
      ]);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveTrades = (updatedTrades: Trade[]) => {
    setTrades(updatedTrades);
    localStorage.setItem('garden_trades_final_17', JSON.stringify(updatedTrades));
  };

  const addTrade = () => {
    if (!newTrade.ticker || newTrade.pnl === undefined) return;

    let entry = newTrade.entryDate;
    let exit = newTrade.exitDate;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (!entry) {
        entry = todayStr + 'T00:00';
    }
    if (!exit) {
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        exit = todayStr + 'T' + h + ':' + m;
    }

    const trade: Trade = {
        id: Date.now(),
        date: entry.split('T')[0],
        entryDate: entry,
        exitDate: exit,
        ticker: newTrade.ticker.toUpperCase(),
        direction: newTrade.direction as 'Long' | 'Short',
        style: newTrade.style as 'Intraday' | 'Swing',
        risk: newTrade.risk || 1.0,
        pnl: Number(newTrade.pnl)
    };

    saveTrades([trade, ...trades]);
    setNewTrade({ direction: 'Long', style: 'Intraday', risk: 1.0 });
    setIsTradeModalOpen(false);
  };

  const openTradeDetail = (trade: Trade) => {
    if (!trade.tda || trade.tda.length === 0) {
        trade.tda = Array(4).fill({ tf: '', image: '', note: '' });
    }
    setActiveTrade(trade);
    setCurrentTab('trade-detail');
  };

  const saveTradeDetail = (updatedTrade: Trade) => {
      const index = trades.findIndex(t => t.id === updatedTrade.id);
      if (index !== -1) {
          const newTrades = [...trades];
          newTrades[index] = updatedTrade;
          saveTrades(newTrades);
      }
      setCurrentTab('journal');
  };

  const openProfile = (trader: Trader) => {
      setSelectedTrader(trader);
      setCurrentTab('profile');
  };

  const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const winCount = trades.filter(t => t.pnl > 0).length;
  const winrate = trades.length === 0 ? 0 : Math.round((winCount / trades.length) * 100);

  const getLayoutPadding = () => {
      const basePaddingX = `clamp(16px, 8vw, ${layoutConfig.paddingX}px)`;
      const basePaddingY = `clamp(24px, 5vh, ${layoutConfig.paddingY}px)`;

      switch(navPosition) {
          case 'bottom': return { paddingLeft: basePaddingX, paddingRight: basePaddingX, paddingTop: basePaddingY, paddingBottom: '120px' };
          case 'top': return { paddingLeft: basePaddingX, paddingRight: basePaddingX, paddingTop: '120px', paddingBottom: basePaddingY };
          case 'left': return { paddingLeft: '120px', paddingRight: basePaddingX, paddingTop: basePaddingY, paddingBottom: basePaddingY };
          case 'right': return { paddingLeft: basePaddingX, paddingRight: '120px', paddingTop: basePaddingY, paddingBottom: basePaddingY };
          default: return { paddingLeft: basePaddingX, paddingRight: basePaddingX, paddingTop: basePaddingY, paddingBottom: basePaddingY };
      }
  };

  const getDevToolsPosition = () => {
      if (navPosition === 'right') return 'bottom-6 left-6';
      if (navPosition === 'bottom') return 'bottom-6 right-6';
      return 'bottom-6 right-6';
  };

  return (
    <div 
      className="min-h-screen bg-white overflow-x-hidden"
      style={{
        '--chart-height': `clamp(250px, 40vh, ${layoutConfig.chartHeight}px)`,
        '--scale-heading': textConfig.headingScale,
        '--scale-body': textConfig.bodyScale,
        '--scale-small': textConfig.smallScale,
      } as React.CSSProperties}
    >
      <NavigationDock 
        currentTab={currentTab} 
        changeTab={setCurrentTab} 
        position={navPosition}
        scale={menuScale}
        edgeOffset={edgeOffset}
        onOpenSettings={() => setIsPreferencesOpen(true)}
      />
      
      <main className="w-full relative">
        <div 
            className="mx-auto box-border transition-all duration-300"
            style={{ 
                maxWidth: `${layoutConfig.maxWidth}px`,
                ...getLayoutPadding()
            }}
        >
          {currentTab === 'dashboard' && (
            <Dashboard 
              trades={trades} 
              totalPnL={totalPnL} 
              winrate={winrate} 
              openTradeModal={() => setIsTradeModalOpen(true)} 
              changeTab={setCurrentTab}
            />
          )}

          {currentTab === 'stats' && (
            <Stats trades={trades} changeTab={setCurrentTab} />
          )}

          {currentTab === 'traders' && (
            <Traders tradersList={tradersList} openProfile={openProfile} />
          )}

          {currentTab === 'profile' && selectedTrader && (
            <Profile trader={selectedTrader} goBack={() => setCurrentTab('traders')} />
          )}

          {currentTab === 'journal' && (
            <Journal 
               trades={trades} 
               openTradeModal={() => setIsTradeModalOpen(true)}
               openTradeDetail={openTradeDetail}
               controlsScale={controlsScale}
               dateToggleConfig={dateToggleConfig}
               positionsConfig={positionsConfig}
               metricsConfig={metricsConfig}
               rightGutter={rightGutter}
               leftGutter={leftGutter}
               filterBarSpacing={filterBarSpacing}
            />
          )}

          {currentTab === 'trade-detail' && activeTrade && (
            <TradeDetail 
               trade={activeTrade}
               goBack={() => setCurrentTab('journal')}
               onSave={saveTradeDetail}
            />
          )}

        </div>
      </main>

      <TradeModal 
        isOpen={isTradeModalOpen} 
        onClose={() => setIsTradeModalOpen(false)}
        newTrade={newTrade}
        setNewTrade={setNewTrade}
        onSave={addTrade}
      />

      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        position={navPosition}
        setPosition={setNavPosition}
        devToolsEnabled={isDevToolsEnabled}
        setDevToolsEnabled={setIsDevToolsEnabled}
      />
      
      {/* HUD Style Dev Tools */}
      {isDevToolsEnabled && (
        <div 
          className={`fixed z-[100] transition-all duration-500 ease-spring dev-tools-hud ${getDevToolsPosition()}`}
        >
           <div className={`bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${isDevToolsExpanded ? 'w-72 p-4' : 'w-10 h-10 p-0 flex items-center justify-center cursor-pointer hover:bg-slate-50'}`}>
              
              {/* Header / Toggle */}
              <div className="flex items-center justify-between mb-2">
                 {isDevToolsExpanded && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                       <Monitor className="w-3 h-3" />
                       <span>Dev HUD</span>
                    </div>
                 )}
                 <button 
                   onClick={() => setIsDevToolsExpanded(!isDevToolsExpanded)}
                   className={`text-slate-400 hover:text-slate-800 transition ${!isDevToolsExpanded ? 'w-full h-full flex items-center justify-center' : ''}`}
                 >
                    {isDevToolsExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-4 h-4" />}
                 </button>
              </div>

              {isDevToolsExpanded && (
                  <div className="space-y-4 animate-fade-in max-h-[80vh] overflow-y-auto">
                      
                      {/* Viewport Info */}
                      <div className="bg-slate-100 rounded-lg p-2 text-center">
                          <span className="text-xs font-mono font-semibold text-slate-600">{windowSize.width}px × {windowSize.height}px</span>
                      </div>
                      
                      {/* Menu Scale Slider */}
                      <div className="space-y-1">
                          <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold">
                              <div className="flex items-center gap-1"><MousePointer2 className="w-3 h-3"/> Menu Scale</div>
                              <span>{menuScale}x</span>
                          </div>
                          <input type="range" min="0.5" max="1.5" step="0.1" value={menuScale} onChange={e => setMenuScale(Number(e.target.value))} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      </div>

                      {/* Controls Scale Slider (NEW) */}
                      <div className="space-y-1">
                          <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold">
                              <div className="flex items-center gap-1"><Scan className="w-3 h-3"/> Controls Size</div>
                              <span>{controlsScale.toFixed(2)}x</span>
                          </div>
                          <input type="range" min="0.5" max="1.5" step="0.05" value={controlsScale} onChange={e => setControlsScale(Number(e.target.value))} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      </div>

                      {/* Edge Offset Slider */}
                      <div className="space-y-1">
                          <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold">
                              <div className="flex items-center gap-1"><Move className="w-3 h-3"/> Edge Offset</div>
                              <span>{edgeOffset}px</span>
                          </div>
                          <input type="range" min="0" max="100" step="4" value={edgeOffset} onChange={e => setEdgeOffset(Number(e.target.value))} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                      </div>

                      <div className="w-full h-[1px] bg-slate-100"></div>

                      {/* Positions Toggle Settings (NEW) */}
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <Filter className="w-3 h-3" /> Positions Dropdown
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Height</span><span>{positionsConfig.height}px</span></div>
                             <input type="range" min="24" max="60" step="2" value={positionsConfig.height} onChange={e => setPositionsConfig({...positionsConfig, height: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Padding X</span><span>{positionsConfig.paddingX}px</span></div>
                             <input type="range" min="4" max="30" step="1" value={positionsConfig.paddingX} onChange={e => setPositionsConfig({...positionsConfig, paddingX: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Radius</span><span>{positionsConfig.borderRadius}px</span></div>
                             <input type="range" min="4" max="32" step="1" value={positionsConfig.borderRadius} onChange={e => setPositionsConfig({...positionsConfig, borderRadius: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Font Size</span><span>{positionsConfig.fontSize}px</span></div>
                             <input type="range" min="10" max="18" step="1" value={positionsConfig.fontSize} onChange={e => setPositionsConfig({...positionsConfig, fontSize: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Weight</span><span>{positionsConfig.fontWeight}</span></div>
                             <input type="range" min="300" max="900" step="100" value={positionsConfig.fontWeight} onChange={e => setPositionsConfig({...positionsConfig, fontWeight: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                      </div>

                      <div className="w-full h-[1px] bg-slate-100"></div>

                      {/* Date Toggle Settings */}
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <Calendar className="w-3 h-3" /> Date Toggle
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Height</span><span>{dateToggleConfig.height}px</span></div>
                             <input type="range" min="24" max="60" step="2" value={dateToggleConfig.height} onChange={e => setDateToggleConfig({...dateToggleConfig, height: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Padding X</span><span>{dateToggleConfig.paddingX}px</span></div>
                             <input type="range" min="4" max="30" step="1" value={dateToggleConfig.paddingX} onChange={e => setDateToggleConfig({...dateToggleConfig, paddingX: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Font Size</span><span>{dateToggleConfig.fontSize}px</span></div>
                             <input type="range" min="10" max="18" step="1" value={dateToggleConfig.fontSize} onChange={e => setDateToggleConfig({...dateToggleConfig, fontSize: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Weight</span><span>{dateToggleConfig.fontWeight}</span></div>
                             <input type="range" min="300" max="900" step="100" value={dateToggleConfig.fontWeight} onChange={e => setDateToggleConfig({...dateToggleConfig, fontWeight: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                      </div>

                      <div className="w-full h-[1px] bg-slate-100"></div>
                      
                      {/* Metrics Bar Settings */}
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <Activity className="w-3 h-3" /> Metrics Bar
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Scale</span><span>{metricsConfig.scale.toFixed(2)}x</span></div>
                             <input type="range" min="0.5" max="1.5" step="0.05" value={metricsConfig.scale} onChange={e => setMetricsConfig({...metricsConfig, scale: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Weight</span><span>{metricsConfig.fontWeight}</span></div>
                             <input type="range" min="100" max="900" step="100" value={metricsConfig.fontWeight} onChange={e => setMetricsConfig({...metricsConfig, fontWeight: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Spacing (Top)</span><span>{metricsConfig.marginTop}px</span></div>
                             <input type="range" min="0" max="100" step="4" value={metricsConfig.marginTop} onChange={e => setMetricsConfig({...metricsConfig, marginTop: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Spacing (Bottom)</span><span>{metricsConfig.marginBottom}px</span></div>
                             <input type="range" min="0" max="100" step="4" value={metricsConfig.marginBottom} onChange={e => setMetricsConfig({...metricsConfig, marginBottom: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                      </div>

                      <div className="w-full h-[1px] bg-slate-100"></div>

                      {/* Layout Sliders */}
                      <div className="space-y-3">
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold"><span>Max W</span><span>{layoutConfig.maxWidth}</span></div>
                             <input type="range" min="800" max="2400" step="20" value={layoutConfig.maxWidth} onChange={e => setLayoutConfig({...layoutConfig, maxWidth: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold"><span>Chart H</span><span>{layoutConfig.chartHeight}</span></div>
                             <input type="range" min="200" max="800" step="20" value={layoutConfig.chartHeight} onChange={e => setLayoutConfig({...layoutConfig, chartHeight: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         
                         {/* Left Gutter Slider */}
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold">
                                 <div className="flex items-center gap-1"><Columns className="w-3 h-3"/> Left Gutter</div>
                                 <span>{leftGutter}px</span>
                             </div>
                             <input type="range" min="0" max="200" step="4" value={leftGutter} onChange={e => setLeftGutter(Number(e.target.value))} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>

                         {/* Right Gutter Slider */}
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold">
                                 <div className="flex items-center gap-1"><Columns className="w-3 h-3"/> Right Gutter</div>
                                 <span>{rightGutter}px</span>
                             </div>
                             <input type="range" min="0" max="200" step="4" value={rightGutter} onChange={e => setRightGutter(Number(e.target.value))} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>

                         {/* Filter Bar Spacing Sliders */}
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold">
                                 <div className="flex items-center gap-1"><Move className="w-3 h-3"/> Controls Left</div>
                                 <span>{filterBarSpacing.left}px</span>
                             </div>
                             <input type="range" min="0" max="200" step="4" value={filterBarSpacing.left} onChange={e => setFilterBarSpacing({...filterBarSpacing, left: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] uppercase text-slate-400 font-bold">
                                 <div className="flex items-center gap-1"><Move className="w-3 h-3"/> Controls Right</div>
                                 <span>{filterBarSpacing.right}px</span>
                             </div>
                             <input type="range" min="0" max="200" step="4" value={filterBarSpacing.right} onChange={e => setFilterBarSpacing({...filterBarSpacing, right: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                      </div>

                      <div className="w-full h-[1px] bg-slate-100"></div>

                      {/* Typography Sliders */}
                      <div className="space-y-3">
                         <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 mb-1">
                            <Type className="w-3 h-3" /> Typography
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Heading</span><span>{textConfig.headingScale}x</span></div>
                             <input type="range" min="0.8" max="2.0" step="0.05" value={textConfig.headingScale} onChange={e => setTextConfig({...textConfig, headingScale: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                         <div className="space-y-1">
                             <div className="flex justify-between text-[10px] text-slate-400"><span>Body</span><span>{textConfig.bodyScale}x</span></div>
                             <input type="range" min="0.8" max="1.5" step="0.05" value={textConfig.bodyScale} onChange={e => setTextConfig({...textConfig, bodyScale: Number(e.target.value)})} className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                         </div>
                      </div>
                  </div>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

export default App;