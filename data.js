const initialDoctors = [
  {
    code: '01',
    name: 'BS. Nguyễn Thị A',
    specialty: 'Ung thư học',
    email: 'nguyenthia@hospital.test',
    phone: '0912 345 678',
    experience: '10 năm',
    gender: 'Nữ',
    status: 'active',
    bio: 'Chuyên gia hàng đầu về ung thư học lâm sàng, nguyên trưởng khoa bệnh viện K.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Chiều', Wednesday: 'Sáng', Thursday: 'Chiều', Friday: 'Nghỉ', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  },
  {
    code: '02',
    name: 'BS. Phạm Văn B',
    specialty: 'Tim mạch',
    email: 'phamvanb@hospital.test',
    phone: '0987 654 321',
    experience: '15 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên khoa Tim mạch can thiệp, tu nghiệp tại CH Pháp, có nhiều công trình nghiên cứu khoa học.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Sáng', Wednesday: 'Chiều', Thursday: 'Sáng', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '03',
    name: 'BS. Trần Thị C',
    specialty: 'Nhi khoa',
    email: 'tranthic@hospital.test',
    phone: '0909 123 456',
    experience: '8 năm',
    gender: 'Nữ',
    status: 'active',
    bio: 'Bác sĩ Nhi khoa tận tâm, yêu trẻ, chuyên sâu về dinh dưỡng trẻ em và hô hấp.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Sáng', Wednesday: 'Sáng', Thursday: 'Sáng', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '04',
    name: 'BS. Lê Hoàng D',
    specialty: 'Chấn thương chỉnh hình',
    email: 'lehoangd@hospital.test',
    phone: '0934 567 890',
    experience: '12 năm',
    gender: 'Nam',
    status: 'inactive',
    bio: 'Chuyên khoa xương khớp, phẫu thuật nội soi khớp và chấn thương thể thao.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Chiều', Wednesday: 'Nghỉ', Thursday: 'Chiều', Friday: 'Chiều', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  },
  {
    code: '05',
    name: 'BS. Hoàng Mai E',
    specialty: 'Sản phụ khoa',
    email: 'hoangmaie@hospital.test',
    phone: '0945 678 901',
    experience: '14 năm',
    gender: 'Nữ',
    status: 'active',
    bio: 'Chuyên gia siêu âm sản khoa, quản lý thai kỳ nguy cơ cao và tư vấn kế hoạch hóa gia đình.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Nghỉ', Wednesday: 'Sáng', Thursday: 'Nghỉ', Friday: 'Sáng', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  },
  {
    code: '06',
    name: 'BS. Đỗ Quốc F',
    specialty: 'Nội tiết',
    email: 'doquocf@hospital.test',
    phone: '0967 890 123',
    experience: '9 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên điều trị đái tháo đường, các bệnh lý tuyến giáp và rối loạn nội tiết tố.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Sáng', Wednesday: 'Nghỉ', Thursday: 'Sáng', Friday: 'Nghỉ', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  },
  {
    code: '07',
    name: 'BS. Vũ Hoàng G',
    specialty: 'Thần kinh',
    email: 'vuhoangg@hospital.test',
    phone: '0978 901 234',
    experience: '11 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên sâu nội thần kinh, điều trị đau đầu, mất ngủ kéo dài và đau thần kinh tọa.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Chiều', Wednesday: 'Sáng', Thursday: 'Chiều', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '08',
    name: 'BS. Nguyễn Minh H',
    specialty: 'Da liễu',
    email: 'nguyenminhh@hospital.test',
    phone: '0989 012 345',
    experience: '7 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên điều trị mụn trứng cá, viêm da cơ địa và các phương pháp thẩm mỹ da công nghệ cao.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Sáng', Wednesday: 'Chiều', Thursday: 'Chiều', Friday: 'Sáng', Saturday: 'Chiều', Sunday: 'Nghỉ'
    }
  },
  {
    code: '09',
    name: 'BS. Phan Thanh I',
    specialty: 'Tai Mũi Họng',
    email: 'phanthanhi@hospital.test',
    phone: '0990 123 456',
    experience: '13 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Khám và điều trị viêm xoang, viêm amidan mạn tính và nội soi tai mũi họng trẻ em.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Sáng', Wednesday: 'Chiều', Thursday: 'Sáng', Friday: 'Chiều', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '10',
    name: 'BS. Bùi Phương K',
    specialty: 'Mắt',
    email: 'buiphuongk@hospital.test',
    phone: '0901 234 567',
    experience: '6 năm',
    gender: 'Nữ',
    status: 'active',
    bio: 'Điều trị tật khúc xạ cận thị, viễn thị, loạn thị và các bệnh lý bề mặt nhãn cầu.',
    schedule: {
      Monday: 'Sáng', Tuesday: 'Chiều', Wednesday: 'Sáng', Thursday: 'Chiều', Friday: 'Sáng', Saturday: 'Nghỉ', Sunday: 'Nghỉ'
    }
  },
  {
    code: '11',
    name: 'BS. Đặng Tiến L',
    specialty: 'Răng Hàm Mặt',
    email: 'dangtienl@hospital.test',
    phone: '0912 345 999',
    experience: '16 năm',
    gender: 'Nam',
    status: 'active',
    bio: 'Chuyên gia phục hình răng sứ thẩm mỹ, cấy ghép Implant nha khoa và niềng răng.',
    schedule: {
      Monday: 'Chiều', Tuesday: 'Chiều', Wednesday: 'Chiều', Thursday: 'Chiều', Friday: 'Chiều', Saturday: 'Sáng', Sunday: 'Nghỉ'
    }
  }
];
