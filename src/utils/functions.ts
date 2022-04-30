export const extractWordInPhrase = (
  phrase: string,
  letterInitial: string,
  letterFinal: string
) => {
  const initial = phrase.lastIndexOf(letterInitial)
  const final = phrase.lastIndexOf(letterFinal)

  if (initial === -1 || final === -1) {
    return ''
  }

  return phrase.substring(initial + 1, final)
}

export const pagination = (array, page, limit) => {
  return array.slice(
    page === 1 ? 0 : limit * page - limit,
    page === 1 ? limit : limit * page
  )
}

export const removeExtensionFromFile = (fileName: string) => {
  return fileName.substring(0, fileName.lastIndexOf('.'))
}
