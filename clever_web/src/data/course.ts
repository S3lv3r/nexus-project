import { COURSE_TOPICS } from './courseOutline'
import type { CourseLessonMeta, CourseTopic } from './courseTypes'

export { COURSE_TOPICS }
export type { CourseLessonMeta, CourseTopic }

export const COURSE_ID = 'curso'
export const COURSE_NAME = 'Trading, Blockchain y Finanzas Digitales'
export const COURSE_SHORT_NAME = 'Trading y Finanzas Digitales'

export interface CourseLessonEntry extends CourseLessonMeta {
  index: number
  topicIndex: number
  topicNumber: number
  topicTitle: string
  topicShortTitle: string
}

export const COURSE_LESSONS: CourseLessonEntry[] = COURSE_TOPICS.flatMap((topic, topicIndex) =>
  topic.lessons.map((lesson) => ({
    ...lesson,
    index: 0,
    topicIndex,
    topicNumber: topic.number,
    topicTitle: topic.title,
    topicShortTitle: topic.shortTitle,
  })),
).map((lesson, index) => ({ ...lesson, index }))

export const TOTAL_LESSONS = COURSE_LESSONS.length
export const TOTAL_TOPICS = COURSE_TOPICS.length
export const TOTAL_MINUTES = COURSE_LESSONS.reduce((sum, lesson) => sum + lesson.minutes, 0)

export const formatHours = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return `${rest} min`
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

export interface CourseProgress {
  completed: Set<number>
  done: number
  percent: number
  resumeIndex: number
  isDone: boolean
  next: CourseLessonEntry
  topicsDone: number
  currentTopic: CourseTopic
  topicStats: { topic: CourseTopic; done: number; total: number }[]
}

export const getCourseProgress = (moduleProgress: Record<string, number[]> | undefined): CourseProgress => {
  const raw = moduleProgress?.[COURSE_ID] || []
  const completed = new Set(raw.filter((index) => Number.isInteger(index) && index >= 0 && index < TOTAL_LESSONS))
  const firstIncomplete = COURSE_LESSONS.findIndex((lesson) => !completed.has(lesson.index))
  const isDone = firstIncomplete < 0
  const resumeIndex = isDone ? TOTAL_LESSONS - 1 : firstIncomplete
  const next = COURSE_LESSONS[resumeIndex]
  const topicStats = COURSE_TOPICS.map((topic, topicIndex) => {
    const lessons = COURSE_LESSONS.filter((lesson) => lesson.topicIndex === topicIndex)
    return { topic, done: lessons.filter((lesson) => completed.has(lesson.index)).length, total: lessons.length }
  })
  return {
    completed,
    done: completed.size,
    percent: TOTAL_LESSONS ? Math.round((completed.size / TOTAL_LESSONS) * 100) : 0,
    resumeIndex,
    isDone,
    next,
    topicsDone: topicStats.filter((item) => item.done === item.total).length,
    currentTopic: COURSE_TOPICS[next.topicIndex],
    topicStats,
  }
}

export const lessonPath = (index: number) => `/aprender?view=lesson&nivel=${index + 1}`
