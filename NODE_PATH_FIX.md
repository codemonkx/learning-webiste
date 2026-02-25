# Node.js PATH Fix for Windows

## The Issue

Node.js is installed but not in your system PATH, so commands like `node` and `npm` don't work directly.

## Quick Fix (Current Session Only)

Run this in PowerShell to use Node.js in your current terminal:

```powershell
$env:Path += ";C:\Program Files\nodejs"
```

Then verify:
```powershell
node --version
npm --version
```

## Permanent Fix (Recommended)

### Option 1: Restart Your Computer

The easiest solution - just restart your computer. Windows will automatically load the PATH that was set during Node.js installation.

### Option 2: Manual PATH Configuration

1. **Open System Properties**
   - Press `Win + X`
   - Select "System"
   - Click "Advanced system settings"
   - Click "Environment Variables"

2. **Edit PATH Variable**
   - Under "System variables", find and select "Path"
   - Click "Edit"
   - Click "New"
   - Add: `C:\Program Files\nodejs`
   - Click "OK" on all dialogs

3. **Restart PowerShell**
   - Close all PowerShell windows
   - Open a new PowerShell window
   - Test: `node --version`

### Option 3: Use PowerShell Profile (Advanced)

Add Node.js to PATH automatically when PowerShell starts:

```powershell
# Open PowerShell profile
notepad $PROFILE

# Add this line:
$env:Path += ";C:\Program Files\nodejs"

# Save and close
# Restart PowerShell
```

## Using Node.js Without PATH

If you don't want to fix the PATH, you can always use the full path:

```powershell
# Run node
& "C:\Program Files\nodejs\node.exe" --version

# Run npm
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" start

# Start your server
& "C:\Program Files\nodejs\node.exe" server.js
```

## For This Project

I've already installed the dependencies using the full path. To start your server:

```powershell
# Option 1: Using full path
& "C:\Program Files\nodejs\npm.cmd" start

# Option 2: After fixing PATH
npm start
```

## Verification

After fixing PATH, verify everything works:

```powershell
node --version    # Should show: v25.6.1
npm --version     # Should show: 10.x.x
```

**Recommendation: Just restart your computer - it's the easiest solution!** 🔄
