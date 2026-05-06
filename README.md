# Pulse Ops

A real-time system monitoring and incident management dashboard built with Next.js 16. Pulse Ops provides comprehensive visibility into service health, incident tracking, and system event streams.

## 🚀 Features

### Service Monitoring
- **Real-time Service Status**: Monitor all services with live health indicators
- **System Status Banner**: At-a-glance view of overall system health
- **Service Health Table**: Detailed metrics for uptime, latency, and request rates
- **Activity Strips**: Visual representation of service activity over time
- **Animated Metrics**: Real-time number animations for key performance indicators

### Incident Management
- **Incident Dashboard**: Track and manage active incidents
- **Incident Timeline**: Detailed chronological view of incident events
- **Alert Integration**: Real-time incident alerts with severity indicators
- **Duration Tracking**: Automatic calculation of incident duration
- **Detailed Incident Pages**: Deep-dive into specific incidents with full event history

### Event Explorer
- **Live Event Stream**: Real-time system event monitoring
- **Advanced Filtering**: Filter by service, severity level, and text search
- **Auto-scroll**: Toggle automatic scrolling for new events
- **Event Highlighting**: Visual indicators for newly arrived events
- **URL-based Filters**: Deep-linkable filter states for sharing

### UI/UX
- **Modern Interface**: Clean, professional design with dark mode support
- **Responsive Layout**: Fully responsive across desktop and mobile
- **Skeleton Loading**: Smooth loading states with skeleton screens
- **Toast Notifications**: Non-intrusive alerts using Sonner
- **Interactive Components**: Dropdowns, dialogs, tooltips, and more

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **State Management**: 
  - TanStack Query (React Query) for server state
  - Zustand for client state
- **Data Visualization**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Form Validation**: Zod

## 📁 Project Structure

```
pulse-ops/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Global styles
│   └── (dashboard)/             # Dashboard route group
│       ├── layout.tsx           # Dashboard layout with sidebar
│       ├── overview/            # System overview page
│       ├── services/            # Services monitoring
│       ├── incidents/           # Incident management
│       │   ├── [id]/           # Individual incident pages
│       │   └── hooks/          # Page-specific hooks
│       └── explorer/            # Event stream explorer
│
├── features/                    # Feature-based modules
│   ├── services/               # Service monitoring
│   │   ├── components/         # UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── api/                # API layer
│   │   ├── utils/              # Utility functions
│   │   └── types.ts            # TypeScript types
│   ├── incidents/              # Incident management
│   │   ├── components/         # Incident UI components
│   │   ├── hooks/              # Incident-related hooks
│   │   ├── api/                # Incident data fetching
│   │   ├── utils/              # Helper functions
│   │   └── types.ts            # Incident types
│   └── explorer/               # Event explorer
│       ├── components/         # Event viewer components
│       ├── hooks/              # Event filtering & fetching
│       ├── api/                # Event data layer
│       └── types.ts            # Event types
│
├── components/                  # Shared components
│   ├── layout/                 # Layout components
│   │   ├── app-shell.tsx      # Main app wrapper
│   │   ├── sidebar.tsx        # Navigation sidebar
│   │   ├── topbar.tsx         # Top navigation bar
│   │   └── page-container.tsx # Page wrapper
│   └── ui/                     # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── table.tsx
│       ├── dialog.tsx
│       └── ...                 # shadcn/ui components
│
├── mocks/                       # Mock data & generators
│   ├── services.ts             # Service data generator
│   ├── incidents-engine.ts     # Incident simulation
│   ├── events.ts               # Event data generator
│   ├── event-store.ts          # Event storage
│   └── system-state.ts         # System state management
│
├── hooks/                       # Global custom hooks
├── lib/                         # Utility libraries
│   └── utils.ts                # Helper functions (cn, etc.)
├── providers/                   # Context providers
│   └── query-provider.tsx      # React Query setup
├── types/                       # Global TypeScript types
└── public/                      # Static assets
```

## 🏗️ Architecture

### Feature-Based Organization
The project follows a feature-based architecture where each major feature (services, incidents, explorer) is self-contained with its own:
- **Components**: UI specific to the feature
- **Hooks**: Business logic and state management
- **API layer**: Data fetching functions
- **Types**: TypeScript definitions
- **Utils**: Helper functions

### Data Flow
1. **Mock Layer**: Simulates backend services with realistic data generation
2. **API Layer**: Feature-specific functions handle data fetching
3. **Hooks Layer**: Custom hooks manage state with React Query
4. **Component Layer**: UI components consume hooks for rendering

### State Management Strategy
- **Server State**: TanStack Query with automatic caching, refetching, and optimistic updates
- **URL State**: Search params for shareable filter states
- **Local State**: React useState for component-specific state
- **Global State**: Zustand for cross-cutting concerns (if needed)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pulse-ops
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm run start
```

## 📝 Development Notes

### Key Design Patterns

- **Co-location**: Components, hooks, and utilities live near their features
- **Separation of Concerns**: Clear boundaries between UI, logic, and data
- **Composition**: Small, reusable components built with Radix UI
- **Type Safety**: Comprehensive TypeScript coverage

### Code Organization Rules

1. Page components in `app/` should be lightweight presentational shells
2. Business logic and data fetching belong in `features/`
3. Reusable UI components go in `components/ui/`
4. Layout components stay in `components/layout/`
5. Mock data generators remain isolated in `mocks/`

### Adding New Features

1. Create a new folder in `features/` with the structure:
   - `components/` - Feature UI
   - `hooks/` - Custom hooks
   - `api/` - Data fetching
   - `types.ts` - Type definitions
   - `utils/` - Helper functions (if needed)

2. Add page route in `app/(dashboard)/[feature-name]/`
3. Import and use feature components in page

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com)
- [shadcn/ui](https://ui.shadcn.com)

## 📄 License

This project is part of a portfolio and is available for reference and learning purposes.
