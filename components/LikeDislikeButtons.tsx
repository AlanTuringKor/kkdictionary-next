"use client"

import { useEffect, useState } from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import Cookies from "js-cookie"
import { v4 as uuidv4 } from "uuid" 

interface Props {
  wordId: string
  likedUsers: string[]
  dislikedUsers: string[]
}

export function LikeDislikeButtons({ wordId, likedUsers, dislikedUsers }: Props) {
  const [anonId, setAnonId] = useState("")
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(likedUsers?.length || 0)
  const [dislikeCount, setDislikeCount] = useState(dislikedUsers?.length || 0)

  useEffect(() => {
    let id = Cookies.get("anon_id")
    if (!id) {
      id = uuidv4()
      Cookies.set("anon_id", id, { expires: 365 })
    }
    setAnonId(id)
    setLiked(likedUsers?.includes(id))
    setDisliked(dislikedUsers?.includes(id))
  }, [likedUsers, dislikedUsers])

  const handleLike = async () => {
    if (liked || disliked) return
    const res = await fetch(`/api/like/${wordId}`, {
      method: "POST",
      body: JSON.stringify({ anon_id: anonId }),
    })
    if (res.ok) {
      setLiked(true)
      setLikeCount((prev) => prev + 1)
    }
  }

  const handleDislike = async () => {
    if (liked || disliked) return
    const res = await fetch(`/api/dislike/${wordId}`, {
      method: "POST",
      body: JSON.stringify({ anon_id: anonId }),
    })
    if (res.ok) {
      setDisliked(true)
      setDislikeCount((prev) => prev + 1)
    }
  }

  return (
    <div className="flex gap-4 mt-2">
      <button
        onClick={handleLike}
        className={`flex items-center gap-1 text-sm transition transform hover:scale-105 ${
          liked ? "text-green-600" : "text-gray-400"
        }`}
      >
        <ThumbsUp size={20} /> {likeCount}
      </button>

      <button
        onClick={handleDislike}
        className={`flex items-center gap-1 text-sm transition transform hover:scale-105 ${
          disliked ? "text-red-500" : "text-gray-400"
        }`}
      >
        <ThumbsDown size={20} /> {dislikeCount}
      </button>
    </div>
  )
}
