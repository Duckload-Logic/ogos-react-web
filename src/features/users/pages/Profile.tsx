import { useState, useRef } from "react";
import { useAuth } from "@/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, Mail, Shield, User, Calendar, LogOut } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function Profile() {
  const { user, logout } = useAuth();
  const [previewImage, setPreviewImage] = useState<string | null>(user?.profilePicture || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!user) return null;

  return (
    <Layout title="Account Profile" isLoading={false}>
      <div className="w-full h-full flex items-center justify-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
          {/* Profile Header */}
          <div className="relative group overflow-hidden rounded-[32px] border border-border/50 bg-card/50 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5 opacity-50" />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {/* Avatar Section */}
              <div className="relative group/avatar">
                <div className="w-32 h-32 rounded-full p-1 bg-primary shadow-xl overflow-hidden">
                  <Avatar className="w-full h-full rounded-full border-4 border-card">
                    <AvatarImage src={previewImage || ""} className="object-cover" />
                    <AvatarFallback className="text-3xl font-bold bg-muted text-muted-foreground italic">
                      {user.firstName[0]}{user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <button
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 p-2.5 rounded-full bg-red-600 text-white shadow-lg transform transition-all duration-300 hover:scale-110 active:scale-95 group-hover/avatar:ring-4 group-hover/avatar:ring-primary/20"
                  title="Change profile picture"
                >
                  <Camera size={18} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* User Info Section */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="space-y-1">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {user.firstName} {user.middleName ? user.middleName[0] + "." : ""} {user.lastName}
                  </h1>
                  <p className="text-muted-foreground font-medium">@{user.email.split('@')[0]}</p>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/80 border border-border/60 text-xs font-semibold uppercase tracking-wider">
                    <Shield size={14} className="text-red-600" />
                    {user.roles.join(", ")}
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/80 border border-border/60 text-xs font-semibold">
                    <Mail size={14} className="text-blue-500" />
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="rounded-[24px] border-border/40 bg-card/40 backdrop-blur-md shadow-lg overflow-hidden">
              <CardHeader className="border-b border-border/20 bg-muted/10">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-primary" />
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </div>
                <CardDescription>Official identity details associated with your account.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">First Name</p>
                      <p className="text-sm font-semibold">{user.firstName}</p>
                    </div>
                    {user.middleName && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Middle Name</p>
                        <p className="text-sm font-semibold">{user.middleName}</p>
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Last Name</p>
                      <p className="text-sm font-semibold">{user.lastName}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Account Type</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <p className="text-sm font-semibold capitalize">{user.type}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings / Metadata */}
            <Card className="rounded-[24px] border-border/40 bg-card/40 backdrop-blur-md shadow-lg overflow-hidden">
              <CardHeader className="border-b border-border/20 bg-muted/10">
                <div className="flex items-center gap-2">
                  <Shield size={20} className="text-blue-500" />
                  <CardTitle className="text-lg">Account Security</CardTitle>
                </div>
                <CardDescription>Security status and account timestamps.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/20 transition-all hover:bg-muted/40 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                        <Shield size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Email Verified</p>
                        <p className="text-[11px] text-muted-foreground">Your email is verified and secure.</p>
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/20 transition-all hover:bg-muted/40 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Registration Date</p>
                        <p className="text-[11px] text-muted-foreground">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logout/Action Button - Mobile visible too but styled differently */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={logout}
              className="rounded-full gap-2 border-primary/20 text-primary hover:text-primary-foreground hover:bg-primary/10 transition-all px-6"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

      </div>
    </Layout>
  );
}
