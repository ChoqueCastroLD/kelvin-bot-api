export async function uploadFile(fileBuffer: ArrayBuffer, filename: string) {
    const timestamp = new Date().getTime();
    const formData = new FormData()
    formData.append('file', new Blob([fileBuffer]), filename)
    const response = await fetch(`${Bun.env.FILE_UPLOAD_ENDPOINT}?filename=${timestamp}_${filename}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${Bun.env.FILE_UPLOAD_TOKEN}`,
        },
        body: formData,
    })
    const data = await response.json()
    return data.filename
}