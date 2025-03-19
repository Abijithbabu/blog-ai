import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SubscriptionSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Current Plan</h3>
            <p className="text-sm text-muted-foreground mt-1">Free Plan</p>
            <Button className="mt-4" variant="outline">
              Upgrade Plan
            </Button>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-lg font-medium">Billing Information</h3>
            <p className="text-sm text-muted-foreground mt-1">
              No billing information available
            </p>
            <Button className="mt-4" variant="outline">
              Add Payment Method
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 