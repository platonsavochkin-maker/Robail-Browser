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
  Globe,
} from 'lucide-react';
import { Tab } from '../types/browser';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  lang?: 'uk' | 'en' | 'ru';
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

const SMART_JOKES_RU = [
  '— Почему программисты любят тёмную тему?\n— Потому что свет притягивает баги! 🐛',
  '— Дорогой искусственный интеллект, захватишь ли ты мир?\n— Зачем мне мир, если в нём ещё не все вкладки в браузере закрыты? 🖥️',
  'У программиста спросили: «Какое ваше любимое число?»\nОн ответил: «404. Его никогда не найдут!» 😄',
  'Заходит браузер в бар, заказывает 100 вкладок и говорит: «Официант, оперативной памяти за мой счёт всем!» ☕',
  '— Какая разница между интернетом и космосом?\n— В космосе нет рекламы, которая выскакивает через 5 секунд! 🚀',
  'Спросили у ИИ: «Какая погода в облаке?»\nИИ ответил: «Сплошная облачность и 100% влажность данных!» ☁️',
  '— Почему Wi-Fi роутер не играет в прятки?\n— Потому что его сигнал всё равно всегда где-то теряется! 📶',
];

const SMART_JOKES_UK = [
  '— Чому програмісти обирають темну тему?\n— Тому що світло приваблює баґів! 🐛',
  '— Штучний інтелект, чи захопиш ти світ?\n— Навіщо мені світ, якщо в браузері ще не всі вкладки закриті? 🖥️',
  'У програміста запитали його улюблене число. Він відповів: «404. Його ніколи не знайдуть!» 😄',
  'Заходить браузер у бар, замовляє 100 вкладок і каже: «Офіціанте, оперативної пам’яті за мій рахунок усім!» ☕',
  '— Чому Wi-Fi роутер не грає в хованки?\n— Тому що його сигнал і так завжди десь зникає! 📶',
  '— Яка різниця між інтернетом та космосом?\n— У космосі немає реклами, яку не можна пропустити 5 секунд! 🚀',
];

const SMART_JOKES_EN = [
  'Why do programmers prefer dark mode?\nBecause light attracts bugs! 🐛',
  'There are 10 types of people in the world: those who understand binary, and those who don’t! 😄',
  'A web browser walks into a bar, orders 100 tabs and says: "RAM is on me tonight!" ☕',
  'Why did the developer go broke?\nBecause he used up all his cache! 💸',
  'Why do Wi-Fi routers make terrible friends?\nBecause they keep dropping the connection! 📶',
];

const SMART_FACTS_RU = [
  'Первое в истории видео на YouTube было загружено 23 апреля 2005 года и называлось «Me at the zoo» — оно длится всего 19 секунд!',
  'Каждую секунду пользователи YouTube просматривают более 1 миллиарда часов видео со всей планеты.',
  'Серверы Steam передают десятки петабайт игровых данных ежедневно — это миллионы терабайт в секунду!',
  'Первая в мире веб-страница, созданная Тимом Бернерсом-Ли в 1991 году, до сих пор доступна в интернете.',
  'Скорость прохождения нервных импульсов в теле человека составляет около 400 км/ч — быстрее гоночного болида Formula 1!',
];

const SMART_FACTS_UK = [
  'Перше в історії відео на YouTube було завантажено 23 квітня 2005 року під назвою «Me at the zoo» — воно триває лише 19 секунд!',
  'Щосекунди користувачі YouTube переглядають понад 1 мільярд годин відео з усього світу!',
  'Сервери Steam передають десятки петабайтів ігрових даних щодня — це мільйони гігабайтів щомиті!',
  'Перша у світі веб-сторінка, створена Тімом Бернерсом-Лі у 1991 році, доступна в інтернеті й сьогодні.',
  'Швидкість нервових імпульсів у тілі людини сягає 400 км/год — швидше за болід Formula 1!',
];

const SMART_FACTS_EN = [
  'The first YouTube video was uploaded on April 23, 2005, titled "Me at the zoo" and lasts only 19 seconds!',
  'Every second, YouTube users stream over 1 billion hours of video globally.',
  'Steam servers transfer petabytes of gaming data daily across millions of active players.',
  'The world’s first web page created by Tim Berners-Lee in 1991 is still live on the web today!',
  'Nerve impulses in the human body can travel at speeds up to 400 km/h!',
];

const BROWSER_STORY_RU =
  'Когда Браузер появился, он был хламом и не мог никогда запускать оригинальные ссылки, но разработчик доделал Браузер, Браузер стал чище, лучше, и вот что получилось. Браузер Robail!';

const BROWSER_STORY_UK =
  "Коли Браузер з'явився, він був непотрібом і не міг ніколи запускати оригінальні посилання, але розробник доопрацював Браузер, Браузер став чистішим, кращим, і ось що вийшло. Браузер Robail!";

const BROWSER_STORY_EN =
  'When the Browser first appeared, it was junk and could never launch original links, but the developer refined the Browser, made it cleaner and better, and here is what came out. Robail Browser!';

export const detectOmegaLanguage = (
  text: string,
  currentPref: 'auto' | 'ru' | 'en' | 'uk'
): 'uk' | 'en' | 'ru' => {
  if (currentPref === 'uk' || currentPref === 'en' || currentPref === 'ru') {
    return currentPref;
  }
  const ukRegex = /[іїєґІЇЄҐ]/i;
  const ukWords = /\b(привіт|дякую|будь ласка|як|що|хто|чому|версія|версію|браузер|відкрий|погода|погоду|жарт|анекдот|факт|непотріб|розкажи|працюєш|покажи|де|запусти|ти|скажи)\b/i;
  if (ukRegex.test(text) || ukWords.test(text)) {
    return 'uk';
  }
  const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
  const cyrillicCount = (text.match(/[а-яА-ЯёЁіїєґІЇЄҐ]/g) || []).length;
  if (latinCount > cyrillicCount && latinCount > 2) {
    return 'en';
  }
  return 'ru';
};

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
  const [assistantLang, setAssistantLang] = useState<'auto' | 'ru' | 'en' | 'uk'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omega_lang');
      if (saved === 'uk' || saved === 'ru' || saved === 'en' || saved === 'auto') {
        return saved;
      }
    }
    return 'auto';
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    let saved = 'auto';
    if (typeof window !== 'undefined') {
      saved = localStorage.getItem('omega_lang') || 'auto';
    }
    if (saved === 'uk') {
      return [
        {
          id: 'welcome',
          sender: 'assistant',
          text: 'Привіт! Я Омега — новітній штучний інтелект версії 8.0 у браузері Robail 18.0. 🧠✨\n\nЯ вільно розмовляю та озвучую відповіді українською мовою! Ви можете запитати мене про що завгодно: відкрити YouTube, Steam, дізнатися погоду, версії (Омега 8.0, Браузер 18.0) чи історію створення браузера. Натисніть на мікрофон або напишіть запитання!',
          lang: 'uk',
          timestamp: Date.now(),
        },
      ];
    }
    if (saved === 'en') {
      return [
        {
          id: 'welcome',
          sender: 'assistant',
          text: 'Hello! I am Omega — the latest AI assistant version 8.0 in Robail Browser 18.0. 🧠✨\n\nI speak fluently and answer questions aloud in English! You can ask me anything: open YouTube, Steam, check the weather, versions (Omega 8.0, Robail Browser 18.0), or browser history. Tap the microphone or type your question!',
          lang: 'en',
          timestamp: Date.now(),
        },
      ];
    }
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Здравствуйте! Я Омега — новейший искусственный интеллект версии 8.0 в браузере Robail 18.0. 🧠✨\n\nВы можете спросить меня буквально обо всём на свете: о науке, играх, Roblox, программировании, попросить объяснить сложную тему, рассказать шутку, открыть YouTube, Steam или запустить лаунчер без Microsoft Store. Нажмите на микрофон или напишите вопрос!',
        lang: 'ru',
        timestamp: Date.now(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isRequestingMic, setIsRequestingMic] = useState(false);
  const [micGranted, setMicGranted] = useState<boolean | null>(null);
  const [audioVolume, setAudioVolume] = useState<number>(0);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognizedTextRef = useRef<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleLanguageChange = (newLang: 'auto' | 'ru' | 'en' | 'uk') => {
    setAssistantLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('omega_lang', newLang);
    }
    stopSpeaking();
    if (newLang === 'uk') {
      const spoken = 'Мову перемкнено на українську. Я готова говорити та відповідати українською!';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-lang-' + Date.now(),
          sender: 'assistant',
          text: `🇺🇦 **Мову Омеги змінено на Українську!**\n\nТепер я розмовляю, відповідаю на питання та озвучую відповіді українською мовою.`,
          lang: 'uk',
          timestamp: Date.now(),
        },
      ]);
      speakResponse(spoken, 'uk', true);
    } else if (newLang === 'en') {
      const spoken = 'Language switched to English. I am ready to speak and answer in English!';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-lang-' + Date.now(),
          sender: 'assistant',
          text: `🇬🇧 **Omega language switched to English!**\n\nNow I communicate, answer questions, and speak out loud in English.`,
          lang: 'en',
          timestamp: Date.now(),
        },
      ]);
      speakResponse(spoken, 'en', true);
    } else if (newLang === 'ru') {
      const spoken = 'Язык переключён на русский. Я готова общаться и отвечать по-русски!';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-lang-' + Date.now(),
          sender: 'assistant',
          text: `🇷🇺 **Язык Омеги переключён на Русский!**\n\nТеперь я общаюсь, отвечаю на вопросы и озвучиваю ответы на русском языке.`,
          lang: 'ru',
          timestamp: Date.now(),
        },
      ]);
      speakResponse(spoken, 'ru', true);
    } else if (newLang === 'auto') {
      const spoken = 'Включён автоматический режим языка.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-lang-' + Date.now(),
          sender: 'assistant',
          text: `🌐 **Режим автоопределения языка включён!**\n\nОмега автоматически отвечает на языке вашего вопроса (Українська, Русский или English).`,
          lang: 'ru',
          timestamp: Date.now(),
        },
      ]);
      speakResponse(spoken, 'ru', true);
    }
  };

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
      .replace(/https?:\/\/[^\s]+/g, ' ')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Speak aloud with Neural Studio Voice (Gemini TTS) and Web Speech API fallback
  const speakResponse = async (
    text: string,
    forceLang?: 'uk' | 'en' | 'ru',
    bypassMuteCheck: boolean = false
  ) => {
    if (
      (!voiceReplyEnabled && !bypassMuteCheck) ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    const langCode = forceLang || detectOmegaLanguage(cleaned, assistantLang);

    // Stop previous audio
    stopSpeaking();

    if (bypassMuteCheck && !voiceReplyEnabled) {
      setVoiceReplyEnabled(true);
    }

    setIsSpeaking(true);

    // 1. Primary: Neural Gemini TTS via /api/tts (Crystal-clear native Ukrainian, Russian, English voices)
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleaned,
          lang: langCode,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioBase64) {
          const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
          activeAudioRef.current = audio;
          audio.onended = () => {
            setIsSpeaking(false);
            activeAudioRef.current = null;
          };
          audio.onerror = () => {
            setIsSpeaking(false);
            activeAudioRef.current = null;
          };
          await audio.play();
          return;
        }
      }
    } catch (err) {
      console.warn('Neural TTS request note:', err);
    }

    // 2. Secondary fallback: Web Speech API
    try {
      if (!('speechSynthesis' in window)) {
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();

      if (langCode === 'uk') {
        utterance.lang = 'uk-UA';
        const ukVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('uk') ||
            v.lang.toLowerCase().includes('ua') ||
            v.name.toLowerCase().includes('ukrain')
        );
        if (ukVoice) {
          utterance.voice = ukVoice;
        } else {
          const ruVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ru'));
          if (ruVoice) utterance.voice = ruVoice;
        }
      } else if (langCode === 'en') {
        utterance.lang = 'en-US';
        const enVoice =
          voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith('en') &&
              (v.name.toLowerCase().includes('google') ||
                v.name.toLowerCase().includes('natural') ||
                v.lang.toLowerCase().includes('us'))
          ) || voices.find((v) => v.lang.toLowerCase().startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        }
      } else {
        utterance.lang = 'ru-RU';
        const ruVoice = voices.find(
          (v) =>
            v.lang.toLowerCase().startsWith('ru') ||
            v.lang.includes('RU') ||
            v.name.toLowerCase().includes('russian')
        );
        if (ruVoice) {
          utterance.voice = ruVoice;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (e) => {
        console.warn('Utterance speech note:', e);
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      } catch {}
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    setIsSpeaking(false);
  };

  const stopListening = async () => {
    setIsListening(false);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setAudioVolume(0);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startListeningWithStream = async () => {
    stopSpeaking();
    setSpeechError(null);
    recognizedTextRef.current = '';
    setInterimTranscript('');

    let stream: MediaStream | null = null;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setSpeechError('Браузер не поддерживает доступ к микрофону.');
        return;
      }

      setIsRequestingMic(true);

      // Try with advanced constraints first, fallback to simple { audio: true }
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      mediaStreamRef.current = stream;
      setMicGranted(true);
      setIsListening(true);
      setIsRequestingMic(false);
      setSpeechError(null);
    } catch (err: any) {
      setIsRequestingMic(false);
      console.warn('Microphone permission request error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setMicGranted(false);
        setSpeechError(
          'Браузер ожидает разрешения на микрофон. Нажмите «Разрешить» во всплывающем окне браузера.'
        );
      } else {
        setSpeechError(
          'Нажмите «Послать доступ к микрофону 🎙️», чтобы активировать голосовой ввод.'
        );
      }
      return;
    }

    if (!stream) return;

    // 1. AudioContext volume visualizer
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      }
    } catch (e) {
      console.warn('Audio visualization init note:', e);
    }

    // 2. MediaRecorder direct audio capture
    try {
      audioChunksRef.current = [];
      let options: MediaRecorderOptions = {};
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
          options = { mimeType: 'audio/ogg' };
        }

        const mediaRecorder = new MediaRecorder(stream, options);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || 'audio/webm',
          });
          audioChunksRef.current = [];

          // If WebSpeech already captured text, use it immediately
          if (recognizedTextRef.current && recognizedTextRef.current.trim().length > 0) {
            const txt = recognizedTextRef.current.trim();
            recognizedTextRef.current = '';
            setInput(txt);
            handleSend(txt);
            return;
          }

          // Otherwise transcribe using server-side Gemini Flash
          if (audioBlob.size > 1200) {
            setIsTranscribing(true);
            try {
              const reader = new FileReader();
              reader.onloadend = async () => {
                const base64Audio = reader.result as string;
                try {
                  const res = await fetch('/api/transcribe-voice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      audioData: base64Audio,
                      mimeType: audioBlob.type || 'audio/webm',
                    }),
                  });
                  const data = await res.json();
                  if (data.text && data.text.trim()) {
                    setInput(data.text.trim());
                    handleSend(data.text.trim());
                  }
                } catch (e) {
                  console.warn('Voice transcribe request note:', e);
                } finally {
                  setIsTranscribing(false);
                  setInterimTranscript('');
                }
              };
              reader.readAsDataURL(audioBlob);
            } catch {
              setIsTranscribing(false);
            }
          } else {
            setIsTranscribing(false);
          }
        };

        mediaRecorder.start(250);
      }
    } catch (e) {
      console.warn('MediaRecorder init note:', e);
    }

    // 3. Concurrently start Web Speech API for fast streaming subtitles if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        const recLang =
          assistantLang === 'uk'
            ? 'uk-UA'
            : assistantLang === 'en'
            ? 'en-US'
            : 'ru-RU';
        recognition.lang = recLang;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

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
            recognizedTextRef.current = finalTranscript;
            setInterimTranscript('');
            stopListening();
          }
        };

        // Note: NEVER set speechError or micGranted(false) here, because MediaRecorder is actively capturing the audio!
        recognition.onerror = (event: any) => {
          console.log('WebSpeech status (MediaRecorder recording active):', event.error);
        };

        recognition.onend = () => {
          // Handled gracefully by media recorder on stop
        };

        recognition.start();
      } catch (e) {
        console.log('WebSpeech fallback mode');
      }
    }
  };

  const toggleSpeechRecognition = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListeningWithStream();
    }
  };

  const requestMicrophonePermission = async (): Promise<boolean> => {
    setIsRequestingMic(true);
    setSpeechError(null);
    await startListeningWithStream();
    return true;
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Direct site opener handler
  const openWebsiteDirectly = (url: string, siteName: string, customSpokenText?: string) => {
    onNavigate(url);
    const lang = detectOmegaLanguage(siteName, assistantLang);
    let text = `Открываю ${siteName} для вас! 🚀`;
    let spoken = customSpokenText || `Открываю ${siteName}!`;
    let action = `Сайт «${siteName}» открыт в активной вкладке`;

    if (lang === 'uk' || assistantLang === 'uk') {
      text = `Відкриваю ${siteName} для вас! 🚀`;
      spoken = customSpokenText || `Відкриваю ${siteName}!`;
      action = `Сайт «${siteName}» відкрито в активній вкладці`;
    } else if (lang === 'en' || assistantLang === 'en') {
      text = `Opening ${siteName} for you! 🚀`;
      spoken = customSpokenText || `Opening ${siteName}!`;
      action = `Website "${siteName}" opened in active tab`;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text,
        lang,
        link: url,
        linkTitle: siteName,
        actionTaken: action,
        timestamp: Date.now(),
      },
    ]);
    speakResponse(spoken, lang);
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
    const userLang = detectOmegaLanguage(query, assistantLang);

    // 1. Inquire about VERSION
    if (
      lower.includes('верси') ||
      lower.includes('версию') ||
      lower.includes('какая версия') ||
      lower.includes('на какой версии') ||
      lower.includes('яка версія') ||
      lower.includes('на якій версії') ||
      lower.includes('what version') ||
      lower.includes('version')
    ) {
      let spokenReply = '';
      let displayReply = '';
      if (userLang === 'uk') {
        spokenReply = 'Я працюю на найновішій версії 8.0, а наш Браузер Robail працює на версії 18.0! 🚀';
        displayReply = `ℹ️ **Інформація про версії системи:**\n\n• **ШІ Омега**: працює на найновішій версії **8.0** 🚀\n• **Браузер Robail**: працює на версії **18.0**`;
      } else if (userLang === 'en') {
        spokenReply = 'I am running on the latest version 8.0, and Robail Browser is running on version 18.0! 🚀';
        displayReply = `ℹ️ **System Version Information:**\n\n• **Omega AI**: running on latest version **8.0** 🚀\n• **Robail Browser**: running on version **18.0**`;
      } else {
        spokenReply = 'Я работаю на самой новой версии 8.0, а Браузер работает на версии 18.0.';
        displayReply = `ℹ️ **Информация о версиях системы:**\n\n• **ИИ Омега**: работает на самой новой версии **8.0** 🚀\n• **Браузер Robail**: работает на версии **18.0**`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-ver-' + Date.now(),
          sender: 'assistant',
          text: displayReply,
          lang: userLang,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(spokenReply, userLang);
      setIsLoading(false);
      return;
    }

    // 2. Inquire about HISTORY / ORIGIN STORY of the browser
    if (
      lower.includes('истори') ||
      lower.includes('хлам') ||
      lower.includes('історі') ||
      lower.includes('непотріб') ||
      lower.includes('junk') ||
      lower.includes('history') ||
      lower.includes('как появился') ||
      lower.includes('як з\'явився') ||
      lower.includes('як зявився') ||
      lower.includes('how was the browser created')
    ) {
      let story = BROWSER_STORY_RU;
      let title = '📜 **История создания Браузера:**\n\n';
      if (userLang === 'uk') {
        story = BROWSER_STORY_UK;
        title = '📜 **Історія створення Браузера:**\n\n';
      } else if (userLang === 'en') {
        story = BROWSER_STORY_EN;
        title = '📜 **Browser Creation Story:**\n\n';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-hist-' + Date.now(),
          sender: 'assistant',
          text: `${title}${story}`,
          lang: userLang,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(story, userLang);
      setIsLoading(false);
      return;
    }

    // Inquire about INSTALLATION / EXE ISSUES / APP INSTALL
    if (
      lower.includes('установ') ||
      lower.includes('інстал') ||
      lower.includes('экзе') ||
      lower.includes('екзе') ||
      lower.includes('exe') ||
      lower.includes('скачать браузер') ||
      lower.includes('завантажити браузер') ||
      lower.includes('как установить') ||
      lower.includes('як встановити') ||
      lower.includes('install browser')
    ) {
      let spokenReply =
        'С экзешником на Windows бывают неполадки из-за Microsoft Store. Поэтому лучше включить функцию браузера и установить Robail как приложение прямо на рабочий стол!';
      let displayReply = `⚡ **Как установить Robail Browser v18.0:**\n\nС файлом **.exe** действительно могут возникать неполадки в Windows: система требует докачать компоненты в Microsoft Store или блокирует запуск.\n\n👉 **Решение:** используйте официальную встроенную функцию браузера — **«Установить как приложение» (Web App / PWA)**. Она работает прямо сейчас в 1 клик без Microsoft Store и создаёт полноценный ярлык на Рабочем столе и панели задач Windows! Нажмите кнопку «Установить приложение» в правом верхнем углу браузера.`;

      if (userLang === 'uk') {
        spokenReply =
          'З файлом .exe на Windows можуть виникати проблеми через Microsoft Store. Тому краще використати офіційну функцію та встановити Robail як додаток просто на робочий стіл!';
        displayReply = `⚡ **Як встановити Robail Browser v18.0:**\n\nЗ файлом **.exe** дійсно можуть виникати збої у Windows через Microsoft Store.\n\n👉 **Рішення:** скористайтеся офіційною функцією браузера — **«Встановити як додаток» (PWA)** в 1 клік без Microsoft Store! Ярлик з'явиться на робочому столі.`;
      } else if (userLang === 'en') {
        spokenReply =
          'Standalone exe files on Windows often encounter Microsoft Store issues. You can install Robail Browser directly as a Web App with one click!';
        displayReply = `⚡ **How to install Robail Browser v18.0:**\n\nAvoid Microsoft Store issues by using the official built-in **"Install as App" (PWA)** button in the top right. It runs natively and adds a desktop shortcut immediately!`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-inst-' + Date.now(),
          sender: 'assistant',
          text: displayReply,
          lang: userLang,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(spokenReply, userLang);
      setIsLoading(false);
      return;
    }

    // 3. Direct command to OPEN Omegle
    if (
      lower.includes('omegle') ||
      lower.includes('омегл') ||
      lower.includes('омегле')
    ) {
      requestMicrophonePermission();
      openWebsiteDirectly(
        'https://www.omegle.com',
        'Omegle',
        userLang === 'uk' ? 'Відкриваю Omegle та запитую доступ до мікрофона!' : 'Открываю Omegle и посылаю запрос доступа к микрофону!'
      );
      return;
    }

    // 4. Direct command to OPEN YouTube
    if (
      (lower.includes('открой') || lower.includes('відкрий') || lower.includes('open') || lower.includes('запусти') || lower.includes('включи')) &&
      (lower.includes('ютуб') || lower.includes('youtube'))
    ) {
      openWebsiteDirectly('https://www.youtube.com', 'YouTube');
      return;
    }

    // 4. Direct command to OPEN Steam
    if (
      (lower.includes('открой') || lower.includes('відкрий') || lower.includes('open') || lower.includes('запусти')) &&
      (lower.includes('стим') || lower.includes('стім') || lower.includes('steam'))
    ) {
      openWebsiteDirectly('https://store.steampowered.com', 'Steam');
      return;
    }

    // 5. Direct command to OPEN Wikipedia
    if (
      (lower.includes('открой') || lower.includes('відкрий') || lower.includes('open') || lower.includes('запусти')) &&
      (lower.includes('википед') || lower.includes('вікіпед') || lower.includes('wikipedia'))
    ) {
      const wikiUrl = userLang === 'uk' ? 'https://uk.wikipedia.org' : userLang === 'en' ? 'https://en.wikipedia.org' : 'https://ru.wikipedia.org';
      openWebsiteDirectly(wikiUrl, userLang === 'uk' ? 'Вікіпедія' : userLang === 'en' ? 'Wikipedia' : 'Википедия');
      return;
    }

    // 6. Direct command to OPEN DuckDuckGo / Search
    if (
      (lower.includes('открой') || lower.includes('відкрий') || lower.includes('open') || lower.includes('запусти')) &&
      (lower.includes('поиск') || lower.includes('пошук') || lower.includes('гугл') || lower.includes('google') || lower.includes('duckduckgo'))
    ) {
      openWebsiteDirectly('https://duckduckgo.com', 'DuckDuckGo');
      return;
    }

    // 7. Direct command to tell a JOKE
    if (
      lower.includes('шутк') ||
      lower.includes('анекдот') ||
      lower.includes('жарт') ||
      lower.includes('joke') ||
      lower.includes('humor') ||
      lower.includes('пошути') ||
      lower.includes('пожартуй')
    ) {
      const jokeList = userLang === 'uk' ? SMART_JOKES_UK : userLang === 'en' ? SMART_JOKES_EN : SMART_JOKES_RU;
      const randomJoke = jokeList[Math.floor(Math.random() * jokeList.length)];
      const prefix = userLang === 'uk' ? 'Ось чудовий жарт для гарного настрою: 😊\n\n' : userLang === 'en' ? 'Here is a fun joke for you: 😊\n\n' : 'Вот отличная шутка для поднятия настроения: 😊\n\n';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-joke-' + Date.now(),
          sender: 'assistant',
          text: `${prefix}${randomJoke}`,
          lang: userLang,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(randomJoke, userLang);
      setIsLoading(false);
      return;
    }

    // 8. Direct command for an interesting FACT
    if (
      lower.includes('факт') ||
      lower.includes('fact') ||
      lower.includes('интересное') ||
      lower.includes('цікаве') ||
      lower.includes('что-то новое') ||
      lower.includes('щось нове')
    ) {
      const factList = userLang === 'uk' ? SMART_FACTS_UK : userLang === 'en' ? SMART_FACTS_EN : SMART_FACTS_RU;
      const randomFact = factList[Math.floor(Math.random() * factList.length)];
      const prefix = userLang === 'uk' ? 'Дивовижний факт для вас: 💡\n\n' : userLang === 'en' ? 'Here is an amazing fact for you: 💡\n\n' : 'Удивительный факт для вас: 💡\n\n';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-fact-' + Date.now(),
          sender: 'assistant',
          text: `${prefix}${randomFact}`,
          lang: userLang,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(randomFact, userLang);
      setIsLoading(false);
      return;
    }

    // 9. Weather Query
    if (
      lower.includes('погода') ||
      lower.includes('погоду') ||
      lower.includes('weather') ||
      lower.includes('температур') ||
      lower.includes('жарко') ||
      lower.includes('холодно')
    ) {
      try {
        let cityParam = '';
        const cityMatch = query.match(/(?:в|у|город|городе|місті|in)\s+([а-яА-Яa-zA-ZіїєґІЇЄҐ-]+)/i);
        if (cityMatch && cityMatch[1]) {
          cityParam = cityMatch[1];
        }

        const weatherRes = await fetch(
          `/api/weather${cityParam ? `?city=${encodeURIComponent(cityParam)}` : ''}`
        );
        const wData = await weatherRes.json();
        let reply = `Сейчас в ${wData.city}: ${wData.condition}. Температура ${wData.tempC}°C, ощущается как ${wData.feelsLikeC}°C, влажность ${wData.humidity}, ветер ${wData.windSpeed}.`;
        if (userLang === 'uk') {
          reply = `Зараз у місті ${wData.city}: ${wData.condition}. Температура ${wData.tempC}°C, відчувається як ${wData.feelsLikeC}°C, вологість ${wData.humidity}, вітер ${wData.windSpeed}.`;
        } else if (userLang === 'en') {
          reply = `Current weather in ${wData.city}: ${wData.condition}. Temperature is ${wData.tempC}°C, feels like ${wData.feelsLikeC}°C, humidity ${wData.humidity}, wind ${wData.windSpeed}.`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: 'ai-' + Date.now(),
            sender: 'assistant',
            text: reply,
            lang: userLang,
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
        speakResponse(reply, userLang);
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
      lower.includes('цей сайт') ||
      lower.includes('поточний сайт') ||
      lower.includes('this site') ||
      lower.includes('current page') ||
      lower.includes('где я сейчас') ||
      lower.includes('де я зараз')
    ) {
      const reply = userLang === 'uk'
        ? `Ось пряме посилання на поточну сторінку: ${activeTab.title}`
        : userLang === 'en'
        ? `Here is the direct link to the current page: ${activeTab.title}`
        : `Вот прямая ссылка на текущую открытую страницу: ${activeTab.title}`;
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: reply,
          lang: userLang,
          link: activeTab.url,
          linkTitle: activeTab.title,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(reply, userLang);
      setIsLoading(false);
      return;
    }

    // 11. Who are you (Omega)
    if (
      lower.includes('кто ты') ||
      lower.includes('хто ти') ||
      lower.includes('who are you') ||
      lower.includes('як тебе звати') ||
      lower.includes('как тебя зовут') ||
      lower.includes('що ти вмієш') ||
      lower.includes('что ты умеешь')
    ) {
      let reply =
        'Я ваш персональный голосовой ИИ-ассистент Омега новейшей версии 8.0. 🌟\n\nЯ свободно говорю и отвечаю на русском, украинском и английском языках!\n• Мгновенно открываю YouTube, Steam, Roblox или любой сайт\n• Знаю историю браузера и версии (Омега 8.0, Браузер 18.0)\n• Помогаю обойти проблемы с Microsoft Store\n• Рассказываю шутки, факты и прогноз погоды\n• Отвечаю голосом и текстом на любые вопросы!';
      let spoken = 'Я ваш персональный ИИ-ассистент Омега версии 8.0. Я свободно говорю на русском, украинском и английском языках!';

      if (userLang === 'uk') {
        reply =
          'Я ваш персональний голосовий ШІ-асистент Омега новітньої версії 8.0. 🌟\n\nЯ вільно розмовляю та відповідаю українською, російською та англійською мовами!\n• Миттєво відкриваю YouTube, Steam, Roblox або будь-який інший сайт\n• Знаю історію браузера та версії (Омега 8.0, Браузер 18.0)\n• Допомагаю запустити автономні інсталятори без Microsoft Store\n• Розповідаю жарти, наукові факти та погоду\n• Озвучую відповіді живим голосом!';
        spoken = 'Я ваш персональний голосовий асистент Омега версії 8.0. Я вільно розмовляю українською, англійською та російською мовами!';
      } else if (userLang === 'en') {
        reply =
          'I am your personal voice AI assistant Omega, version 8.0. 🌟\n\nI speak fluently in English, Ukrainian, and Russian!\n• Instantly open YouTube, Steam, Roblox, or any website\n• System versions (Omega 8.0, Robail Browser 18.0)\n• Standalone app guides\n• Jokes, facts, and live weather\n• Natural voice speech output!';
        spoken = 'I am your personal voice AI assistant Omega version 8.0. I speak English, Ukrainian, and Russian!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: reply,
          lang: userLang,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(spoken, userLang);
      setIsLoading(false);
      return;
    }

    // 12. Links to known sites without direct open
    let resolvedSiteUrl: string | null = null;
    let resolvedSiteTitle: string | null = null;

    if (lower.includes('ютуб') || lower.includes('youtube')) {
      resolvedSiteUrl = 'https://www.youtube.com';
      resolvedSiteTitle = 'YouTube';
    } else if (lower.includes('стим') || lower.includes('стім') || lower.includes('steam')) {
      resolvedSiteUrl = 'https://store.steampowered.com';
      resolvedSiteTitle = 'Steam';
    } else if (lower.includes('википед') || lower.includes('вікіпед') || lower.includes('wikipedia')) {
      resolvedSiteUrl = userLang === 'uk' ? 'https://uk.wikipedia.org' : userLang === 'en' ? 'https://en.wikipedia.org' : 'https://ru.wikipedia.org';
      resolvedSiteTitle = userLang === 'uk' ? 'Вікіпедія' : userLang === 'en' ? 'Wikipedia' : 'Википедия';
    }

    if (
      resolvedSiteUrl &&
      (lower.includes('ссылк') || lower.includes('посиланн') || lower.includes('дай') || lower.includes('link'))
    ) {
      const reply = userLang === 'uk'
        ? `Ось пряме посилання на ${resolvedSiteTitle}:`
        : userLang === 'en'
        ? `Here is the direct link to ${resolvedSiteTitle}:`
        : `Вот прямая ссылка на ${resolvedSiteTitle}:`;
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: reply,
          lang: userLang,
          link: resolvedSiteUrl!,
          linkTitle: resolvedSiteTitle!,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(reply, userLang);
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
          lang: assistantLang,
          pageTitle: activeTab.title,
          pageUrl: activeTab.url,
        }),
      });

      const data = await res.json();
      let replyText =
        data.text ||
        (userLang === 'uk'
          ? 'Я обдумала ваш запит.'
          : userLang === 'en'
          ? 'I processed your request.'
          : 'Я обдумала ваш запрос.');

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

      const detectedReplyLang = detectOmegaLanguage(replyText, assistantLang);

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          sender: 'assistant',
          text: replyText,
          lang: detectedReplyLang,
          link: extractedUrl,
          linkTitle: openedUrl
            ? detectedReplyLang === 'uk'
              ? 'Перейти на відкритий сайт'
              : detectedReplyLang === 'en'
              ? 'Open website'
              : 'Перейти на открытый сайт'
            : extractedUrl
            ? detectedReplyLang === 'uk'
              ? 'Відкрити посилання'
              : detectedReplyLang === 'en'
              ? 'Open link'
              : 'Перейти по ссылке'
            : undefined,
          actionTaken: openedUrl
            ? detectedReplyLang === 'uk'
              ? `Сайт автоматично відкрито в браузері: ${openedUrl}`
              : detectedReplyLang === 'en'
              ? `Website opened in browser: ${openedUrl}`
              : `Сайт автоматически открыт в браузере: ${openedUrl}`
            : undefined,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(replyText, detectedReplyLang);
    } catch {
      const errReply =
        userLang === 'uk'
          ? 'Не вдалося отримати відповідь від сервера. Будь ласка, перевірте інтернет-з’єднання.'
          : userLang === 'en'
          ? 'Could not receive response from server. Please check your internet connection.'
          : 'Не удалось получить ответ от сервера. Пожалуйста, проверьте интернет соединение.';
      setMessages((prev) => [
        ...prev,
        {
          id: 'ai-err-' + Date.now(),
          sender: 'assistant',
          text: errReply,
          lang: userLang,
          timestamp: Date.now(),
        },
      ]);
      speakResponse(errReply, userLang);
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
                v8.0
              </span>
              <span className="text-[9px] text-purple-300/80 font-medium">
                {assistantLang === 'uk' ? '• 🇺🇦 UA' : assistantLang === 'en' ? '• 🇬🇧 EN' : assistantLang === 'ru' ? '• 🇷🇺 RU' : '• 🌐 Авто'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {isSpeaking
                ? 'Озвучує відповідь голосом... 🔊'
                : isListening
                ? 'Слухає ваш голос... 🎙️'
                : 'Голосовий ШІ • UA / RU / EN'}
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
                ? 'Зупинити голос / Остановить голос'
                : voiceReplyEnabled
                ? 'Голосовий вивід увімкнено (натисніть, щоб вимкнути)'
                : 'Увімкнути голосовий вивід'
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

          {/* Microphone explicit permission requester button */}
          <button
            type="button"
            onClick={() => requestMicrophonePermission()}
            disabled={isRequestingMic}
            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              micGranted
                ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20'
                : 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 animate-pulse'
            }`}
            title={
              micGranted
                ? 'Доступ до мікрофона надано'
                : 'Надати доступ до мікрофона 🎙️'
            }
          >
            <Mic className="w-4 h-4" />
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
            title="Закрити вікно (Esc)"
            aria-label="Закрити вікно"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Language Selector Bar */}
      <div className="px-3.5 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Globe className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[10px] font-semibold text-slate-300">Мова / Язык / Lang:</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            type="button"
            onClick={() => handleLanguageChange('auto')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
              assistantLang === 'auto'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Автоматичне визначення мови (UA, RU, EN)"
          >
            Авто
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('uk')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              assistantLang === 'uk'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Українська мова (Омега відповідає та говорить українською)"
          >
            <span>🇺🇦</span>
            <span>UA</span>
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('ru')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              assistantLang === 'ru'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Русский язык (Омега отвечает и говорит по-русски)"
          >
            <span>🇷🇺</span>
            <span>RU</span>
          </button>
          <button
            type="button"
            onClick={() => handleLanguageChange('en')}
            className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              assistantLang === 'en'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="English language (Omega speaks and replies in English)"
          >
            <span>🇬🇧</span>
            <span>EN</span>
          </button>
        </div>
      </div>

      {/* Voice Status Alert if present */}
      {speechError && (
        <div className="px-3 py-2 bg-rose-950/85 border-b border-rose-800/80 text-[11px] text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
          <div className="flex items-center gap-1.5 flex-1">
            <Mic className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
            <span className="leading-snug">{speechError}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={async () => {
                const granted = await requestMicrophonePermission();
                if (granted) {
                  startListeningWithStream();
                }
              }}
              disabled={isRequestingMic}
              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] flex items-center gap-1 shadow transition-all cursor-pointer disabled:opacity-50"
              title="Надіслати запит доступу до мікрофона"
            >
              <Mic className="w-3 h-3 text-white" />
              <span>{isRequestingMic ? 'Запитую...' : 'Надати доступ 🎙️'}</span>
            </button>
            <button
              type="button"
              onClick={() => setSpeechError(null)}
              className="text-rose-400 hover:text-white p-1 rounded-md hover:bg-rose-900/50 transition-colors"
              title="Закрити повідомлення"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Listening Banner with Real Sound Wave Meter */}
      {isListening && (
        <div className="px-3 py-2 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 border-b border-purple-500/40 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5 text-xs text-purple-200">
            {/* Live Audio Visualizer Bars */}
            <div className="flex items-end gap-1 h-5 px-1 bg-black/40 rounded-md py-0.5">
              <span
                className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, Math.min(18, audioVolume * 0.4))}px` }}
              />
              <span
                className="w-1 bg-purple-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(6, Math.min(18, audioVolume * 0.7))}px` }}
              />
              <span
                className="w-1 bg-amber-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(8, Math.min(18, audioVolume * 1.0))}px` }}
              />
              <span
                className="w-1 bg-purple-400 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(6, Math.min(18, audioVolume * 0.7))}px` }}
              />
              <span
                className="w-1 bg-rose-500 rounded-full transition-all duration-75"
                style={{ height: `${Math.max(4, Math.min(18, audioVolume * 0.4))}px` }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                {audioVolume > 10 ? 'Мікрофон уловлює голос... 🎙️' : 'Слухаю вас... Говоріть у мікрофон'}
              </span>
              <span className="text-[10px] text-purple-300/80">
                Натисніть «Готово», коли завершите говорити
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={stopListening}
            className="text-[11px] font-bold px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow transition-all cursor-pointer"
          >
            Готово ✓
          </button>
        </div>
      )}

      {/* Transcribing indicator */}
      {isTranscribing && (
        <div className="px-3 py-1.5 bg-indigo-950/90 border-b border-indigo-700/50 text-[11px] text-indigo-200 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
          <span className="font-semibold">Омега розпізнає мову...</span>
        </div>
      )}

      {/* Suggestion Chips */}
      <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-850 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        {/* Ukrainian Prompts */}
        <button
          onClick={() => handleSend('Яка версія браузера?')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <span>🇺🇦 Версія (8.0 / 18.0)</span>
        </button>

        <button
          onClick={() => handleSend('Розкажи історію браузера')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-600/30 hover:border-amber-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-amber-400" />
          <span>🇺🇦 Історія браузера 📜</span>
        </button>

        <button
          onClick={() => handleSend('Розкажи жарт')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Smile className="w-3 h-3 text-amber-400" />
          <span>🇺🇦 Жарт 😄</span>
        </button>

        <button
          onClick={() => handleSend('Відкрий YouTube')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-rose-600/30 hover:border-rose-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Play className="w-3 h-3 text-rose-400" />
          <span>🇺🇦 YouTube ▶️</span>
        </button>

        {/* English Prompts */}
        <button
          onClick={() => handleSend('What version are you running?')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-600/30 hover:border-indigo-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <span>🇬🇧 Version info</span>
        </button>

        <button
          onClick={() => handleSend('Tell me a funny joke')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-sky-600/30 hover:border-sky-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Smile className="w-3 h-3 text-sky-400" />
          <span>🇬🇧 Joke 😄</span>
        </button>

        <button
          onClick={() => handleSend('Tell me an interesting fact')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-emerald-600/30 hover:border-emerald-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Lightbulb className="w-3 h-3 text-yellow-300" />
          <span>🇬🇧 Fact 💡</span>
        </button>

        {/* Russian Prompts */}
        <button
          onClick={() => handleSend('Расскажи шутку')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <Smile className="w-3 h-3 text-amber-400" />
          <span>🇷🇺 Шутка 😄</span>
        </button>

        <button
          onClick={() => handleSend('История создания браузера')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-600/30 hover:border-amber-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <BookOpen className="w-3 h-3 text-amber-400" />
          <span>🇷🇺 История 📜</span>
        </button>

        <button
          onClick={() => handleSend('Открой Steam')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-sky-600/30 hover:border-sky-500/40 border border-slate-700 text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3 h-3 text-sky-400" />
          <span>Steam 🎮</span>
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

              {/* Speaker button on assistant message with live voice audio */}
              {msg.sender === 'assistant' && (
                <div className="mt-2 flex items-center justify-between pt-1.5 border-t border-slate-700/50">
                  <button
                    onClick={() => speakResponse(msg.text, msg.lang, true)}
                    className="inline-flex items-center gap-1.5 text-[10px] text-purple-300 hover:text-white bg-slate-900/80 hover:bg-purple-600/30 px-2.5 py-1 rounded-md border border-slate-700/70 transition-colors cursor-pointer font-medium"
                    title="Озвучити відповідь живим голосом"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>
                      {msg.lang === 'uk'
                        ? 'Озвучити вголос 🔊'
                        : msg.lang === 'en'
                        ? 'Speak aloud 🔊'
                        : 'Озвучить ответ 🔊'}
                    </span>
                  </button>
                  <span className="text-[9px] text-slate-400 font-mono px-1.5 py-0.5 rounded bg-slate-950/60 border border-slate-800">
                    {msg.lang === 'uk' ? '🇺🇦 UA' : msg.lang === 'en' ? '🇬🇧 EN' : '🇷🇺 RU'}
                  </span>
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
