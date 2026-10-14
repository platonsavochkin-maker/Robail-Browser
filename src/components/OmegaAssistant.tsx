import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  CloudSun,
  Link2,
  ExternalLink,
  Copy,
  Check,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Wind,
  Droplets,
  Thermometer,
  Smile,
  Lightbulb,
  Square,
  Play,
  BookOpen,
  Info,
} from 'lucide-react';
import { Tab } from '../types/browser';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  link?: string;
  linkTitle?: string;
  actionTaken?: string;
  weatherData?: {
    city: string;
    tempC: string;
    feelsLikeC: string;
    condition: string;
    humidity: string;
    windSpeed: string;
  };
  timestamp: number;
}

interface OmegaAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
  onNavigate: (url: string) => void;
}

const SMART_JOKES = [
  '— Почему программисты любят тёмную тему?\n— Потому что свет притягивает баги! 🐛',
  '— Дорогой искусственный интеллект, захватишь ли ты мир?\n— Зачем мне мир, если в нём ещё не все вкладки в браузере закрыты? 🖥️',
  'У программиста спросили: «Какое ваше любимое число?»\nОн ответил: «404. Его никогда не найдут!» 😄',
  'Заходит браузер в бар, заказывает 100 вкладок и говорит: «Официант, оперативной памяти за мой счёт всем!» ☕',
  '— Какая разница между интернетом и космосом?\n— В космосе нет рекламы, которая выскакивает через 5 секунд! 🚀',
  'Спросили у ИИ: «Какая погода в облаке?»\nИИ ответил: «Сплошная облачность и 100% влажность данных!» ☁️',
  '— Почему Wi-Fi роутер не играет в прятки?\n— Потому что его сигнал всё равно всегда где-то теряется! 📶',
];

const SMART_FACTS = [
  'Первое в истории видео на YouTube было загружено 23 апреля 2005 года и называлось «Me at the zoo» — оно длится всего 19 секунд!',
  'Каждую секунду пользователи YouTube просматривают более 1 миллиарда часов видео со всей планеты.',
  'Серверы Steam передают десятки петабайт игровых данных ежедневно — это миллионы терабайт в секунду!',
  'Первая в мире веб-страница, созданная Тимом Бернерсом-Ли в 1991 году, до сих пор доступна в интернете.',
  'Скорость прохождения нервных импульсов в теле человека составляет около 400 км/ч — быстрее гоночного болида Formula 1!',
];

const BROWSER_STORY =
  'Когда Браузер появился, он был хламом и не мог никогда запускать оригинальные ссылки, но разработчик доделал Браузер, Браузер стал чище, лучше, и вот что получилось. Браузер Robail!';

const renderFormattedText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    if (!line.trim()) {
      return <div key={idx} className="h-1" />;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={idx} className={idx > 0 ? 'mt-0.5' : ''}>
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-bold text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        })}
      </p>
    );
  });
};

export const OmegaAssistant: React.FC<OmegaAssistantProps> = ({
  isOpen,
  onClose,
  activeTab,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Здравствуйте! Я Омега — полноценный искусственный интеллект в браузере Robail. 🧠✨\n\nВы можете спросить меня буквально обо всём на свете: о науке, космосе, истории, программировании, попросить объяснить сложную тему, написать стих, рассказать шутку, открыть YouTube или рассказать историю браузера. Нажмите на микрофон внизу или напишите любой вопрос!',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      stopSpeaking();
      stopListening();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        const targetEl = e.target as HTMLElement;
        if (targetEl.closest('button[title*="Омег"]') || targetEl.closest('button[title*="Ассистент"]')) {
          return;
        }
        stopSpeaking();
        stopListening();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        stopSpeaking();
        stopListening();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, interimTranscript]);

  // Clean text for speech synthesis
  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/\[\[OPEN:[^\]]+\]\]/g, '')
      .replace(/https?:\/\/[^\s]+/g, 'ссылка прикреплена')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Speak aloud with Web Speech API
  const speakResponse = (text: string) => {
    if (!voiceReplyEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const cleaned = cleanTextForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'ru-RU';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const ruVoice = voices.find((v) => v.lang.startsWith('ru') || v.lang.includes('RU'));
      if (ruVoice) {
        utterance.voice = ruVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  // Toggle Speech Recognition
  const toggleSpeechRecognition = () => {
    setSpeechError(null);
    stopSpeaking();

    if (isListening) {
      stopListening();
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Голосовой ввод не поддерживается в этом браузере. Вы можете писать текстом!');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += trans;
          } else {
            currentInterim += trans;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (finalTranscript) {
          setInterimTranscript('');
          setInput(finalTranscript);
          handleSend(finalTranscript);
          stopListening();
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Разрешите доступ к микрофону в браузере для голосового общения.');
        } else if (event.error !== 'no-speech') {
          setSpeechError('Не удалось разобрать речь. Попробуйте еще раз или напишите текстом.');
        }
        stopListening();
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err) {
      console.error('Failed to start recognition:', err);
      stopListening();
      setSpeechError('Ошибка микрофона. Проверьте права доступа.');
      setTimeout(() => setSpeechError(null), 4000);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Direct site opener handler
  const openWebsiteDirectly = (url: string, siteName: string, customSpokenText?: string) => {
    onNavigate(url);
    const text = `Открываю ${siteName} для вас! 🚀`;
    const spoken = customSpokenText || `Открываю ${siteName}!`;

    setMessages((prev) => [
      ...prev,
      {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text,
        link: url,
        linkTitle: siteName,
        actionTaken: `Сайт «${siteName}» открыт в активной вкладке`,
        timestamp: Date.now(),
      },
    ]);
    speakResponse(spoken);
    setIsLoading(false);
  };

  const handleSend = async (customPrompt?: string) => {
    const query = (customPrompt || input).trim();
    if (!query || isLoading) return;

    stopSpeaking();

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    const lower = query.toLowerCase();

    // 1. Inquire about VERSION ("на какой ты версии работаешь", "какая версия", "версия браузера")
    if (
      lower.includes('верси') ||
      lower.includes('версию') ||
      lower.includes('какая версия') ||
      lower.includes('на какой версии') ||
      lower.includes('номер версии') ||
      lower.includes('версия') ||
      lower.includes('version')
    ) {
      const spokenReply = 'Я работаю на версии 5.0, а Браузер работает на версии 15.0.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-ver-' + Date.now(),
          sender: 'assistant',
          text: `ℹ️ **Информация о версиях системы:**\n\n• **ИИ Омега**: работает на версии **5.0**\n• **Браузер Robail**: работает на версии **15.0**`,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(spokenReply);
      setIsLoading(false);
      return;
    }

    // 2. Inquire about HISTORY / ORIGIN STORY of the browser
    if (
      lower.includes('истори') ||
      lower.includes('хлам') ||
      lower.includes('как появился браузер') ||
      lower.includes('как создавался браузер') ||
      lower.includes('откуда браузер') ||
      lower.includes('расскажи о браузере') ||
      lower.includes('история создания') ||
      lower.includes('кто создал браузер')
    ) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-hist-' + Date.now(),
          sender: 'assistant',
          text: `📜 **История создания Браузера:**\n\nКогда Браузер появился, он был хламом и не мог никогда запускать оригинальные ссылки, но разработчик доделал Браузер, Браузер стал чище, лучше, и вот что получилось. **Браузер Robail!**`,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(BROWSER_STORY);
      setIsLoading(false);
      return;
    }

    // 3. Direct command to OPEN YouTube
    if (
      (lower.includes('открой') || lower.includes('запусти') || lower.includes('перейди') || lower.includes('включи')) &&
      (lower.includes('ютуб') || lower.includes('youtube'))
    ) {
      openWebsiteDirectly('https://www.youtube.com', 'YouTube');
      return;
    }

    // 4. Direct command to OPEN Steam
    if (
      (lower.includes('открой') || lower.includes('запусти') || lower.includes('перейди')) &&
      (lower.includes('стим') || lower.includes('steam'))
    ) {
      openWebsiteDirectly('https://store.steampowered.com', 'Steam');
      return;
    }

    // 5. Direct command to OPEN Wikipedia
    if (
      (lower.includes('открой') || lower.includes('запусти') || lower.includes('перейди')) &&
      (lower.includes('википед') || lower.includes('wikipedia'))
    ) {
      openWebsiteDirectly('https://ru.wikipedia.org', 'Википедия');
      return;
    }

    // 6. Direct command to OPEN DuckDuckGo / Search
    if (
      (lower.includes('открой') || lower.includes('запусти') || lower.includes('перейди')) &&
      (lower.includes('поиск') || lower.includes('гугл') || lower.includes('google') || lower.includes('duckduckgo'))
    ) {
      openWebsiteDirectly('https://duckduckgo.com', 'Поисковая система DuckDuckGo');
      return;
    }

    // 7. Direct command to tell a JOKE
    if (
      lower.includes('шутк') ||
      lower.includes('анекдот') ||
      lower.includes('пошути') ||
      lower.includes('рассмеши') ||
      lower.includes('юмор')
    ) {
      const randomJoke = SMART_JOKES[Math.floor(Math.random() * SMART_JOKES.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-joke-' + Date.now(),
          sender: 'assistant',
          text: `Вот отличная шутка для поднятия настроения: 😊\n\n${randomJoke}`,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(randomJoke);
      setIsLoading(false);
      return;
    }

    // 8. Direct command for an interesting FACT
    if (
      lower.includes('факт') ||
      lower.includes('интересное') ||
      lower.includes('что-то новое') ||
      lower.includes('удиви')
    ) {
      const randomFact = SMART_FACTS[Math.floor(Math.random() * SMART_FACTS.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-fact-' + Date.now(),
          sender: 'assistant',
          text: `Удивительный факт для вас: 💡\n\n${randomFact}`,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(`Знаете ли вы, что: ${randomFact}`);
      setIsLoading(false);
      return;
    }

    // 9. Weather Query: "какая сейчас погода", "погода", "температура"
    if (
      lower.includes('погода') ||
      lower.includes('погоду') ||
      lower.includes('температур') ||
      lower.includes('жарко') ||
      lower.includes('холодно')
    ) {
      try {
        let cityParam = '';
        const cityMatch = query.match(/(?:в|город|городе)\s+([а-яА-Яa-zA-Z-]+)/i);
        if (cityMatch && cityMatch[1]) {
          cityParam = cityMatch[1];
        }

        const weatherRes = await fetch(
          `/api/weather${cityParam ? `?city=${encodeURIComponent(cityParam)}` : ''}`
        );
        const wData = await weatherRes.json();
        const reply = `Сейчас в ${wData.city}: ${wData.condition}. Температура ${wData.tempC}°C, ощущается как ${wData.feelsLikeC}°C, влажность ${wData.humidity}, ветер ${wData.windSpeed}.`;

        setMessages((prev) => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'assistant',
            text: reply,
            weatherData: {
              city: wData.city,
              tempC: wData.tempC,
              feelsLikeC: wData.feelsLikeC,
              condition: wData.condition,
              humidity: wData.humidity,
              windSpeed: wData.windSpeed,
            },
            timestamp: Date.now(),
          },
        ]);
        speakResponse(reply);
        setIsLoading(false);
        return;
      } catch (err) {
        console.error('Weather error:', err);
      }
    }

    // 10. Link to CURRENT page
    if (
      lower.includes('этот самый сайт') ||
      lower.includes('этот сайт') ||
      lower.includes('текущий сайт') ||
      lower.includes('где я сейчас') ||
      lower.includes('ссылка на эту страницу')
    ) {
      const currentUrl =
        activeTab.url === 'robail://start'
          ? 'robail://start (Стартовая страница Robail)'
          : activeTab.url;
      const reply = `Вот прямая ссылка на текущую открытую страницу: ${activeTab.title}`;
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: reply,
          link: activeTab.url,
          linkTitle: activeTab.title,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(reply);
      setIsLoading(false);
      return;
    }

    // 11. Who are you (Omega)
    if (
      lower.includes('кто ты') ||
      lower.includes('как тебя зовут') ||
      lower.includes('что ты умеешь') ||
      lower.includes('ты кто')
    ) {
      const reply =
        'Я ваш персональный голосовой ИИ-ассистент Омега. 🌟\n\nЯ умею:\n• Мгновенно открывать YouTube, Steam или любой другой сайт\n• Знаю историю создания браузера и версии (Омега 5.0, Браузер 15.0)\n• Рассказывать шутки и интересные научные факты\n• Подсказывать погоду в любом городе мира\n• Давать ссылки и отвечать на любые ваши вопросы голосом и текстом!';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: reply,
          timestamp: Date.now(),
        },
      ]);
      speakResponse('Я ваш персональный ИИ-ассистент Омега. Могу открыть YouTube, Steam, рассказать историю браузера, назвать версии, пошутить или ответить на любые вопросы!');
      setIsLoading(false);
      return;
    }

    // 12. Links to known sites without direct open
    let resolvedSiteUrl: string | null = null;
    let resolvedSiteTitle: string | null = null;

    if (lower.includes('ютуб') || lower.includes('youtube')) {
      resolvedSiteUrl = 'https://www.youtube.com';
      resolvedSiteTitle = 'YouTube';
    } else if (lower.includes('стим') || lower.includes('steam')) {
      resolvedSiteUrl = 'https://store.steampowered.com';
      resolvedSiteTitle = 'Steam';
    } else if (lower.includes('википед') || lower.includes('wikipedia')) {
      resolvedSiteUrl = 'https://ru.wikipedia.org';
      resolvedSiteTitle = 'Википедия';
    }

    if (
      resolvedSiteUrl &&
      (lower.includes('ссылк') || lower.includes('дай') || lower.includes('как зайти'))
    ) {
      const reply = `Вот прямая ссылка на ${resolvedSiteTitle}:`;
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: reply,
          link: resolvedSiteUrl!,
          linkTitle: resolvedSiteTitle!,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(`Вот ссылка на ${resolvedSiteTitle}. Нажмите кнопку в сообщении для перехода.`);
      setIsLoading(false);
      return;
    }

    // 13. General Super-Intelligent AI response via Gemini (/api/gemini)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          pageTitle: activeTab.title,
          pageUrl: activeTab.url,
        }),
      });

      const data = await res.json();
      let replyText = data.text || 'Я обдумала ваш запрос.';

      // Check if Gemini issued an [[OPEN:URL]] command
      let openedUrl: string | undefined = undefined;
      const openMatch = replyText.match(/\[\[OPEN:(https?:\/\/[^\s\]]+)\]\]/i);
      if (openMatch && openMatch[1]) {
        const dest = openMatch[1];
        openedUrl = dest;
        replyText = replyText.replace(/\[\[OPEN:[^\]]+\]\]/g, '').trim();
        onNavigate(dest);
      }

      // Extract regular URL if mentioned
      const urlMatch = replyText.match(/https?:\/\/[^\s)]+/);
      const extractedUrl = openedUrl || (urlMatch ? urlMatch[0] : undefined);

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: replyText,
          link: extractedUrl,
          linkTitle: openedUrl ? 'Перейти на открытый сайт' : (extractedUrl ? 'Перейти по ссылке' : undefined),
          actionTaken: openedUrl ? `Сайт автоматически открыт в браузере: ${openedUrl}` : undefined,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(replyText);
    } catch {
      const errReply = 'Не удалось получить ответ от сервера. Пожалуйста, проверьте интернет соединение.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'assistant',
          text: errReply,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(errReply);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-12 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl border border-slate-750 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-purple-500/20"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-white">Омега</h3>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                v5.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {isSpeaking
                ? 'Озвучивает ответ...'
                : isListening
                ? 'Слушает ваш голос...'
                : 'Полноценный ИИ • Ответит на любой ваш вопрос'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Sound Reply Toggle */}
          <button
            type="button"
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                setVoiceReplyEnabled(!voiceReplyEnabled);
              }
            }}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              voiceReplyEnabled
                ? 'text-purple-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={
              isSpeaking
                ? 'Остановить голос'
                : voiceReplyEnabled
                ? 'Голосовой ответ включен (нажмите, чтобы выключить)'
                : 'Включить голосовой ответ'
            }
          >
            {isSpeaking ? (
              <Square className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : voiceReplyEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              stopSpeaking();
              stopListening();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
            title="Закрыть окно (Esc)"
            aria-label="Закрыть окно"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Status Alert if present */}
      {speechError && (
        <div className="px-3 py-1.5 bg-rose-950/70 border-b border-rose-800/60 text-[11px] text-rose-300 flex items-center justify-between">
          <span>{speechError}</span>
          <button onClick={() => setSpeechError(null)} className="text-rose-400 hover:text-white ml-2">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Listening Banner */}
      {isListening && (
        <div className="px-3 py-2 bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/40 border-b border-purple-500/30 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2 text-xs text-purple-200">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-semibold">Слушаю вас... Говорите в микрофон</span>
          </div>
          <button
            onClick={stopListening}
            className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 cursor-pointer"
          >
            Стоп
          </button>
        </div>
      )}

      {/* Suggestion Chips */}
      <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-850 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        <button
          onClick={() => handleSend('Расскажи историю браузера')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-600/30 hover:border-amber-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-amber-400" />
          <span>История браузера 📜</span>
        </button>

        <button
          onClick={() => handleSend('На какой версии ты работаешь?')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Info className="w-3 h-3 text-indigo-400" />
          <span>Версии (5.0 / 15.0) 🔢</span>
        </button>

        <button
          onClick={() => handleSend('Расскажи шутку')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Smile className="w-3 h-3 text-amber-400" />
          <span>Шутка 😄</span>
        </button>

        <button
          onClick={() => handleSend('Открой YouTube')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-rose-600/30 hover:border-rose-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Play className="w-3 h-3 text-rose-400" />
          <span>YouTube ▶️</span>
        </button>

        <button
          onClick={() => handleSend('Открой Steam')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-sky-600/30 hover:border-sky-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3 h-3 text-sky-400" />
          <span>Steam 🎮</span>
        </button>

        <button
          onClick={() => handleSend('Расскажи интересный факт')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Lightbulb className="w-3 h-3 text-yellow-300" />
          <span>Факт 💡</span>
        </button>

        <button
          onClick={() => handleSend('Какая сейчас погода?')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <CloudSun className="w-3 h-3 text-amber-400" />
          <span>Погода 🌤️</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 max-h-80 min-h-48 overflow-y-auto p-3 space-y-3 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3 leading-relaxed relative group ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-xs'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-xs'
              }`}
            >
              <div className="text-xs leading-relaxed">
                {renderFormattedText(msg.text)}
              </div>

              {/* Action Banner (e.g. Website Opened) */}
              {msg.actionTaken && (
                <div className="mt-2 p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2 text-emerald-300 text-[11px] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{msg.actionTaken}</span>
                </div>
              )}

              {/* Speaker button on assistant message */}
              {msg.sender === 'assistant' && (
                <div className="mt-2 flex items-center gap-1.5 pt-1 border-t border-slate-700/50">
                  <button
                    onClick={() => speakResponse(msg.text)}
                    className="inline-flex items-center gap-1 text-[10px] text-purple-300 hover:text-white bg-slate-900/60 hover:bg-purple-600/30 px-2 py-0.5 rounded-md border border-slate-700/60 transition-colors cursor-pointer"
                    title="Озвучить ответ голосом"
                  >
                    <Volume2 className="w-3 h-3 text-purple-400" />
                    <span>Озвучить ответ</span>
                  </button>
                </div>
              )}

              {/* Weather Visual Card if present */}
              {msg.weatherData && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CloudSun className="w-5 h-5 text-amber-400" />
                      <span className="font-bold text-white text-xs">
                        {msg.weatherData.city}
                      </span>
                    </div>
                    <span className="text-base font-black text-amber-300">
                      {msg.weatherData.tempC}°C
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 pt-1 border-t border-slate-800">
                    <div className="flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-rose-400" />
                      <span>Ощущается: {msg.weatherData.feelsLikeC}°C</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" />
                      <span>Влажность: {msg.weatherData.humidity}</span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <Wind className="w-3 h-3 text-slate-400" />
                      <span>Ветер: {msg.weatherData.windSpeed}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Link Box if present */}
              {msg.link && (
                <div className="mt-2.5 p-2 rounded-xl bg-slate-900 border border-slate-750 flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono text-cyan-300 truncate block">
                    {msg.link}
                  </span>
                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        onNavigate(msg.link!);
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Открыть в браузере</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleCopyLink(msg.link!)}
                      className="p-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedLink === msg.link ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Копировать</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span className="text-[9px] text-slate-500 mt-0.5 px-1">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}

        {interimTranscript && (
          <div className="flex flex-col items-end">
            <div className="max-w-[85%] rounded-2xl p-2.5 bg-purple-700/60 text-purple-200 border border-purple-500/40 text-xs italic">
              <span className="animate-pulse">🎙️ {interimTranscript}...</span>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 p-2 text-slate-400 text-xs animate-pulse">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <span>Омега думает и готовит ответ...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          title={isListening ? 'Остановить запись голоса' : 'Сказать голосом Омеге'}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/40 shadow-lg shadow-rose-600/30'
              : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30'
          }`}
        >
          {isListening ? (
            <Mic className="w-4 h-4 text-white" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={
            isListening
              ? 'Слушаю вас... Говорите'
              : 'Задайте Омеге буквально любой вопрос...'
          }
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 transition-colors"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
          title="Отправить сообщение"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
