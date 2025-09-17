import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(request: NextRequest) {
  let browser;
  
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
      // Production: Use @sparticuz/chromium optimized for serverless
      executablePath = await chromium.executablePath();
      browserArgs = chromium.args;
    } else {
      // Development: Use @sparticuz/chromium for consistency
      executablePath = await chromium.executablePath();
      browserArgs = [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ];
    }

    // Launch Puppeteer with error handling
    console.log('Launching browser with executablePath:', executablePath ? 'Available' : 'None');
    console.log('Browser args length:', browserArgs.length);
    
    browser = await puppeteer.launch({
      headless: true,
      executablePath,
      args: browserArgs,
      timeout: 30000,
    });
    
    console.log('Browser launched successfully');

    const page = await browser.newPage();
    
    // Set viewport size to match the card dimensions
    await page.setViewport({ 
      width: 1200, 
      height: 800,
      deviceScaleFactor: 2 // Higher resolution for better quality
    });

    console.log('Navigating to URL:', url);
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    console.log('Page loaded, waiting for images');
    // Wait for images to load with timeout
    try {
      await page.evaluate(() => {
        return Promise.all(
          Array.from(document.images, img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error('Image load timeout')), 10000);
              img.addEventListener('load', () => {
                clearTimeout(timeout);
                resolve(void 0);
              });
              img.addEventListener('error', () => {
                clearTimeout(timeout);
                resolve(void 0); // Continue even if some images fail
              });
            });
          })
        );
      });
    } catch (imageError) {
      console.warn('Some images failed to load:', imageError);
      // Continue with screenshot anyway
    }

    console.log('Taking screenshot');
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

    console.log('Screenshot taken successfully, size:', screenshot.length);
    
    await page.close();
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
    
    // Ensure browser is closed even on error
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate screenshot', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
