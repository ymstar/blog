export interface Project {
  name: string;
  description: string;
  url: string;
  type: 'online' | 'docs' | 'tool';
  openSource: boolean;
  repo?: string;
  icon: string; // /products/xxx.png
  accent: string; // tailwind gradient classes
}

export const projects: Project[] = [
  {
    name: '卡雷达',
    description: '一站式移动上网方案决策平台，流量卡、随身WiFi、家庭宽带',
    url: 'https://kaleida.com.cn',
    type: 'online',
    openSource: false,
    icon: '/products/kaleida.png',
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    name: 'DyHub',
    description: '抖音弹幕中台，将直播间互动事件通过 WebSocket / SSE / Webhook 三种通道分发',
    url: 'https://github.com/ymstar/dyhub',
    type: 'tool',
    openSource: true,
    repo: 'https://github.com/ymstar/dyhub',
    icon: '/products/dyhub.png',
    accent: 'from-pink-500 to-rose-400',
  },
  {
    name: '小沙的个人菜谱',
    description: '给我媳妇量身打造的家常菜谱记录和分享网站',
    url: 'https://cookbook.ymstar.cn',
    type: 'online',
    openSource: true,
    repo: 'https://github.com/ymstar/cookbook',
    icon: '/products/cookbook.png',
    accent: 'from-orange-500 to-amber-400',
  },
  {
    name: '河北高考志愿助手',
    description: '为河北考生量身定制的高考志愿辅助系统',
    url: 'https://hbzhiyuan.site',
    type: 'online',
    openSource: false,
    icon: '/products/hbzhiyuan.png',
    accent: 'from-violet-500 to-purple-400',
  },
];
