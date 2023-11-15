export const checkIfImageExists = async (imageUrl: string) => {
  try {
    // const resp = await axios('checkimage',imageUrl)
    // rep = true false
    // const img = new Image()

    // return !!(resp.data !== false && resp.data[0] === 'HTTP/1.0 200 OK')

    // console.log(resp)

    // // const img = new Image()

    // // img.src = imageUrl
    // // console.log(img.height)

    // // return !(img.height > 0)
 
    const response = await fetch(imageUrl, { method: 'HEAD' })

    return !!(response.ok)
  }
  catch (error) {
    console.error('Error checking image existence:', error)

    return false
  }
}
