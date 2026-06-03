# 六爻占卜 - 易经六爻在线占卜系统

基于 Next.js + Supabase 构建的六爻占卜网站，支持多用户、占卜记录保存和六度关系网。

## 功能

- 易经六爻在线起卦（三枚铜钱法）
- 自动解析卦象、动爻、变卦
- 用户注册/登录（邮箱 + Google OAuth）
- 占卜记录保存与历史回顾
- 六度关系网：可视化用户之间的占卜关联

## 技术栈

- Next.js 14 + TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- D3.js (关系网可视化)
- Vercel 部署

## 本地开发

1. 克隆项目
2. 安装依赖: `npm install`
3. 创建 `.env.local` 文件，配置 Supabase 环境变量
4. 运行: `npm run dev`

## 环境变量

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```