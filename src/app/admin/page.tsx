"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ListOrdered, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  // This page is already protected by AdminLayout

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center"><PlusCircle className="mr-2 h-5 w-5 text-primary" /> Create New Event</CardTitle>
              <CardDescription>Add a new event to the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/admin/events/new">Create Event</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center"><ListOrdered className="mr-2 h-5 w-5 text-primary" /> Manage Events</CardTitle>
              <CardDescription>View, edit, or delete existing events.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link href="/admin/events">View All Events</Link> 
              </Button>
              {/* Link to /admin/events which will list events and allow edit/delete */}
              {/* For now, /admin/events will be a placeholder */}
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center"><Settings className="mr-2 h-5 w-5 text-primary" /> App Settings</CardTitle>
              <CardDescription>Configure application settings (placeholder).</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Configure Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Placeholder for future admin stats or info */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Platform Overview</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Analytics and platform statistics will be displayed here.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
