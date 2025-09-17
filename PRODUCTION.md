# Production Deployment Guide

## ✅ Production-Ready Configuration

This application is now optimized for production deployment with the following key features:

### 🔧 **Optimized Dependencies**
- ✅ `puppeteer-core` - Lightweight, no bundled Chrome
- ✅ `@sparticuz/chromium` - Serverless-optimized Chrome binary
- ✅ Compatible versions for reliable operation

### 🚀 **Vercel Configuration**
- ✅ Increased memory allocation (1024MB)
- ✅ Extended timeout (60 seconds)  
- ✅ Optimized region settings

### 📝 **Production Checklist**

Before deploying:

1. **Environment Variables** (Optional)
   ```bash
   # These are automatically handled, but you can override if needed:
   NODE_ENV=production
   ```

2. **Vercel Settings**
   - The `vercel.json` file is already configured
   - Memory: 1024MB (sufficient for screenshot generation)
   - Timeout: 60 seconds (handles slow page loads)

3. **Test Deployment**
   ```bash
   # Deploy to Vercel
   vercel --prod
   
   # Test health endpoint first
   curl https://your-domain.vercel.app/api/health
   
   # Test screenshot API
   curl -X POST https://your-domain.vercel.app/api/screenshot \
     -H "Content-Type: application/json" \
     -d '{"url":"https://your-domain.vercel.app/card","fileName":"test.png"}'
   ```

### 🔍 **Production Monitoring**

The API includes comprehensive logging:
- Browser launch status
- Page navigation progress  
- Image loading status
- Screenshot generation metrics
- Error details with stack traces

View logs in Vercel Dashboard > Functions > Logs

### 🛠️ **Troubleshooting Production Issues**

**Common Issues & Solutions:**

1. **Timeout Errors**
   - Increase timeout in `vercel.json` if needed
   - Check if target URL loads quickly

2. **Memory Issues**
   - Current allocation: 1024MB (should be sufficient)
   - Can increase to 1536MB if needed in `vercel.json`

3. **Chrome Binary Issues**
   - Using `@sparticuz/chromium` v131.0.1 (tested stable version)
   - No manual Chrome installation needed

4. **Image Loading Failures**
   - API continues even if some images fail to load
   - Check image URLs are accessible from serverless environment

### 📊 **Performance Expectations**

- **Cold start**: 3-8 seconds (first request)
- **Warm requests**: 1-3 seconds
- **Screenshot generation**: 2-5 seconds
- **Memory usage**: ~200-400MB per request

### 🔐 **Security Considerations**

- All requests are validated
- No user input directly passed to shell
- Browser runs in sandboxed environment
- Proper error handling prevents information leakage

## 🚢 **Deploy Commands**

```bash
# 1. Commit your changes
git add .
git commit -m "Production-ready screenshot API"

# 2. Deploy to Vercel
vercel --prod

# 3. Test the deployment
curl https://your-domain.vercel.app/api/health
```

## ✨ **API Endpoints**

### Health Check
```
GET /api/health
```
Returns system status and chromium availability.

### Screenshot Generation  
```
POST /api/screenshot
Content-Type: application/json

{
  "url": "https://your-domain.vercel.app/card?userName=Test&userImage=/images/user-image.png",
  "fileName": "my-card.png"
}
```

Returns PNG image as binary response.

---

**Your application is now production-ready! 🎉**
