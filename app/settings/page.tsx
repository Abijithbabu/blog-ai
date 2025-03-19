"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import api from "@/axios-instance";
import {
  ProfileSettings,
  SubscriptionSettings,
  PersonalizeSettings,
  ApiKeySettings,
} from "./components";
import type { PersonalizeFormData } from "./components/PersonalizeSettings";
import type { ProfileFormData } from "./components/ProfileSettings";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // await axios.patch('/api/user', {
      //   name: data.name,
      //   email: data.email,
      //   password: data.password || undefined
      // })

      // For demo purposes, show a success message
      setTimeout(() => {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const onPersonalizeSubmit = async (data: PersonalizeFormData) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // await api.patch('/settings/personalize', data)

      // For demo purposes, show a success message
      setTimeout(() => {
        toast({
          title: "Settings updated",
          description:
            "Your personalization settings have been updated successfully.",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // await axios.delete('/api/user')

      // For demo purposes, show a success message
      setTimeout(() => {
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully.",
        });
        setIsLoading(false);
        setShowDeleteModal(false);
        // Redirect to home page
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <div className="container flex-wrap gap-2 flex">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-t-lg rounded-b-none px-6"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-t-lg rounded-b-none px-6"
              >
                Subscription
              </TabsTrigger>
              <TabsTrigger 
                value="personalize"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-t-lg rounded-b-none px-6"
              >
                Personalize
              </TabsTrigger>
              <TabsTrigger 
                value="api"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-t-lg rounded-b-none px-6"
              >
                API Keys
              </TabsTrigger>
            </div>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="profile" className="space-y-8 mt-0">
              <ProfileSettings
                user={user}
                isLoading={isLoading}
                onSubmit={onProfileSubmit}
                onDeleteAccount={() => setShowDeleteModal(true)}
              />
            </TabsContent>

            <TabsContent value="subscription" className="space-y-8 mt-0">
              <SubscriptionSettings />
            </TabsContent>

            <TabsContent value="personalize" className="space-y-8 mt-0">
              <PersonalizeSettings
                isLoading={isLoading}
                onSubmit={onPersonalizeSubmit}
              />
            </TabsContent>

            <TabsContent value="api" className="space-y-8 mt-0">
              <ApiKeySettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
      />
    </div>
  );
}
