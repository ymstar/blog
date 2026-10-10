export interface Project {
  name: string;
  description: string;
  url: string;
  type: 'online' | 'docs' | 'tool';
  openSource: boolean;
  repo?: string;
  accent: string; // tailwind gradient classes
}

export const projects: Project[] = [
  {
    name: '卡雷达',
    description: '在线雷达图表生成工具，可视化你的多维数据',
    url: 'https://kaleida.com.cn',
    type: 'online',
    openSource: false,
    accent: 'from-blue-500 to-cyan-400',
  },
  {
    name: '个人菜谱',
    description: '个人菜谱集合网站，记录每一道家常菜',
    url: 'https://cookbook.ymstar.cn',
    type: 'online',
    openSource: true,
    repo: 'https://github.com/ymstar/cookbook',
    accent: 'from-orange-500 to-amber-400',
  },
  {
    name: 'Temporal 中文文档',
    description: 'Temporal 分布式工作流引擎中文翻译文档',
    url: 'https://temporalcn.site',
    type: 'docs',
    openSource: true,
    repo: 'https://github.com/ymstar/temporalcn',
    accent: 'from-violet-500 to-purple-400',
  },
  {
    name: 'DyHub',
    description: '抖音弹幕互动中台，直播弹幕的统一管理',
    url: 'https://github.com/ymstar/dyhub',
    type: 'tool',
    openSource: true,
    repo: 'https://github.com/ymstar/dyhub',
    accent: 'from-pink-500 to-rose-400',
  },
];
