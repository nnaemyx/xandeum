# Xandeum pNode Analytics Platform

A comprehensive analytics dashboard for Xandeum pNodes (storage provider nodes), built with Next.js. This platform provides real-time monitoring, statistics, and insights into the Xandeum network's storage layer.

![Xandeum pNode Analytics](https://img.shields.io/badge/Xandeum-pNode%20Analytics-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-repo%2Fxandeum-dashboard)

## Features

- **Real-time pNode Monitoring**: Fetches and displays all pNodes from Xandeum network gossip using pRPC (pNode RPC) calls
- **Comprehensive Statistics**: Overview cards showing total nodes, online status, storage capacity, and average uptime
- **Interactive Data Table**: Sortable, searchable, and filterable table of all pNodes with key metrics
- **CSV Export**: Instantly download pNode data for offline analysis
- **Storage Visualization**: Bar charts showing storage distribution by region
- **Protected Access**: Dashboard requires Solana wallet connection for security
- **Mobile Optimized**: Fully responsive design with slide-out sidebar for mobile devices
- **Auto-refresh**: Automatically updates data every 30 seconds
- **Dark Mode Support**: Built-in dark mode for better viewing experience

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Access to Xandeum pRPC endpoint (or use mock data for development)

## Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd xandeum
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables** (optional):
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_PRPC_ENDPOINT=https://api.xandeum.network
   ```
   
   If not set, the app will use the default endpoint or fall back to mock data for demonstration.

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

The page will automatically reload when you make changes to the code.

## Building for Production

1. **Build the application**:
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

2. **Start the production server**:
   ```bash
   npm start
   # or
   yarn start
   # or
   pnpm start
   ```

## Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. **Push your code to GitHub** (or GitLab/Bitbucket)

2. **Import your repository to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will automatically detect Next.js

3. **Configure environment variables** (if needed):
   - In your Vercel project settings, add `NEXT_PUBLIC_PRPC_ENDPOINT` if you have a custom endpoint

4. **Deploy**: Click "Deploy" and your app will be live!

### Deploy to Other Platforms

This Next.js app can be deployed to any platform that supports Node.js:

- **Netlify**: Use the Next.js build plugin
- **Railway**: Connect your GitHub repo and deploy
- **AWS Amplify**: Import your repository
- **Docker**: Build a containerized version

For Docker deployment:
```bash
# Build the Docker image
docker build -t xandeum-analytics .

# Run the container
docker run -p 3000:3000 xandeum-analytics
```

## Project Structure

```
xandeum/
├── app/
│   ├── api/
│   │   └── pnodes/
│   │       └── route.ts          # API route for fetching pNodes
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main dashboard page
├── components/
│   ├── PNodeTable.tsx            # Sortable, filterable pNode table
│   ├── StatsOverview.tsx         # Statistics overview cards
│   └── StorageChart.tsx          # Storage visualization chart
├── lib/
│   └── pnode-api.ts              # pRPC API utilities and types
├── public/                       # Static assets
└── package.json
```

## API Integration

The platform uses pRPC (pNode RPC) calls to fetch pNode data. The main API functions are in `lib/pnode-api.ts`:

- `fetchPNodes()`: Retrieves all pNodes from gossip
- `fetchPNodeByPubkey()`: Fetches a specific pNode by public key
- `calculateStats()`: Calculates aggregate statistics

### Configuring the pRPC Endpoint

Update the `PRPC_ENDPOINT` constant in `lib/pnode-api.ts` or set the `NEXT_PUBLIC_PRPC_ENDPOINT` environment variable to point to your Xandeum pRPC endpoint.

**Note**: The current implementation includes mock data generation for development and demonstration purposes. Replace the mock data with actual pRPC API calls based on the Xandeum network documentation.

## Usage

1. **Connect Wallet**: Click "Connect Wallet" in the top right or on the landing screen to access the dashboard
2. **View Dashboard**: The main page displays an overview of all pNodes with key statistics
3. **Search pNodes**: Use the search bar to filter pNodes by pubkey, ID, or region
4. **Filter by Status**: Use the status dropdown to filter by online/offline/syncing
5. **Sort Data**: Click column headers to sort the table
6. **Export Data**: Click "Export CSV" to download the current pNode list
7. **View Charts**: Scroll down to see storage distribution charts
8. **Refresh Data**: Click the "Refresh" button or wait for auto-refresh (30 seconds)

## Features in Detail

### Statistics Overview
- **Total pNodes**: Count of all registered pNodes
- **Online Nodes**: Number of currently online pNodes
- **Total Storage**: Aggregate storage capacity across all nodes
- **Average Uptime**: Mean uptime percentage across all nodes

### pNode Table
Each pNode entry displays:
- **Public Key**: Unique identifier (truncated for readability)
- **Status**: Online, Offline, or Syncing
- **Region**: Geographic location
- **Uptime**: Percentage of time the node has been online
- **Storage**: Used and total storage capacity
- **Reputation**: Node reputation score (0-100)

### Storage Chart
Visual representation of storage capacity and usage by region, helping identify storage distribution across the network.

## Customization

### Adding New Metrics
1. Update the `PNode` interface in `lib/pnode-api.ts` to include new fields
2. Add columns to `PNodeTable.tsx`
3. Update statistics calculations in `calculateStats()`

### Styling
The app uses Tailwind CSS. Modify `app/globals.css` or component classes to customize the appearance.

### Auto-refresh Interval
Change the refresh interval in `app/page.tsx`:
```typescript
const interval = setInterval(fetchPNodes, 30000); // 30 seconds
```

## Troubleshooting

### pNodes Not Loading
- Check that the pRPC endpoint is correctly configured
- Verify network connectivity
- Check browser console for error messages
- The app will fall back to mock data if the API is unavailable

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (requires 18+)
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

### TypeScript Errors
- Run `npm run lint` to check for issues
- Ensure all types are properly defined in `lib/pnode-api.ts`

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Resources

- **Xandeum Network**: [xandeum.network](https://xandeum.network)
- **Xandeum Documentation**: [xandeum.network/docs](https://xandeum.network/docs)
- **Xandeum Discord**: [discord.gg/uqRSmmM5m](https://discord.gg/uqRSmmM5m)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

## License

This project is open source and available for the Xandeum ecosystem.

## Support

For questions or issues:
- Join the Xandeum Discord: [discord.gg/uqRSmmM5m](https://discord.gg/uqRSmmM5m)
- Check the Xandeum documentation: [xandeum.network/docs](https://xandeum.network/docs)

---

Built with ❤️ for the Xandeum Network
