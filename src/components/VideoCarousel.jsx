import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'
import { useEffect, useRef, useState } from 'react'

import { hightlightsSlides } from '../constants'
import { pauseImg, playImg, replayImg } from '../utils'
gsap.registerPlugin(ScrollTrigger)

const VideoCarousel = () => {
  const videoRef = useRef([])
  const videoSpanRef = useRef([])
  const videoDivRef = useRef([])

  // video and indicator
  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  })

  const [loadedData, setLoadedData] = useState([])
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video

  useGSAP(() => {
    // video animation to play the video when it is in the view
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none',
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true,
        }))
      },
    })
  }, [isEnd, videoId])

  useEffect(() => {
    const currentProgress = 0
    const span = videoSpanRef.current
  }, [videoId, startPlay])

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause()
      } else {
        startPlay && videoRef.current[videoId].play()
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData])

  // vd id is the id for every video until id becomes number 3
  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }))
        break

      case 'video-last':
        setVideo((pre) => ({ ...pre, isLastVideo: true }))
        break

      case 'video-reset':
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }))
        break

      case 'pause':
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }))
        break

      case 'play':
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }))
        break

      default:
        return video
    }
  }

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e])

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="pr-10 sm:p-20">
            <div className="video-carousel_container">
              <div className="flex-center size-full overflow-hidden rounded-3xl bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(el) => {
                    videoRef.current[i] = el
                  }}
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute left-[5%] top-12 z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="text-xl font-medium md:text-2xl">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-center relative mt-10">
        <div className="flex-center rounded-full bg-gray-300 px-7 py-5 backdrop-blur">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="relative mx-2 size-3 cursor-pointer rounded-full bg-gray-200"
            >
              <span
                className="absolute size-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={
              isLastVideo
                ? () => handleProcess('video-reset')
                : !isPlaying
                  ? () => handleProcess('play')
                  : () => handleProcess('pause')
            }
          />
        </button>
      </div>
    </>
  )
}

export default VideoCarousel
