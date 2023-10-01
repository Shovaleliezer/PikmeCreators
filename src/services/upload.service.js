const CLOUD_NAME = "dfmtbntrc"
const UPLOAD_PRESET = "stgck1s3"
const UPLOAD_IMG = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
const UPLOAD_VIDEO = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`

export async function uploadFile(file, type = 'img') {
  const formData = new FormData()
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('file', file)
  return fetch(type === 'img' ? UPLOAD_IMG : UPLOAD_VIDEO, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      return res
    })
    .catch(err => console.error(err))
}