import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Check if credentials are valid
const isConfigured = !!(supabaseUrl && supabaseKey && !supabaseUrl.includes('example.com') && !supabaseKey.includes('sb_publishable_QgN'));

export async function uploadFile(file: File, bucket: string = 'cyberseg'): Promise<string> {
  if (!isConfigured) {
    console.warn('Supabase storage not fully configured. Using mock upload.');
    // Generate a mock URL or local base64/object URL for testing
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string || `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070`);
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const supabase = createBrowserClient(supabaseUrl!, supabaseKey!);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    // Fallback to mock url to avoid breaking the application
    return `https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070`;
  }
}
