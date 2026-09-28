/**
 * Government bodies selectable on the Teacher Empowerment application.
 * This list is the source of truth: when an application first names a body,
 * the server creates it in the database with this id as organizations.slug.
 */
export const GOVERNMENT_BODIES = [
  { id: "fed-ministry-edu", name: "Federal Ministry of Education" },
  { id: "subeb", name: "State Universal Basic Education Board (SUBEB)" },
  { id: "trcn", name: "Teachers Registration Council of Nigeria (TRCN)" },
  { id: "nti", name: "National Teachers' Institute (NTI)" },
  { id: "ncce", name: "National Commission for Colleges of Education (NCCE)" },
  { id: "tetfund", name: "Tertiary Education Trust Fund (TETFund)" },
  { id: "ubec", name: "Universal Basic Education Commission (UBEC)" },
  { id: "state-ministry-edu", name: "State Ministry of Education" },
  { id: "local-education", name: "Local Government Education Authority (LGEA)" },
] as const;
