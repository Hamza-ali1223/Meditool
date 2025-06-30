const doctors = [
  {
    id: 1,
    name: "Dr. Sarah",
    speciality: 1, // General Physician
    phone: "+1-555-0101",
    email: "sarah.johnson@meditool.com",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-12-28T10:30:00Z",
    image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg",
    rating: "⭐ 3.8",
    fees: 120
  },
  {
    id: 2,
    name: "Dr. Michael",
    speciality: 2, // Cardiologist
    phone: "+1-555-0102",
    email: "michael.chen@meditool.com",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-12-27T14:20:00Z",
    image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg",
    rating: "⭐ 4.2",
    fees: 180
  },
  {
    id: 3,
    name: "Dr. Emily",
    speciality: 3, // Dermatologist
    phone: "+1-555-0103",
    email: "emily.rodriguez@meditool.com",
    createdAt: "2024-02-01T10:00:00Z",
    updatedAt: "2024-12-26T16:45:00Z",
    image: "https://images.pexels.com/photos/4173251/pexels-photo-4173251.jpeg",
    rating: "⭐ 3.9",
    fees: 150
  },
  {
    id: 4,
    name: "Dr. James",
    speciality: 4, // Orthopedist
    phone: "+1-555-0104",
    email: "james.wilson@meditool.com",
    createdAt: "2024-02-10T11:00:00Z",
    updatedAt: "2024-12-25T09:15:00Z",
    image: "https://images.pexels.com/photos/5452255/pexels-photo-5452255.jpeg",
    rating: "⭐ 4.1",
    fees: 200
  },
  {
    id: 5,
    name: "Dr. Lisa",
    speciality: 5, // Pediatrician
    phone: "+1-555-0105",
    email: "lisa.thompson@meditool.com",
    createdAt: "2024-02-15T08:30:00Z",
    updatedAt: "2024-12-24T11:00:00Z",
    image: "https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg",
    rating: "⭐ 3.7",
    fees: 130
  },
  {
    id: 6,
    name: "Dr. Robert",
    speciality: 1, // General Physician
    phone: "+1-555-0106",
    email: "robert.martinez@meditool.com",
    createdAt: "2024-03-01T09:30:00Z",
    updatedAt: "2024-12-23T15:30:00Z",
    image: "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg",
    rating: "⭐ 3.6",
    fees: 110
  },
  {
    id: 7,
    name: "Dr. Jennifer",
    speciality: 6, // Gynecologist
    phone: "+1-555-0107",
    email: "jennifer.davis@meditool.com",
    createdAt: "2024-03-10T10:30:00Z",
    updatedAt: "2024-12-22T14:00:00Z",
    image: "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg",
    rating: "⭐ 4.0",
    fees: 165
  },
  {
    id: 8,
    name: "Dr. William",
    speciality: 7, // Psychiatrist
    phone: "+1-555-0108",
    email: "william.brown@meditool.com",
    createdAt: "2024-03-15T11:30:00Z",
    updatedAt: "2024-12-21T10:45:00Z",
    image: "https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg",
    rating: "⭐ 3.8",
    fees: 175
  },
  {
    id: 9,
    name: "Dr. Amanda",
    speciality: 8, // Dentist
    phone: "+1-555-0109",
    email: "amanda.taylor@meditool.com",
    createdAt: "2024-04-01T08:00:00Z",
    updatedAt: "2024-12-20T16:30:00Z",
    image: "https://images.pexels.com/photos/3845653/pexels-photo-3845653.jpeg",
    rating: "⭐ 4.3",
    fees: 140
  },
  {
    id: 10,
    name: "Dr. Christopher",
    speciality: 9, // Ophthalmologist
    phone: "+1-555-0110",
    email: "christopher.lee@meditool.com",
    createdAt: "2024-04-10T09:00:00Z",
    updatedAt: "2024-12-19T13:15:00Z",
    image: "https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg",
    rating: "⭐ 3.9",
    fees: 190
  },
  {
    id: 11,
    name: "Dr. Maria",
    speciality: 10, // ENT Specialist
    phone: "+1-555-0111",
    email: "maria.garcia@meditool.com",
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: "2024-12-18T11:30:00Z",
    image: "https://images.pexels.com/photos/4989136/pexels-photo-4989136.jpeg",
    rating: "⭐ 3.5",
    fees: 155
  },
  {
    id: 12,
    name: "Dr. Daniel",
    speciality: 11, // Neurologist
    phone: "+1-555-0112",
    email: "daniel.anderson@meditool.com",
    createdAt: "2024-05-01T11:00:00Z",
    updatedAt: "2024-12-17T15:45:00Z",
    image: "https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg",
    rating: "⭐ 4.2",
    fees: 220
  },
  {
    id: 13,
    name: "Dr. Patricia",
    speciality: 2, // Cardiologist
    phone: "+1-555-0113",
    email: "patricia.white@meditool.com",
    createdAt: "2024-05-10T08:30:00Z",
    updatedAt: "2024-12-16T09:00:00Z",
    image: "https://images.pexels.com/photos/5214950/pexels-photo-5214950.jpeg",
    rating: "⭐ 3.7",
    fees: 185
  },
  {
    id: 14,
    name: "Dr. Thomas",
    speciality: 4, // Orthopedist
    phone: "+1-555-0114",
    email: "thomas.moore@meditool.com",
    createdAt: "2024-05-20T09:30:00Z",
    updatedAt: "2024-12-15T14:30:00Z",
    image: "https://images.pexels.com/photos/5327873/pexels-photo-5327873.jpeg",
    rating: "⭐ 4.0",
    fees: 195
  },
  {
    id: 15,
    name: "Dr. Nancy",
    speciality: 12, // Endocrinologist
    phone: "+1-555-0115",
    email: "nancy.jackson@meditool.com",
    createdAt: "2024-06-01T10:30:00Z",
    updatedAt: "2024-12-14T12:00:00Z",
    image: "https://images.pexels.com/photos/4270088/pexels-photo-4270088.jpeg",
    rating: "⭐ 3.8",
    fees: 170
  },
  {
    id: 16,
    name: "Dr. Kevin",
    speciality: 3, // Dermatologist
    phone: "+1-555-0116",
    email: "kevin.harris@meditool.com",
    createdAt: "2024-06-10T11:30:00Z",
    updatedAt: "2024-12-13T16:15:00Z",
    image: "https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg",
    rating: "⭐ 3.6",
    fees: 145
  },
  {
    id: 17,
    name: "Dr. Susan",
    speciality: 5, // Pediatrician
    phone: "+1-555-0117",
    email: "susan.martin@meditool.com",
    createdAt: "2024-06-20T08:00:00Z",
    updatedAt: "2024-12-12T10:30:00Z",
    image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg",
    rating: "⭐ 4.1",
    fees: 125
  },
  {
    id: 18,
    name: "Dr. Charles",
    speciality: 8, // Dentist
    phone: "+1-555-0118",
    email: "charles.clark@meditool.com",
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: "2024-12-11T13:45:00Z",
    image: "https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg",
    rating: "⭐ 3.9",
    fees: 135
  },
  {
    id: 19,
    name: "Dr. Linda",
    speciality: 7, // Psychiatrist
    phone: "+1-555-0119",
    email: "linda.lewis@meditool.com",
    createdAt: "2024-07-10T10:00:00Z",
    updatedAt: "2024-12-10T15:00:00Z",
    image: "https://images.pexels.com/photos/7659573/pexels-photo-7659573.jpeg",
    rating: "⭐ 4.4",
    fees: 180
  },
  {
    id: 20,
    name: "Dr. Richard",
    speciality: 1, // General Physician
    phone: "+1-555-0120",
    email: "richard.walker@meditool.com",
    createdAt: "2024-07-20T11:00:00Z",
    updatedAt: "2024-12-09T11:30:00Z",
    image: "https://images.pexels.com/photos/5452256/pexels-photo-5452256.jpeg",
    rating: "⭐ 3.7",
    fees: 115
  }
];

export default doctors;