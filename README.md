# Solana Student Card Generator with Puppeteer Screenshots

This is a Next.js application that generates Solana Student Africa Summit 2025 cards and allows users to download them as high-quality PNG images using Puppeteer.

## Features

- 🎨 Beautiful Solana Student Africa Summit 2025 card design
- 📸 High-quality screenshot generation using Puppeteer
- 🖼️ Customizable user names and images
- 📱 Responsive design
- ☁️ Serverless deployment ready

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Puppeteer** - Screenshot generation
- **@sparticuz/chromium** - Serverless Chrome browser

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dp-screenshot-api
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Main Features

1. **View Card**: Visit `/` to see the main card with download functionality
2. **Download Card**: Click the "Download" button to generate and download a PNG image
3. **Custom Card**: Visit `/card?userName=YourName&userImage=/path/to/image.png` for customization
4. **API Endpoint**: POST to `/api/screenshot` with URL and filename to generate screenshots

### API Usage

```javascript
// Example API call
const response = await fetch('/api/screenshot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'http://localhost:3000/card?userName=ADEMIDE',
    fileName: 'my-card.png'
  }),
});

const blob = await response.blob();
// Handle the downloaded image blob
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy automatically

The app is configured to work with Vercel's serverless environment using `@sparticuz/chromium`.

### Other Platforms

For other serverless platforms, ensure:
- Node.js 18+ runtime
- Sufficient memory allocation (512MB+)
- Proper Chrome/Chromium binary availability

## Environment Variables

For production deployment, you may need:

```bash
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## Project Structure

```
├── app/
│   ├── api/screenshot/route.ts    # Screenshot API endpoint
│   ├── card/page.tsx              # Clean card page for screenshots
│   ├── page.tsx                   # Main page with download button
│   └── layout.tsx                 # Root layout
├── components/
│   └── InvitationCard.tsx         # Main card component
├── public/
│   └── images/                    # Card assets (user images, logos, etc.)
└── package.json
```

## Customization

### Adding New Images

1. Add images to `public/images/`
2. Update the `InvitationCard` component to reference new images
3. Ensure images are optimized for web (WebP, PNG)

### Styling

The card uses Tailwind CSS. Modify the `InvitationCard.tsx` component to change:
- Colors and gradients
- Typography and fonts
- Layout and spacing
- Background effects

## Troubleshooting

### Puppeteer Issues

If you encounter Chrome/Chromium issues:

1. **Local Development**: Ensure Chrome is installed
2. **Production**: The app uses `@sparticuz/chromium` for serverless environments
3. **Memory Issues**: Increase serverless function memory limits

### Common Errors

- **Chrome not found**: Install Chrome locally or ensure `@sparticuz/chromium` is properly configured
- **Timeout errors**: Increase the `waitUntil: 'networkidle0'` timeout in the API
- **Image loading**: Ensure all images are accessible and properly sized

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
