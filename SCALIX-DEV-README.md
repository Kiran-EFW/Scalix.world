# 🚀 Scalix.world Development Launcher

Comprehensive scripts to run the complete Scalix.world ecosystem in development mode.

## 📋 What's Included

The Scalix.world ecosystem consists of:

- **🌐 Scalix.world Web App** (Next.js) - Main application interface
- **🤖 Mock LiteLLM Server** - AI API backend with model routing
- **🔗 Scalix Bridge Server** - Cross-platform communication hub

## 🎯 Quick Start

### Option 1: PowerShell Script (Recommended)
```powershell
# Start all services
.\start-scalix-dev.ps1

# Check status
.\start-scalix-dev.ps1 -Status

# Stop all services
.\start-scalix-dev.ps1 -Stop
```

### Option 2: Batch Script
```batch
# Start all services
start-scalix-dev.bat
```

## 📊 Services Started

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Scalix.world Web** | 3000 | http://localhost:3000 | Main web application |
| **Admin Dashboard** | 3000 | http://localhost:3000/admin | System administration |
| **LiteLLM API** | 4000 | http://localhost:4000 | AI model gateway |
| **Analytics API** | 4000 | http://localhost:4000/v1/analytics | Usage analytics |
| **Chat API** | 4000 | http://localhost:4000/v1/chat/completions | AI chat completions |

## 🔧 PowerShell Script Features

The PowerShell script (`start-scalix-dev.ps1`) provides:

- ✅ **Automatic directory navigation**
- ✅ **Background service management**
- ✅ **Health checks for all services**
- ✅ **Colored output with status indicators**
- ✅ **Error handling and troubleshooting**
- ✅ **Service status monitoring**
- ✅ **Graceful shutdown capabilities**

### PowerShell Commands:

```powershell
# Start development environment
.\start-scalix-dev.ps1

# Check service status
.\start-scalix-dev.ps1 -Status

# Stop all services
.\start-scalix-dev.ps1 -Stop
```

## 📁 Directory Structure

```
crea-AI-master/
├── Scalix.world web/          # Next.js web application
│   ├── app/                   # Next.js app directory
│   ├── components/            # React components
│   ├── lib/                   # Utilities and configurations
│   └── package.json           # Node.js dependencies
├── litellm-main/
│   └── litellm-main/          # Backend services
│       ├── mock_litellm_server.py    # AI API server
│       ├── scalix_bridge_server.py   # Communication hub
│       └── [other backend files]
├── start-scalix-dev.ps1       # PowerShell launcher
├── start-scalix-dev.bat       # Batch launcher
└── SCALIX-DEV-README.md       # This documentation
```

## 🛠️ Prerequisites

Ensure you have the following installed:

- ✅ **Node.js** (v16 or higher) - for the web application
- ✅ **npm** or **yarn** - package manager
- ✅ **Python** (v3.8 or higher) - for backend services
- ✅ **PowerShell** (for advanced script features)

## 🚀 Manual Startup (Alternative)

If you prefer to start services manually:

### 1. Start Web Application
```bash
cd "C:\Users\kiran\Downloads\crea-AI-master\Scalix.world web"
npm run dev
```

### 2. Start Backend Services
```bash
cd "C:\Users\kiran\Downloads\crea-AI-master\litellm-main\litellm-main"
python mock_litellm_server.py
python scalix_bridge_server.py
```

## 🔍 Troubleshooting

### Common Issues:

1. **Port Already in Use**
   ```
   Error: Port 3000/4000 already in use
   Solution: Close other applications or change ports in scripts
   ```

2. **npm/Python Not Found**
   ```
   Error: npm/python command not found
   Solution: Install Node.js and Python, ensure they're in PATH
   ```

3. **Directory Not Found**
   ```
   Error: Cannot find path
   Solution: Verify the directory structure matches the script paths
   ```

### Health Checks:

Test individual services:
```bash
# Web application
curl http://localhost:3000

# Backend services
curl http://localhost:4000/health

# Analytics API
curl http://localhost:4000/v1/analytics
```

## 📊 Service Monitoring

### Check All Services:
```powershell
.\start-scalix-dev.ps1 -Status
```

### View Running Processes:
```powershell
# Check Node.js processes
Get-Process -Name node

# Check Python processes
Get-Process -Name python

# Check background jobs
Get-Job
```

## 🛑 Stopping Services

### Using the Script:
```powershell
.\start-scalix-dev.ps1 -Stop
```

### Manual Stop:
```powershell
# Stop Node.js processes
Get-Process -Name node | Stop-Process -Force

# Stop Python processes
Get-Process -Name python | Stop-Process -Force

# Stop background jobs
Get-Job | Stop-Job -PassThru | Remove-Job
```

## 🎯 Development Workflow

1. **Start Development Environment:**
   ```powershell
   .\start-scalix-dev.ps1
   ```

2. **Access the Application:**
   - Main App: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

3. **Monitor Services:**
   ```powershell
   .\start-scalix-dev.ps1 -Status
   ```

4. **Stop When Done:**
   ```powershell
   .\start-scalix-dev.ps1 -Stop
   ```

## 🔧 Customization

### Change Ports:
Edit the script files to use different ports if needed:
- Web App: Default port 3000
- Backend Services: Default port 4000

### Modify Directories:
Update the directory paths in the scripts if your folder structure differs.

## 📈 Features Included

- ✅ **Complete Web Application** with modern UI
- ✅ **Admin Dashboard** for system management
- ✅ **AI Model Integration** (OpenAI, Gemini, Claude)
- ✅ **Real-time Analytics** and monitoring
- ✅ **Cross-platform Communication**
- ✅ **Mobile Responsive Design**
- ✅ **PWA Features** (offline, installable)
- ✅ **Accessibility Compliance** (WCAG)
- ✅ **Real-time Notifications**
- ✅ **Advanced User Onboarding**

## 🎉 Success Indicators

When everything is running correctly, you should see:

```
✅ Web Application: Running (Status: 200)
✅ Backend Services: Running (Status: 200)
🎉 SUCCESS! All Scalix.world services are running!
```

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure ports 3000 and 4000 are available
4. Check the console output for specific error messages

---

**🎯 Ready to launch your Scalix.world development environment!** 🚀✨
