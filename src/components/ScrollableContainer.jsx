"use client"
import { useEffect, useRef, useState } from "react"

export default function ScrollableContainer({ children, className = "" }) {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollRef = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const handleScroll = () => {
      setIsScrolling(true)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout to hide scrollbar after 1 second
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false)
      }, 1000)
    }

    element.addEventListener("scroll", handleScroll)

    return () => {
      element.removeEventListener("scroll", handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className={`${className} ${
        isScrolling ? "scrollbar-show" : "scrollbar-hide"
      } transition-all duration-300 overflow-x-hidden`}
    >
      {children}
    </div>
  )
}
