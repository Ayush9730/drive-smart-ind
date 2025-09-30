import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/rental';
import { Database } from '@/integrations/supabase/types';

type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const transformProfileFromDB = (row: ProfileRow): User => {
    return {
      name: row.name,
      phone: row.phone,
      email: row.email,
      drivingLicense: row.driving_license,
    };
  };

  const fetchProfile = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch profile.",
        });
        return;
      }

      if (data) {
        setProfile(transformProfileFromDB(data));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (userData: User) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save profile.",
      });
      return false;
    }

    try {
      const profileData: ProfileInsert = {
        user_id: userId,
        name: userData.name,
        phone: userData.phone,
        email: userData.email,
        driving_license: userData.drivingLicense,
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) {
        console.error('Error saving profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save profile.",
        });
        return false;
      }

      setProfile(userData);
      toast({
        title: "Success",
        description: "Profile saved successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profile,
    loading,
    saveProfile,
    refetchProfile: fetchProfile,
  };
};