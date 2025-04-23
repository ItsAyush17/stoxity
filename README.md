Welcome to Stoxity
Project Info
URL: stoxity.js.org

Repository: github.com/itsayush17/stoxity

Stoxity is a retro-themed stock analysis web application engineered with a nostalgic pixel-art aesthetic, leveraging modern frontend technologies to deliver AI-powered financial insights. Built with a focus on responsive design and retro visual flourishes, Stoxity provides a unique blend of vintage terminal-style interfaces and cutting-edge stock analysis.
Project Overview
Stoxity is a single-page application (SPA) designed to offer users a seamless experience for querying and analyzing stock data. Key features include:
Retro Pixel-Art Aesthetic: Utilizes pixel fonts, dashed borders, and gradient text to evoke a nostalgic 8-bit terminal vibe.

Stock Search Functionality: Enables users to query stock symbols or company names via an intuitive search interface.

Comprehensive Analysis: Displays stock data in a retro terminal-style UI, with support for tabular formats and social media-style insight cards.

AI-Powered Insights: Integrates the DeepSeek API to generate predictive analytics and actionable insights derived from SEC filings and earnings reports.

API Key Management: Implements a secure, client-side API key management system for user authentication and API access control.

Responsive Design: Ensures optimal rendering across all device breakpoints using Tailwind CSS's responsive utilities.

Visual Flourishes: Incorporates retro-inspired UI elements like CRT scanline effects, pixelated icons, and animated gradients.

# Stoxity

Stoxity is an AI-powered stock analysis application that uses Google Gemini API to provide detailed insights about stocks.

## Real-time Data with Google Gemini API

This application uses Google Gemini API to fetch real-time stock data and analysis. To use this feature, you'll need to set up your Gemini API credentials.

### Setting Up Google Gemini API

1. **Create a Google Cloud account** if you don't already have one.
2. **Get a Gemini API key**:
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API key" button
   - Copy your API key

3. **Configure the application**:
   - Create a `.env` file in the root of the project
   - Add your API key to the file:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

## Feature Flags

You can control various aspects of the application by setting environment variables:

```
# Feature Flags
VITE_USE_REAL_DATA=true  # Set to false to use mock data instead of real API calls
VITE_ENABLE_CHARTS=true
VITE_ENABLE_NEWS=true
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## Tech Stack

- React
- TypeScript
- Vite
- TailwindCSS
- Recharts
- Google Gemini API
- ShadcnUI

## How It Works

1. User searches for a stock symbol
2. The application validates that the stock is in our suggestions list
3. If valid, it queries the Google Gemini API with a carefully crafted prompt
4. The API returns comprehensive stock information, which is then formatted and displayed
5. If the API call fails, the app falls back to mock data

## Mock vs. Real Data

By default, the application uses real data from the Gemini API. If you'd like to use mock data instead (for testing or development), set `VITE_USE_REAL_DATA=false` in your `.env` file.

## API Cost Considerations

Note that the Google Gemini API has usage quotas and may incur costs if you exceed the free tier limits. For more information, see the [Gemini API pricing](https://ai.google.dev/pricing).

# Step 1: Clone the repository.
git clone https://github.com/itsayush17/stoxity.git

# Step 2: Navigate to the project directory.
cd stoxity

# Step 3: Install dependencies.
npm install

# Step 4: Launch the development server with hot-module replacement (HMR) and live preview.
npm run dev

Edit files using your IDE of choice (e.g., VS Code, WebStorm). Push changes to the repository to sync updates with Lovable.
3. Edit Directly in GitHub
Navigate to the desired file in the GitHub repository.

Click the Edit button (pencil icon) in the file view.

Commit changes directly to the main branch or create a pull request for peer review.

Commits are automatically reflected in Lovable.

4. Use GitHub Codespaces
From the repository's main page, click the Code button (green) and select the Codespaces tab.

Click New Codespace to spin up a cloud-based development environment preconfigured with Stoxity's dependencies.

Edit files within the Codespace, then commit and push changes to the repository.

What Technologies Power Stoxity?
Stoxity is architected with a modern frontend stack optimized for performance and developer experience:
Vite: A next-generation build tool and development server with lightning-fast HMR and ES module support.

TypeScript: Provides static typing for enhanced code reliability and maintainability.

React: Powers the component-based UI, enabling declarative rendering and state management.

shadcn-ui: A collection of accessible, customizable UI components tailored for rapid prototyping.

Tailwind CSS: A utility-first CSS framework for crafting responsive, retro-styled interfaces with minimal custom CSS.

DeepSeek API: Integrates AI-driven financial analytics, processing SEC filings and earnings data for predictive insights.

Additional dependencies include:
Axios: For handling HTTP requests to the DeepSeek API and other external data sources.

React Query: For efficient data fetching, caching, and synchronization of stock data.

Vite PWA Plugin: Enables progressive web app (PWA) capabilities for offline access and native-like experiences.

