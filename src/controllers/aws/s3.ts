import { removeExtensionFromFile } from '../../utils/functions'

import { AWS } from './connection'

const s3 = new AWS.S3()
const maxKeys = 60

export const findFilesOrFolders = async (
  folderName: string,
  nextContinuationToken?: string
) => {
  const folders: any = await getOnlyFolders(folderName, nextContinuationToken)

  if (folders.allFilesOrFolders.length) {
    return {
      folders: folders.allFilesOrFolders,
      nct: folders.NextContinuationToken,
    }
  } else {
    const files: any = await getFilesInFolders(folderName, nextContinuationToken)
    const filesURL = await generateUrlFromFiles(files.allFilesOrFolders)

    return { files: filesURL, nct: files.NextContinuationToken }
  }
}

export const generateUrlFromFiles = async files => {
  const filesURL = []

  for await (const file of files) {
    const urlDownload = await s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_BUCKET_PRODUCTS,
      Key: file.download,
      Expires: parseInt(process.env.AWS_BUCKET_URL_EXPIRES),
    })

    const urlImage = await s3.getSignedUrlPromise('getObject', {
      Bucket: process.env.AWS_BUCKET_PRODUCTS,
      Key: file.image,
      Expires: parseInt(process.env.AWS_BUCKET_URL_EXPIRES),
    })

    filesURL.push({ directory: file.image, urlDownload, urlImage })
  }

  return filesURL
}

const getOnlyFolders = (folderName: string, nextContinuationToken?: string) =>
  new Promise((resolve, reject) => {
    s3.listObjectsV2(
      {
        Bucket: process.env.AWS_BUCKET_PRODUCTS,
        MaxKeys: maxKeys,
        Prefix: folderName,
        Delimiter: '/',
        ContinuationToken: nextContinuationToken,
      },
      async (err, res) => {
        if (err) {
          reject(err)
        } else {
          const foldersPrefix = []

          if (res?.CommonPrefixes?.length) {
            for await (const folder of res?.CommonPrefixes) {
              if (folder.Prefix.endsWith('/')) {
                const pathSplit = folder.Prefix.split('/')

                foldersPrefix.push({
                  name: pathSplit[pathSplit.length - 2],
                  prefix: folder.Prefix,
                })
              }
            }
          }

          resolve({
            allFilesOrFolders: foldersPrefix,
            NextContinuationToken: foldersPrefix.length
              ? res?.NextContinuationToken
              : undefined,
          })
        }
      }
    )
  })

const getFilesInFolders = (folderName: string, nextContinuationToken?: string) =>
  new Promise((resolve, reject) => {
    s3.listObjectsV2(
      {
        Bucket: process.env.AWS_BUCKET_PRODUCTS,
        MaxKeys: maxKeys,
        Prefix: folderName,
        ContinuationToken: nextContinuationToken,
      },
      async (err, res) => {
        if (err) {
          reject(err)
        } else {
          const allFiles = []

          if (res?.Contents?.length) {
            for await (const file of res?.Contents) {
              if (!file.Key.endsWith('/')) {
                if (
                  file.Key.endsWith('.png') ||
                  file.Key.endsWith('.jpg') ||
                  file.Key.endsWith('.jpeg')
                ) {
                  let fileName = file.Key

                  const rarFile = removeExtensionFromFile(fileName) + '.rar'
                  const zipFile = removeExtensionFromFile(fileName) + '.zip'

                  const compressedFileExists = res.Contents.find(
                    image => image.Key === rarFile || image.Key === zipFile
                  )

                  if (compressedFileExists) {
                    const fileNameSplitted = compressedFileExists.Key.split('.')

                    const fileExtension = fileNameSplitted[fileNameSplitted.length - 1]

                    fileName = fileExtension === 'rar' ? rarFile : zipFile
                  }

                  allFiles.push({
                    image: file.Key,
                    download: fileName,
                  })
                }
              }
            }
          }

          resolve({
            allFilesOrFolders: allFiles,
            NextContinuationToken: res?.NextContinuationToken,
          })
        }
      }
    )
  })
