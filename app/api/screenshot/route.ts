import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fs from 'fs';

// Import regular puppeteer for development
let puppeteerDev: any = null;
try {
  puppeteerDev = require('puppeteer');
} catch {
  // puppeteer not available, will use puppeteer-core
}

export async function POST(request: NextRequest) {
  try {
    const { url, fileName } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Determine if we're in production (serverless) environment
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    let executablePath;
    let browserArgs;
    
    if (isProduction) {
      // Production: Use @sparticuz/chromium
      executablePath = await chromium.executablePath();
      browserArgs = [
        ...chromium.args,
        '--hide-scrollbars',
        '--disable-web-security',
      ];
    } else {
      // Development: Try to find local Chrome, fallback to @sparticuz/chromium
      const localChromePaths = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS
        '/usr/bin/google-chrome-stable', // Linux
        '/usr/bin/google-chrome', // Linux alternative
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Windows
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // Windows 32-bit
      ];
      
      // Try to find local Chrome first
      for (const path of localChromePaths) {
        try {
          if (fs.existsSync(path)) {
            executablePath = path;
            break;
          }
        } catch {
          continue;
        }
      }
      
      // If no local Chrome found, use @sparticuz/chromium
      if (!executablePath) {
        executablePath = await chromium.executablePath();
        browserArgs = chromium.args;
      } else {
        browserArgs = [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
        ];
      }
    }

    // Launch Puppeteer with puppeteer-core
    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: browserArgs,
    });

    const page = await browser.newPage();
    
    // Set viewport size to match the card dimensions
    await page.setViewport({ 
      width: 1200, 
      height: 800,
      deviceScaleFactor: 2 // Higher resolution for better quality
    });

    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Wait for images to load
    await page.evaluate(() => {
      return Promise.all(
        Array.from(document.images, img => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.addEventListener('load', resolve);
            img.addEventListener('error', reject);
          });
        })
      );
    });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 800
      }
    });

    await browser.close();

    // Return the screenshot as a response
    return new NextResponse(Buffer.from(screenshot), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${fileName || 'screenshot.png'}"`,
      },
    });

  } catch (error) {
    console.error('Screenshot error:', error);
    return NextResponse.json(
      { error: 'Failed to generate screenshot', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
