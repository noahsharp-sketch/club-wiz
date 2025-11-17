import { Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-foreground">Club Finder</h3>
            <p className="text-secondary-foreground/80 mb-4">
              Helping golfers of all skill levels find their perfect clubs through advanced playability factor analysis.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-primary-foreground">Contact Us</h3>
            <div className="space-y-3">
              <a
                href="mailto:Club-wizFinder@outlook.com"
                className="flex items-center gap-2 text-secondary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                Club-wizFinder@outlook.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8 text-center text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Club Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
