export const END_POINT = {
  // Auth
  POST_SIGNUP: `/auth/signup`,
  POST_LOGIN: `/auth/login`,
  POST_REFRESH: `/auth/refresh`,
  POST_LOGOUT: `/auth/logout`,
  GET_ME: `/auth/me`,

  // Agent
  POST_AGENT_CHAT: `/agent/chat`,
  GET_AGENT_PROFILE: `/agent/profile/me`,

  // Chatbot
  POST_USER_CHAT: `/chat/`,

  //Student
  GET_STUDENT_PROGRESS: `/student/me/progress`,
  GET_STUDENT_ASSIGNMENTS: `/student/learning/assignments`,

  //Study
  GET_STEP1_CARDS: `/student/learning/stage1/cards`,
  POST_STEP1_CARD_CHECK: `/student/learning/stage1/submit-card-check`,
  GET_STEP2_PROBLEMS: `/student/learning/stage2/problems`,
  POST_STEP2_ANSWER: `/student/learning/stage2/submit-answer`,
  GET_STEP3_PROBLEMS: `/student/learning/stage3/problems`,
  GET_STEP3_NEXT_PROBLEM: `/student/learning/stage3/next-problem`,
  POST_STEP3_ANSWER: `/student/learning/stage3/submit-answer`,
  GET_STEP3_PROGRESS: `/student/learning/stage3/progress`,
  POST_STEP3_RESET: `/student/learning/stage3/reset-progress`,

  // Teacher Classroom
  GET_TEACHER_CLASSES: `/teacher/classes`,
  GET_TEACHER_CLASS_STUDENTS: (classId: string) => `/teacher/classes/${classId}/students`,
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
