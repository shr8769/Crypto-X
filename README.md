# CryptoX - Next-Gen Crypto Trading Platform

A modern, professional cryptocurrency trading platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real-time Crypto Prices**: Live price updates for major cryptocurrencies
- **Modern Dashboard**: Clean, professional interface with real-time data
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Sleek dark theme with cyan/green accents
- **Type-Safe**: Built with TypeScript for better development experience
- **Component-Based**: Modular React components for maintainability

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Navigation.tsx  # Main navigation component
│   ├── Hero.tsx        # Landing page hero section
│   └── index.ts        # Component exports
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── Auth.tsx        # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── NotFound.tsx    # 404 page
│   └── index.ts        # Page exports
├── hooks/              # Custom React hooks
│   ├── useCryptoPrices.ts # Crypto price data hook
│   └── use-mobile.tsx  # Mobile detection hook
├── utils/              # Utility functions
│   └── formatters.ts   # Data formatting utilities
├── types/              # TypeScript type definitions
│   └── crypto.ts       # Crypto-related types
├── constants/          # Application constants
│   └── crypto.ts       # Crypto-related constants
├── lib/                # Library configurations
│   └── utils.ts        # Utility functions
└── styles/
    └── index.css       # Global styles and design system
```

## 🎨 Design System

The project uses a comprehensive design system with:

- **Colors**: Dark theme with cyan/green accent colors
- **Typography**: Modern, readable font hierarchy
- **Components**: Consistent spacing and styling
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design approach

## 🔧 Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:8080](http://localhost:8080) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📱 Pages

- **/** - Landing page with hero section and features
- **/auth** - Login and signup page
- **/dashboard** - Main trading dashboard with live prices
- **404** - Custom not found page

## 🚀 Deployment

The app can be deployed to any static hosting service:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting service

## 📈 Future Enhancements

- Real crypto API integration
- User authentication and accounts
- Portfolio tracking
- Advanced charting
- Trading functionality
- Real-time notifications
- Mobile app

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.