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

