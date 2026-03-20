import React, { useState, useEffect, useRef } from "react";
import { Settings, LogOut, Gavel, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileDropdownProps {
  firstName?: string;
  lastName?: string;
  roleLabel: string;

  // For student only
  section?: string;
  studentNumber?: string;

  profilePath: string;
  onLogout: () => void;
}

export default function ProfileDropdown({
  firstName,
  lastName,
  roleLabel,
  section,
  studentNumber,
  profilePath,
  onLogout,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  /* Font Size */
  const applyFont = (value: number) => {
    setFontScale(value);
    document.documentElement.style.fontSize = `${value}%`;
  };

  const increaseFont = () => fontScale < 150 && applyFont(fontScale + 10);
  const decreaseFont = () => fontScale > 80 && applyFont(fontScale - 10);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative z-[9999]" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded hover:bg-muted/30 transition text-foreground"
      >
        <Avatar className="h-7 w-7">
          <AvatarFallback className="text-xs font-semibold text-primary-foreground">
            {firstName?.charAt(0)}
            {lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm hidden md:block text-primary-foreground">
          {roleLabel}
        </span>
      </button>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-72 bg-card text-card-foreground border border-border rounded-xl shadow-xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 isolate"
        >
          {/* Profile Header */}
          <button
            onClick={() => {
              navigate(profilePath);
              setOpen(false);
            }}
            className="w-full text-left p-4 border-b border-border hover:bg-muted transition"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="font-semibold">
                  {firstName?.charAt(0)}
                  {lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">
                  {firstName} {lastName}
                </p>

                {section && studentNumber ? (
                  <p className="text-xs text-muted-foreground">
                    {section} • {studentNumber}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">{roleLabel}</p>
                )}
              </div>
            </div>
          </button>

          {/* Preferences */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Settings size={16} />
              User Preferences
            </div>

            <p className="text-xs text-muted-foreground mb-2">Font Size</p>

            <div className="flex items-center justify-center gap-3 bg-muted rounded-lg py-2">
              <button
                onClick={decreaseFont}
                className="w-8 h-8 rounded-md hover:bg-background transition"
              >
                −
              </button>

              <span className="text-sm font-medium w-12 text-center">
                {fontScale}%
              </span>

              <button
                onClick={increaseFont}
                className="w-8 h-8 rounded-md hover:bg-background transition"
              >
                +
              </button>
            </div>
          </div>
          <a
            href="https://www.pup.edu.ph/terms/"
            target="_blank"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition"
          >
            <Gavel size={16} />
            <span>Terms of Service</span>
          </a>

          <a
            href="https://www.pup.edu.ph/privacy/"
            target="_blank"
            className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition border-t border-border"
          >
            <ShieldCheck size={16} />
            <span>Privacy Policy</span>
          </a>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition border-t border-border"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
