#!/bin/bash

# MERN CRM Deployment Script
# This script helps deploy the application to Vercel

echo "🚀 Starting MERN CRM Deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ You are not logged in to Vercel. Please login first:"
    echo "vercel login"
    exit 1
fi

# Deploy backend first
echo "📦 Deploying backend..."
cd backend

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found in backend directory."
    echo "Please create a .env file with the following variables:"
    echo "MONGODB_URI=your_mongodb_connection_string"
    echo "JWT_SECRET=your_jwt_secret"
    echo "NODE_ENV=production"
    read -p "Do you want to continue without .env file? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Deploy backend to Vercel
echo "🚀 Deploying backend to Vercel..."
vercel --prod

# Get the backend URL
BACKEND_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*\.vercel\.app')

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Failed to get backend deployment URL"
    exit 1
fi

echo "✅ Backend deployed successfully: $BACKEND_URL"

# Deploy frontend
echo "📦 Deploying frontend..."
cd ../frontend

# Update environment variables for frontend
echo "REACT_APP_API_URL=$BACKEND_URL/api" > .env.production.local

# Deploy frontend to Vercel
echo "🚀 Deploying frontend to Vercel..."
vercel --prod

# Get the frontend URL
FRONTEND_URL=$(vercel --prod 2>&1 | grep -o 'https://[^ ]*\.vercel\.app')

if [ -z "$FRONTEND_URL" ]; then
    echo "❌ Failed to get frontend deployment URL"
    exit 1
fi

echo "✅ Frontend deployed successfully: $FRONTEND_URL"

# Summary
echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Deployment Summary:"
echo "🌐 Frontend: $FRONTEND_URL"
echo "🔧 Backend API: $BACKEND_URL"
echo ""
echo "📝 Next Steps:"
echo "1. Update your MongoDB Atlas network access to allow Vercel's IP ranges"
echo "2. Test the application at $FRONTEND_URL"
echo "3. Configure custom domain if needed"
echo ""
echo "🔗 API Endpoints:"
echo "   Authentication: $BACKEND_URL/api/auth"
echo "   Customers: $BACKEND_URL/api/customers"
echo "   Leads: $BACKEND_URL/api/leads"
echo ""
echo "Happy coding! 🎯"
