# Video Sync Utility

🔗 **Try it live here** (Update this link after deployment)

A simple web tool to calculate timing offsets for synchronizing multiple videos based on sync points.

## What it does

Takes multiple videos with different durations and calculates the exact timing offsets needed to align them at specific sync points. Perfect for multi-camera video editing.

## How to use

1. **Add your videos** - Enter name, total duration (HH:MM:SS), and sync point (MM:SS)
2. **See the calculations** - The longest video becomes the reference, offsets are calculated automatically
3. **Use the results** - Apply the calculated offsets in your video editor

## Example

**Input:**
- Video 1: 1:20:48 duration, sync at 11:38
- Video 2: 45:30 duration, sync at 9:50
- Video 3: 52:15 duration, sync at 8:57

**Output:**
- Video 1: Reference (0s offset)
- Video 2: +108s offset (start 1m 48s later)
- Video 3: +161s offset (start 2m 41s later)

## Features

✅ Handles both MM:SS and HH:MM:SS time formats  
✅ Visual timeline showing video alignment  
✅ Supports positive and negative offsets  
✅ Add/remove videos dynamically  
✅ Real-time calculations as you type  

## Local Setup

**Quick start (no installation):**
1. Download `index.html` from this repo
2. Open in any web browser
3. Done!

**Development setup:**
```bash
git clone [repo-url]
cd video-sync-utility
npm install
npm start
```

## Perfect for

- Multi-camera video editing
- Podcast recording sync
- Live stream alignment
- Event documentation

---

**Note:** No data is stored or transmitted - everything runs locally in your browser.
