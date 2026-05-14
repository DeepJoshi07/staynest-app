import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container-base flex flex-col gap-4 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Staynest, Inc.</p>
        <div className="flex items-center gap-5">
          <a href="#" aria-label="Twitter">
            <Twitter size={16} />
          </a>
          <a href="#" aria-label="Instagram">
            <Instagram size={16} />
          </a>
          <a href="#" aria-label="Facebook">
            <Facebook size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
