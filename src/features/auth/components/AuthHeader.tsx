import PUPLogo from "@/assets/images/PUPLogo.png";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="bg-primary px-4 sm:px-6 py-6 sm:py-8 text-primary-foreground">
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <img
          src={PUPLogo}
          alt="PUPT Logo"
          className="h-14 sm:h-16 w-14 sm:w-16 object-contain"
        />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-center">PUPT OGOS</h1>
      <p className="text-center text-xs sm:text-sm opacity-90 mt-2">{subtitle}</p>
    </div>
  );
}
