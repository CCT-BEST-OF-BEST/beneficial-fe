export const END_POINT = {
  // Auth
  POST_SIGNUP: `/auth/signup`,
  POST_LOGIN: `/auth/login`,
  POST_REFRESH: `/auth/refresh`,
  POST_LOGOUT: `/auth/logout`,
  GET_ME: `/auth/me`,

  // Agent
  POST_AGENT_CHAT: `/agent/chat`,
  DELETE_AGENT_SESSION: (sessionId: string) => `/agent/session/${sessionId}`,

  // RAG 채팅 (단발)
  POST_USER_CHAT: `/chat/`,

  // Content (단원/차시 트리)
  GET_CONTENT_UNITS: `/content/units`,
  GET_CONTENT_LESSON: (lessonId: string) => `/content/lessons/${lessonId}`,

  // Student
  GET_STUDENT_PROGRESS: `/student/me/progress`,
  GET_STUDENT_ASSIGNMENTS: `/student/learning/assignments`,
  GET_LEARNING_RECORDS: `/student/learning/records/me`,
  GET_STUDENT_MY_CLASS: `/student/my-class`,

  // Stage 1
  GET_STEP1_CARDS: `/student/learning/stage1/cards`,
  POST_STEP1_CARD_CHECK: `/student/learning/stage1/submit-card-check`,

  // Stage 2 (lesson_id 쿼리 파라미터 포함)
  GET_STEP2_PROBLEMS: (lessonId: string) => `/student/learning/stage2/problems?lesson_id=${lessonId}`,
  POST_STEP2_ANSWER: (lessonId: string) => `/student/learning/stage2/submit-answer?lesson_id=${lessonId}`,

  // Stage 3 (lesson_id 쿼리 파라미터 포함)
  GET_STEP3_PROBLEMS: (lessonId: string) => `/student/learning/stage3/problems?lesson_id=${lessonId}`,
  GET_STEP3_NEXT_PROBLEM: (lessonId: string) => `/student/learning/stage3/next-problem?lesson_id=${lessonId}`,
  POST_STEP3_ANSWER: (lessonId: string) => `/student/learning/stage3/submit-answer?lesson_id=${lessonId}`,
  GET_STEP3_PROGRESS: (lessonId: string) => `/student/learning/stage3/progress?lesson_id=${lessonId}`,
  POST_STEP3_RESET: (lessonId: string) => `/student/learning/stage3/reset-progress?lesson_id=${lessonId}`,

  // Teacher Classroom
  GET_TEACHER_CLASSES: `/teacher/classes`,
  GET_TEACHER_CLASS_STUDENTS: (classId: string) => `/teacher/classes/${classId}/students`,
  POST_TEACHER_CLASS_STUDENT: (classId: string) => `/teacher/classes/${classId}/students`,
  DELETE_TEACHER_CLASS_STUDENT: (classId: string, studentId: string) => `/teacher/classes/${classId}/students/${studentId}`,
  GET_TEACHER_SEARCH_STUDENTS: `/teacher/classes/search-students`,
  GET_TEACHER_STUDENT_PROFILE: (userId: string) => `/teacher/students/${userId}/profile`,
  GET_TEACHER_STUDENT_RECORDS: (userId: string) => `/teacher/students/${userId}/records`,

  // Teacher Instruction
  POST_GENERATE_PROBLEMS: `/teacher/instruction/generate-problems`,
  GET_TEACHER_ASSIGNMENTS: `/teacher/instruction/assignments`,
  POST_DRAFT_ASSIGNMENT: `/teacher/instruction/assignments/draft`,
  PATCH_ASSIGN_ASSIGNMENT: (assignmentId: string) => `/teacher/instruction/assignments/${assignmentId}/assign`,
  PATCH_CANCEL_ASSIGNMENT: (assignmentId: string) => `/teacher/instruction/assignments/${assignmentId}/cancel`,
  PATCH_COMPLETE_ASSIGNMENT: (assignmentId: string) => `/teacher/instruction/assignments/${assignmentId}/complete`,

  // Admin
  GET_ADMIN_SYSTEM_STATUS: `/admin/system-status`,
  POST_ADMIN_INITIALIZE_ALL: `/admin/initialize-all`,
  POST_ADMIN_SEED_DATA: `/admin/seed-data`,
  POST_ADMIN_REBUILD_VECTOR: `/admin/rebuild-vector-index`,
  POST_ADMIN_REBUILD_BM25: `/admin/rebuild-bm25`,
  POST_ADMIN_HYPOTHETICAL_QUESTIONS: `/admin/build-hypothetical-questions`,
};
