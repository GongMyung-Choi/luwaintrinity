import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// 업로드 대상 폴더들
const folders = [
  { local: './os/images', remote: 'images' },
  { local: './os/images2', remote: 'images2' },
  { local: './goods/library', remote: 'library' }
];

async function uploadFolder(localDir, remoteDir) {
  const files = fs.readdirSync(localDir);

  for (const file of files) {
    const localPath = path.join(localDir, file);

    const stat = fs.statSync(localPath);
    if (stat.isDirectory()) {
      await uploadFolder(localPath, `${remoteDir}/${file}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const { error } = await supabase.storage
      .from('luwain-storage')
      .upload(`${remoteDir}/${file}`, fileBuffer, { upsert: true });

    if (error) {
      console.error(`❌ Failed: ${file}`, error.message);
    } else {
      console.log(`✅ Uploaded: ${remoteDir}/${file}`);
    }
  }
}

async function run() {
  for (const f of folders) {
    console.log(`📂 Uploading folder: ${f.local}`);
    await uploadFolder(f.local, f.remote);
  }
  console.log("🎉 All uploads complete.");
}

run();
