import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import ProfileForm from "@/components/profile/ProfileForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, Settings, User, Lock, Bell, Trash2, Download, FileText, MessageCircle } from "lucide-react";
import { 
  editProfile, 
  changePhoto, 
  uploadNewPhoto, 
  removePhoto, 
  saveProfileChanges 
} from "@/utils/buttonActions";
import useRealTimeUpdates from "@/hooks/useRealTimeUpdates";
import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample profile data
  const profileBadges = [
    { id: 1, name: "Budget Master", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3", color: "bg-finny-purple" },
    { id: 2, name: "Savings Pro", image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3", color: "bg-finny-blue" },
    { id: 3, name: "Streak Keeper", image: "https://images.unsplash.com/photo-1519834704043-6acbb5208e54?auto=format&fit=crop&q=80&w=1740&ixlib=rb-4.0.3", color: "bg-finny-green" },
  ];

  // Set up real-time updates for profile changes
  useRealTimeUpdates({
    tableName: "profiles",
    events: ["UPDATE"],
    onDataChange: (payload) => {
      if (payload.new && payload.new.id === user?.id) {
        console.log("Profile updated:", payload.new);
        // In a real implementation we would update the profile state
      }
    }
  });

  const handleEditProfile = () => {
    setIsEditing(true);
    editProfile();
  };

  const handleChangePhoto = () => {
    changePhoto();
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    saveProfileChanges();
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      
      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-3">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                <AvatarFallback>FN</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold">Alex Morgan</h2>
                <p className="text-muted-foreground">alex.morgan@example.com</p>
                
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge className="bg-finny-purple text-white">Level 5</Badge>
                  <Badge variant="outline">1,200 XP</Badge>
                  <Badge variant="outline">Member since Apr 2023</Badge>
                </div>
                
                <div className="mt-4 flex flex-col md:flex-row gap-2">
                  {isEditing ? (
                    <Button 
                      className="bg-finny-green hover:bg-finny-green/90"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </Button>
                  ) : (
                    <Button 
                      className="bg-finny-purple hover:bg-finny-purple-dark"
                      onClick={handleEditProfile}
                    >
                      Edit Profile
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    onClick={handleChangePhoto}
                  >
                    Change Photo
                  </Button>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <div className="p-3 bg-finny-purple/10 rounded-lg mb-2">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-finny-purple">7 Days</p>
                </div>
                
                <div className="p-3 bg-finny-green/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Goals Completed</p>
                  <p className="text-2xl font-bold text-finny-green">3</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="text-finny-purple h-5 w-5" />
              Top Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              {profileBadges.map((badge) => (
                <div key={badge.id} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={badge.image} alt={badge.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-medium">{badge.name}</span>
                </div>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-xs"
                onClick={() => window.location.href = "/achievements"}
              >
                View All Badges
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User size={16} /> Personal Info
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings size={16} /> Preferences
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Lock size={16} /> Privacy
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <FileText size={16} /> Your Data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm isEditing={isEditing} onSave={handleSaveChanges} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your app experience and notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Bell size={18} className="text-finny-purple" /> Notifications
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Daily Check-in Reminder</p>
                        <p className="text-sm text-muted-foreground">Remind you to log expenses daily</p>
                      </div>
                      <input type="checkbox" checked className="toggle toggle-primary" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Goal Progress Updates</p>
                        <p className="text-sm text-muted-foreground">Weekly updates on your savings goals</p>
                      </div>
                      <input type="checkbox" checked className="toggle toggle-primary" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Budget Alerts</p>
                        <p className="text-sm text-muted-foreground">Alert when approaching category limits</p>
                      </div>
                      <input type="checkbox" checked className="toggle toggle-primary" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Settings size={18} className="text-finny-blue" /> App Settings
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Currency Display</p>
                        <p className="text-sm text-muted-foreground">Select your preferred currency</p>
                      </div>
                      <select className="select select-bordered select-sm w-24">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button className="bg-finny-purple hover:bg-finny-purple-dark">Save Preferences</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Password</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
                      </div>
                      <Button variant="outline">Update Password</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="font-medium">Enhance Your Account Security</p>
                        <p className="text-sm text-muted-foreground">Protect your account with 2FA</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Show My Progress on Leaderboards</p>
                        <p className="text-sm text-muted-foreground">Share anonymized progress data</p>
                      </div>
                      <input type="checkbox" checked className="toggle toggle-primary" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Share Achievement Notifications</p>
                        <p className="text-sm text-muted-foreground">Post achievements to community feed</p>
                      </div>
                      <input type="checkbox" className="toggle toggle-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Your Data</CardTitle>
              <CardDescription>Manage your personal data and export options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Download size={18} className="text-finny-blue" /> Data Export
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm mb-4">
                      Download all your financial data in various formats for your records or to use in other applications.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FileText size={14} />
                        Export as CSV
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FileText size={14} />
                        Export as PDF
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FileText size={14} />
                        Export as JSON
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Trash2 size={18} className="text-red-500" /> Account Deletion
                  </h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete My Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default ProfilePage;
