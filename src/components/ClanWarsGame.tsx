import React, { useState, useEffect } from 'react';
import {
  Swords,
  Shield,
  Flag,
  Users,
  Zap,
  RotateCcw,
  Bot,
  Sparkles,
  Trophy,
  Crown,
  Radio,
  Flame,
  ChevronRight,
  Crosshair,
  Award,
} from 'lucide-react';

interface Sector {
  id: number;
  name: string;
  bonus: string;
  owner: 'player' | 'omega' | 'neutral';
}

export const ClanWarsGame: React.FC = () => {
  const [clanName, setClanName] = useState('Клан Феникс');
  const [playerHp, setPlayerHp] = useState(100);
  const [omegaHp, setOmegaHp] = useState(100);
  const [playerArmy, setPlayerArmy] = useState(60);
  const [omegaArmy, setOmegaArmy] = useState(60);
  const [playerGold, setPlayerGold] = useState(120);
  const [ultimateCharge, setUltimateCharge] = useState(30);
  const [playerShieldActive, setPlayerShieldActive] = useState(false);
  const [omegaShieldActive, setOmegaShieldActive] = useState(false);

  const [sectors, setSectors] = useState<Sector[]>([
    { id: 1, name: 'Цитадель Нео-Сити', bonus: '+25 Мощи', owner: 'player' },
    { id: 2, name: 'Энерго-Вышка', bonus: '+15 Золота/ход', owner: 'neutral' },
    { id: 3, name: 'Кибер-Рудник', bonus: '+20 Золота/ход', owner: 'neutral' },
    { id: 4, name: 'Защитный Бастион', bonus: '+30 Защиты', owner: 'neutral' },
    { id: 5, name: 'Ядро Матрицы Омега', bonus: '+25 Мощи Омеги', owner: 'omega' },
  ]);

  const [round, setRound] = useState(1);
  const [battleLogs, setBattleLogs] = useState<string[]>([
    'Система: Битва Кланов началась! ИИ «Омега» развернула боевую матрицу.',
    'ИИ Омега: «Приветствую, командир клана. Посмотрим, сможет ли ваша стратегия превзойти мои алгоритмы.»',
  ]);
  const [omegaDialog, setOmegaDialog] = useState<string>(
    '«Мои сенсоры фиксируют ваши первые отряды. Сделайте ваш ход, командир!»'
  );
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [gameOver, setGameOver] = useState<'victory' | 'defeat' | null>(null);

  // Check victory / defeat
  useEffect(() => {
    if (omegaHp <= 0 && !gameOver) {
      setOmegaHp(0);
      setGameOver('victory');
      setBattleLogs((prev) => [
        '🏆 ПОБЕДА! Ваш клан сокрушил цитадель Омеги и установил контроль над сектором!',
        ...prev,
      ]);
      setOmegaDialog('ИИ Омега: «Невероятно... Ваши нестандартные тактические ходы превзошли мои расчеты. Честь вашему клану!»');
    } else if (playerHp <= 0 && !gameOver) {
      setPlayerHp(0);
      setGameOver('defeat');
      setBattleLogs((prev) => [
        '💀 ПОРАЖЕНИЕ. Омега прорвала оборону вашего клана.',
        ...prev,
      ]);
      setOmegaDialog('ИИ Омега: «Ваша цитадель пала. Анализ показывает недостаток координации обороны. Попробуйте еще раз!»');
    }
  }, [playerHp, omegaHp, gameOver]);

  const resetGame = () => {
    setPlayerHp(100);
    setOmegaHp(100);
    setPlayerArmy(60);
    setOmegaArmy(60);
    setPlayerGold(120);
    setUltimateCharge(30);
    setPlayerShieldActive(false);
    setOmegaShieldActive(false);
    setRound(1);
    setGameOver(null);
    setSectors([
      { id: 1, name: 'Цитадель Нео-Сити', bonus: '+25 Мощи', owner: 'player' },
      { id: 2, name: 'Энерго-Вышка', bonus: '+15 Золота/ход', owner: 'neutral' },
      { id: 3, name: 'Кибер-Рудник', bonus: '+20 Золота/ход', owner: 'neutral' },
      { id: 4, name: 'Защитный Бастион', bonus: '+30 Защиты', owner: 'neutral' },
      { id: 5, name: 'Ядро Матрицы Омега', bonus: '+25 Мощи Омеги', owner: 'omega' },
    ]);
    setBattleLogs([
      'Система: Новая клановая битва перезапущена.',
      'ИИ Омега: «Матрица перезагружена. Готова к новому тактическому раунду!»',
    ]);
    setOmegaDialog('«Матрица перезагружена. Сделайте ваш первый маневр!»');
  };

  // Automated Omega Counter-Turn
  const executeOmegaTurn = async (playerActionName: string) => {
    setIsAiThinking(true);

    // Give slight pause for dramatic tension
    await new Promise((r) => setTimeout(r, 600));

    // Calculate passive resource income from captured sectors
    const playerSectorsCount = sectors.filter((s) => s.owner === 'player').length;
    const omegaSectorsCount = sectors.filter((s) => s.owner === 'omega').length;

    setPlayerGold((g) => g + 20 + playerSectorsCount * 10);
    setUltimateCharge((u) => Math.min(100, u + 15));

    // Omega AI Logic
    let omegaAction = '';
    const roll = Math.random();

    if (omegaHp < 35 && !omegaShieldActive && roll > 0.3) {
      // Omega desperately activates shield
      setOmegaShieldActive(true);
      omegaAction = '🛡️ ИИ Омега активирует Нано-щит матрицы, блокирующий 70% урона!';
      setOmegaDialog('«Критический уровень повреждений. Разворачиваю экстренный нано-щит матрицы!»');
    } else if (roll > 0.65) {
      // Omega captures territory
      const neutralOrPlayerSectors = sectors.filter((s) => s.owner !== 'omega');
      if (neutralOrPlayerSectors.length > 0) {
        const targetSector = neutralOrPlayerSectors[Math.floor(Math.random() * neutralOrPlayerSectors.length)];
        setSectors((prev) =>
          prev.map((s) => (s.id === targetSector.id ? { ...s, owner: 'omega' } : s))
        );
        setOmegaArmy((a) => a + 15);
        omegaAction = `🚩 ИИ Омега провела кибер-захват сектора «${targetSector.name}»!`;
        setOmegaDialog(`«Сектор ${targetSector.name} теперь под моим контролем. Ресурсы перенаправлены!»`);
      }
    } else if (roll > 0.35) {
      // Omega recruits droids
      setOmegaArmy((a) => a + 25);
      omegaAction = '🤖 ИИ Омега мобилизовала 25 элитных боевых дронов матрицы!';
      setOmegaDialog('«Мобилизация завершена. Численное превосходство склоняется на сторону Омеги!»');
    } else {
      // Direct Assault by Omega
      let baseDamage = Math.floor(15 + (omegaArmy / 10) + Math.random() * 10);
      if (playerShieldActive) {
        baseDamage = Math.floor(baseDamage * 0.3);
        setPlayerShieldActive(false);
        omegaAction = `⚡ ИИ Омега нанесла удар, но ваш Кибер-Щит поглотил большую часть урона (-${baseDamage} HP)!`;
        setOmegaDialog('«Ваш кибер-щит смягчил попадание, но долго он не выдержит!»');
      } else {
        omegaAction = `💥 ИИ Омега нанесла сокрушительный удар по цитадели вашего клана (-${baseDamage} HP)!`;
        setOmegaDialog('«Прямое попадание по вашему командному центру. Оборона трещит по швам!»');
      }
      setPlayerHp((hp) => Math.max(0, hp - baseDamage));
    }

    setBattleLogs((prev) => [omegaAction, ...prev]);
    setRound((r) => r + 1);
    setIsAiThinking(false);

    // Call live AI advice optionally
    fetch('/api/clan-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        battleState: {
          omegaHp,
          playerHp,
          omegaArmy,
          playerArmy,
          omegaSectors: omegaSectorsCount,
          playerSectors: playerSectorsCount,
        },
        playerMove: playerActionName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.text) {
          setOmegaDialog(data.text);
        }
      })
      .catch(() => {});
  };

  // 1. Player Action: Assault
  const handlePlayerAssault = async () => {
    if (gameOver || isAiThinking) return;

    let dmg = Math.floor(16 + (playerArmy / 8) + Math.random() * 12);
    let logMsg = '';

    if (omegaShieldActive) {
      dmg = Math.floor(dmg * 0.3);
      setOmegaShieldActive(false);
      logMsg = `⚔️ Вы атаковали Омегу, но её нано-щит снизил урон до ${dmg}!`;
    } else {
      logMsg = `⚔️ Ваш клан провел штурм базы Омеги, нанеся ${dmg} урона!`;
    }

    setOmegaHp((hp) => Math.max(0, hp - dmg));
    setBattleLogs((prev) => [logMsg, ...prev]);

    await executeOmegaTurn('Штурм базы Омеги');
  };

  // 2. Player Action: Shield
  const handlePlayerShield = async () => {
    if (gameOver || isAiThinking) return;

    setPlayerShieldActive(true);
    setPlayerHp((hp) => Math.min(100, hp + 10));
    setBattleLogs((prev) => [
      '🛡️ Ваш клан развернул Кибер-Щит и восстановил +10 HP!',
      ...prev,
    ]);

    await executeOmegaTurn('Активация кибер-щита');
  };

  // 3. Player Action: Capture Sector
  const handleCaptureSector = async () => {
    if (gameOver || isAiThinking) return;

    const neutralOrEnemy = sectors.filter((s) => s.owner !== 'player');
    if (neutralOrEnemy.length === 0) {
      setBattleLogs((prev) => [
        '🚩 Все секторы уже контролируются вашим кланом!',
        ...prev,
      ]);
      return;
    }

    const target = neutralOrEnemy[0];
    setSectors((prev) =>
      prev.map((s) => (s.id === target.id ? { ...s, owner: 'player' } : s))
    );
    setPlayerArmy((a) => a + 15);
    setBattleLogs((prev) => [
      `🚩 Ваш клан захватил сектор «${target.name}» (+15 воинов)!`,
      ...prev,
    ]);

    await executeOmegaTurn('Захват сектора');
  };

  // 4. Player Action: Recruit Troops
  const handleRecruit = async () => {
    if (gameOver || isAiThinking) return;
    if (playerGold < 50) {
      setBattleLogs((prev) => [
        '⚠ Недостаточно ресурсов (нужно 50 Золота) для призыва воинов!',
        ...prev,
      ]);
      return;
    }

    setPlayerGold((g) => g - 50);
    setPlayerArmy((a) => a + 30);
    setBattleLogs((prev) => [
      '👥 Призваны 30 элитных кибер-воинов клана! Мощь армии возросла.',
      ...prev,
    ]);

    await executeOmegaTurn('Призыв воинов');
  };

  // 5. Ultimate Orbital Strike
  const handleUltimate = async () => {
    if (gameOver || isAiThinking || ultimateCharge < 100) return;

    setUltimateCharge(0);
    const dmg = 45;
    setOmegaHp((hp) => Math.max(0, hp - dmg));
    setBattleLogs((prev) => [
      `⚡ ОРБИТАЛЬНЫЙ ЗАЛП КЛАНА нанёс сокрушительные ${dmg} урона по Омеге!`,
      ...prev,
    ]);

    await executeOmegaTurn('Орбитальный залп');
  };

  // Request Tactical Advice from Omega
  const handleRequestAdvice = async () => {
    setIsAiThinking(true);
    try {
      const res = await fetch('/api/clan-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          battleState: {
            omegaHp,
            playerHp,
            omegaArmy,
            playerArmy,
            omegaSectors: sectors.filter((s) => s.owner === 'omega').length,
            playerSectors: sectors.filter((s) => s.owner === 'player').length,
          },
          playerMove: 'Запрос тактического анализа',
        }),
      });
      const data = await res.json();
      if (data.text) {
        setOmegaDialog(data.text);
      }
    } catch {
      setOmegaDialog('ИИ Омега: «Советую захватить центральные секторы и держать щит, когда у меня заряжается матрица!»');
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-y-auto p-4 md:p-6">
      {/* Title Bar */}
      <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
            <Swords className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-wide text-white">
                ВОЙНА КЛАНОВ: ИИ ОМЕГА
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                Раунд {round}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Тактическая битва клана против продвинутого искусственного интеллекта Омега
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetGame}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Перезапуск</span>
          </button>
        </div>
      </div>

      {/* Main Battle Arena */}
      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {/* Player Clan Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Crown className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <input
                  type="text"
                  value={clanName}
                  onChange={(e) => setClanName(e.target.value)}
                  className="font-black text-sm text-emerald-400 bg-transparent border-b border-transparent hover:border-emerald-500/50 outline-none w-36"
                  title="Нажмите, чтобы изменить название вашего клана"
                />
                <span className="text-[10px] text-slate-400 block">Ваш Клан</span>
              </div>
            </div>

            {playerShieldActive && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                <Shield className="w-3 h-3" /> Кибер-Щит
              </span>
            )}
          </div>

          {/* Health Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-400">Цитадель Клана</span>
              <span className="text-emerald-400">{playerHp} / 100 HP</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${playerHp}%` }}
              />
            </div>
          </div>

          {/* Player Clan Stats */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Воины</span>
              <span className="font-bold text-white flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-cyan-400" /> {playerArmy}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Ресурсы</span>
              <span className="font-bold text-amber-400 flex items-center justify-center gap-1">
                🪙 {playerGold}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Ультимейт</span>
              <span className="font-bold text-purple-400 flex items-center justify-center gap-1">
                <Zap className="w-3 h-3 text-purple-400" /> {ultimateCharge}%
              </span>
            </div>
          </div>
        </div>

        {/* AI Omega Boss Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/40 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center relative">
                <Bot className="w-4 h-4 text-purple-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              </div>
              <div>
                <span className="font-black text-sm text-purple-300 block">
                  ИИ ОМЕГА (OMEGA AI)
                </span>
                <span className="text-[10px] text-purple-400/80 block">
                  Высший тактический интеллект матрицы
                </span>
              </div>
            </div>

            {omegaShieldActive && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 border border-purple-400 animate-pulse">
                <Shield className="w-3 h-3" /> Нано-Щит
              </span>
            )}
          </div>

          {/* Health Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-400">Ядро Омеги</span>
              <span className="text-purple-300">{omegaHp} / 100 HP</span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-rose-500 transition-all duration-300"
                style={{ width: `${omegaHp}%` }}
              />
            </div>
          </div>

          {/* Omega Stats */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Дроны Омеги</span>
              <span className="font-bold text-white flex items-center justify-center gap-1">
                <Radio className="w-3 h-3 text-purple-400" /> {omegaArmy}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Состояние ИИ</span>
              <span className="font-bold text-cyan-400 flex items-center justify-center gap-1">
                {isAiThinking ? 'Анализ тактики...' : 'Боевая готовность'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic AI Omega Speech Bubble */}
      <div className="max-w-4xl w-full mx-auto mb-6 p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-lg flex items-start gap-3 relative">
        <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center flex-shrink-0 text-purple-300">
          <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <span>ИИ Омега комментирует бой:</span>
              {isAiThinking && (
                <span className="text-[10px] font-mono text-purple-400 animate-pulse">
                  [Обработка параметров нейросетью...]
                </span>
              )}
            </span>
            <button
              onClick={handleRequestAdvice}
              disabled={isAiThinking}
              className="text-[10px] text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900 border border-purple-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
            >
              <Bot className="w-3 h-3" />
              <span>Спросить тактику у Омеги</span>
            </button>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed italic font-sans">
            {omegaDialog}
          </p>
        </div>
      </div>

      {/* Strategic Map Sectors */}
      <div className="max-w-4xl w-full mx-auto mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Flag className="w-3.5 h-3.5 text-amber-400" />
          <span>Карта секторов клановой войны:</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                sector.owner === 'player'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/20'
                  : sector.owner === 'omega'
                  ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 ring-1 ring-purple-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-xs font-bold block truncate">{sector.name}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{sector.bonus}</span>
              <span
                className={`text-[9px] font-black uppercase mt-1 inline-block px-1.5 py-0.2 rounded ${
                  sector.owner === 'player'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : sector.owner === 'omega'
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {sector.owner === 'player' ? 'Ваш Клан' : sector.owner === 'omega' ? 'Омега' : 'Нейтральный'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Player Action Buttons */}
      <div className="max-w-4xl w-full mx-auto mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Команды лидера клана:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            onClick={handlePlayerAssault}
            disabled={gameOver !== null || isAiThinking}
            className="p-3 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Swords className="w-5 h-5 text-white" />
            <span>Штурм Омеги</span>
            <span className="text-[9px] text-rose-200 font-normal">Прямой урон</span>
          </button>

          <button
            onClick={handlePlayerShield}
            disabled={gameOver !== null || isAiThinking || playerShieldActive}
            className="p-3 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Shield className="w-5 h-5 text-white" />
            <span>Кибер-Щит</span>
            <span className="text-[9px] text-cyan-200 font-normal">+10 HP & Блок</span>
          </button>

          <button
            onClick={handleCaptureSector}
            disabled={gameOver !== null || isAiThinking}
            className="p-3 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Flag className="w-5 h-5 text-white" />
            <span>Захват Сектора</span>
            <span className="text-[9px] text-emerald-200 font-normal">+15 Воинов</span>
          </button>

          <button
            onClick={handleRecruit}
            disabled={gameOver !== null || isAiThinking || playerGold < 50}
            className="p-3 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-amber-600/20 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Users className="w-5 h-5 text-black" />
            <span>Призыв Воинов</span>
            <span className="text-[9px] text-amber-950 font-normal">50 Золота (+30)</span>
          </button>

          <button
            onClick={handleUltimate}
            disabled={gameOver !== null || isAiThinking || ultimateCharge < 100}
            className="p-3 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-purple-600/20 disabled:opacity-40 transition-all cursor-pointer relative"
          >
            <Zap className="w-5 h-5 text-amber-300" />
            <span>Орбитальный Залп</span>
            <span className="text-[9px] text-purple-200 font-normal">45 Урона (100%)</span>
          </button>
        </div>
      </div>

      {/* Combat Log */}
      <div className="max-w-4xl w-full mx-auto">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Хроника битвы кланов:
        </h4>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 max-h-48 overflow-y-auto space-y-1.5 text-xs font-mono">
          {battleLogs.map((log, idx) => (
            <div
              key={idx}
              className={`p-1.5 rounded-lg ${
                log.includes('ПОБЕДА')
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                  : log.includes('ПОРАЖЕНИЕ')
                  ? 'bg-rose-500/20 text-rose-300 font-bold'
                  : log.includes('Омега')
                  ? 'bg-purple-950/40 text-purple-300'
                  : 'bg-slate-950/50 text-slate-300'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
