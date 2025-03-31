"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ProfileSettings,
  SubscriptionSettings,
  PersonalizeSettings,
  ApiKeySettings,
} from "./components";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="personalize">Personalize</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="profile" className="space-y-8 mt-0">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="subscription" className="space-y-8 mt-0">
              <SubscriptionSettings />
            </TabsContent>

            <TabsContent value="personalize" className="space-y-8 mt-0">
              <PersonalizeSettings />
            </TabsContent>

            <TabsContent value="api" className="space-y-8 mt-0">
              <ApiKeySettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
