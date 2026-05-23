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

  //Study
  GET_STEP1_CARDS: `/learning/stage1/cards`,
  POST_STEP1_CARD_CHECK: `/learning/stage1/submit-card-check`,
  GET_STEP2_PROBLEMS: `/learning/stage2/problems`,
  POST_STEP2_ANSWER: `/learning/stage2/submit-answer`,
  GET_STEP3_PROBLEMS: `/learning/stage3/problems`,
  GET_STEP3_NEXT_PROBLEM: `/learning/stage3/next-problem`,
  POST_STEP3_ANSWER: `/learning/stage3/submit-answer`,
  GET_STEP3_PROGRESS: `/learning/stage3/progress`,
  POST_STEP3_RESET: `/learning/stage3/reset-progress`,
};
