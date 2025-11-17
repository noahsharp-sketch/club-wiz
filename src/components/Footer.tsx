import { Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4 text-center">
        
        {/* About */}
        <h3 className="text-2xl font-bold mb-4 text-primary-foreground">
          Club Finder
        </h3>
        <p className="text-secondary-foreground/80 max-w-xl mx-auto mb-6">
          Helping golfers of all skill levels find their perfect clubs through advanced playability factor analysis.
        </p>

        {/* Contact */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <a
            href="mailto:Club-wizFinder@outlook.com"
            className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            Club-wizFinder@outlook.com
          </a>
        </div>

        {/* Copyright */}
        <div className="border-t border-secondary-foreground/20 pt-6">
          <p className="text-secondary-foreground/60">
            &copy; {new Date().getFullYear()} Club Finder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
