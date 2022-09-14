export const uploadService = {
  uploadImg
}
async function uploadImg(file) {
  const CLOUD_NAME = "bergerr"
  const UPLOAD_PRESET = "hkqb0ner"
  const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

  const formData = new FormData()
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('file', file)

  return fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      return res
    })
    .catch(err => console.error(err))
}