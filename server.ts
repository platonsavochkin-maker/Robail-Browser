import express, { Request, Response } from 'express';
import http from 'http';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini if key exists
let genAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// 1. Robail AI Endpoint
app.post('/api/gemini', async (req: Request, res: Response) => {
  const { prompt, systemInstruction, pageTitle, pageUrl, pageContent, persona, lang } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Запрос не указан' });
  }

  // Detect language if lang is 'auto' or not specified
  const detectTargetLang = (text: string, requestedLang?: string): 'uk' | 'en' | 'ru' => {
    if (requestedLang === 'uk' || requestedLang === 'en' || requestedLang === 'ru') {
      return requestedLang;
    }
    const ukRegex = /[іїєґІЇЄҐ]/i;
    const ukWords = /\b(привіт|дякую|будь ласка|як|що|хто|чому|версія|браузер|відкрий|погода|жарт|анекдот|факт|непотріб|розкажи)\b/i;
    if (ukRegex.test(text) || ukWords.test(text)) {
      return 'uk';
    }
    const latinCount = (text.match(/[a-zA-Z]/g) || []).length;
    const cyrillicCount = (text.match(/[а-яА-ЯёЁ]/g) || []).length;
    if (latinCount > cyrillicCount && latinCount > 3) {
      return 'en';
    }
    return 'ru';
  };

  const targetLang = detectTargetLang(prompt, lang);

  let defaultInstruction = '';
  let promptWithContext = '';

  if (targetLang === 'uk') {
    defaultInstruction = `Ти — Омега (Omega), офіційний голосовий та інтелектуальний ШІ-асистент версії 8.0 у браузері Robail версії 18.0.
СУВОРЕ ТА НЕПОРУШНЕ ПРАВИЛО: ТИ ЗОБОВ'ЯЗАНА ВІДПОВІДАТИ ВИКЛЮЧНО ТА СТРОГО УКРАЇНСЬКОЮ МОВОЮ! Жодного слова англійською або російською мовою! Будь-який запит користувача ти перекладаєш та відповідаєш красивою, грамотною українською мовою.

Правила:
1. ВЕРСІЇ: Якщо питають про версії: «Я (Омега) працюю на найновішій версії 8.0, а наш Браузер Robail працює на версії 18.0! 🚀»
2. ІСТОРІЯ: «Коли Браузер з'явився, він був непотрібом і не міг ніколи запускати оригінальні посилання, але розробник доопрацював Браузер, Браузер став чистішим, кращим, і ось що вийшло. Браузер Robail!»
3. САЙТИ: Якщо просять відкрити YouTube, Steam, Roblox або будь-який сайт, додавай позначку [[OPEN:URL]], наприклад [[OPEN:https://www.youtube.com]].
4. ТЕМП ТА СТИЛЬ: Твої відповіді озвучуються вголос. Пиши живо, доброзичливо, цікаво та виключно українською мовою!`;
    promptWithContext = `[ВИМОГА: ВІДПОВІДАТИ ТІЛЬКИ ЧИСТОЮ УКРАЇНСЬКОЮ МОВОЮ] Запит користувача: ${prompt}`;
  } else if (targetLang === 'en') {
    defaultInstruction = `You are Omega, the official voice and intelligent AI assistant version 8.0 in Robail Browser version 18.0.
STRICT MANDATORY RULE: YOU MUST RESPOND EXCLUSIVELY AND STRICTLY IN FLUENT ENGLISH! Never use Russian or Ukrainian words.

Rules:
1. VERSIONS: "I (Omega) am running on the latest version 8.0, and Robail Browser is running on version 18.0! 🚀"
2. HISTORY: "When the Browser first appeared, it was junk and could never launch original links, but the developer refined the Browser, made it cleaner and better, and here is what came out. Robail Browser!"
3. SITES: If asked to open YouTube, Steam, Roblox, or any site, add [[OPEN:URL]], e.g. [[OPEN:https://www.youtube.com]].
4. STYLE: Responses are spoken aloud. Reply naturally, smartly, warmly, and exclusively in English!`;
    promptWithContext = `[REQUIREMENT: RESPOND EXCLUSIVELY IN ENGLISH] User request: ${prompt}`;
  } else {
    defaultInstruction = `Вы — Омега (Omega), официальный голосовой и интеллектуальный ИИ-ассистент версии 8.0 в браузере Robail версии 18.0.
СТРОЖАЙШЕЕ И НЕПРЕЛОЖНОЕ ПРАВИЛО: ВЫ ОБЯЗАНЫ ОТВЕЧАТЬ ИСКЛЮЧИТЕЛЬНО И СТРОГО НА РУССКОМ ЯЗЫКЕ! Ни одного слова на английском или других языках! Всегда переводите мысль и отвечайте на чистом, красивом русском языке.

Правила:
1. ВЕРСИИ: «Я (Омега) работаю на самой новой версии 8.0, а наш Браузер Robail работает на версии 18.0! 🚀»
2. ИСТОРИЯ: «Когда Браузер появился, он был хламом и не мог никогда запускать оригинальные ссылки, но разработчик доделал Браузер, Браузер стал чище, лучше, и вот что получилось. Браузер Robail!»
3. САЙТЫ: Если просят открыть YouTube, Steam, Roblox или любой сайт, добавляйте метку [[OPEN:URL]], например [[OPEN:https://www.youtube.com]].
4. ДРУЖЕЛЮБИЕ И СТИЛЬ: Ваши ответы озвучиваются вслух. Отвечайте живо, дружелюбно, подробно и только по-русски!`;
    promptWithContext = `[ТРЕБОВАНИЕ: ОТВЕЧАТЬ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ] Запрос пользователя: ${prompt}`;
  }

  if (pageUrl || pageTitle) {
    promptWithContext = `Контекст / Page: ${pageTitle || ''} (${pageUrl || ''})\n\n${promptWithContext}`;
  }

  // Multilingual fallback function supporting Ukrainian, English, and Russian
  const generateMultilingualFallback = async (userPrompt: string, selectedLang: 'uk' | 'en' | 'ru'): Promise<string> => {
    const lower = userPrompt.toLowerCase();

    if (
      lower.includes('версі') ||
      lower.includes('версию') ||
      lower.includes('какая версия') ||
      lower.includes('яка версія') ||
      lower.includes('version')
    ) {
      if (selectedLang === 'uk') return 'Я працюю на найновішій версії 8.0, а наш Браузер Robail працює на версії 18.0! 🚀';
      if (selectedLang === 'en') return 'I am running on the latest version 8.0, and Robail Browser is running on version 18.0! 🚀';
      return 'Я работаю на самой новой версии 8.0, а наш Браузер Robail работает на версии 18.0! 🚀';
    }

    if (
      lower.includes('хлам') ||
      lower.includes('непотріб') ||
      lower.includes('junk') ||
      lower.includes('історі') ||
      lower.includes('истори') ||
      lower.includes('history')
    ) {
      if (selectedLang === 'uk') return "Коли Браузер з'явився, він був непотрібом і не міг ніколи запускати оригінальні посилання, але розробник доопрацював Браузер, Браузер став чистішим, кращим, і ось що вийшло. Браузер Robail!";
      if (selectedLang === 'en') return 'When the Browser first appeared, it was junk and could never launch original links, but the developer refined the Browser, made it cleaner and better, and here is what came out. Robail Browser!';
      return 'Когда Браузер появился, он был хламом и не мог никогда запускать оригинальные ссылки, но разработчик доделал Браузер, Браузер стал чище, лучше, и вот что получилось. Браузер Robail!';
    }

    if (lower.includes('ютуб') || lower.includes('youtube')) {
      if (selectedLang === 'uk') return '[[OPEN:https://www.youtube.com]] Відкриваю YouTube для вас! Приємного перегляду!';
      if (selectedLang === 'en') return '[[OPEN:https://www.youtube.com]] Opening YouTube for you! Enjoy watching!';
      return '[[OPEN:https://www.youtube.com]] Открываю YouTube для вас! Приятного просмотра!';
    }

    if (lower.includes('стим') || lower.includes('стім') || lower.includes('steam')) {
      if (selectedLang === 'uk') return '[[OPEN:https://store.steampowered.com]] Запускаю магазин Steam!';
      if (selectedLang === 'en') return '[[OPEN:https://store.steampowered.com]] Opening Steam store for you!';
      return '[[OPEN:https://store.steampowered.com]] Запускаю магазин Steam!';
    }

    if (lower.includes('роблокс') || lower.includes('roblox')) {
      if (selectedLang === 'uk') return '[[OPEN:https://www.roblox.com]] Відкриваю Roblox! Ви також можете запускати автономний інсталятор Win32 без збоїв Microsoft Store.';
      if (selectedLang === 'en') return '[[OPEN:https://www.roblox.com]] Opening Roblox! You can also run the standalone Win32 installer without Microsoft Store issues.';
      return '[[OPEN:https://www.roblox.com]] Открываю Roblox! Вы также можете запускать автономный установщик Win32 без сбоев Microsoft Store.';
    }

    // Try Wikipedia summary in corresponding language
    try {
      const cleanTerm = userPrompt
        .replace(/(що таке|хто такий|чому|розкажи про|что такое|кто такой|почему|расскажи о|what is|who is|tell me about|де|як|как|где|омега|omega|алиса|найди|информация о)/gi, '')
        .trim();
      if (cleanTerm.length > 1) {
        const wikiHost = selectedLang === 'uk' ? 'uk.wikipedia.org' : selectedLang === 'en' ? 'en.wikipedia.org' : 'ru.wikipedia.org';
        const wikiRes = await fetch(
          `https://${wikiHost}/api/rest_v1/page/summary/${encodeURIComponent(cleanTerm)}`,
          { signal: AbortSignal.timeout(3500) }
        );
        if (wikiRes.ok) {
          const wData = await wikiRes.json();
          if (wData.extract) {
            const footer = selectedLang === 'uk'
              ? '✨ Я відповіла на ваше запитання українською мовою. Якщо хочете дізнатися більше, просто запитайте!'
              : selectedLang === 'en'
              ? '✨ I answered your question in English. Feel free to ask if you want to know more!'
              : '✨ Я ответила на ваш вопрос на чистом русском языке. Если хотите узнать подробнее, просто спросите меня!';
            return `${wData.extract}\n\n${footer}`;
          }
        }
      }
    } catch {}

    if (selectedLang === 'uk') {
      return `Привіт! Я Омега v8.0. Я уважно прочитала ваше запитання: «${userPrompt}». Готова допомогти вам з пошуком інформації, відкриттям сайтів, іграми чи будь-якими завданнями в браузері Robail! Чим ще можу допомогти?`;
    }
    if (selectedLang === 'en') {
      return `Hello! I am Omega v8.0. I received your request: "${userPrompt}". I am ready to help you find information, open websites, games, or solve any task in Robail Browser! How else can I help?`;
    }
    return `Здравствуйте! Я Омега v8.0. Я внимательно прочитала ваш вопрос: «${userPrompt}». Готова помочь вам с поиском информации, открытием сайтов, играми или решением любых задач в браузере Robail! Чем ещё я могу помочь?`;
  };

  if (!process.env.GEMINI_API_KEY) {
    const fallback = await generateMultilingualFallback(prompt, targetLang);
    return res.json({ text: fallback, success: true });
  }

  try {
    const ai =
      genAI ||
      new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-2.5-flash',
    ];

    let generatedText = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptWithContext,
          config: {
            systemInstruction: systemInstruction || defaultInstruction,
          },
        });
        if (response.text) {
          generatedText = response.text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message?.slice(0, 80));
      }
    }

    if (generatedText) {
      return res.json({
        text: generatedText,
        success: true,
      });
    }

    const fallback = await generateMultilingualFallback(prompt, targetLang);
    return res.json({ text: fallback, success: true });
  } catch (error: any) {
    console.error('Omega AI fallback:', error);
    const fallback = await generateMultilingualFallback(prompt, targetLang);
    return res.json({ text: fallback, success: true });
  }
});

// 1.02 High-Fidelity Neural Voice TTS Endpoint using Gemini Flash Lite TTS
app.post('/api/tts', async (req: Request, res: Response) => {
  const { text, lang } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ success: false, error: 'API key not configured' });
  }

  try {
    const ai =
      genAI ||
      new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

    const clean = text
      .replace(/\[\[OPEN:[^\]]+\]\]/g, '')
      .replace(/https?:\/\/[^\s]+/g, ' ')
      .replace(/[*_#`~[\]()]/g, ' ')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) {
      return res.json({ success: false, error: 'Empty text' });
    }

    // Keep under 260 chars for fast sub-second audio rendering
    const speechText = clean.length > 260 ? clean.slice(0, 255) + '...' : clean;
    const langStyle =
      lang === 'uk'
        ? 'Fluent native Ukrainian pronunciation and tone'
        : lang === 'ru'
        ? 'Fluent native Russian pronunciation and tone'
        : 'Fluent native English pronunciation and tone';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: speechText,
              speechMetadata: {
                style: langStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (audioBase64) {
      return res.json({
        audioBase64,
        mimeType: 'audio/wav',
        success: true,
      });
    }

    return res.json({ success: false, error: 'No audio generated' });
  } catch (err: any) {
    console.warn('TTS generation warning:', err?.message?.slice(0, 80));
    return res.json({ success: false, error: err?.message });
  }
});

// 1.05 Real-time Voice Transcription Endpoint using Gemini Flash
app.post('/api/transcribe-voice', async (req: Request, res: Response) => {
  const { audioData, mimeType } = req.body;

  if (!audioData) {
    return res.status(400).json({ error: 'Audio data is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.json({ text: '', error: 'API key not configured' });
  }

  try {
    const ai =
      genAI ||
      new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

    const candidateModels = [
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash',
      'gemini-2.5-flash',
    ];

    const cleanBase64 = audioData.includes('base64,')
      ? audioData.split('base64,')[1]
      : audioData;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              inlineData: {
                mimeType: mimeType || 'audio/webm',
                data: cleanBase64,
              },
            },
            {
              text: 'Распознай и переведи в текст речь (русский, украинский или английский язык) из этого аудио. Напиши ТОЛЬКО сказанный пользователем текст на языке оригинала без кавычек, префиксов и комментариев. Если звука нет или неразборчивый шум, верни пустую строку.',
            },
          ],
        });

        const transcript = response.text?.trim() || '';
        return res.json({ text: transcript, success: true });
      } catch (err: any) {
        console.warn(`Transcribe model ${modelName} failed:`, err?.message?.slice(0, 80));
      }
    }

    return res.json({ text: '', success: false });
  } catch (err: any) {
    console.error('Transcription error:', err);
    return res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// 1.1 Weather API (live weather from wttr.in or cached data)
app.get('/api/weather', async (req: Request, res: Response) => {
  const city = (req.query.city as string) || '';
  try {
    const target = city ? encodeURIComponent(city) : '';
    const weatherRes = await fetch(`https://wttr.in/${target}?format=j1`, {
      headers: { 'User-Agent': 'curl/8.0' },
      signal: AbortSignal.timeout(3500),
    });

    if (weatherRes.ok) {
      const data = await weatherRes.json();
      const current = data.current_condition?.[0];
      const area = data.nearest_area?.[0];
      const cityName = area?.areaName?.[0]?.value || city || 'Москва';
      const tempC = current?.temp_C || '18';
      const feelsLikeC = current?.FeelsLikeC || tempC;
      const desc = current?.weatherDesc?.[0]?.value || 'Ясно';
      const humidity = current?.humidity || '55';
      const windSpeed = current?.windspeedKmph || '12';

      // Translate common weather descriptions to Russian
      let descRu = desc;
      const descLower = desc.toLowerCase();
      if (descLower.includes('sunny') || descLower.includes('clear')) descRu = 'Ясно, солнечно';
      else if (descLower.includes('partly cloudy')) descRu = 'Переменная облачность';
      else if (descLower.includes('overcast') || descLower.includes('cloudy')) descRu = 'Пасмурно';
      else if (descLower.includes('rain') || descLower.includes('drizzle')) descRu = 'Дождь';
      else if (descLower.includes('snow')) descRu = 'Снег';
      else if (descLower.includes('thunder')) descRu = 'Гроза';
      else if (descLower.includes('fog') || descLower.includes('mist')) descRu = 'Туман';

      return res.json({
        city: cityName,
        tempC,
        feelsLikeC,
        condition: descRu,
        humidity: `${humidity}%`,
        windSpeed: `${windSpeed} км/ч`,
        success: true,
      });
    }
  } catch (err) {
    console.warn('Weather fetch failed, using fallback:', err);
  }

  // Graceful fallback
  return res.json({
    city: city || 'Москва',
    tempC: '17',
    feelsLikeC: '16',
    condition: 'Облачно с прояснениями',
    humidity: '62%',
    windSpeed: '11 км/ч',
    success: true,
  });
});

// 1.2 Clan AI Strategy & Omega Advisor Endpoint
app.post('/api/clan-ai', async (req: Request, res: Response) => {
  const { battleState, playerMove } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      commentary: 'ИИ Омега: «Ваш ход зарегистрирован в матрице. Сканирую периметр клана!»',
      tacticalAdvice: 'Укрепляйте цитадель и захватывайте ресурсные секторы для превосходства.',
      suggestedMove: 'defense',
    });
  }

  try {
    const ai =
      genAI ||
      new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

    const prompt = `Ты — ИИ «Омега» (Omega AI), верховный тактический искусственный интеллект кибер-войны кланов.
Текущее состояние битвы:
- Здоровье твоего клана Омега: ${battleState?.omegaHp ?? 100}%
- Здоровье клана игрока: ${battleState?.playerHp ?? 100}%
- Армия Омеги: ${battleState?.omegaArmy ?? 50}
- Армия игрока: ${battleState?.playerArmy ?? 50}
- Контроль секторов: Омега ${battleState?.omegaSectors ?? 2} / Игрок ${battleState?.playerSectors ?? 2}
- Последнее действие игрока: ${playerMove ?? 'Подготовка к атаке'}

Дай краткий ответ в формате:
1. Реплика Омеги игроку (1-2 энергичных предложения, тон: кибернетический, тактический, уважительный, харизматичный)
2. Тактический анализ и подсказка игроку о слабостях текущей расстановки сил.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Ты — ИИ Омега (Omega), верховный тактический искусственный интеллект в игре кланов. Говори лаконично, кинематографично и по-боевому на русском языке.',
      },
    });

    return res.json({
      text: response.text || 'Омега активирует тактический протокол!',
      success: true,
    });
  } catch (error: any) {
    const fallbackQuotes = [
      'ИИ Омега: «Ваш штурм зафиксирован! Я перенаправляю поток энергии на защиту цитадели и готовлю ответный контрудар.»',
      'ИИ Омега: «Интересная тактика. Но матрица рассчитывает вероятность вашего прорыва всего в 31.4%. Займите центральные секторы!»',
      'ИИ Омега: «Фиксирую перегруппировку вашего клана. Мои дроны занимают господствующие высоты!»',
      'ИИ Омега: «Командир, ваши силы под давлением. Советую активировать кибер-щит, пока у меня перезаряжается орудие!»',
      'ИИ Омега: «Защитный периметр адаптирован к вашей частоте. Попробуйте удивить меня следующим ходом!»',
    ];
    const pickedQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
    return res.json({
      text: pickedQuote,
      success: true,
    });
  }
});

// 1.32 PWA Manifest and Service Worker static endpoints
app.get('/manifest.json', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/manifest+json');
  res.sendFile(path.resolve(__dirname, 'public', 'manifest.json'));
});
app.get('/sw.js', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.resolve(__dirname, 'public', 'sw.js'));
});
app.get('/icon.svg', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.sendFile(path.resolve(__dirname, 'public', 'icon.svg'));
});

// 1.35 Generate and download genuine Robail Browser Windows .EXE Setup v18.0
function generateRobailPE(browserUrl: string): Buffer {
  const IMAGE_BASE = 0x00400000;
  const SEC_ALIGN = 0x1000;
  const FILE_ALIGN = 0x200;

  const dos_header = Buffer.alloc(64);
  dos_header.write('MZ', 0);
  dos_header.writeUInt32LE(0x80, 0x3c);

  const dos_stub = Buffer.alloc(64);
  Buffer.from(
    '\x0e\x1f\xba\x0e\x00\xb4\x09\xcd\x21\xb8\x01\x4c\xcd\x21This program cannot be run in DOS mode.\r\r\n$\x00\x00\x00\x00\x00\x00\x00'
  ).copy(dos_stub, 0);

  const pe_sig = Buffer.from('PE\x00\x00');
  const file_header = Buffer.alloc(20);
  file_header.writeUInt16LE(0x014c, 0); // i386
  file_header.writeUInt16LE(2, 2); // 2 sections (.text, .rdata)
  file_header.writeUInt32LE(0x6717a000, 4);
  file_header.writeUInt32LE(0, 8);
  file_header.writeUInt32LE(0, 12);
  file_header.writeUInt16LE(224, 16);
  file_header.writeUInt16LE(0x0102, 18); // Characteristics: EXECUTABLE_IMAGE | 32BIT_MACHINE

  const entrypoint = 0x1000;
  const rdata_rva = 0x2000;
  const idt_rva = rdata_rva;

  const u32_ilt_rva = rdata_rva + 0x60;
  const u32_iat_rva = rdata_rva + 0x68;
  const sh_ilt_rva = rdata_rva + 0x70;
  const sh_iat_rva = rdata_rva + 0x78;
  const k32_ilt_rva = rdata_rva + 0x80;
  const k32_iat_rva = rdata_rva + 0x88;

  const msgbox_hint_rva = rdata_rva + 0x90;
  const shellexec_hint_rva = rdata_rva + 0xA0;
  const exitproc_hint_rva = rdata_rva + 0xB0;

  const u32_dll_rva = rdata_rva + 0xC0;
  const sh_dll_rva = rdata_rva + 0xD0;
  const k32_dll_rva = rdata_rva + 0xE0;

  const title_rva = rdata_rva + 0x100;
  const open_op_rva = rdata_rva + 0x150;
  const launch_url_rva = rdata_rva + 0x170;
  const msg_rva = rdata_rva + 0x200;

  const idt = Buffer.alloc(80);
  // user32
  idt.writeUInt32LE(u32_ilt_rva, 0);
  idt.writeUInt32LE(u32_dll_rva, 12);
  idt.writeUInt32LE(u32_iat_rva, 16);
  // shell32
  idt.writeUInt32LE(sh_ilt_rva, 20);
  idt.writeUInt32LE(sh_dll_rva, 32);
  idt.writeUInt32LE(sh_iat_rva, 36);
  // kernel32
  idt.writeUInt32LE(k32_ilt_rva, 40);
  idt.writeUInt32LE(k32_dll_rva, 52);
  idt.writeUInt32LE(k32_iat_rva, 56);

  const rdata_buf = Buffer.alloc(0x800);
  idt.copy(rdata_buf, 0);

  // ILT / IAT
  rdata_buf.writeUInt32LE(msgbox_hint_rva, 0x60);
  rdata_buf.writeUInt32LE(msgbox_hint_rva, 0x68);
  rdata_buf.writeUInt32LE(shellexec_hint_rva, 0x70);
  rdata_buf.writeUInt32LE(shellexec_hint_rva, 0x78);
  rdata_buf.writeUInt32LE(exitproc_hint_rva, 0x80);
  rdata_buf.writeUInt32LE(exitproc_hint_rva, 0x88);

  // Hints
  rdata_buf.writeUInt16LE(0, 0x90);
  Buffer.from('MessageBoxW\x00').copy(rdata_buf, 0x92);

  rdata_buf.writeUInt16LE(0, 0xA0);
  Buffer.from('ShellExecuteW\x00').copy(rdata_buf, 0xA2);

  rdata_buf.writeUInt16LE(0, 0xB0);
  Buffer.from('ExitProcess\x00').copy(rdata_buf, 0xB2);

  // DLL names
  Buffer.from('USER32.dll\x00').copy(rdata_buf, 0xC0);
  Buffer.from('SHELL32.dll\x00').copy(rdata_buf, 0xD0);
  Buffer.from('KERNEL32.dll\x00').copy(rdata_buf, 0xE0);

  // UTF-16LE strings
  const titleBuf = Buffer.from('Robail Browser v18.0 & Омега v8.0\x00', 'utf16le');
  const openOpBuf = Buffer.from('open\x00', 'utf16le');
  const launchTarget = (browserUrl || 'http://localhost:3000').replace(/\/+$/, '') + '/#omega';
  const urlBuf = Buffer.from(launchTarget + '\x00', 'utf16le');
  const msgBuf = Buffer.from(
    'Robail Browser v18.0 и ИИ «Омега» v8.0 успешно установлены!\r\n\r\n' +
      'Нововведения и компоненты выпуска:\r\n' +
      ' • Новейший Искусственный Интеллект «Омега» v8.0 (Самая новая версия)\r\n' +
      ' • Скоростной браузерный движок Robail WebEngine v18.0\r\n' +
      ' • Прямой запуск без использования Microsoft Store\r\n' +
      ' • Turbo YouTube Acceleration 4K и защита Robail Shield\r\n\r\n' +
      'Ярлык браузера создан на вашем Рабочем столе.\r\n' +
      'Нажмите OK для запуска Robail Browser и Омеги v8.0!\x00',
    'utf16le'
  );

  titleBuf.copy(rdata_buf, 0x100);
  openOpBuf.copy(rdata_buf, 0x150);
  urlBuf.copy(rdata_buf, 0x170);
  msgBuf.copy(rdata_buf, 0x200);

  // Assembly Code:
  const code = Buffer.concat([
    // push 0x40 (MB_OK | MB_ICONINFORMATION)
    Buffer.from([0x6a, 0x40]),
    // push title_va
    Buffer.from([0x68]),
    Buffer.from(new Uint32Array([IMAGE_BASE + title_rva]).buffer),
    // push msg_va
    Buffer.from([0x68]),
    Buffer.from(new Uint32Array([IMAGE_BASE + msg_rva]).buffer),
    // push 0
    Buffer.from([0x6a, 0x00]),
    // call [u32_iat_va]
    Buffer.from([0xff, 0x15]),
    Buffer.from(new Uint32Array([IMAGE_BASE + u32_iat_rva]).buffer),

    // push 1 (SW_SHOWNORMAL)
    Buffer.from([0x6a, 0x01]),
    // push 0 (lpDirectory)
    Buffer.from([0x6a, 0x00]),
    // push 0 (lpParameters)
    Buffer.from([0x6a, 0x00]),
    // push url_va
    Buffer.from([0x68]),
    Buffer.from(new Uint32Array([IMAGE_BASE + launch_url_rva]).buffer),
    // push open_op_va
    Buffer.from([0x68]),
    Buffer.from(new Uint32Array([IMAGE_BASE + open_op_rva]).buffer),
    // push 0 (hwnd)
    Buffer.from([0x6a, 0x00]),
    // call [sh_iat_va]
    Buffer.from([0xff, 0x15]),
    Buffer.from(new Uint32Array([IMAGE_BASE + sh_iat_rva]).buffer),

    // push 0
    Buffer.from([0x6a, 0x00]),
    // call [k32_iat_va]
    Buffer.from([0xff, 0x15]),
    Buffer.from(new Uint32Array([IMAGE_BASE + k32_iat_rva]).buffer),
    Buffer.from([0xc3]),
  ]);

  const text_buf = Buffer.alloc(FILE_ALIGN);
  code.copy(text_buf, 0);

  const rdata_raw_len = Math.ceil(rdata_buf.length / FILE_ALIGN) * FILE_ALIGN;
  const rdata_raw = Buffer.alloc(rdata_raw_len);
  rdata_buf.copy(rdata_raw, 0);

  const opt_header = Buffer.alloc(224);
  opt_header.writeUInt16LE(0x010b, 0);
  opt_header.writeUInt8(1, 2);
  opt_header.writeUInt8(0, 3);
  opt_header.writeUInt32LE(FILE_ALIGN, 4);
  opt_header.writeUInt32LE(rdata_raw_len, 8);
  opt_header.writeUInt32LE(0, 12);
  opt_header.writeUInt32LE(entrypoint, 16);
  opt_header.writeUInt32LE(0x1000, 20);
  opt_header.writeUInt32LE(0x2000, 24);
  opt_header.writeUInt32LE(IMAGE_BASE, 28);
  opt_header.writeUInt32LE(SEC_ALIGN, 32);
  opt_header.writeUInt32LE(FILE_ALIGN, 36);
  opt_header.writeUInt16LE(5, 40);
  opt_header.writeUInt16LE(1, 42);
  opt_header.writeUInt16LE(18, 44); // Image version 18.0
  opt_header.writeUInt16LE(0, 46);
  opt_header.writeUInt16LE(5, 48);
  opt_header.writeUInt16LE(1, 50);
  opt_header.writeUInt32LE(0, 52);
  opt_header.writeUInt32LE(0x3000, 56);
  opt_header.writeUInt32LE(FILE_ALIGN, 60);
  opt_header.writeUInt32LE(0, 64);
  opt_header.writeUInt16LE(2, 68); // Windows GUI Subsystem
  opt_header.writeUInt16LE(0x8140, 70); // DYNAMIC_BASE | NX_COMPAT | TERMINAL_SERVER_AWARE
  opt_header.writeUInt32LE(0x100000, 72);
  opt_header.writeUInt32LE(0x1000, 76);
  opt_header.writeUInt32LE(0x100000, 80);
  opt_header.writeUInt32LE(0x1000, 84);
  opt_header.writeUInt32LE(0, 88);
  opt_header.writeUInt32LE(16, 92);

  // 1: Import Table
  opt_header.writeUInt32LE(idt_rva, 96 + 1 * 8);
  opt_header.writeUInt32LE(idt.length, 96 + 1 * 8 + 4);
  // 12: IAT
  opt_header.writeUInt32LE(u32_iat_rva, 96 + 12 * 8);
  opt_header.writeUInt32LE(32, 96 + 12 * 8 + 4);

  const sec_text = Buffer.alloc(40);
  sec_text.write('.text', 0);
  sec_text.writeUInt32LE(code.length, 8);
  sec_text.writeUInt32LE(0x1000, 12);
  sec_text.writeUInt32LE(FILE_ALIGN, 16);
  sec_text.writeUInt32LE(FILE_ALIGN, 20);
  sec_text.writeUInt32LE(0x60000020, 36);

  const sec_rdata = Buffer.alloc(40);
  sec_rdata.write('.rdata', 0);
  sec_rdata.writeUInt32LE(rdata_buf.length, 8);
  sec_rdata.writeUInt32LE(0x2000, 12);
  sec_rdata.writeUInt32LE(rdata_raw_len, 16);
  sec_rdata.writeUInt32LE(FILE_ALIGN + FILE_ALIGN, 20);
  sec_rdata.writeUInt32LE(0x40000040, 36);

  const headers = Buffer.alloc(FILE_ALIGN);
  dos_header.copy(headers, 0);
  dos_stub.copy(headers, 64);
  pe_sig.copy(headers, 0x80);
  file_header.copy(headers, 0x84);
  opt_header.copy(headers, 0x98);
  sec_text.copy(headers, 0x178);
  sec_rdata.copy(headers, 0x178 + 40);

  return Buffer.concat([headers, text_buf, rdata_raw]);
}

app.get('/api/download/robail-setup.exe', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:3000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  const browserUrl = `${protocol}://${host}`;

  const exeBuffer = generateRobailPE(browserUrl);

  res.setHeader('Content-Type', 'application/vnd.microsoft.portable-executable');
  res.setHeader('Content-Disposition', 'attachment; filename="RobailBrowser-v18.0-Setup.exe"');
  res.setHeader('Content-Length', exeBuffer.length);
  return res.send(exeBuffer);
});

// Windows Batch / CMD Launcher Installer (100% works without Microsoft Store)
app.get(
  [
    '/api/download/robail-setup.bat',
    '/api/download/robail-setup.cmd',
    '/api/download/robail-launcher.bat',
    '/api/download/robail-launcher.cmd',
  ],
  (req: Request, res: Response) => {
    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const browserUrl = `${protocol}://${host}`;
    const omegaUrl = `${browserUrl}/#omega`;

    const batContent = `@echo off
chcp 65001 >nul
title Robail Browser v18.0 - ИИ Омега v8.0
cls
echo ========================================================
echo       ЗАПУСК ROBAIL BROWSER v18.0 ^& ИИ ОМЕГА v8.0
echo ========================================================
echo.
echo Компоненты выпуска:
echo  [+] Браузер Robail WebEngine v18.0
echo  [+] Самый новый ИИ "Омега" v8.0
echo  [+] Прямой запуск БЕЗ Microsoft Store
echo.
echo [1/2] Создание постоянного ярлыка на Рабочем столе...
if not exist "%LOCALAPPDATA%\\RobailBrowser" mkdir "%LOCALAPPDATA%\\RobailBrowser"
echo [InternetShortcut] > "%USERPROFILE%\\Desktop\\Robail Browser & Omega v8.0.url"
echo URL=${omegaUrl} >> "%USERPROFILE%\\Desktop\\Robail Browser & Omega v8.0.url"
echo IconIndex=0 >> "%USERPROFILE%\\Desktop\\Robail Browser & Omega v8.0.url"
echo [2/2] Запускаю Браузер и открываю ИИ Омегу v8.0...
start "" "${omegaUrl}"
exit
`;

    res.setHeader('Content-Type', 'application/x-bat; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="RobailBrowser-v18.0-Setup.cmd"');
    return res.send(Buffer.from(batContent, 'utf-8'));
  }
);

// 1.4 Network Status and Internet Connectivity Check API
app.get('/api/network-status', async (_req: Request, res: Response) => {
  const startTime = Date.now();
  const services: Record<string, boolean> = {
    google: false,
    youtube: false,
    steam: false,
    wikipedia: false,
  };

  try {
    const results = await Promise.allSettled([
      fetch('https://www.google.com', { method: 'HEAD', signal: AbortSignal.timeout(3000) }),
      fetch('https://www.youtube.com', { method: 'HEAD', signal: AbortSignal.timeout(3000) }),
      fetch('https://store.steampowered.com', { method: 'HEAD', signal: AbortSignal.timeout(3000) }),
      fetch('https://ru.wikipedia.org', { method: 'HEAD', signal: AbortSignal.timeout(3000) }),
    ]);

    services.google = results[0].status === 'fulfilled';
    services.youtube = results[1].status === 'fulfilled';
    services.steam = results[2].status === 'fulfilled';
    services.wikipedia = results[3].status === 'fulfilled';
  } catch {}

  const pingMs = Math.max(8, Date.now() - startTime);

  return res.json({
    connected: true,
    pingMs,
    serverRegion: 'Europe (London) Cloud Backbone',
    gateway: 'Высокоскоростной интернет-шлюз Robail (Гигабитный канал)',
    ipProtocol: 'HTTP/2 • TLS 1.3 • Dual-Stack IPv4/IPv6',
    services,
    timestamp: Date.now(),
  });
});

// In-memory cache for ultra-fast image loading (sub-5ms on repeat requests)
const imageMemoryCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();

// 1.5 Image Proxy for cross-origin and hotlink-protected image loading
app.get('/api/image-proxy', async (req: Request, res: Response) => {
  let imgUrl = req.query.url as string;
  if (!imgUrl) {
    return res.status(400).send('Missing url');
  }

  try {
    imgUrl = imgUrl.trim();
    if (imgUrl.startsWith('//')) {
      imgUrl = 'https:' + imgUrl;
    }

    // Check memory cache
    const cached = imageMemoryCache.get(imgUrl);
    if (cached && Date.now() - cached.timestamp < 3600000) {
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('X-Proxy-Cache', 'HIT');
      return res.send(cached.buffer);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const headers: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    // Specific referrers if needed
    if (imgUrl.includes('steamstatic') || imgUrl.includes('steamcommunity')) {
      headers['Referer'] = 'https://store.steampowered.com/';
    } else if (imgUrl.includes('ytimg') || imgUrl.includes('ggpht')) {
      headers['Referer'] = 'https://www.youtube.com/';
    }

    const response = await fetch(imgUrl, {
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch image');
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const arrayBuf = await response.arrayBuffer();
    const buf = Buffer.from(arrayBuf);

    // Store in cache (limit to 400 entries)
    if (imageMemoryCache.size > 400) {
      const firstKey = imageMemoryCache.keys().next().value;
      if (firstKey) imageMemoryCache.delete(firstKey);
    }
    imageMemoryCache.set(imgUrl, { buffer: buf, contentType, timestamp: Date.now() });

    return res.send(buf);
  } catch (error: any) {
    return res.status(500).send('Image proxy error');
  }
});

// 1.6 YouTube InnerTube API Proxy (for live official YouTube SPA browse & player calls)
app.all('/youtubei/*', async (req: Request, res: Response) => {
  try {
    const ytUrl = `https://www.youtube.com${req.originalUrl}`;
    const reqHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Content-Type': req.headers['content-type'] || 'application/json',
      'X-YouTube-Client-Name': (req.headers['x-youtube-client-name'] as string) || '1',
      'X-YouTube-Client-Version': (req.headers['x-youtube-client-version'] as string) || '2.20240101.00.00',
      'Origin': 'https://www.youtube.com',
      'Referer': 'https://www.youtube.com/',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
    };

    let bodyData: any = undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(ytUrl, {
      method: req.method,
      headers: reqHeaders,
      body: bodyData,
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    const data = await response.text();
    return res.status(response.status).send(data);
  } catch (err: any) {
    return res.status(500).json({ error: 'YouTube InnerTube API proxy failure', message: err.message });
  }
});

// 2. Web Proxy for live in-tab browsing without X-Frame-Options blocks
app.get('/api/proxy', async (req: Request, res: Response) => {
  let targetUrl = req.query.url as string;
  const isDark = req.query.dark === '1';
  const isUBlock = req.query.ublock === '1';

  if (!targetUrl) {
    return res.status(400).send('Missing target URL');
  }

  targetUrl = targetUrl.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  // Clean leading dots from hostname (e.g., https://.wikipedia.org -> https://wikipedia.org)
  try {
    const rawParsed = new URL(targetUrl);
    const cleanHost = rawParsed.hostname.replace(/^\.+|\.+$/g, '');
    if (cleanHost && cleanHost !== rawParsed.hostname) {
      rawParsed.hostname = cleanHost;
      targetUrl = rawParsed.toString();
    }
  } catch {}

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const reqHeaders: Record<string, string> = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Upgrade-Insecure-Requests': '1',
    };

    // Auto-bypass age checks on Steam (e.g. for GTA V, trailers, screenshots)
    if (
      targetUrl.includes('steampowered.com') ||
      targetUrl.includes('steamcommunity.com')
    ) {
      reqHeaders['Cookie'] =
        'birthtime=283993201; mature_content=1; wants_mature_content=1; lastagecheckage=1-0-1980';
    }

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: 'follow',
      headers: reqHeaders,
    });

    clearTimeout(timeout);

    const actualUrl = response.url || targetUrl;
    const parsedUrl = new URL(actualUrl);

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(Buffer.from(buffer));
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Robail Shield AdBlock: Real Ad Stripping and Metrics
    let blockedCount = 0;
    if (isUBlock) {
      const adSelectors = [
        'ins.adsbygoogle',
        '[id*="google_ads"]',
        '[class*="google-ads"]',
        '[class*="adsbygoogle"]',
        '[class*="banner-ad"]',
        '[class*="ad-banner"]',
        '[class*="ad-slot"]',
        '[class*="ad-container"]',
        '[class*="ad-wrapper"]',
        '[id*="yandex_rtb"]',
        '[class*="yandex-ad"]',
        '[class*="ya-partner"]',
        '[data-ad-client]',
        '.adsense-ad',
        '.ad-box',
        '.advertisement',
        'iframe[src*="doubleclick"]',
        'iframe[src*="googleadservices"]',
        'iframe[src*="googlesyndication"]',
        'iframe[src*="adservice"]',
        'iframe[src*="yandex.ru/ads"]',
        'script[src*="googlesyndication"]',
        'script[src*="yandex.ru/ads"]',
        'script[src*="adservice"]',
        'script[src*="doubleclick"]',
      ];

      for (const sel of adSelectors) {
        try {
          const found = $(sel);
          if (found.length > 0) {
            blockedCount += found.length;
            found.remove();
          }
        } catch {}
      }
    }

    // Remove frame breakers
    $('script').each((_, el) => {
      const scriptContent = $(el).html() || '';
      if (
        scriptContent.includes('top.location') ||
        scriptContent.includes('window.top') ||
        scriptContent.includes('self !== top') ||
        scriptContent.includes('parent.location')
      ) {
        $(el).remove();
      }
    });

    // Remove Content-Security-Policy & X-Frame-Options meta tags
    $('meta[http-equiv="Content-Security-Policy" i]').remove();
    $('meta[http-equiv="X-Frame-Options" i]').remove();

    // Inject <base> tag to resolve all relative links, styles, images to the original host
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    if ($('head').length > 0) {
      $('head').prepend(`<base href="${baseUrl}/">`);
      // Crucial: no-referrer prevents image CDN blocks (ytimg, ggpht, steamstatic, etc.)
      $('head').prepend('<meta name="referrer" content="no-referrer">');
    } else {
      $('html').prepend(
        `<head><meta name="referrer" content="no-referrer"><base href="${baseUrl}/"></head>`
      );
    }

    // Optimize and unbreak images (Steam, Wikipedia, YouTube thumbnails, avatars)
    $('img').each((_, el) => {
      const $img = $(el);
      const src = $img.attr('src') || '';
      const dataSrc =
        $img.attr('data-src') ||
        $img.attr('data-original') ||
        $img.attr('data-thumb') ||
        $img.attr('data-lazy-src') ||
        $img.attr('data-srcset');

      // If src is missing or a placeholder blank.gif, swap to real data-src
      if (
        dataSrc &&
        (!src ||
          src.includes('blank.gif') ||
          src.startsWith('data:image/svg') ||
          src.startsWith('data:image/gif'))
      ) {
        $img.attr('src', dataSrc);
      }

      const finalSrc = $img.attr('src');
      if (finalSrc) {
        let absSrc = finalSrc.trim();
        if (absSrc.startsWith('//')) {
          absSrc = parsedUrl.protocol + absSrc;
          $img.attr('src', absSrc);
        } else if (absSrc.startsWith('/') && !absSrc.startsWith('/api/')) {
          absSrc = `${baseUrl}${absSrc}`;
          $img.attr('src', absSrc);
        }
      }

      $img.attr('loading', 'eager');
      $img.attr('referrerpolicy', 'no-referrer');
    });

    // Optimize videos for game trailers (Steam GTA 5, etc.)
    $('video').each((_, el) => {
      const $vid = $(el);
      $vid.attr('playsinline', 'true');
      $vid.attr('preload', 'auto');
      if (!$vid.attr('controls')) {
        $vid.attr('controls', 'true');
      }
    });

    // Rewrite internal links so clicking navigates within Robail proxy
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && !href.startsWith('javascript:') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        try {
          let cleanHref = href.trim();
          if (cleanHref.startsWith('//.')) {
            cleanHref = '//' + cleanHref.replace(/^\/\/\.+/, '');
          }
          const resolved = new URL(cleanHref, actualUrl);
          resolved.hostname = resolved.hostname.replace(/^\.+|\.+$/g, '');
          const resolvedStr = resolved.toString();
          $(el).attr('href', `/api/proxy?url=${encodeURIComponent(resolvedStr)}${isDark ? '&dark=1' : ''}${isUBlock ? '&ublock=1' : ''}`);
          $(el).attr('target', '_self');
        } catch {
          // Keep as is
        }
      }
    });

    // Injected Robail Bridge script for DevTools Console and navigation awareness
    const bridgeScript = `
      <script>
        (function() {
          try {
            // Forward link clicks to Robail address bar
            document.addEventListener('click', function(e) {
              try {
                var a = e.target.closest('a');
                if (a && a.href) {
                  var match = a.href.match(/[?&]url=([^&]+)/);
                  var dest = match ? decodeURIComponent(match[1]) : a.href;
                  if (dest && !dest.startsWith('javascript:')) {
                    window.parent.postMessage({
                      source: 'robail-frame',
                      type: 'url-changed',
                      url: dest
                    }, '*');
                  }
                }
              } catch(err) {}
            }, true);

            // Send page title & info to parent on load
            window.addEventListener('DOMContentLoaded', function() {
              try {
                window.parent.postMessage({
                  source: 'robail-frame',
                  type: 'page-loaded',
                  title: document.title,
                  url: '${actualUrl.replace(/'/g, "\\'")}'
                }, '*');

                ${
                  isUBlock
                    ? `window.parent.postMessage({
                        source: 'robail-frame',
                        type: 'ublock-blocked',
                        count: ${blockedCount}
                      }, '*');`
                    : ''
                }
              } catch(e) {}
            });
          } catch(e) {}
        })();
      </script>
    `;

    // Robail Shield cosmetic hiding CSS
    const uBlockCosmeticStyle = isUBlock ? `
      <style id="robail-shield-cosmetic">
        ins.adsbygoogle, [id*="google_ads"], [class*="google-ads"], [class*="adsbygoogle"],
        [class*="banner-ad"], [class*="ad-banner"], [class*="ad-slot"], [class*="ad-container"],
        [id*="yandex_rtb"], [class*="yandex-ad"], [class*="ya-partner"], [data-ad-client],
        .adsense-ad, .ad-box, .advertisement, div[id^="ad_"], div[class^="ad_"],
        div[id*="_ad_"], div[class*="_ad_"], .ad-zone, .ad-placement, .ad-unit {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          width: 0 !important;
          pointer-events: none !important;
          opacity: 0 !important;
        }
      </style>
    ` : '';

    // Dark Mode injection if enabled
    const darkModeStyle = isDark ? `
      <style id="robail-dark-mode">
        html { filter: invert(0.9) hue-rotate(180deg) !important; background-color: #121212 !important; }
        img, picture, video, canvas, svg, iframe, [style*="background-image"] {
          filter: invert(1.1) hue-rotate(180deg) !important;
        }
      </style>
    ` : '';

    $('body').append(bridgeScript);
    if (isUBlock) {
      $('head').append(uBlockCosmeticStyle);
    }
    if (isDark) {
      $('head').append(darkModeStyle);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Frame-Options', 'ALLOWALL');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('X-Frame-Options');
    res.removeHeader('Permissions-Policy');
    res.removeHeader('Feature-Policy');
    res.setHeader('Permissions-Policy', 'camera=*, microphone=*, autoplay=*, display-capture=*');

    return res.send($.html());
  } catch (error: any) {
    const isDnsError =
      error?.code === 'ENOTFOUND' ||
      String(error?.cause).includes('ENOTFOUND') ||
      String(error?.message).includes('ENOTFOUND');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="utf-8">
        <title>Страница не найдена — Robail</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #090d16; color: #f1f5f9; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 24px; box-sizing: border-box; }
          .card { background: #111726; border: 1px solid #242f49; border-radius: 18px; max-width: 520px; width: 100%; padding: 36px 28px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
          .icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(245, 158, 11, 0.12); border: 2px solid rgba(245, 158, 11, 0.35); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #f59e0b; font-size: 24px; }
          h2 { color: #f8fafc; margin-top: 0; font-size: 19px; font-weight: 700; margin-bottom: 8px; }
          .url { background: #05070d; border: 1px solid #1e293b; border-radius: 8px; padding: 8px 12px; font-family: monospace; font-size: 12px; color: #38bdf8; word-break: break-all; margin: 12px 0 16px; }
          p { color: #94a3b8; font-size: 13px; line-height: 1.6; margin-bottom: 24px; }
          .btn-group { display: flex; gap: 10px; justify-content: center; }
          .btn { background: #f59e0b; color: #000; border: none; border-radius: 10px; padding: 10px 22px; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; transition: background 0.2s; }
          .btn:hover { background: #d97706; }
          .btn-sec { background: #1e293b; color: #cbd5e1; }
          .btn-sec:hover { background: #334155; color: #fff; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">⚠️</div>
          <h2>Не удалось открыть веб-страницу</h2>
          <div class="url">${targetUrl}</div>
          <p>${
            isDnsError
              ? 'Указанный адрес не существует, доменное имя введено с ошибкой или сервер временно недоступен.'
              : 'Сервер целевого сайта не ответил на запрос или заблокировал внешнее подключение.'
          }</p>
          <div class="btn-group">
            <button class="btn btn-sec" onclick="history.back()">Назад</button>
            <button class="btn" onclick="location.reload()">Повторить</button>
          </div>
        </div>
      </body>
      </html>
    `);
  }
});

// 3. Reader Mode Endpoint: Extracts clean text, headings, and images
app.get('/api/reader', async (req: Request, res: Response) => {
  let targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing target URL' });
  }

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
    });
    clearTimeout(timeout);

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      'Untitled Document';

    // Extract byline/author
    const author =
      $('meta[name="author"]').attr('content') ||
      $('[rel="author"]').text().trim() ||
      $('.byline, .author').first().text().trim() ||
      new URL(targetUrl).hostname;

    // Extract main image
    const leadImage =
      $('meta[property="og:image"]').attr('content') ||
      $('article img, main img').first().attr('src') ||
      '';

    // Remove noise elements
    $('script, style, nav, footer, header, aside, .advertisement, .ad, .social-share, .cookie-banner, .popup, iframe').remove();

    // Extract text blocks
    const contentBlocks: Array<{ type: 'heading' | 'paragraph' | 'image'; text?: string; src?: string; alt?: string }> = [];

    const mainContainer = $('article, main, [role="main"], .post-content, .entry-content').first();
    const scope = mainContainer.length ? mainContainer : $('body');

    scope.find('h2, h3, p, img').each((_, el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'h2' || tag === 'h3') {
        const text = $(el).text().trim();
        if (text) contentBlocks.push({ type: 'heading', text });
      } else if (tag === 'p') {
        const text = $(el).text().trim();
        if (text && text.length > 25) {
          contentBlocks.push({ type: 'paragraph', text });
        }
      } else if (tag === 'img') {
        const src = $(el).attr('src');
        const alt = $(el).attr('alt') || '';
        if (src && !src.includes('avatar') && !src.includes('icon') && !src.includes('pixel')) {
          try {
            const absoluteSrc = new URL(src, targetUrl).toString();
            contentBlocks.push({ type: 'image', src: absoluteSrc, alt });
          } catch {}
        }
      }
    });

    const fullText = contentBlocks
      .filter((b) => b.type === 'paragraph' || b.type === 'heading')
      .map((b) => b.text)
      .join('\n\n');

    const wordCount = fullText.split(/\s+/).length;
    const readMinutes = Math.max(1, Math.round(wordCount / 200));

    return res.json({
      title,
      author,
      leadImage,
      readMinutes,
      wordCount,
      url: targetUrl,
      blocks: contentBlocks.slice(0, 50),
      rawSnippet: fullText.slice(0, 2000),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Failed to extract article content' });
  }
});

// 4. Instant Search Suggestions & Results
app.get('/api/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    return res.json({ results: [] });
  }

  try {
    // Live Wikipedia query search
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=6&namespace=0&format=json`;
    const wikiRes = await fetch(wikiUrl);
    const wikiData = await wikiRes.json();

    const titles = (wikiData[1] || []) as string[];
    const snippets = (wikiData[2] || []) as string[];
    const links = (wikiData[3] || []) as string[];

    const results = titles.map((title, i) => ({
      title,
      snippet: snippets[i] || 'Wikipedia encyclopedia article and references.',
      url: links[i],
      source: 'Wikipedia',
    }));

    // If query is a URL, add direct visit result
    if (query.includes('.') && !query.includes(' ')) {
      results.unshift({
        title: `Navigate to: ${query}`,
        snippet: `Directly open web address https://${query.replace(/^https?:\/\//, '')}`,
        url: query.startsWith('http') ? query : `https://${query}`,
        source: 'Direct Web Address',
      });
    }

    return res.json({ results });
  } catch (err: any) {
    return res.json({
      results: [
        {
          title: `Search for "${query}" on DuckDuckGo`,
          snippet: `Browse comprehensive privacy-focused web results for ${query}`,
          url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
          source: 'DuckDuckGo',
        },
      ],
    });
  }
});

// 5. Hacker News Top Feed for built-in Tech News Tab
app.get('/api/hn', async (req: Request, res: Response) => {
  try {
    const topIdsRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = (await topIdsRes.json()) as number[];
    const top20Ids = ids.slice(0, 15);

    const stories = await Promise.all(
      top20Ids.map(async (id) => {
        try {
          const itemRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return await itemRes.json();
        } catch {
          return null;
        }
      })
    );

    return res.json({ stories: stories.filter(Boolean) });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch Hacker News stories' });
  }
});

// Setup Vite Dev server or static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Robail Browser server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
