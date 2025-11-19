
# Artistrial Client

A modern Next.js frontend application for the Artistrial platform - a comprehensive marketplace for artists, creators, and creative professionals.

## Features

- **Modern UI/UX**: Built with Next.js 14, React 18, and Tailwind CSS
- **Component Library**: Extensive use of Radix UI components for accessibility
- **Authentication**: Integrated with Supabase for user management
- **Marketplace**: Multi-category marketplace for assets, talent, studios, and more
- **Dashboard**: Comprehensive dashboard for users to manage their creative work
- **Responsive Design**: Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Database**: Supabase
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-github-repo-url>
cd artistrial-client
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase credentials and other environment variables
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── app/                    # Next.js app directory
│   ├── (public)/          # Public routes
│   └── dashboard/         # Protected dashboard routes
├── src/
│   ├── components/        # Reusable components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   └── utils/            # Helper functions
└── styles/               # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
