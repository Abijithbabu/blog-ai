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
