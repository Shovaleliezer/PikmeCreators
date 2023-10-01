const CLOUD_NAME = "dfmtbntrc"
const UPLOAD_PRESET = "stgck1s3"

export async function uploadFile(file, type = 'img') {
  const formData = new FormData()
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('file', file)
  return fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type === 'img' ? 'image' : 'video'}/upload`  , {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(res => {
      return res
    })
    .catch(err => console.error(err))
}