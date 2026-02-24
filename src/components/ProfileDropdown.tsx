import React, { useState, useEffect, useRef } from "react";
import { UserCircle, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-2 rounded hover:bg-muted transition text-foreground"
      >
        <UserCircle size={28} />
        <span className="text-sm hidden md:block">{roleLabel}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-card text-card-foreground border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 isolate">

          {/* Profile Header */}
          <button
            onClick={() => {
              navigate(profilePath);
              setOpen(false);
            }}
            className="w-full text-left p-4 border-b border-border hover:bg-muted transition"
          >
            <div className="flex items-center gap-3">
              <UserCircle size={36} />
              <div>
                <p className="text-sm font-semibold">
                  {firstName} {lastName}
                </p>

                {section && studentNumber ? (
                  <p className="text-xs text-muted-foreground">
                    {section} • {studentNumber}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {roleLabel}
                  </p>
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

            <p className="text-xs text-muted-foreground mb-2">
              Font Size
            </p>

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