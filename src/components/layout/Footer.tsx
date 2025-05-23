export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted text-muted-foreground py-6 text-center shadow-inner mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm">&copy; {currentYear} Eventide. All rights reserved.</p>
        <p className="text-xs mt-1">Discover your next event with us.</p>
      </div>
    </footer>
  );
}
