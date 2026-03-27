"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, addDays } from "date-fns";

import { createSprint } from "@/actions/sprints";
import useFetch from "@/hooks/useFetch";
import { SprintFormData, sprintSchema } from "@/lib/formSchema";
import { toast } from "sonner";

export default function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}: {
  projectTitle: string;
  projectKey: string;
  projectId: string;
  sprintKey: number;
}) {
  const [showForm, setShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const router = useRouter();

  const { loading: createSprintLoading, fn: createSprintFn, data } =
    useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const onSubmit = async (data: SprintFormData) => {
    await createSprintFn({
        projectId,
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
    setShowForm(false);
    toast.success("Sprint created successfully");
    router.refresh(); 
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>
      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  {...register("name")}
                  readOnly
                  className="bg-slate-950"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>
                <Controller
                    control={control}
                    name="startDate"
                    render={({ field: { value: startDate, onChange } }) => (
                        <Popover>
                        <PopoverTrigger asChild>
                            <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal bg-slate-950 ${
                                !dateRange && "text-muted-foreground"
                            }`}
                            >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from && dateRange.to ? (
                                format(dateRange.from, "LLL dd, y") +
                                " - " +
                                format(dateRange.to, "LLL dd, y")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto bg-slate-900" align="start">
                            <DayPicker
                            classNames={{
                                chevron: "fill-blue-500",
                                range_start: "bg-blue-700",
                                range_end: "bg-blue-700",
                                range_middle: "bg-blue-400",
                                day_button: "border-none",
                                today: "border-2 border-blue-700",
                            }}
                            mode="range"
                            disabled={[{ before: new Date() }]}
                            selected={dateRange}
                            onSelect={(range) => {
                                if (range?.from && range?.to) {
                                const newRange = { from: range.from, to: range.to };
                                setDateRange(newRange);
                                onChange(range.from);        
                                setValue("endDate", range.to); 
                                }
                            }}
                            />
                        </PopoverContent>
                        </Popover>
                    )}
                />
            </div>
              <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}