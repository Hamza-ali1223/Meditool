// Function to convert your doctors array to the required JSON format
function generateDoctorBatchJson(doctors, specialities) {
  return {
    doctors: doctors.map(doctor => {
      // Extract first and last name from doctor name
      const nameParts = doctor.name.split(' ');
      const lastName = nameParts[0].replace('Dr.', '').trim();
      const firstName = nameParts.slice(1).join(' ');
      
      // Find the speciality object by ID
      const specialityObj = specialities.find(s => s.id === doctor.speciality);
      
      return {
        doctorName: doctor.name,
        doctorEmail: doctor.email,
        specialityId: doctor.speciality.toString(), // Convert to string
        doctorPhoneNumber: doctor.phone,
        image: doctor.image,
        rating: parseFloat(doctor.rating.replace('⭐ ', '')),
        consulationFee: doctor.fees,
        user: {
          firstName: firstName,
          lastName: lastName,
          email: doctor.email,
          phoneNumber: doctor.phone,
          image: doctor.image,
          roles: ["DOCTOR"]
        },
        // Add some default available slots for each doctor
        availableSlots: [
          {
            dayOfWeek: "MONDAY",
            startTime: "09:00",
            endTime: "12:00",
            available: true
          },
          {
            dayOfWeek: "MONDAY",
            startTime: "14:00",
            endTime: "17:00",
            available: true
          },
          {
            dayOfWeek: "WEDNESDAY",
            startTime: "09:00",
            endTime: "17:00",
            available: true
          },
          {
            dayOfWeek: "FRIDAY",
            startTime: "09:00",
            endTime: "17:00",
            available: true
          }
        ]
      };
    })
  };
}

// Generate the JSON
const doctorBatchJson = generateDoctorBatchJson(doctors, specialities);

// Convert to a string with pretty formatting
const jsonString = JSON.stringify(doctorBatchJson, null, 2);

// Output the JSON string
console.log(jsonString);