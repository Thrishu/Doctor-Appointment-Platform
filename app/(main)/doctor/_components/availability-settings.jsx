"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Plus, Loader2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { setAvailabilitySlots } from "@/actions/doctor";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

export function AvailabilitySettings({ slots }) {
  const [showForm, setShowForm] = useState(false);
  const [localSlots, setLocalSlots] = useState([]);

  // Custom hook for server action
  const { loading, fn: submitSlots, data } = useFetch(setAvailabilitySlots);

  // Add a new empty slot
  const addSlot = () => {
    setLocalSlots([
      ...localSlots,
      { startTime: '', endTime: '' }
    ]);
  };

  // Remove a slot by index
  const removeSlot = (idx) => {
    setLocalSlots(localSlots.filter((_, i) => i !== idx));
  };

  // Update a slot's time
  const updateSlot = (idx, field, value) => {
    setLocalSlots(localSlots.map((slot, i) =>
      i === idx ? { ...slot, [field]: value } : slot
    ));
  };

  // Handle slot submission
  const onSubmit = async () => {
    if (loading) return;
    // Validate slots
    const today = new Date().toISOString().split("T")[0];
    const slotObjs = localSlots.map(slot => {
      // Convert local time to UTC ISO string
      const startDate = new Date(`${today}T${slot.startTime}:00`);
      const endDate = new Date(`${today}T${slot.endTime}:00`);
      return {
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      };
    });
    // Basic validation
    for (const slot of slotObjs) {
      if (!slot.startTime || !slot.endTime || slot.startTime >= slot.endTime) {
        toast.error("Each slot must have a valid start and end time, and end must be after start.");
        return;
      }
    }
    // Send as JSON string
    const formData = new FormData();
    formData.append('slots', JSON.stringify(slotObjs));
    await submitSlots(formData);
  };

  useEffect(() => {
    if (data && data?.success) {
      setShowForm(false);
      setLocalSlots([]);
      toast.success("Availability slots updated successfully");
    }
  }, [data]);

  // Format time string for display
  const formatTimeString = (dateString) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (e) {
      return "Invalid time";
    }
  };

  return (
    <Card className="border-emerald-900/20">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-emerald-400" />
          Availability Settings
        </CardTitle>
        <CardDescription>
          Set your daily availability for patient appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Current Availability Display */}
        {!showForm ? (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-3">
                Current Availability
              </h3>

              {slots.length === 0 ? (
                <p className="text-muted-foreground">
                  You haven&apos;t set any availability slots yet. Add your
                  availability to start accepting appointments.
                </p>
              ) : (
                <div className="space-y-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center p-3 rounded-md bg-muted/20 border border-emerald-900/20"
                    >
                      <div className="bg-emerald-900/20 p-2 rounded-full mr-3">
                        <Clock className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {formatTimeString(slot.startTime)} -{" "}
                          {formatTimeString(slot.endTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {slot.appointment ? "Booked" : "Available"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={() => { setShowForm(true); setLocalSlots([]); }}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Set Availability Time
            </Button>
          </>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); onSubmit(); }}
            className="space-y-4 border border-emerald-900/20 rounded-md p-4"
          >
            <h3 className="text-lg font-medium text-white mb-2">
              Set Daily Availability
            </h3>

            <div className="space-y-4">
              {localSlots.map((slot, idx) => (
                <div key={idx} className="flex gap-4 items-end">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor={`startTime-${idx}`}>Start Time</Label>
                    <Input
                      id={`startTime-${idx}`}
                      type="time"
                      value={slot.startTime}
                      onChange={e => updateSlot(idx, 'startTime', e.target.value)}
                      className="bg-background border-emerald-900/20"
                      required
                    />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label htmlFor={`endTime-${idx}`}>End Time</Label>
                    <Input
                      id={`endTime-${idx}`}
                      type="time"
                      value={slot.endTime}
                      onChange={e => updateSlot(idx, 'endTime', e.target.value)}
                      className="bg-background border-emerald-900/20"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeSlot(idx)}
                    className="ml-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={addSlot} className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" /> Add Slot
              </Button>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={loading}
                className="border-emerald-900/30"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Availability"
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 p-4 bg-muted/10 border border-emerald-900/10 rounded-md">
          <h4 className="font-medium text-white mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-2 text-emerald-400" />
            How Availability Works
          </h4>
          <p className="text-muted-foreground text-sm">
            Setting your daily availability allows patients to book appointments
            during those hours. The same availability applies to all days. You
            can update your availability at any time, but existing booked
            appointments will not be affected.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
