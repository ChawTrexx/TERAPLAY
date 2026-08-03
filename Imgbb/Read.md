====================================================================
           IMAGE HOSTING & PLAYER INTEGRATION GUIDE
====================================================================

[ OVERVIEW ]
Is setup mein Supabase (Image Bucket + Uploads Database Table) ko 
HTML Player/Uploader ke sath connect karke video thumbnails aur 
images host kiye jaate hain.


--------------------------------------------------------------------
1. SUPABASE CREDENTIALS (YOUR IMAGE HOST)
--------------------------------------------------------------------
* Supabase Project URL : https://askvmuxefttgqvnnalod.supabase.co
* Storage Bucket Name  : images
* Database Table Name  : uploads
* Supabase Anon Key    : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...


--------------------------------------------------------------------
2. DATABASE TABLE STRUCTURE (Table Name: 'uploads')
--------------------------------------------------------------------
Make sure aapke Supabase database table 'uploads' mein ye columns ho:

  - id           : int8 (Primary Key, Auto-increment)
  - created_at   : timestamptz (Default: now())
  - file_path    : text
  - delete_token : text
  - expires_at   : timestamptz


--------------------------------------------------------------------
3. HOW TO FETCH & SHOW ALL IMAGES FROM DATABASE
--------------------------------------------------------------------
Database se saari images load karke UI mein dikhane ke liye ye 
JavaScript logic use hota hai:

// Step 1: Initialize Supabase Client
const imgHostUrl = "https://askvmuxefttgqvnnalod.supabase.co";
const imgHostKey = "YOUR_ANON_KEY";
const client = supabase.createClient(imgHostUrl, imgHostKey);

// Step 2: Fetch all records ordered by newest first
async function loadUploadedImages() {
  const { data, error } = await client
    .from('uploads')
    .select('*')
    .order('created_at', { ascending: false });

  if (data) {
    data.forEach(item => {
      // Direct Storage URL
      const publicUrl = `${imgHostUrl}/storage/v1/object/public/images/${item.file_path}`;
      
      // Render inside HTML Grid
      addImageToGalleryUI(publicUrl);
    });
  }
}


--------------------------------------------------------------------
4. HOW TO UPLOAD BASE64 THUMBNAILS (FOR PLAYER CODE)
--------------------------------------------------------------------
Jab Video Canvas se Base64 image snapshot banta hai, use Supabase 
Storage mein upload karne ka function:

async function uploadThumbToMyHost(base64Image, expirationSec = 60) {
  try {
    // Convert Base64 to Blob
    const byteCharacters = atob(base64Image);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    const fileName = `thumb_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.jpg`;

    // 1. Storage Upload
    const { data, error } = await client
      .storage
      .from('images')
      .upload(fileName, blob, { contentType: 'image/jpeg' });

    if (error) throw error;

    // 2. Get Public URL
    const { data: publicUrlData } = client
      .storage
      .from('images')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;
    const expiresAt = new Date(Date.now() + expirationSec * 1000).toISOString();

    // 3. Insert record into 'uploads' table
    await client.from('uploads').insert([{
      file_path: fileName,
      delete_token: Math.random().toString(36).substring(2, 12),
      expires_at: expiresAt
    }]);

    return publicUrl; // Returns Image Direct Link
  } catch (err) {
    console.error("Upload Error:", err);
    return null;
  }
}


--------------------------------------------------------------------
5. CDN DEPENDENCY TO INCLUDE IN <HEAD>
--------------------------------------------------------------------
Aapke kisi bhi HTML page par Supabase JS SDK honi zaruri hai:

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

====================================================================

