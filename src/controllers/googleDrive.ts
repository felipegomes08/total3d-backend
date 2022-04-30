import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
})

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
})

export async function getFiles() {
  return getAllFilesFromFolder('1zKAC_e7qZNUS3L9NnhX7my3ogylpT7Xm')

  const { data } = await drive.files.list({
    q: `'12r5oKH32pdHuKv1aQhLT1-ztFzYQoay7' in parents`,
    spaces: 'drive',
    fields: 'nextPageToken, files(id, name, mimeType)',
    pageSize: 1000,
  })
  return { length: data.files.length, data }
}

// TOTAL3D
// 1zKAC_e7qZNUS3L9NnhX7my3ogylpT7Xm
// Hackintosh/resoucer
// 1AMNakXBnTeypL40azejJXH2vEUv81MEI
// Dropshipping
// 1lJPgbbo9MEXv47XGDwSHxXPnMloSCwVl

async function getAllFilesFromFolder(folderId: string) {
  const { data } = await drive.files.list({
    // q: "name = 'Hackintosh'",
    q: `'${folderId}' in parents`,
    // q: `'1AMNakXBnTeypL40azejJXH2vEUv81MEI' in parents`,
    spaces: 'drive',
    fields: 'nextPageToken, files(id, mimeType)',
    pageSize: 1000,
  })

  const files = []

  for await (const file of data.files) {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      const result = await getAllFilesFromFolder(file.id)
      files.push(...result.files)
    } else {
      // console.log({ file })
      if (
        file.mimeType === 'image/jpg' ||
        file.mimeType === 'image/jpeg' ||
        file.mimeType === 'image/png'
      ) {
        files.push(file)
      }
    }
  }

  console.log(files.length)
  // const folderData = drive.files.list({
  //   q: `id = '${folder}'`,
  //   spaces: 'drive',
  //   fields: 'nextPageToken, files(id, name, mimeType)',
  // })

  // const { data } = await drive.files.get(
  //   { fileId: '1zKAC_e7qZNUS3L9NnhX7my3ogylpT7Xm', alt: 'media' },
  //   { responseType: 'stream' }
  // )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // return new Promise<any>(resolve => {
  //   const chunks = []

  //   data.on('data', function (chunk) {
  //     chunks.push(chunk)
  //   })

  //   data.on('end', function () {
  //     const result = Buffer.concat(chunks)
  //     const base64 = 'data:image/jpeg;base64,' + result.toString('base64')
  //     resolve(base64)
  //   })
  // })

  // return { length: data.files.length, data }
  return { length: files.length, files }
}
