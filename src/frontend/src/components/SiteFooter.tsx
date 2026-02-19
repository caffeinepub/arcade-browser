import { Heart } from 'lucide-react';

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'arcade-browser');
  const caffeineUrl = `https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`;

  return (
    <footer className="border-t border-accent/30 bg-card/30 backdrop-blur-sm py-6 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          © {year} • Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
          <a 
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
