# TRD Spark Starter

A modern, full-stack TypeScript starter template built with React, Vite, and Supabase. This project provides a solid foundation for building scalable web applications with a beautiful UI powered by shadcn/ui components.

## 🚀 Tech Stack

- **Frontend Framework:** React 18.3
- **Build Tool:** Vite 5.4
- **Language:** TypeScript 5.8
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui (Radix UI)
- **Backend/Database:** Supabase
- **State Management:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Routing:** React Router DOM
- **Icons:** Lucide React

## ✨ Features

- ⚡️ Lightning-fast development with Vite and React SWC
- 🎨 Beautiful, accessible UI components from shadcn/ui
- 🔐 Supabase integration for authentication and database
- 📱 Responsive design with Tailwind CSS
- 🎯 Type-safe forms with React Hook Form and Zod validation
- 🌙 Dark mode support with next-themes
- 📊 Data visualization with Recharts
- 🎭 Comprehensive component library including:
  - Dialogs, Dropdowns, and Modals
  - Forms, Inputs, and Selects
  - Navigation components
  - Data displays and cards
  - Toast notifications (Sonner)

## 📋 Prerequisites

- Node.js 18+ or Bun runtime
- npm, yarn, or bun package manager
- Supabase account (for backend features)

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ash-norsidi/trd-spark-starter.git
   cd trd-spark-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables**
   
   Copy the `.env` file and update with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The application will be available at `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## 📁 Project Structure

```
trd-spark-starter/
├── src/              # Source files
├── public/           # Static assets
├── supabase/         # Supabase configuration and migrations
├── index.html        # Entry HTML file
├── vite.config.ts    # Vite configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json     # TypeScript configuration
```

## 🎨 UI Components

This starter includes a comprehensive set of pre-built, accessible UI components:

- **Layout:** Accordion, Collapsible, Resizable Panels, Scroll Area, Separator, Tabs
- **Forms:** Checkbox, Input, Label, Radio Group, Select, Slider, Switch, Textarea
- **Overlays:** Alert Dialog, Dialog, Drawer (Vaul), Hover Card, Popover, Sheet, Tooltip
- **Navigation:** Context Menu, Dropdown Menu, Menubar, Navigation Menu
- **Feedback:** Progress, Toast (Sonner)
- **Data Display:** Avatar, Card, Charts (Recharts), Calendar
- **Input:** Command (cmdk), Date Picker, OTP Input

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom configuration including the typography plugin. Customize your design tokens in `tailwind.config.ts`.

### shadcn/ui Components
Components are configured in `components.json` and can be added using the shadcn CLI:

```bash
npx shadcn@latest add [component-name]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Built with ❤️ using modern web technologies
