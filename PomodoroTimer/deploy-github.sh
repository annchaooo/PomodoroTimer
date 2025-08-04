#!/bin/bash

echo "🍅 Deploying Pomodoro Timer to GitHub Pages..."

# Initialize git if not already done
if [ ! -d ".git" ]; then
    git init
    echo "Git repository initialized"
fi

# Add all files
git add .
git commit -m "Deploy Pomodoro Timer"

echo ""
echo "🚀 Next steps:"
echo "1. Create a new repository on GitHub.com"
echo "2. Name it 'pomodoro-timer'"
echo "3. Copy the repository URL"
echo "4. Run these commands:"
echo ""
echo "   git remote add origin YOUR_GITHUB_REPO_URL"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "5. Go to Settings > Pages in your GitHub repo"
echo "6. Select 'Deploy from branch' > 'main' > '/docs'"
echo "7. Your site will be live at: https://YOUR_USERNAME.github.io/pomodoro-timer"
echo ""
echo "✅ Ready to deploy!"
