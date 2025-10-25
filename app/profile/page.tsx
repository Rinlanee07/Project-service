// app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  User,
  Settings,
  Bell,
  Shield,
  Key,
  Camera,
  Mail,
  Phone,
  Calendar,
  Edit,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ProfileData } from 'types/profile'; 

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [formData, setFormData] = useState<ProfileData | null>(null); //ใช้ type 
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setFormData(data);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load profile.',
            variant: 'destructive',
          });
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: 'Network error.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!formData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen text-red-500">
          Failed to load profile.
        </div>
      </DashboardLayout>
    );
  }

  const handleSaveProfile = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully.',
    });
    setEditMode(false);
  };

  const handleChangePassword = () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Password Changed',
      description: 'Your password has been updated successfully.',
    });
    setShowPasswordDialog(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handlePreferenceChange = (
    key: keyof ProfileData['preferences'],
    value: boolean
  ) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [key]: value,
      },
    });
  };

  const notificationOptions = [
    {
      key: 'emailNotifications' as const,
      title: 'Email Notifications',
      desc: 'Receive notifications via email',
    },
    {
      key: 'smsNotifications' as const,
      title: 'SMS Notifications',
      desc: 'Receive urgent notifications via SMS',
    },
    {
      key: 'pushNotifications' as const,
      title: 'Push Notifications',
      desc: 'Receive browser push notifications',
    },
    {
      key: 'weeklyReports' as const,
      title: 'Weekly Reports',
      desc: 'Receive weekly summary reports',
    },
  ];

  // ✅ คำนวณ initials อย่างปลอดภัย — ตอนนี้ name เป็น string แน่นอน
  const initials = formData.name
    .split(' ')
    .filter((part: string) => part.length > 0)
    .map((part: string) => part[0].toUpperCase())
    .join('');

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        <div className="space-y-8 max-w-6xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Profile Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your account information and preferences
              </p>
            </div>
            <Button
              variant={editMode ? 'default' : 'outline'}
              onClick={editMode ? handleSaveProfile : () => setEditMode(true)}
              className={cn(
                'w-full sm:w-auto',
                editMode
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md'
                  : 'border-blue-500 text-blue-600 hover:bg-blue-50'
              )}
            >
              {editMode ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>

          {/* Profile Overview */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-24 w-24 ring-2 ring-blue-500/30">
                    <AvatarImage src={formData.avatar} alt={formData.name} />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-800">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {editMode && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white shadow-sm border border-gray-300 hover:bg-blue-100 hover:text-blue-700"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold truncate text-blue-700">
                      {formData.name}
                    </h2>
                    <Badge
                      variant="secondary"
                      className="text-blue-700 bg-blue-100 border-blue-200"
                    >
                      {formData.role}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span className="truncate">{formData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span>{formData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 flex-shrink-0 text-blue-500" />
                      <span>
                        Joined {new Date(formData.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {Object.entries(formData.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{value}</p>
                      <p className="text-sm text-gray-600 capitalize mt-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 p-1 bg-gray-100 rounded-xl border border-gray-200">
              {[
                { value: 'personal', label: 'Personal Info', icon: User },
                { value: 'security', label: 'Security', icon: Shield },
                { value: 'notifications', label: 'Notifications', icon: Bell },
                { value: 'preferences', label: 'Preferences', icon: Settings },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex flex-col sm:flex-row items-center gap-2 data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-gray-600 hover:text-blue-600 rounded-lg py-2 px-3 transition-all"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="mt-0">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={formData.name.split(' ')[0] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: `${e.target.value} ${
                                formData.name.split(' ')[1] || ''
                              }`,
                            })
                          }
                          disabled={!editMode}
                          className="bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          disabled={!editMode}
                          className="bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-gray-700">
                          Role
                        </Label>
                        <Select value={formData.role} disabled>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-gray-300">
                            <SelectItem value="Shop Owner">Shop Owner</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Technician">Technician</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={formData.name.split(' ')[1] || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: `${
                                formData.name.split(' ')[0]
                              } ${e.target.value}`,
                            })
                          }
                          disabled={!editMode}
                          className="bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          disabled={!editMode}
                          className="bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department" className="text-gray-700">
                          Department
                        </Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              department: e.target.value,
                            })
                          }
                          disabled={!editMode}
                          className="bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="address" className="text-gray-700">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      disabled={!editMode}
                      rows={3}
                      className="bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-0 space-y-4">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Key className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Password</p>
                        <p className="text-sm text-gray-600">
                          Last changed 3 months ago
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordDialog(true)}
                      className="border-blue-500 text-blue-600 hover:bg-blue-100"
                    >
                      Change Password
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-gray-600">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-100"
                    >
                      Enable 2FA
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-semibold mb-3 text-gray-800">
                      Recent Login Activity
                    </h4>
                    <div className="space-y-3 text-sm">
                      {[
                        {
                          device: 'Current session',
                          location: 'Bangkok, Thailand',
                          time: 'Active now',
                          active: true,
                        },
                        {
                          device: 'Chrome on Windows',
                          location: 'Bangkok, Thailand',
                          time: '2 hours ago',
                          active: false,
                        },
                        {
                          device: 'Mobile App',
                          location: 'Bangkok, Thailand',
                          time: '1 day ago',
                          active: false,
                        },
                      ].map((session, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                        >
                          <div className="text-gray-700">
                            <span className="font-medium">{session.device}</span> –{' '}
                            {session.location}
                          </div>
                          <span
                            className={`text-xs ${
                              session.active
                                ? 'text-green-600 font-medium'
                                : 'text-gray-500'
                            }`}
                          >
                            {session.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="mt-0">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {notificationOptions.map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{item.title}</p>
                          <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                        <Switch
                          checked={formData.preferences[item.key]}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange(item.key, checked)
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="mt-0">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">
                    Application Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-gray-700">
                        Language
                      </Label>
                      <Select
                        value={formData.preferences.language}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, language: value },
                          })
                        }
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="th">ไทย (Thai)</SelectItem>
                          <SelectItem value="zh">中文 (Chinese)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-gray-700">
                        Timezone
                      </Label>
                      <Select
                        value={formData.preferences.timezone}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            preferences: { ...formData.preferences, timezone: value },
                          })
                        }
                      >
                        <SelectTrigger className="bg-white border-gray-300 text-gray-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="Asia/Bangkok">
                            Asia/Bangkok (UTC+7)
                          </SelectItem>
                          <SelectItem value="Asia/Tokyo">
                            Asia/Tokyo (UTC+9)
                          </SelectItem>
                          <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Password Change Dialog */}
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogContent className="sm:max-w-md bg-white border border-gray-200 text-gray-800">
              <DialogHeader>
                <DialogTitle className="text-xl text-blue-600">
                  Change Password
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Enter your current password and choose a new secure password.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {[
                  { id: 'current', label: 'Current Password', key: 'current' },
                  { id: 'new', label: 'New Password', key: 'new' },
                  { id: 'confirm', label: 'Confirm New Password', key: 'confirm' },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-gray-700">
                      {field.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={field.id}
                        type={
                          showPasswords[field.key as keyof typeof showPasswords]
                            ? 'text'
                            : 'password'
                        }
                        value={passwordData[field.key as keyof typeof passwordData]}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, [field.key]: e.target.value })
                        }
                        className="pr-10 bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                        onClick={() =>
                          setShowPasswords({
                            ...showPasswords,
                            [field.key]: !showPasswords[
                              field.key as keyof typeof showPasswords
                            ],
                          })
                        }
                      >
                        {showPasswords[field.key as keyof typeof showPasswords] ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordDialog(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update Password
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;