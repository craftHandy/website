
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, MapPin, Pencil, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getMyProfile,
  updateMyProfile,
  type UpdateProfilePayload,
  type UserProfile,
} from "@/lib/api";

import { toast } from "@/store/toast";

const inputCls =
  "w-full h-11 px-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-foreground)] rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)] font-poppins";

const labelCls =
  "block text-xs text-[var(--color-cream-dark)] tracking-wider mb-1.5 font-poppins";

const errCls = "text-red-600 text-xs mt-1 font-poppins";

export function userProfileKey(token: string | null) {
  return ["user-profile", token] as const;
}

export function useUserProfile(token: string | null) {
  return useQuery({
    queryKey: userProfileKey(token),
    queryFn: () => getMyProfile(token!),
    enabled: Boolean(token),
  });
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ profile }: { profile: UserProfile }) {
  return (
    <div className="h-14 w-14 shrink-0 rounded-full border border-gold/40 bg-[var(--color-surface)] flex items-center justify-center font-serif text-lg text-gold">
      {initials(profile.fullName || profile.email)}
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gold shrink-0">{icon}</span>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.15em] text-[var(--color-cream-dark)] font-poppins">
          {label}
        </p>

        <p className="text-sm font-poppins break-words">
          {value || (
            <span className="text-[var(--color-cream-dark)]">Not provided</span>
          )}
        </p>
      </div>
    </div>
  );
}

function ProfileFields({ profile }: { profile: UserProfile }) {
  return (
    <div className="border-t border-[var(--color-border-subtle)] mt-5 pt-5 grid gap-4 sm:grid-cols-2">
      <DetailRow
        icon={<Mail className="size-4" />}
        label="Email"
        value={profile.email}
      />

      <DetailRow
        icon={<Phone className="size-4" />}
        label="Mobile"
        value={profile.mobileNo}
      />

      <div className="sm:col-span-2">
        <DetailRow
          icon={<MapPin className="size-4" />}
          label="Address"
          value={profile.address}
        />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-sm p-5 sm:p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-[var(--color-surface)]" />

        <div className="flex-1 space-y-2">
          <div className="h-4 w-40 bg-[var(--color-surface)]" />
          <div className="h-3 w-56 bg-[var(--color-surface)]" />
        </div>
      </div>

      <div className="border-t border-[var(--color-border-subtle)] mt-5 pt-5 grid gap-4 sm:grid-cols-2">
        <div className="h-10 bg-[var(--color-surface)] sm:col-span-2" />
      </div>
    </div>
  );
}

function NoProfileFound() {
  return (
    <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-sm p-8 sm:p-10">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="h-14 w-14 rounded-full border border-gold/40 bg-[var(--color-surface)] flex items-center justify-center font-serif text-lg text-gold">
          ?
        </div>

        <h3 className="mt-4 font-medium font-poppins text-base">
          No Profile Found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-[var(--color-cream-dark)] font-poppins">
          We couldn&apos;t find profile information for your account.
        </p>
      </div>
    </div>
  );
}

function EditProfileDialog({
  token,
  profile,
  open,
  onOpenChange,
}: {
  token: string;
  profile: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfilePayload>();

  useEffect(() => {
    if (open) {
      reset({
        fullName: profile.fullName,
        mobileNo: profile.mobileNo,
        address: profile.address,
      });
    }
  }, [open, profile, reset]);

  const mutation = useMutation({
    mutationFn: (values: UpdateProfilePayload) =>
      updateMyProfile(token, values),

    onSuccess: (updated) => {
      queryClient.setQueryData(
        userProfileKey(token),
        (previous: UserProfile | undefined) =>
          previous ? { ...previous, ...updated } : undefined,
      );

      toast("Profile updated", {
        description: "Your details have been saved.",
        variant: "success",
      });

      onOpenChange(false);
    },

    onError: (error: Error) =>
      toast("Update failed", {
        description: error.message,
        variant: "error",
      }),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={mutation.isPending ? undefined : onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>

          <DialogDescription>
            Update your contact and delivery details. Your email address cannot
            be changed here.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          className="space-y-4"
        >
          <div>
            <label htmlFor="profile-email" className={labelCls}>
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={profile.email}
              readOnly
              disabled
              className={`${inputCls} opacity-60 cursor-not-allowed`}
            />
          </div>

          <div>
            <label htmlFor="profile-fullName" className={labelCls}>
              Full Name
            </label>

            <input
              id="profile-fullName"
              className={inputCls}
              placeholder="Your full name"
              {...register("fullName", {
                required: "Full name is required.",
                maxLength: {
                  value: 100,
                  message: "Full name is too long.",
                },
              })}
            />

            {errors.fullName && (
              <p className={errCls}>{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="profile-mobileNo" className={labelCls}>
              Mobile Number
            </label>

            <input
              id="profile-mobileNo"
              inputMode="tel"
              className={inputCls}
              placeholder="+9779800000000"
              {...register("mobileNo", {
                required: "Mobile number is required.",
                maxLength: {
                  value: 20,
                  message: "Mobile number is too long.",
                },
              })}
            />

            {errors.mobileNo && (
              <p className={errCls}>{errors.mobileNo.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="profile-address" className={labelCls}>
              Address
            </label>

            <textarea
              id="profile-address"
              rows={3}
              className={`${inputCls} h-auto py-2.5 resize-y`}
              placeholder="Street, city, country"
              {...register("address", {
                required: "Address is required.",
                maxLength: {
                  value: 255,
                  message: "Address is too long.",
                },
              })}
            />

            {errors.address && (
              <p className={errCls}>{errors.address.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="hover:bg-gold/10 hover:text-white"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Full profile card with an edit action that opens the update dialog. */
export function ProfileDetailsCard({ token }: { token: string | null }) {
  const [editOpen, setEditOpen] = useState(false);
  const profileQuery = useUserProfile(token);

  if (profileQuery.isPending) {
    return <ProfileSkeleton />;
  }

  const profile = profileQuery.data;

  /*
   * Do not check/display the API error here.
   * If there is no profile data, simply show the empty state.
   */
  if (!profile) {
    return <NoProfileFound />;
  }

  return (
    <>
      <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] rounded-sm p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar profile={profile} />

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-poppins mb-1">
              My Profile
            </p>

            <p className="font-medium font-poppins truncate">
              {profile.fullName || "Your account"}
            </p>

            <p className="text-sm text-[var(--color-cream-dark)] font-poppins truncate">
              {profile.email}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="shrink-0 hover:bg-gold/10 hover:text-white"
            onClick={() => setEditOpen(true)}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
        </div>

        <ProfileFields profile={profile} />
      </div>

      {token && (
        <EditProfileDialog
          token={token}
          profile={profile}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}
    </>
  );
}
