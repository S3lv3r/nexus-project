export interface CourseTerm {
  term: string
  text: string
}

export interface CourseContentBlock extends CourseTerm {
  points: CourseTerm[]
}

export interface CourseExample extends CourseTerm {
  points: string[]
}

export interface CourseTable {
  header: string[]
  rows: string[][]
}

export interface CourseLessonMeta {
  id: string
  title: string
  description: string
  objective: string
  minutes: number
  level: string
  keywords: string[]
}

export interface CourseLessonDetail {
  intro: { label: string; text: string }[]
  content: CourseContentBlock[]
  examples: CourseExample[]
  tables: CourseTable[]
  activities: string[]
  summary: string[]
}

export interface CourseTopic {
  number: number
  title: string
  shortTitle: string
  icon: string
  summary: string
  lessons: CourseLessonMeta[]
}
