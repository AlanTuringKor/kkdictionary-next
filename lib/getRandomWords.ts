import clientPromise from './mongodb'

export async function getRandomWords(count = 6) {
  const client = await clientPromise
  const db = client.db('DictionaryDB')
  const collection = db.collection('dictionaries')

  const recentTargetCount = Math.min(3, count)
  let recentResults: any[] = []

  // 최대 30일 전까지 하루씩 범위 확장하면서 단어 수집
  for (let day = 7; day <= 300; day++) {
    const date = new Date()
    date.setDate(date.getDate() - day)

    const results = await collection
      .aggregate([
        { $match: { entry_time: { $gte: date } } },
        { $sample: { size: recentTargetCount } },
      ])
      .toArray()

    recentResults = results

    if (recentResults.length >= recentTargetCount) break
  }

  // recent 단어 부족하면 그냥 있는 만큼만
  const remainingCount = count - recentResults.length

  let otherResults: any[] = []
  if (remainingCount > 0) {
    const otherPipeline = [
      { $match: { _id: { $nin: recentResults.map((doc) => doc._id) } } },
      { $sample: { size: remainingCount } }
    ]
    otherResults = await collection.aggregate(otherPipeline).toArray()
  }

  return [...recentResults, ...otherResults]
}
