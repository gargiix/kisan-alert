import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Sprout,
  Leaf,
  Tractor,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Send,
  Bot,
  User,
  ChevronRight,
  MapPin,
  Clock,
  Zap,
  Shield,
  Target,
  ArrowUpRight,
  Sparkles,
  Database,
  Settings,
  Bell,
  Menu,
  X,
} from 'lucide-react';

// Types
interface WeatherData {
  day: string;
  date: string;
  temp: number;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  precipitation: number;
  wind: number;
  humidity: number;
}

interface CropData {
  name: string;
  health: number;
  growthStage: string;
  planted: string;
  harvest: string;
  area: number;
  yield: number;
  color: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// Animated Counter Hook
const useAnimatedCounter = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const startVal = useRef(0);

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (startTime.current === null) {
        startTime.current = currentTime;
      }
      const progress = Math.min((currentTime - startTime.current) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(startVal.current + (end - startVal.current) * easeOutQuart);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTime.current = null;
    };
  }, [end, duration]);

  return count;
};

// Animated Number Component
const AnimatedNumber = ({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}) => {
  const count = useAnimatedCounter(value * Math.pow(10, decimals), duration);
  const displayValue = (count / Math.pow(10, decimals)).toFixed(decimals);

  return (
    <span className="tabular-nums">
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

// Loading Animation Component
const LoadingSpinner = ({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={`${sizeClasses[size]} relative`}>
      <div className="absolute inset-0 border-4 border-agri-200 rounded-full" />
      <div className="absolute inset-0 border-4 border-transparent border-t-agri-500 rounded-full animate-spin" />
    </div>
  );
};

// Floating Agriculture Icon
const FloatingIcon = ({
  icon: Icon,
  className = '',
  delay = 0,
}: {
  icon: React.ElementType;
  className?: string;
  delay?: number;
}) => (
  <div
    className={`absolute opacity-20 floating-element ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon className="w-16 h-16 text-agri-500" strokeWidth={1} />
  </div>
);

// Weather Icon Component
const WeatherIcon = ({
  condition,
  size = 'default',
  className = '',
}: {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  size?: 'small' | 'default' | 'large';
  className?: string;
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const iconMap = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: CloudSnow,
  };

  const Icon = iconMap[condition];
  const colors = {
    sunny: 'text-amber-500',
    cloudy: 'text-gray-400',
    rainy: 'text-sky-500',
    snowy: 'text-blue-300',
  };

  return (
    <div className={`weather-icon ${className}`}>
      <Icon className={`${sizeClasses[size]} ${colors[condition]} ${condition === 'sunny' ? 'animate-spin-slow' : condition === 'rainy' ? 'animate-bounce-soft' : ''}`} />
    </div>
  );
};

// Weather Card Component
const WeatherCard = ({
  weather,
  isToday = false,
}: {
  weather: WeatherData;
  isToday?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative rounded-2xl p-5 transition-all duration-500 cursor-pointer overflow-hidden card-hover ${
        isToday
          ? 'bg-gradient-to-br from-agri-500 to-agri-600 text-white shadow-xl shadow-agri-500/30'
          : 'glass-card'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isToday && (
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-medium">Today</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <p className={`font-semibold ${isToday ? 'text-white' : 'text-gray-800'}`}>
            {weather.day}
          </p>
          <p className={`text-sm ${isToday ? 'text-white/70' : 'text-gray-500'}`}>
            {weather.date}
          </p>
        </div>
        <WeatherIcon condition={weather.condition} size="large" />
      </div>

      <div className="mb-4">
        <p className={`text-4xl font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>
          {weather.temp}
          <span className="text-lg font-normal">°C</span>
        </p>
        <p className={`text-sm ${isToday ? 'text-white/70' : 'text-gray-500'}`}>
          {weather.high}° / {weather.low}°
        </p>
      </div>

      <div
        className={`grid grid-cols-3 gap-2 pt-3 border-t ${
          isToday ? 'border-white/20' : 'border-gray-100'
        }`}
      >
        <div className="text-center">
          <Droplets className={`w-4 h-4 mx-auto mb-1 ${isToday ? 'text-white/70' : 'text-sky-500'}`} />
          <p className={`text-xs font-medium ${isToday ? 'text-white' : 'text-gray-700'}`}>
            {weather.humidity}%
          </p>
        </div>
        <div className="text-center">
          <CloudRain className={`w-4 h-4 mx-auto mb-1 ${isToday ? 'text-white/70' : 'text-agri-500'}`} />
          <p className={`text-xs font-medium ${isToday ? 'text-white' : 'text-gray-700'}`}>
            {weather.precipitation}mm
          </p>
        </div>
        <div className="text-center">
          <Wind className={`w-4 h-4 mx-auto mb-1 ${isToday ? 'text-white/70' : 'text-gray-400'}`} />
          <p className={`text-xs font-medium ${isToday ? 'text-white' : 'text-gray-700'}`}>
            {weather.wind}km/h
          </p>
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  color = 'agri',
  delay = 0,
}: {
  title: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'agri' | 'sky' | 'amber' | 'rose';
  delay?: number;
}) => {
  const colorClasses = {
    agri: { bg: 'from-agri-500 to-agri-600', icon: 'text-agri-500', shadow: 'shadow-agri-500/20' },
    sky: { bg: 'from-sky-500 to-sky-600', icon: 'text-sky-500', shadow: 'shadow-sky-500/20' },
    amber: { bg: 'from-amber-500 to-amber-600', icon: 'text-amber-500', shadow: 'shadow-amber-500/20' },
    rose: { bg: 'from-rose-500 to-rose-600', icon: 'text-rose-500', shadow: 'shadow-rose-500/20' },
  };

  return (
    <div
      className="stat-card animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color].bg} p-3 shadow-lg ${colorClasses[color].shadow}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend === 'up' ? 'text-agri-600' : 'text-rose-500'
            }`}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">
          <AnimatedNumber value={value} />
          <span className="text-lg font-normal text-gray-400 ml-1">{unit}</span>
        </p>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({
  value,
  max = 100,
  color = 'agri',
  showLabel = true,
  size = 'default',
}: {
  value: number;
  max?: number;
  color?: 'agri' | 'sky' | 'amber' | 'rose';
  showLabel?: boolean;
  size?: 'small' | 'default' | 'large';
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorClasses = {
    agri: 'from-agri-400 to-agri-500',
    sky: 'from-sky-400 to-sky-500',
    amber: 'from-amber-400 to-amber-500',
    rose: 'from-rose-400 to-rose-500',
  };

  const sizeClasses = {
    small: 'h-1.5',
    default: 'h-2.5',
    large: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{percentage.toFixed(0)}%</p>
      )}
    </div>
  );
};

// Crop Card Component
const CropCard = ({ crop }: { crop: CropData }) => (
  <div className="glass-card rounded-2xl p-5 card-hover">
    <div className="flex items-start gap-4 mb-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${crop.color}20` }}
      >
        <Leaf className="w-7 h-7" style={{ color: crop.color }} />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{crop.name}</h4>
        <p className="text-sm text-gray-500">{crop.growthStage}</p>
      </div>
      <span className="px-3 py-1 bg-agri-50 text-agri-600 rounded-full text-sm font-medium">
        {crop.health}%
      </span>
    </div>

    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-500">Health</span>
        <span className="font-medium text-gray-700">{crop.health}%</span>
      </div>
      <ProgressBar value={crop.health} color="agri" showLabel={false} />
    </div>

    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-gray-500">Planted</p>
        <p className="font-medium text-gray-700">{crop.planted}</p>
      </div>
      <div>
        <p className="text-gray-500">Harvest</p>
        <p className="font-medium text-gray-700">{crop.harvest}</p>
      </div>
      <div>
        <p className="text-gray-500">Area</p>
        <p className="font-medium text-gray-700">{crop.area} ha</p>
      </div>
      <div>
        <p className="text-gray-500">Yield Est.</p>
        <p className="font-medium text-gray-700">{crop.yield} t/ha</p>
      </div>
    </div>
  </div>
);

// Chart Components
const BarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-between gap-3 h-40 px-2">
      {data.map((item, index) => (
        <div key={item.label} className="flex flex-col items-center flex-1 gap-2">
          <div className="w-full flex flex-col justify-end h-32">
            <div
              className="chart-bar w-full transition-all duration-1000 hover:from-agri-400 hover:to-agri-300"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                animationDelay: `${index * 100}ms`,
              }}
            />
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const currentOffset = offset;
            offset += percentage;

            return (
              <circle
                key={item.label}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={item.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={-currentOffset}
                className="transition-all duration-1000"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-800 ml-auto">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Chatbot Component
const AIChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content:
        "Hello! I'm your AI farming assistant. I can help you with crop management, weather insights, pest control, and optimizing your farm operations. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(() => {
  if (!input.trim()) return;

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    type: 'user',
    content: input,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setIsTyping(true);

  fetch('https://kisan-alert-backend-rp2f.onrender.com/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: input }),
  })
    .then((res) => res.json())
    .then((data) => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    })
    .catch(() => {
      setIsTyping(false);
    });
}, [input]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden h-[500px] flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-sky-500 flex items-center justify-center shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">AI Farm Assistant</h4>
          <p className="text-xs text-agri-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-agri-500 rounded-full animate-pulse" />
            Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.type === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user'
                  ? 'bg-agri-500'
                  : 'bg-gradient-to-br from-agri-100 to-sky-100'
              }`}
            >
              {message.type === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-agri-600" />
              )}
            </div>
            <div
              className={`chat-bubble ${
                message.type === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-agri-100 to-sky-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-agri-600" />
            </div>
            <div className="chat-bubble chat-bubble-ai">
              <div className="typing-indicator">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your farm..."
            className="input-field flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="btn-primary px-4 !py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Hero Section Component
const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] overflow-hidden hero-gradient">
      {/* Animated Background Elements */}
      <div className="mesh-gradient absolute inset-0" />

      {/* Floating Agriculture Icons */}
      <FloatingIcon icon={Leaf} className="top-[15%] left-[10%]" delay={0} />
      <FloatingIcon icon={Sprout} className="top-[25%] right-[15%]" delay={1} />
      <FloatingIcon icon={Tractor} className="bottom-[20%] left-[20%]" delay={2} />
      <FloatingIcon icon={Sun} className="top-[10%] right-[25%]" delay={1.5} />
      <FloatingIcon icon={Cloud} className="bottom-[30%] right-[10%]" delay={0.5} />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-agri-200 shadow-sm">
              <Sparkles className="w-4 h-4 text-agri-500" />
              <span className="text-sm font-medium text-agri-700">
                AI-Powered Agriculture Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-gray-800">Cultivate</span>
              <br />
              <span className="gradient-text">Smarter</span>
              <br />
              <span className="text-gray-800">Harvests</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              Transform your agricultural operations with real-time insights,
              AI-driven recommendations, and precision farming tools designed
              for the modern farmer.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="btn-primary group flex items-center gap-2">
                Get Started
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="btn-secondary flex items-center gap-2">
                <Activity className="w-5 h-5" />
                View Demo
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-agri-400 to-agri-600 flex items-center justify-center text-white text-xs font-medium shadow-lg"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-gray-800">1,200+ Farms</p>
                <p className="text-sm text-gray-500">Trust our platform</p>
              </div>
            </div>
          </div>

          {/* Right Content - Demo Dashboard Preview */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="glass-card rounded-3xl p-6 shadow-2xl shadow-agri-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-agri-400" />
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  Farm Dashboard
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass rounded-xl p-4 bg-gradient-to-r from-agri-50 to-sky-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Sun className="w-6 h-6 text-amber-500 animate-spin-slow" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Perfect Growing Day
                      </p>
                      <p className="text-xs text-gray-500">
                        Optimal conditions detected
                      </p>
                    </div>
                  </div>
                  <ProgressBar value={85} color="agri" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-4">
                    <p className="text-2xl font-bold text-gray-800">24°C</p>
                    <p className="text-xs text-gray-500">Soil Temperature</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-2xl font-bold text-gray-800">68%</p>
                    <p className="text-xs text-gray-500">Humidity Level</p>
                  </div>
                </div>

                <div className="glass rounded-xl p-4 bg-gradient-to-r from-agri-500 to-agri-600">
                  <div className="flex items-center justify-between text-white mb-2">
                    <p className="font-medium">AI Recommendation</p>
                    <Zap className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-white/90">
                    Irrigate sector C in 2 hours for optimal moisture levels
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative floating card */}
            <div className="absolute -top-4 -right-4 glass-card rounded-xl p-4 animate-float shadow-lg hidden lg:block">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-agri-500" />
                <span className="text-sm font-medium text-gray-700">
                  99.9% Uptime
                </span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 glass-card rounded-xl p-4 animate-float-delayed shadow-lg hidden lg:block">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-sky-500" />
                <span className="text-sm font-medium text-gray-700">
                  ±2% Accuracy
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-agri-300 flex items-start justify-center p-1">
          <div className="w-1.5 h-2.5 rounded-full bg-agri-400 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

// Dashboard Section
const DashboardSection = () => {
  const [activeView, setActiveView] = useState<'overview' | 'crops' | 'weather'>(
    'overview'
  );

  const weatherData: WeatherData[] = [
    {
      day: 'Monday',
      date: 'Jul 7',
      temp: 24,
      high: 26,
      low: 18,
      condition: 'sunny',
      precipitation: 0,
      wind: 12,
      humidity: 45,
    },
    {
      day: 'Tuesday',
      date: 'Jul 8',
      temp: 22,
      high: 24,
      low: 16,
      condition: 'cloudy',
      precipitation: 5,
      wind: 18,
      humidity: 62,
    },
    {
      day: 'Wednesday',
      date: 'Jul 9',
      temp: 19,
      high: 21,
      low: 15,
      condition: 'rainy',
      precipitation: 15,
      wind: 25,
      humidity: 78,
    },
    {
      day: 'Thursday',
      date: 'Jul 10',
      temp: 20,
      high: 23,
      low: 14,
      condition: 'cloudy',
      precipitation: 3,
      wind: 14,
      humidity: 55,
    },
    {
      day: 'Friday',
      date: 'Jul 11',
      temp: 25,
      high: 28,
      low: 18,
      condition: 'sunny',
      precipitation: 0,
      wind: 10,
      humidity: 42,
    },
  ];

  const [cropData, setCropData] = useState<CropData[]>([]);

useEffect(() => {
  fetch('https://kisan-alert-backend-rp2f.onrender.com/crop-suggestions')
    .then((res) => res.json())
    .then((data) => setCropData(data))
    .catch((err) => console.error('Failed to fetch crop data:', err));
}, []);

  const yieldData = [
    { label: 'Jan', value: 65 },
    { label: 'Feb', value: 72 },
    { label: 'Mar', value: 83 },
    { label: 'Apr', value: 78 },
    { label: 'May', value: 91 },
    { label: 'Jun', value: 88 },
  ];

  const resourceData = [
    { label: 'Wheat', value: 45, color: '#f59e0b' },
    { label: 'Barley', value: 32, color: '#22c55e' },
    { label: 'Potatoes', value: 18, color: '#f97316' },
    { label: 'Corn', value: 28, color: '#eab308' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12 animate-slide-up">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Farm Dashboard
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Monitor your entire agricultural operation from one unified platform.
          Real-time data, AI insights, and actionable recommendations.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-8">
        <div className="glass-card rounded-xl p-1.5 inline-flex">
          {(['overview', 'crops', 'weather'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                activeView === view
                  ? 'bg-gradient-to-r from-agri-500 to-agri-600 text-white shadow-lg shadow-agri-500/30'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Farm Area"
            value={123}
            unit="hectares"
            icon={MapPin}
            trend="up"
            trendValue="+5%"
            color="agri"
            delay={0}
          />
          <StatCard
            title="Active Crops"
            value={12}
            unit="varieties"
            icon={Sprout}
            trend="up"
            trendValue="+2"
            color="sky"
            delay={100}
          />
          <StatCard
            title="Yield Forecast"
            value={847}
            unit="tons"
            icon={BarChart3}
            trend="up"
            trendValue="+12%"
            color="amber"
            delay={200}
          />
          <StatCard
            title="Water Usage"
            value={2340}
            unit="m³"
            icon={Droplets}
            trend="down"
            trendValue="-8%"
            color="rose"
            delay={300}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weather Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    5-Day Weather Forecast
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Central Valley Farm, CA
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-agri-600">
                  <Clock className="w-4 h-4" />
                  Updated 5 min ago
                </div>
              </div>

              <div className="grid sm:grid-cols-5 gap-4">
                {weatherData.map((weather, index) => (
                  <div
                    key={weather.day}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <WeatherCard weather={weather} isToday={index === 0} />
                  </div>
                ))}
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800">
                    Yield Performance
                  </h3>
                  <ArrowUpRight className="w-5 h-5 text-agri-500" />
                </div>
                <BarChart data={yieldData} />
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-800">
                    Crop Distribution
                  </h3>
                  <PieChart className="w-5 h-5 text-agri-500" />
                </div>
                <DonutChart data={resourceData} />
              </div>
            </div>
          </div>

          {/* AI Chatbot */}
          <div className="lg:col-span-1">
            <AIChatbot />
          </div>
        </div>

        {/* Crops Grid */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Crop Overview
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cropData.map((crop, index) => (
              <div
                key={crop.name}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CropCard crop={crop} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Activity,
      title: 'Real-Time Monitoring',
      description:
        'Track soil moisture, temperature, humidity, and growth metrics across all your fields with IoT sensors.',
      color: 'agri',
    },
    {
      icon: Bot,
      title: 'AI-Powered Insights',
      description:
        'Get personalized recommendations for irrigation, fertilization, and pest control based on your data.',
      color: 'sky',
    },
    {
      icon: Cloud,
      title: 'Weather Intelligence',
      description:
        'Access hyperlocal weather forecasts and alerts to plan your farming activities effectively.',
      color: 'amber',
    },
    {
      icon: Database,
      title: 'Data Analytics',
      description:
        'Visualize trends, analyze historical data, and make data-driven decisions for better yields.',
      color: 'rose',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description:
        'Early warning systems for disease, pests, and adverse weather conditions protect your investments.',
      color: 'agri',
    },
    {
      icon: Target,
      title: 'Precision Farming',
      description:
        'Variable rate technology and GPS guidance maximize efficiency and minimize waste.',
      color: 'sky',
    },
  ] as const;

  const colorClasses = {
    agri: 'from-agri-500 to-agri-600',
    sky: 'from-sky-500 to-sky-600',
    amber: 'from-amber-500 to-amber-600',
    rose: 'from-rose-500 to-rose-600',
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-agri-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Intelligence at Every Step
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform combines cutting-edge AI with comprehensive farm
            management tools to help you grow more with less.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-8 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[feature.color]} flex items-center justify-center mb-6 shadow-lg`}
              >
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Banner
const StatsBanner = () => {
  const stats = [
    { value: 2500, label: 'Active Farms', suffix: '+' },
    { value: 1.2, label: 'Million Hectares', suffix: 'M', decimals: 1 },
    { value: 98, label: 'Customer Satisfaction', suffix: '%' },
    { value: 15, label: 'Countries', suffix: '+' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-agri-600 via-agri-500 to-sky-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center py-6 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-5xl font-bold text-white mb-2">
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                />
              </p>
              <p className="text-white/80 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-lg shadow-agri-500/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-agri-600 flex items-center justify-center shadow-lg shadow-agri-500/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Agri<span className="text-agri-500">Wise</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-agri-600 transition-colors font-medium"
            >
              Features
            </a>
            <a
              href="#dashboard"
              className="text-gray-600 hover:text-agri-600 transition-colors font-medium"
            >
              Dashboard
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-agri-600 transition-colors font-medium"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="text-gray-600 hover:text-agri-600 transition-colors font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button className="btn-primary">Start Free Trial</button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slide-down">
            <nav className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-agri-600 transition-colors font-medium py-2"
              >
                Features
              </a>
              <a
                href="#dashboard"
                className="text-gray-600 hover:text-agri-600 transition-colors font-medium py-2"
              >
                Dashboard
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-agri-600 transition-colors font-medium py-2"
              >
                Pricing
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-agri-600 transition-colors font-medium py-2"
              >
                Contact
              </a>
              <button className="btn-primary mt-4 w-full">Start Free Trial</button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-gradient-to-b from-agri-900 to-agri-950 text-white py-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-agri-600 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              Agri<span className="text-agri-400">Wise</span>
            </span>
          </div>
          <p className="text-agri-300/70 leading-relaxed">
            Empowering farmers with AI-driven insights and precision agriculture
            tools for sustainable farming.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-3 text-agri-300/70">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Integrations
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                API
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-3 text-agri-300/70">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Community
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-3 text-agri-300/70">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-agri-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-agri-400 text-sm">
          © 2026 AgriWise. All rights reserved.
        </p>
        <p className="text-agri-400/50 text-sm">
          Building the future of sustainable agriculture.
        </p>
      </div>
    </div>
  </footer>
);

// Main App Component
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-agri-50 via-white to-sky-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-600 flex items-center justify-center shadow-2xl shadow-agri-500/30 animate-pulse-slow">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 rounded-2xl bg-agri-500/20 blur-xl animate-glow" />
          </div>
          <p className="text-gray-600 font-medium">Loading AgriWise...</p>
          <div className="mt-4 flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsBanner />
        <DashboardSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
