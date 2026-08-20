import { ChangeEvent, FormEvent, useState } from "react";
import { Camera, Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/auth-provider";
import { updateProfileMutationFn } from "@/lib/api";
import { toast } from "@/lib/toast";
import { UserType } from "@/types/api.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_IMAGE_BYTES = 1_000_000;

function ProfileForm({ user }: { user: UserType }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.name || "");
  const [address, setAddress] = useState(user.address || "");
  const [profilePicture, setProfilePicture] = useState(user.profilePicture);

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfileMutationFn,
  });

  const initials = user.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid image", description: "Choose a PNG, JPEG, WebP, or GIF image.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({ title: "Image too large", description: "Profile pictures must be smaller than 1 MB.", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfilePicture(String(reader.result));
    reader.onerror = () => toast({ title: "Upload failed", description: "The selected image could not be read.", variant: "destructive" });
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      toast({ title: "Name required", description: "Enter at least two characters.", variant: "destructive" });
      return;
    }

    mutate(
      { name: name.trim(), address: address.trim(), profilePicture },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(["authUser"], data);
          toast({ title: "Profile updated", description: data.message, variant: "success" });
        },
        onError: (error) => toast({ title: "Update failed", description: error.message, variant: "destructive" }),
      }
    );
  };

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Personal profile</CardTitle>
        <CardDescription>Update the details other workspace members see.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="size-24 border bg-white">
              <AvatarImage src={profilePicture || ""} alt={name} className="object-cover" />
              <AvatarFallback className="text-xl font-semibold">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="profile-picture" className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
                <Camera className="size-4" /> Upload picture
              </Label>
              <Input id="profile-picture" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImage} className="sr-only" />
              <p className="text-xs text-muted-foreground">PNG, JPEG, WebP, or GIF. Maximum 1 MB.</p>
              {profilePicture ? <Button type="button" variant="ghost" size="sm" onClick={() => setProfilePicture(null)}>Remove picture</Button> : null}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="profile-name">Name</Label><Input id="profile-name" value={name} maxLength={255} onChange={(event) => setName(event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="profile-email">Email</Label><Input id="profile-email" value={user.email} disabled /><p className="text-xs text-muted-foreground">Email changes require account verification.</p></div>
            <div className="space-y-2 sm:col-span-2"><Label htmlFor="profile-address">Address</Label><Input id="profile-address" value={address} maxLength={500} placeholder="City, state, country" onChange={(event) => setAddress(event.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="profile-role">Role in this workspace</Label><Input id="profile-role" value={user.role || "Member"} disabled /></div>
          </div>

          <Button type="submit" disabled={isPending}>{isPending ? <Loader className="size-4 animate-spin" /> : null} Save profile</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function Profile() {
  const { user, isLoading } = useAuthContext();
  if (isLoading || !user) return <Loader className="mx-auto mt-16 size-8 animate-spin" />;
  return <div className="mx-auto w-full max-w-5xl py-3"><h1 className="mb-6 text-2xl font-semibold">Profile</h1><ProfileForm key={String(user.updatedAt)} user={user} /></div>;
}
