import { Link } from '@tanstack/react-router';
import { Gamepad2, HelpCircle } from 'lucide-react';
import LoginButton from './Auth/LoginButton';

export default function SiteHeader() {
  return (
    <header className="border-b border-accent/30 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="/assets/generated/arcade-logo.dim_512x512.png" 
              alt="Arcade Browser" 
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-primary arcade-title">Arcade Browser</h1>
              <p className="text-xs text-muted-foreground">100% in-browser • No installs</p>
            </div>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link 
              to="/help"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Link>
            <LoginButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
