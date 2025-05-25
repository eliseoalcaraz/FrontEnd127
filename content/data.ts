export const courses = [
  { id: 1, title: "Company" },
  { id: 2, title: "Sport Org" },
  { id: 3, title: "Group Project" },
  { id: 4, title: "Company 2" },
];


export const sampleData = {
  "Users": [
    { "user_id": 1, "name": "Eliseo Alcaraz", "email": "eliseo@example.com", "password_hash": "hash1", "created_at": "2025-05-01T08:00:00Z" },
    { "user_id": 2, "name": "Maria Santos", "email": "maria@example.com", "password_hash": "hash2", "created_at": "2025-05-01T08:10:00Z" },
    { "user_id": 3, "name": "Juan Cruz", "email": "juan@example.com", "password_hash": "hash3", "created_at": "2025-05-01T08:20:00Z" },
    { "user_id": 4, "name": "Liza Reyes", "email": "liza@example.com", "password_hash": "hash4", "created_at": "2025-05-01T08:30:00Z" },
    { "user_id": 5, "name": "Carlos dela Peña", "email": "carlos@example.com", "password_hash": "hash5", "created_at": "2025-05-01T08:40:00Z" },
    { "user_id": 6, "name": "Anna Lim", "email": "anna@example.com", "password_hash": "hash6", "created_at": "2025-05-01T08:50:00Z" },
    { "user_id": 7, "name": "Noel Tan", "email": "noel@example.com", "password_hash": "hash7", "created_at": "2025-05-01T09:00:00Z" },
    { "user_id": 8, "name": "Grace Uy", "email": "grace@example.com", "password_hash": "hash8", "created_at": "2025-05-01T09:10:00Z" },
    { "user_id": 9, "name": "Robert Ong", "email": "robert@example.com", "password_hash": "hash9", "created_at": "2025-05-01T09:20:00Z" },
    { "user_id": 10, "name": "Irene Gomez", "email": "irene@example.com", "password_hash": "hash10", "created_at": "2025-05-01T09:30:00Z" }
  ],

  "Courses": [
    { "course_id": 101, "host_id": 1, "name": "Intro to Data Science", "join_code": "DS101", "geolocation": "14.5995,120.9842", "created_at": "2025-05-02T08:00:00Z", "late_threshold_minutes": 10 },
    { "course_id": 102, "host_id": 2, "name": "Web Development", "join_code": "WEB102", "geolocation": "14.6095,121.0000", "created_at": "2025-05-02T08:10:00Z", "late_threshold_minutes": 5 },
    { "course_id": 103, "host_id": 3, "name": "Mobile Apps", "join_code": "MOB103", "geolocation": "14.6200,121.0010", "created_at": "2025-05-02T08:20:00Z", "late_threshold_minutes": 7 },
    { "course_id": 104, "host_id": 4, "name": "Databases", "join_code": "DB104", "geolocation": "14.6100,121.0020", "created_at": "2025-05-02T08:30:00Z", "late_threshold_minutes": 8 },
    { "course_id": 105, "host_id": 5, "name": "Cybersecurity", "join_code": "SEC105", "geolocation": "14.6200,121.0030", "created_at": "2025-05-02T08:40:00Z", "late_threshold_minutes": 6 },
    { "course_id": 106, "host_id": 6, "name": "Networking", "join_code": "NET106", "geolocation": "14.6300,121.0040", "created_at": "2025-05-02T08:50:00Z", "late_threshold_minutes": 10 },
    { "course_id": 107, "host_id": 7, "name": "Machine Learning", "join_code": "ML107", "geolocation": "14.6400,121.0050", "created_at": "2025-05-02T09:00:00Z", "late_threshold_minutes": 5 },
    { "course_id": 108, "host_id": 8, "name": "AI Ethics", "join_code": "ETH108", "geolocation": "14.6500,121.0060", "created_at": "2025-05-02T09:10:00Z", "late_threshold_minutes": 9 },
    { "course_id": 109, "host_id": 9, "name": "Cloud Computing", "join_code": "CLOUD109", "geolocation": "14.6600,121.0070", "created_at": "2025-05-02T09:20:00Z", "late_threshold_minutes": 10 },
    { "course_id": 110, "host_id": 10, "name": "Quantum Computing", "join_code": "QUANT110", "geolocation": "14.6700,121.0080", "created_at": "2025-05-02T09:30:00Z", "late_threshold_minutes": 4 }
  ],

  "Enrollments": [
    { "user_id": 1, "course_id": 101, "enrolled_at": "2025-05-03T10:00:00Z" },
    { "user_id": 2, "course_id": 101, "enrolled_at": "2025-05-03T10:01:00Z" },
    { "user_id": 3, "course_id": 102, "enrolled_at": "2025-05-03T10:02:00Z" },
    { "user_id": 4, "course_id": 102, "enrolled_at": "2025-05-03T10:03:00Z" },
    { "user_id": 5, "course_id": 103, "enrolled_at": "2025-05-03T10:04:00Z" },
    { "user_id": 6, "course_id": 104, "enrolled_at": "2025-05-03T10:05:00Z" },
    { "user_id": 7, "course_id": 105, "enrolled_at": "2025-05-03T10:06:00Z" },
    { "user_id": 8, "course_id": 106, "enrolled_at": "2025-05-03T10:07:00Z" },
    { "user_id": 9, "course_id": 107, "enrolled_at": "2025-05-03T10:08:00Z" },
    { "user_id": 10, "course_id": 108, "enrolled_at": "2025-05-03T10:09:00Z" }
  ],

  "Sessions": [
    { "session_id": 201, "course_id": 101, "start_time": "2025-05-10T08:00:00Z", "end_time": "2025-05-10T09:30:00Z" },
    { "session_id": 202, "course_id": 102, "start_time": "2025-05-11T08:00:00Z", "end_time": "2025-05-11T09:30:00Z" },
    { "session_id": 203, "course_id": 103, "start_time": "2025-05-12T08:00:00Z", "end_time": "2025-05-12T09:30:00Z" },
    { "session_id": 204, "course_id": 104, "start_time": "2025-05-13T08:00:00Z", "end_time": "2025-05-13T09:30:00Z" },
    { "session_id": 205, "course_id": 105, "start_time": "2025-05-14T08:00:00Z", "end_time": "2025-05-14T09:30:00Z" },
    { "session_id": 206, "course_id": 106, "start_time": "2025-05-15T08:00:00Z", "end_time": "2025-05-15T09:30:00Z" },
    { "session_id": 207, "course_id": 107, "start_time": "2025-05-16T08:00:00Z", "end_time": "2025-05-16T09:30:00Z" },
    { "session_id": 208, "course_id": 108, "start_time": "2025-05-17T08:00:00Z", "end_time": "2025-05-17T09:30:00Z" },
    { "session_id": 209, "course_id": 109, "start_time": "2025-05-18T08:00:00Z", "end_time": "2025-05-18T09:30:00Z" },
    { "session_id": 210, "course_id": 110, "start_time": "2025-05-19T08:00:00Z", "end_time": "2025-05-19T09:30:00Z" }
  ],

  "Attendances": [
    { "attendance_id": 301, "session_id": 201, "user_id": 1, "status": "present", "user_geolocation": "14.5996,120.9843", "proof_base64": "proof1", "joined_at": "2025-05-10T08:01:00Z" },
    { "attendance_id": 302, "session_id": 201, "user_id": 2, "status": "late", "user_geolocation": "14.5997,120.9844", "proof_base64": "proof2", "joined_at": "2025-05-10T08:12:00Z" },
    { "attendance_id": 303, "session_id": 202, "user_id": 3, "status": "present", "user_geolocation": "14.6095,121.0001", "proof_base64": "proof3", "joined_at": "2025-05-11T08:05:00Z" },
    { "attendance_id": 304, "session_id": 202, "user_id": 4, "status": "present", "user_geolocation": "14.6096,121.0002", "proof_base64": "proof4", "joined_at": "2025-05-11T08:03:00Z" },
    { "attendance_id": 305, "session_id": 203, "user_id": 5, "status": "absent", "user_geolocation": "", "proof_base64": "", "joined_at": "" },
    { "attendance_id": 306, "session_id": 204, "user_id": 6, "status": "present", "user_geolocation": "14.6101,121.0021", "proof_base64": "proof6", "joined_at": "2025-05-13T08:00:00Z" },
    { "attendance_id": 307, "session_id": 205, "user_id": 7, "status": "present", "user_geolocation": "14.6201,121.0031", "proof_base64": "proof7", "joined_at": "2025-05-14T08:02:00Z" },
    { "attendance_id": 308, "session_id": 206, "user_id": 8, "status": "late", "user_geolocation": "14.6301,121.0041", "proof_base64": "proof8", "joined_at": "2025-05-15T08:20:00Z" },
    { "attendance_id": 309, "session_id": 207, "user_id": 9, "status": "present", "user_geolocation": "14.6401,121.0051", "proof_base64": "proof9", "joined_at": "2025-05-16T08:00:00Z" },
    { "attendance_id": 310, "session_id": 208, "user_id": 10, "status": "present", "user_geolocation": "14.6501,121.0061", "proof_base64": "proof10", "joined_at": "2025-05-17T08:00:00Z" }
  ]
}
