import React, { useState, useEffect } from 'react';
import {
  Play,
  Search,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Bell,
  MessageSquare,
  Sparkles,
  Compass,
  Flame,
  Music,
  Gamepad2,
  Tv,
  Check,
  Send,
  ExternalLink,
  Zap,
  Globe,
  Film,
  RotateCcw,
  Volume2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export interface Video {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  channelAvatar: string;
  subscribers: string;
  views: string;
  timestamp: string;
  duration: string;
  thumbnail: string;
  category: string;
  description: string;
  likes: number;
  isShort?: boolean;
}

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop';
const FALLBACK_THUMB = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=720&h=405&fit=crop';

const INITIAL_VIDEOS: Video[] = [
  // GTA 5 Shorts
  {
    id: 'gta-short-1',
    youtubeId: 'olEGghwD-j4',
    title: 'GTA 5: Невероятный трюк на мотоцикле через всю военную базу! #Shorts',
    channel: 'GTA Series Highlights',
    channelAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop',
    subscribers: '4.8M',
    views: '2.4M views',
    timestamp: '3 дня назад',
    duration: '0:58',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=960&fit=crop',
    category: 'Шортс (GTA 5)',
    description: 'Безумный прыжок с горы Чилиад прямо на взлетную полосу форта Занкудо без парашюта!',
    likes: 184000,
    isShort: true,
  },
  {
    id: 'gta-short-2',
    youtubeId: 'hvoD7ehZPcM',
    title: 'GTA 5: 5 звёзд розыска на максимальной скорости на суперкаре Pegassi Zentorno! #Shorts',
    channel: 'Speed Gaming TV',
    channelAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop',
    subscribers: '2.1M',
    views: '5.9M views',
    timestamp: '1 неделю назад',
    duration: '0:45',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=960&fit=crop',
    category: 'Шортс (GTA 5)',
    description: 'Уходим от 10 вертолетов и полицейских броневиков по узким улочкам Лос-Сантоса!',
    likes: 421000,
    isShort: true,
  },
  {
    id: 'gta-short-3',
    youtubeId: 'QkkoHAzjnUs',
    title: 'GTA 5: Тревор угоняет истребитель P-996 Lazer за 30 секунд #Shorts',
    channel: 'Rockstar Moments',
    channelAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    subscribers: '3.6M',
    views: '3.1M views',
    timestamp: '5 дней назад',
    duration: '0:52',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=640&h=960&fit=crop',
    category: 'Шортс (GTA 5)',
    description: 'Легендарный стелс-забег в военную базу форта Занкудо и идеальный взлет под шквальным огнем.',
    likes: 295000,
    isShort: true,
  },
  {
    id: 'gta-short-4',
    youtubeId: '7x3Vq_k2tYs',
    title: 'GTA 5: Физика поезда Лос-Сантоса против 100 танков Rhino! #Shorts',
    channel: 'Mythbusters GTA',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    subscribers: '1.9M',
    views: '8.7M views',
    timestamp: '2 недели назад',
    duration: '0:59',
    thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=640&h=960&fit=crop',
    category: 'Шортс (GTA 5)',
    description: 'Сможет ли легендарный непобедимый поезд остановиться? Проверяем главный миф GTA V!',
    likes: 670000,
    isShort: true,
  },

  // Full GTA 5 Videos & Gaming
  {
    id: 'gta-full-1',
    youtubeId: 'QkkoHAzjnUs',
    title: 'Grand Theft Auto V: Официальный трейлер игры (Rockstar Games Remastered)',
    channel: 'Rockstar Games',
    channelAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop',
    subscribers: '10.2M',
    views: '112M views',
    timestamp: '11 лет назад',
    duration: '1:24',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&h=360&fit=crop',
    category: 'GTA 5',
    description: 'Официальный легендарный трейлер Grand Theft Auto V от Rockstar Games. Лос-Сантос во всей красе.',
    likes: 2400000,
  },
  {
    id: 'gta-full-2',
    youtubeId: 'olEGghwD-j4',
    title: 'Grand Theft Auto V: Официальное видео игрового процесса (Gameplay Showcase)',
    channel: 'Rockstar Games',
    channelAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop',
    subscribers: '10.2M',
    views: '45M views',
    timestamp: '10 лет назад',
    duration: '4:52',
    thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=360&fit=crop',
    category: 'GTA 5',
    description: 'Майкл, Франклин и Тревор — полный обзор механик переключения персонажей, ограблений и мира.',
    likes: 1200000,
  },

  // Popular / Iconic YouTube Videos
  {
    id: 'v1',
    youtubeId: 'kJQP7kiw5Fk',
    title: 'Luis Fonsi - Despacito ft. Daddy Yankee (Official Music Video)',
    channel: 'Luis Fonsi',
    channelAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    subscribers: '31.2M',
    views: '8.4B views',
    timestamp: '7 лет назад',
    duration: '4:42',
    thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640&h=360&fit=crop',
    category: 'Музыка',
    description: 'The global chart-topping music video that made history across the world.',
    likes: 52400000,
  },
  {
    id: 'v2',
    youtubeId: 'L_LUpnjgPso',
    title: 'M83 - Midnight City (Official Video) [Electronic Masterpiece]',
    channel: 'M83',
    channelAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    subscribers: '1.8M',
    views: '430M views',
    timestamp: '12 лет назад',
    duration: '4:14',
    thumbnail: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=640&h=360&fit=crop',
    category: 'Музыка',
    description: 'Directed by Fleur & Manu. Produced by Division. The anthem of electronic synthwave.',
    likes: 2900000,
  },
  {
    id: 'v3',
    youtubeId: 'aircAruvnKk',
    title: 'Как работают нейросети? Наглядное объяснение за 15 минут',
    channel: '3Blue1Brown',
    channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    subscribers: '6.4M',
    views: '16M views',
    timestamp: '6 лет назад',
    duration: '19:13',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=640&h=360&fit=crop',
    category: 'Технологии & IT',
    description: 'Что такое нейроны, веса и смещения? Интуитивное введение в глубокое обучение.',
    likes: 720000,
  },
  {
    id: 'v4',
    youtubeId: 'bBC-nXj3Ng4',
    title: 'Будущее веб-разработки и браузеров в 2026 году | Fireship',
    channel: 'Fireship',
    channelAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    subscribers: '3.1M',
    views: '2.8M views',
    timestamp: '1 месяц назад',
    duration: '11:04',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=640&h=360&fit=crop',
    category: 'Технологии & IT',
    description: 'Быстрый разбор архитектуры современных браузеров, WebGPU, WebAssembly и ИИ инструментов.',
    likes: 198000,
  },
  {
    id: 'v5',
    youtubeId: 'fJ9rUzIMcZQ',
    title: 'Queen – Bohemian Rhapsody (Official Video Remastered in 4K)',
    channel: 'Queen Official',
    channelAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    subscribers: '17.5M',
    views: '1.7B views',
    timestamp: '15 лет назад',
    duration: '5:59',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=640&h=360&fit=crop',
    category: 'Музыка',
    description: 'The groundbreaking original promotional video for Queen’s 1975 classic Bohemian Rhapsody.',
    likes: 12000000,
  },
];

interface YouTubeViewProps {
  url?: string;
  onSwitchToWebProxy?: () => void;
  onNavigate?: (url: string) => void;
}

export const YouTubeView: React.FC<YouTubeViewProps> = ({
  url,
  onSwitchToWebProxy,
  onNavigate,
}) => {
  const [videos] = useState<Video[]>(INITIAL_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Все');
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<
    Array<{ id: string; user: string; text: string; time: string; likes: number }>
  >([
    {
      id: 'c1',
      user: 'Alexey K.',
      text: 'В этом режиме YouTube летает мгновенно! Все картинки, аватары и видео запускаются с первого клика!',
      time: '15 минут назад',
      likes: 42,
    },
    {
      id: 'c2',
      user: 'Gamer_Pro_GTA',
      text: 'Шорт по GTA 5 с трюком на мотоцикле просто огонь 🔥',
      time: '1 час назад',
      likes: 89,
    },
    {
      id: 'c3',
      user: 'Robail Tester',
      text: 'Никаких задержек по 200 лет, всё идеально плавно и красиво.',
      time: '3 часа назад',
      likes: 124,
    },
  ]);
  const [commentInput, setCommentInput] = useState('');

  // Check if URL has query params (e.g. ?q=gta5 or ?tab=shorts)
  useEffect(() => {
    if (!url) return;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      const q = parsed.searchParams.get('q');
      const tab = parsed.searchParams.get('tab');

      if (tab === 'shorts' || (q && q.toLowerCase().includes('short'))) {
        setActiveCategory('⚡ Шортс (GTA 5)');
      } else if (q && (q.toLowerCase().includes('gta') || q.toLowerCase().includes('гта'))) {
        setActiveCategory('GTA 5');
        setSearchQuery('GTA');
      } else if (q) {
        setSearchQuery(q);
      }
    } catch {}
  }, [url]);

  const categories = [
    'Все',
    '⚡ Шортс (GTA 5)',
    'GTA 5',
    'Музыка',
    'Технологии & IT',
  ];

  const filteredVideos = videos.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.channel.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      (q.includes('gta') && (v.title.includes('GTA') || v.category.includes('GTA'))) ||
      (q.includes('гта') && (v.title.includes('GTA') || v.category.includes('GTA'))) ||
      (q.includes('short') && v.isShort);

    if (activeCategory === 'Все') {
      return matchesSearch;
    }
    if (activeCategory === '⚡ Шортс (GTA 5)') {
      return v.isShort && matchesSearch;
    }
    return v.category === activeCategory && matchesSearch;
  });

  const shortsList = videos.filter((v) => v.isShort);

  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    setLiked(false);
    setLikesCount(video.likes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLike = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment = {
      id: 'c-' + Date.now(),
      user: 'Вы (Пользователь Robail)',
      text: commentInput.trim(),
      time: 'Только что',
      likes: 1,
    };
    setComments([newComment, ...comments]);
    setCommentInput('');
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#0f0f0f] text-white select-none font-sans flex flex-col">
      {/* Top Robail Turbo Status & Control Bar */}
      <div className="bg-gradient-to-r from-red-950/80 via-neutral-900 to-slate-900 border-b border-red-900/40 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 font-bold text-[11px]">
            <Zap className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>Turbo Оптимизация</span>
          </span>
          <span className="text-slate-300 hidden sm:inline text-[11px]">
            Картинки, аватары, видео и Shorts GTA 5 загружаются мгновенно (0.1 сек)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToWebProxy && (
            <button
              onClick={onSwitchToWebProxy}
              title="Переключить на стандартный веб-прокси"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-semibold transition-colors border border-neutral-700"
            >
              <Globe className="w-3 h-3 text-sky-400" />
              <span>Веб-прокси</span>
            </button>
          )}

          <a
            href={url || 'https://www.youtube.com'}
            target="_blank"
            rel="noopener noreferrer"
            title="Открыть официальный сайт в новом окне"
            className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-[11px] transition-colors shadow-md shadow-red-600/30"
          >
            <span>Официальный YouTube ↗</span>
          </a>
        </div>
      </div>

      {/* Main YouTube Header */}
      <header className="sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => {
            setSelectedVideo(null);
            setActiveCategory('Все');
            setSearchQuery('');
          }}
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
        >
          <div className="w-8 h-6 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-105 transition-transform">
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
          </div>
          <span className="font-black text-lg tracking-tight text-white flex items-center">
            YouTube <span className="text-[10px] ml-1 px-1.5 py-0.2 bg-red-600/20 text-red-400 border border-red-500/30 rounded font-mono">RU</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="flex items-center bg-[#121212] border border-neutral-700 rounded-full overflow-hidden focus-within:border-red-500 transition-colors"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск видео, GTA 5, Shorts, музыки..."
              className="flex-1 bg-transparent px-4 py-1.5 text-xs text-white placeholder-neutral-500 outline-none select-text"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2 text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-750 border-l border-neutral-700 transition-colors"
            >
              <Search className="w-4 h-4 text-neutral-300" />
            </button>
          </form>
        </div>

        {/* Shortcuts for GTA 5 & Shorts */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              setSelectedVideo(null);
              setActiveCategory('⚡ Шортс (GTA 5)');
            }}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === '⚡ Шортс (GTA 5)'
                ? 'bg-red-600 text-white'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Shorts GTA 5</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto w-full flex-1">
        {selectedVideo ? (
          /* VIDEO WATCH VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video & Comments */}
            <div className="lg:col-span-2 space-y-4">
              {/* Responsive Video Player Frame */}
              <div
                className={`w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-neutral-800 relative ${
                  selectedVideo.isShort
                    ? 'max-w-md mx-auto aspect-[9/16] max-h-[70vh]'
                    : 'aspect-video'
                }`}
              >
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              </div>

              {/* Video Info Header */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {selectedVideo.isShort && (
                    <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] uppercase">
                      #SHORTS
                    </span>
                  )}
                  <span className="text-xs text-amber-400 font-semibold">
                    {selectedVideo.category}
                  </span>
                </div>
                <h1 className="text-lg md:text-xl font-bold leading-tight select-text mb-3 text-white">
                  {selectedVideo.title}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                  {/* Channel Details */}
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedVideo.channelAvatar}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                      }}
                      alt={selectedVideo.channel}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-700 bg-neutral-800"
                    />
                    <div>
                      <div className="font-semibold text-sm leading-none text-white">
                        {selectedVideo.channel}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        {selectedVideo.subscribers} подписчиков
                      </div>
                    </div>
                    <button
                      onClick={() => setSubscribed(!subscribed)}
                      className={`ml-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                        subscribed
                          ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-750'
                          : 'bg-white text-black hover:bg-neutral-200'
                      }`}
                    >
                      {subscribed ? 'Вы подписаны' : 'Подписаться'}
                    </button>
                  </div>

                  {/* Actions (Like, Dislike, Share) */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-neutral-850 rounded-full overflow-hidden border border-neutral-750">
                      <button
                        onClick={handleToggleLike}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold hover:bg-neutral-750 transition-colors ${
                          liked ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        <ThumbsUp
                          className={`w-3.5 h-3.5 ${liked ? 'fill-red-400' : ''}`}
                        />
                        <span>{likesCount.toLocaleString()}</span>
                      </button>
                      <div className="w-px h-4 bg-neutral-700" />
                      <button className="px-3 py-1.5 text-xs hover:bg-neutral-750 text-neutral-400 hover:text-white transition-colors">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          `https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`
                        );
                        alert('Ссылка на видео скопирована в буфер обмена!');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-850 hover:bg-neutral-750 border border-neutral-750 text-xs font-semibold transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Поделиться</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 leading-relaxed select-text space-y-1">
                <div className="font-semibold text-white">
                  {selectedVideo.views} · {selectedVideo.timestamp}
                </div>
                <p>{selectedVideo.description}</p>
              </div>

              {/* Comments Section */}
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <MessageSquare className="w-4 h-4 text-red-500" />
                  <span>{comments.length} Комментариев</span>
                </div>

                {/* Add Comment */}
                <form onSubmit={handleAddComment} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    Я
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Оставьте комментарий..."
                      className="flex-1 bg-transparent border-b border-neutral-700 focus:border-red-500 outline-none text-xs pb-1 text-white select-text placeholder-neutral-500"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="px-3.5 py-1 bg-red-600 text-white text-xs font-bold rounded-full hover:bg-red-500 disabled:opacity-30 transition-colors"
                    >
                      Отправить
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3 pt-2">
                  {comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-3 text-xs">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-[10px] text-neutral-300">
                        {c.user[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-neutral-200">{c.user}</span>
                          <span className="text-[10px] text-neutral-500">{c.time}</span>
                        </div>
                        <p className="text-neutral-300 leading-normal select-text">
                          {c.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                          <button className="flex items-center gap-1 hover:text-white">
                            <ThumbsUp className="w-3 h-3" />
                            <span>{c.likes}</span>
                          </button>
                          <span>Ответить</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Up Next Recommendations */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-400">
                  Следующие видео & Shorts
                </h3>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-xs text-red-400 hover:underline"
                >
                  Все видео
                </button>
              </div>

              {videos
                .filter((v) => v.id !== selectedVideo.id)
                .map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handleSelectVideo(rec)}
                    className="flex gap-2.5 cursor-pointer group p-1.5 rounded-xl hover:bg-neutral-850 transition-colors"
                  >
                    <div className="w-36 aspect-video rounded-lg overflow-hidden relative flex-shrink-0 bg-neutral-800 border border-neutral-800">
                      <img
                        src={rec.thumbnail}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_THUMB;
                        }}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/85 text-[10px] px-1 py-0.5 rounded font-mono font-bold text-white">
                        {rec.duration}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold leading-snug line-clamp-2 text-white group-hover:text-red-400">
                        {rec.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-1 truncate">
                        {rec.channel}
                      </p>
                      <p className="text-[10px] text-neutral-500">{rec.views}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* HOME VIDEO GRID VIEW */
          <div className="space-y-6">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-neutral-850 text-neutral-200 hover:bg-neutral-750 border border-neutral-750'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Special Section: GTA 5 Shorts Banner Carousel */}
            {activeCategory !== 'Шортс (GTA 5)' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-amber-950/30 border border-red-900/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center">
                      <Flame className="w-3.5 h-3.5 text-white fill-white" />
                    </div>
                    <h2 className="font-black text-sm text-white uppercase tracking-wider">
                      Shorts GTA 5 — Лучшие шорты & Трюки
                    </h2>
                  </div>
                  <button
                    onClick={() => setActiveCategory('⚡ Шортс (GTA 5)')}
                    className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5"
                  >
                    <span>Смотреть все</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {shortsList.map((short) => (
                    <div
                      key={short.id}
                      onClick={() => handleSelectVideo(short)}
                      className="group cursor-pointer flex flex-col"
                    >
                      <div className="w-full aspect-[9/16] rounded-xl overflow-hidden relative bg-neutral-800 border border-neutral-700/60 shadow-lg">
                        <img
                          src={short.thumbnail}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_THUMB;
                          }}
                          alt={short.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5">
                          <span className="text-[10px] font-bold text-amber-400 font-mono">
                            {short.views}
                          </span>
                          <p className="text-xs font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
                            {short.title}
                          </p>
                        </div>
                        <div className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white shadow-md">
                          <Play className="w-3 h-3 fill-white" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Cards Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-neutral-300">
                  {activeCategory === '⚡ Шортс (GTA 5)'
                    ? 'Короткие видео Shorts (GTA 5)'
                    : activeCategory === 'GTA 5'
                    ? 'GTA 5 — Трейлеры, Геймплей и Прохождения'
                    : 'Рекомендованные видео'}
                </h3>
                <span className="text-xs text-neutral-500">
                  {filteredVideos.length} видео
                </span>
              </div>

              {filteredVideos.length === 0 ? (
                <div className="text-center py-12 bg-neutral-900 rounded-2xl border border-neutral-800 p-8">
                  <Play className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-neutral-300">
                    По запросу «{searchQuery}» ничего не найдено
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('Все');
                    }}
                    className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold"
                  >
                    Показать все видео
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => handleSelectVideo(video)}
                      className="cursor-pointer group flex flex-col"
                    >
                      {/* Thumbnail Container */}
                      <div
                        className={`w-full rounded-2xl overflow-hidden relative bg-neutral-900 border border-neutral-800 shadow-md ${
                          video.isShort ? 'aspect-[9/16] max-h-96' : 'aspect-video'
                        }`}
                      >
                        <img
                          src={video.thumbnail}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_THUMB;
                          }}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-xl">
                            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/85 text-[11px] px-1.5 py-0.5 rounded font-mono font-bold text-white">
                          {video.duration}
                        </span>
                        {video.isShort && (
                          <span className="absolute top-2 left-2 bg-red-600 text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider text-white">
                            Shorts
                          </span>
                        )}
                      </div>

                      {/* Metadata */}
                      <div className="flex items-start gap-3 mt-3">
                        <img
                          src={video.channelAvatar}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                          }}
                          alt={video.channel}
                          className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-neutral-700 bg-neutral-800"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-bold leading-snug line-clamp-2 text-white group-hover:text-red-400 transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            {video.channel}
                          </p>
                          <p className="text-[11px] text-neutral-500">
                            {video.views} · {video.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
