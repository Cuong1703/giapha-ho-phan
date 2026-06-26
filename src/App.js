import { useState, useCallback, useRef, useEffect, useMemo } from "react";

// ─── DỮ LIỆU GIA PHẢ HỌ PHAN (trích xuất từ giapha) ───────────

const PERSONS = [
  { id: "1fcef043-b4d7-47ee-abd6-a875a09a4204", full_name: "Phan Tấn Liêu (Ông Cố)", gender: "male", birth_year: 1880, death_year: 1955, is_deceased: true, generation: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: "Thăng Phước", note: null, photo_url: null },
  { id: "01dba837-b24f-4152-b65d-1c341d744cd6", full_name: "Nguyễn Thị Cát vợ 1", gender: "female", birth_year: null, death_year: null, is_deceased: true, generation: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "92f2085d-8f4c-40c9-9809-34c02c20ea89", full_name: "Phan Thị Tiếu vợ 2", gender: "female", birth_year: 1897, death_year: 1962, is_deceased: true, generation: 1, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7", full_name: "Phan Tuế (con 1)", gender: "male", birth_year: 1913, death_year: 1994, is_deceased: true, generation: 2, birth_order: 1, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: "Sài Gòn", note: null, photo_url: null },
  { id: "6a41b7bb-faae-4be7-b92b-4c20055363ee", full_name: "Phan Tấn Hưởng (con 2)", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 2, birth_order: 6, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "c8e4167b-b67c-4898-8d5f-26b1426133e6", full_name: "Phan Thị Trượng (con 3)", gender: "female", birth_year: null, death_year: null, is_deceased: true, generation: 2, birth_order: 7, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "dca73201-019b-45ad-bbc0-f97b589c5d21", full_name: "Phan Tấn Hồ (con 4)", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 2, birth_order: 8, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "cb374b0c-5895-4174-a63c-023a7ed56ca7", full_name: "Phan Thị Hòa (con 6)", gender: "female", birth_year: 1929, death_year: 1961, is_deceased: true, generation: 2, birth_order: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: "An Lâm Thăng Phước", note: null, photo_url: null },
  { id: "c1d21d19-59d4-4960-b536-2f78929d7be5", full_name: "Phan Thị Cúc ( con 7)", gender: "female", birth_year: 1931, death_year: 2018, is_deceased: true, generation: 2, birth_order: 4, birth_place: null, occupation: null, phone: null, email: null, burial_place: "Bình Sơn", note: null, photo_url: null },
  { id: "68067fe9-a5da-43b6-9c0e-d71c40cf6df1", full_name: "Phan Thanh Vinh (con 8)", gender: "male", birth_year: null, death_year: 1970, is_deceased: true, generation: 2, birth_order: 9, birth_place: null, occupation: null, phone: null, email: null, burial_place: "Thăng Phước", note: null, photo_url: null },
  { id: "821ab95d-ed57-48f6-afb1-e8af34de163c", full_name: "Phan Thị Thanh (con 9)", gender: "female", birth_year: null, death_year: 1986, is_deceased: true, generation: 2, birth_order: 10, birth_place: null, occupation: null, phone: null, email: null, burial_place: "Thăng Phước", note: null, photo_url: null },
  { id: "981a5871-bed1-42d0-9f15-b6acebe3d7e8", full_name: "Phan Khanh (con 10)", gender: "male", birth_year: 1943, death_year: null, is_deceased: false, generation: 2, birth_order: 5, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "fc127f9b-953b-427b-9fac-bf87d7d8cc0f", full_name: "Trần Thị Lê", gender: "female", birth_year: 1947, death_year: null, is_deceased: false, generation: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "9c2bb029-5293-4a5c-98fe-8403c9afc813", full_name: "Phan Thị Tố Nho", gender: "female", birth_year: 1971, death_year: null, is_deceased: false, generation: 3, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "ad87a8ad-6be8-4ad6-b155-ece7c3990acb", full_name: "Phan Tấn Nhân", gender: "male", birth_year: 1978, death_year: 2022, is_deceased: true, generation: 3, birth_order: 2, birth_place: "thăng phước", occupation: null, phone: null, email: null, burial_place: "thăng phước", note: null, photo_url: null },
  { id: "08856e9c-ed1f-4c12-8bcc-38445d0bb17d", full_name: "Phan Tấn Nhỉ", gender: "male", birth_year: 1979, death_year: null, is_deceased: false, generation: 3, birth_order: 3, birth_place: "Thăng Phước - Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "aaeaaaa5-1f23-4608-9731-731b0c699b0f", full_name: "Phan Thị Tố Như", gender: "female", birth_year: 1981, death_year: null, is_deceased: false, generation: 3, birth_order: 4, birth_place: "Thăng Phước - Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "0a88d955-c48c-438c-ac29-1c341c1b9fb5", full_name: "Phan Tấn Nhuận", gender: "male", birth_year: 1985, death_year: null, is_deceased: false, generation: 3, birth_order: 5, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "3b4d22a9-3cd5-4187-bfca-1f9c04d59998", full_name: "Trần ĐÌnh Tú", gender: "male", birth_year: 1968, death_year: 2007, is_deceased: true, generation: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "89c85b59-43ce-48d7-96e9-8a5823d4298c", full_name: "Trần Thị Tố Diễm", gender: "female", birth_year: 1987, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "6f8f25bf-c20a-4a41-925b-ee5a7af9b874", full_name: "Trần Thị Tố Hương", gender: "female", birth_year: 1991, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "9f594e50-729a-49a4-b3f4-5c661556f706", full_name: "Phan Hải (con 5)", gender: "male", birth_year: 1926, death_year: null, is_deceased: true, generation: 2, birth_order: 2, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: "Tam Kỳ", note: null, photo_url: null },
  { id: "0b773b3c-8c2d-48c3-be13-12abced62315", full_name: "Võ Thị Tuyên", gender: "female", birth_year: 1927, death_year: null, is_deceased: true, generation: 2, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: "Tam Kì", note: null, photo_url: null },
  { id: "f659a210-8101-4833-a36f-41f3ae8e21d9", full_name: "Phan Thị Trân (con 1)", gender: "female", birth_year: null, death_year: 1955, is_deceased: true, generation: 3, birth_order: 5, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "756838cd-6c03-4c90-8ab3-5a91df3f759f", full_name: "Phan Thị Vũ", gender: "female", birth_year: 1957, death_year: null, is_deceased: false, generation: 3, birth_order: 1, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "099f5a9d-9d48-4262-9d13-063fcb9ea88b", full_name: "Phan Tấn Phong", gender: "male", birth_year: 1960, death_year: null, is_deceased: false, generation: 3, birth_order: 2, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "fe75b0ae-fd43-4e0f-a754-137ed45a8b3d", full_name: "Phan Thị Phú", gender: "female", birth_year: 1962, death_year: 1968, is_deceased: true, generation: 3, birth_order: 3, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "29215fbc-31fe-4c08-a2d9-b5bff15ae942", full_name: "Phan Tấn Toản", gender: "male", birth_year: 1966, death_year: 1968, is_deceased: true, generation: 3, birth_order: 4, birth_place: "Tam Kì", occupation: null, phone: null, email: null, burial_place: "Tam Kì", note: null, photo_url: null },
  { id: "581ebb3a-c1d2-46bf-b87a-f98a8f2ef30c", full_name: "Nguyễn Minh Phàn", gender: "male", birth_year: 1958, death_year: 2019, is_deceased: true, generation: 3, birth_place: "Điện Bàn", occupation: null, phone: null, email: null, burial_place: "Điện Bàn - Quảng Nam", note: null, photo_url: null },
  { id: "789642c1-4cfc-43c4-a36e-2984fdcf38aa", full_name: "Nguyễn Minh Tuấn", gender: "male", birth_year: 1985, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "040fc6b7-cb65-430d-84a8-be8a7c805eac", full_name: "Nguyễn Minh Tuân", gender: "male", birth_year: 1991, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "e1749ebf-a5ef-4363-8b6c-1d61a004b784", full_name: "Phạm Thị Luyện", gender: "female", birth_year: 1962, death_year: null, is_deceased: false, generation: 3, birth_place: "Thăng Bình", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "f425d7d4-ebfd-4727-84b0-70193f0f2f9d", full_name: "Phan Tấn Khoa", gender: "male", birth_year: 1987, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "8dcb0002-f4bf-4d2c-aa78-20fb2796856a", full_name: "Phan Tấn Khánh", gender: "male", birth_year: 1989, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "071ce61e-cfff-44ec-8a57-9b3581a04d89", full_name: "Nguyễn Thị Thúy Kiều", gender: "female", birth_year: 1987, death_year: null, is_deceased: false, generation: 4, birth_place: "Duy Xuyên", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "5a3308ca-7dd3-4428-bf7e-fd077c82dafa", full_name: "Phan Minh Nhật", gender: "male", birth_year: 2016, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: "Bình Sơn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "0daaf76b-31b0-4d57-8551-f3872009867b", full_name: "Phan Vĩnh Ký", gender: "male", birth_year: 2017, death_year: null, is_deceased: false, generation: 5, birth_order: 2, birth_place: "Bình Sơn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "78070928-2ec5-451f-895f-b1d5a56839ca", full_name: "Trương Nguyễn Kim Sa", gender: "female", birth_year: 1990, death_year: null, is_deceased: false, generation: 4, birth_place: "Hội An", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "22521210-91be-4983-b122-8ffe8f7ac825", full_name: "Phan Ngọc Diệp", gender: "female", birth_year: 2017, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: "Bình Sơn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "348e42a6-18c7-4eb0-a51c-d554f95b94eb", full_name: "Trịnh Tấn Ban (Khoa Luân)", gender: "male", birth_year: 1950, death_year: 2009, is_deceased: true, generation: 3, birth_order: 1, birth_place: "Bình Sơn,Thăng Bình,Quảng Nam", occupation: null, phone: null, email: null, burial_place: "Nghĩa Thành,Châu Đức, Bà Rịa Vũng Tàu", note: null, photo_url: null },
  { id: "39408911-64be-4fc1-b039-973ea5341327", full_name: "Đặng Lý", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "5a7530a6-21ea-4d2f-a804-b2b9cf0e6427", full_name: "Đặng Thị Phụng", gender: "female", birth_year: null, death_year: null, is_deceased: true, generation: 3, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "60acde25-035a-4b1a-9617-fb3a2fff86c3", full_name: "Đặng Văn Sự", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 3, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "00a0687e-89c1-4f70-b45f-0157b6b43253", full_name: "Đặng Văn Thành", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 3, birth_order: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "98918fe0-8ee7-4f1f-ac84-4ada299ead63", full_name: "Huỳnh Thị Cẩm", gender: "female", birth_year: null, death_year: null, is_deceased: true, generation: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "7b05d072-6d47-4871-97d6-ad0d4bac509f", full_name: "Phan Thanh Hoài", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 3, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "65c76052-3ef7-468c-ba1a-9e9196812bd9", full_name: "Phan Thị Thanh Liên", gender: "female", birth_year: 1957, death_year: null, is_deceased: false, generation: 3, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "9badc2e0-e267-4e66-be39-e19db74d9dee", full_name: "Dương Văn Minh", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "1eb9cd0a-1300-4f5e-b767-91938e5af8c1", full_name: "Dương Văn Tường", gender: "male", birth_year: 1961, death_year: null, is_deceased: false, generation: 3, birth_order: 1, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "7ae8f1ff-941f-4fd3-a8ac-ffce1673b262", full_name: "Dương Thị Ba", gender: "female", birth_year: 1963, death_year: null, is_deceased: false, generation: 3, birth_order: 2, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "12bb73ac-073f-410e-b008-b86942b94e1a", full_name: "Trần Thùy", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 2, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "cd02a334-e3b1-4a28-9a7a-13b811805682", full_name: "Trần Thị Hóa", gender: "female", birth_year: 1975, death_year: null, is_deceased: false, generation: 3, birth_order: 3, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", full_name: "Nguyễn Thị Quyên", gender: "female", birth_year: 1922, death_year: 2001, is_deceased: true, generation: 2, birth_place: "Quế Thọ", occupation: null, phone: null, email: null, burial_place: "Sài gòn", note: null, photo_url: null },
  { id: "c95f63e4-a4e6-4089-8ee2-cd12ff428964", full_name: "Phan Thị Tân", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 3, birth_order: 6, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "af4b7f03-ef37-4395-a897-ccef767dbeec", full_name: "Phan Thị Ngọc Mai", gender: "female", birth_year: 1947, death_year: null, is_deceased: false, generation: 3, birth_order: 1, birth_place: "Thăng Phước - Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "39718b66-3c09-498c-b953-de6801d1f1ff", full_name: "Phan Thị Đương", gender: "female", birth_year: null, death_year: null, is_deceased: true, generation: 3, birth_order: 7, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "d4882b5d-4823-42ed-8178-d24cf1bc0160", full_name: "Phan Đình Chiến", gender: "male", birth_year: 1954, death_year: 1961, is_deceased: true, generation: 3, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: "Thăng Phước", note: null, photo_url: null },
  { id: "ed740a64-3f07-43f2-b176-a68670472478", full_name: "Phan Thị Thành", gender: "female", birth_year: 1957, death_year: 1961, is_deceased: true, generation: 3, birth_order: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: "Thăng Phước", note: null, photo_url: null },
  { id: "aa1ad514-af79-4e57-8ece-f4b54191a38a", full_name: "Phan Tấn Hồng", gender: "male", birth_year: 1959, death_year: null, is_deceased: false, generation: 3, birth_order: 4, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "01a4773a-bd49-4c83-9f7b-9aa593410413", full_name: "Phan Tấn Phúc", gender: "male", birth_year: 1962, death_year: null, is_deceased: false, generation: 3, birth_order: 5, birth_place: "Thăng Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "43a39dd9-2861-4322-8c5c-8bb96b88b0e4", full_name: "Nguyễn Thị Cẩm Hiền", gender: "female", birth_year: 1993, death_year: null, is_deceased: false, generation: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "086a5a1d-5605-4727-a938-66226befae84", full_name: "Phan Tấn Bảo Thạnh", gender: "male", birth_year: 2018, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "54744268-f17c-49ca-99e8-4f553d229da5", full_name: "Phan Tấn Nguyên Thảo", gender: "male", birth_year: 2018, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "451604ca-deef-49e5-ae08-edcaa208157a", full_name: "Lê Thị Mỹ Hiếu", gender: "female", birth_year: 1982, death_year: null, is_deceased: false, generation: 3, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "4ad8c18b-c1a9-4610-bca9-0b2f27917c6e", full_name: "Phan Tấn Thuận", gender: "male", birth_year: 2009, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "9b88f174-5cc2-455d-ab80-533ca53f129b", full_name: "Phan Mỹ Duyên", gender: "female", birth_year: 2014, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "5c62dcc0-673a-4655-adf4-c767387b9611", full_name: "Phan Tấn Ba", gender: "male", birth_year: null, death_year: 1970, is_deceased: true, generation: 3, birth_order: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "17024aca-b70c-4a73-8605-c0cc065547f7", full_name: "Phan Thị Bốn", gender: "female", birth_year: null, death_year: 1970, is_deceased: true, generation: 3, birth_order: 4, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "2cc959f5-f715-4b98-8979-9debe5c88677", full_name: "Ngô Thị Hội", gender: "female", birth_year: 1953, death_year: null, is_deceased: false, generation: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "d858deac-436c-4055-8857-8e5a00b3c378", full_name: "Trịnh Tấn Ngô Quang Hiệp", gender: "male", birth_year: 1978, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "9d029845-3688-4a38-afab-9656d7481fcc", full_name: "Trịnh Tấn Ngô Minh Quốc", gender: "male", birth_year: 1981, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "3b11d16d-8db9-40d7-9a94-a38daa8a79e7", full_name: "Trịnh Ngô Minh Chính", gender: "female", birth_year: 1983, death_year: null, is_deceased: false, generation: 4, birth_order: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "9ac9439a-999b-4a52-ba49-bc80230f3ee9", full_name: "Trịnh Ngô Minh Tâm", gender: "female", birth_year: 1986, death_year: null, is_deceased: false, generation: 4, birth_order: 4, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "553fe1e3-0c1b-4f15-be1e-de289fd0953d", full_name: "Trịnh Tấn Ngô Minh Trường", gender: "male", birth_year: 1990, death_year: null, is_deceased: false, generation: 4, birth_order: 5, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "d8ade8ea-f9ae-4806-9ebf-c7ccc75859c4", full_name: "Nguyễn Thị Khuyên", gender: "female", birth_year: 1985, death_year: null, is_deceased: false, generation: 4, birth_place: "Hà Tĩnh", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "9625d965-81c7-43a2-a677-aea3625de8a2", full_name: "Nguyễn Minh Thọ", gender: "male", birth_year: 1978, death_year: null, is_deceased: false, generation: 4, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "3f4c7a88-4ad3-48ca-8317-f1208c71e5d7", full_name: "Trịnh Tấn Chương", gender: "male", birth_year: 1930, death_year: null, is_deceased: true, generation: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "02550b8b-1c09-454b-a6ac-30eb2702db91", full_name: "Trịnh Tấn Hai", gender: "male", birth_year: 1953, death_year: 1965, is_deceased: true, generation: 3, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "4ae2dd46-cd0b-4212-adf8-207704867af9", full_name: "Trịnh Văn Pháp", gender: "male", birth_year: 1953, death_year: 1961, is_deceased: true, generation: 3, birth_order: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "af7ee767-1bf9-4abb-83f9-0b1d1ce5846c", full_name: "Nguyễn Chánh Thiện", gender: "male", birth_year: 2009, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "3f3024e5-58fb-47ea-9958-11139ed2586c", full_name: "Nguyễn Thị Phương Minh", gender: "female", birth_year: 2011, death_year: null, is_deceased: false, generation: 5, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "d1174d32-44bd-4b43-9942-548ef4abfdd2", full_name: "Nguyễn Minh Trí", gender: "male", birth_year: 2018, death_year: null, is_deceased: false, generation: 5, birth_order: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "f71aaf3b-d37a-43ba-8197-1bcc52347394", full_name: "Trịnh Tấn Nguyên Bảo", gender: "male", birth_year: 2007, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "6ac778ce-85d9-4a7b-9b2c-413c853fb84b", full_name: "Trần Văn Trường", gender: "male", birth_year: 1984, death_year: null, is_deceased: false, generation: 4, birth_place: "Thăng Bình -  Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "43430f7a-fb49-4ef7-9bcb-d7546b02b5e2", full_name: "Trần Đình Cường", gender: "male", birth_year: 1992, death_year: null, is_deceased: false, generation: 4, birth_order: 3, birth_place: "Bình Sơn - Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "2b9b542b-5977-42e2-8456-2c32d09c0db7", full_name: "Nguyễn Thị Thùy", gender: "female", birth_year: 1980, death_year: null, is_deceased: false, generation: 3, birth_place: "Bà Rịa Vũng Tàu", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "980da6b9-cd20-4710-b748-71649a868128", full_name: "Phan Hoàng Nhật Linh", gender: "female", birth_year: 2002, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "f11d886c-e221-4570-88d1-a7b0f867eb31", full_name: "Phan Nhật Vân Anh", gender: "female", birth_year: 2003, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "dc6d9f8d-0222-4bf0-a8ca-3263e1e73606", full_name: "Phan Hoàng Nhã Uyên", gender: "female", birth_year: 2013, death_year: 2022, is_deceased: true, generation: 4, birth_order: 3, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: "thăng phước", note: null, photo_url: null },
  { id: "ba8ccce9-9f22-4526-9b81-be4591a29fd6", full_name: "Tấn Lộc", gender: "male", birth_year: null, death_year: null, is_deceased: false, generation: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "3b882403-56bb-4eaa-b5fa-d1766e61e1de", full_name: "Tấn Đạt", gender: "male", birth_year: 2005, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Tam Kì", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "0f59d86b-44c1-47bf-8843-6d800b622a87", full_name: "Thỏ", gender: "female", birth_year: 2014, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "e8656ff9-65de-4ba2-8fc1-3a4143c8ad8a", full_name: "Nguyễn Hùng", gender: "male", birth_year: 1971, death_year: null, is_deceased: false, generation: 3, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "a532dccb-7b38-4605-9cc4-0c13916d330e", full_name: "Nguyễn Thành Trung", gender: "male", birth_year: 1997, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "4faa47c7-5e73-4619-b9ff-fa20d550b946", full_name: "Nguyễn Thành Tiến", gender: "male", birth_year: 1999, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "a59d1d10-6fd3-4d4c-b09b-d8b43e5641d9", full_name: "Nguyễn Xuân Hùng", gender: "male", birth_year: 1963, death_year: null, is_deceased: false, generation: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "abb0fa73-ff9f-4215-95de-97afbd6c1c1a", full_name: "Nguyễn Xuân Hưng", gender: "male", birth_year: 1987, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "0289193e-6860-4e26-92e2-d42dde678439", full_name: "Trần Thị Hường", gender: "female", birth_year: 1987, death_year: null, is_deceased: false, generation: 4, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "b8f0164c-a350-4f05-84db-7e58be23b555", full_name: "Nguyễn Trần Bảo Huy", gender: "male", birth_year: 2004, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "652db289-3104-4722-aa46-3ea904d11294", full_name: "Nguyễn Thị Bảo Hân", gender: "female", birth_year: 2014, death_year: null, is_deceased: false, generation: 5, birth_order: 2, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "e2419fa2-c000-405c-8e73-ccc665a020d8", full_name: "Nguyễn Xuân Hiếu", gender: "male", birth_year: 1990, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "ced99d18-c192-42ce-a4b7-3fa420f6feca", full_name: "Trần Thị Kiều Oanh", gender: "female", birth_year: 1990, death_year: null, is_deceased: false, generation: 4, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "cf94fd37-999c-405c-a5eb-b96740ba98ce", full_name: "Nguyễn Trần Nhã Uyên", gender: "female", birth_year: 2017, death_year: null, is_deceased: false, generation: 5, birth_order: 2, birth_place: "Bình Sơn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "ae8b559f-893a-4d2c-bd97-f60f9d9bd0d9", full_name: "Dương Thành Trí", gender: "male", birth_year: 1956, death_year: null, is_deceased: false, generation: 3, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "c0cc42e7-ce55-4210-ac1b-bdb9f6706d00", full_name: "Dương Thành Tuấn", gender: "male", birth_year: 1975, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "f3dbe4c8-1e7e-4673-ac01-221cf58b4ddb", full_name: "Lê Ánh Sáng", gender: "female", birth_year: 1985, death_year: null, is_deceased: false, generation: 4, birth_place: "Huế", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "3d926593-4cc1-4052-a948-1fd9cfe2b1e5", full_name: "Dương Thị Thủy", gender: "female", birth_year: 1980, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "e4831162-4f2d-4aec-bdac-4b33804940dd", full_name: "con 1", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "fdc63a62-f38d-43b6-8de3-8419da0e6466", full_name: "con 2", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 5, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "a89ebe39-9518-4482-9e25-ae7233d47acf", full_name: "con 3", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 5, birth_order: 3, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "be19f82f-b8e5-40d8-9b52-509d3dbff0d8", full_name: "chồng", gender: "male", birth_year: null, death_year: null, is_deceased: false, generation: 4, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "3d4200dd-d55a-4279-8958-dda4546fa821", full_name: "con 1", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "3a92fc57-9ab2-4090-a20e-815f306e0977", full_name: "con 2", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 5, birth_order: 2, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "53490c92-f64c-4887-afc4-874e22a8f4b2", full_name: "Dương Thị Thảo", gender: "female", birth_year: 1987, death_year: null, is_deceased: false, generation: 4, birth_order: 3, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "4e3fbd1b-cf49-4360-818a-93e6a4e49150", full_name: "Trần Nhân", gender: "male", birth_year: 1987, death_year: null, is_deceased: false, generation: 4, birth_place: "Huế", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "0aa34c78-0e3a-4bab-bf3f-65601303ff3c", full_name: "con gái", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "abf3452f-3b08-4ec5-b98f-45ef252eb5db", full_name: "Phan Thùy Dương", gender: "female", birth_year: 2019, death_year: null, is_deceased: false, generation: 5, birth_order: 2, birth_place: "Đà Nẵng", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "a52a5d20-5e76-4a92-9ed4-25ae24d0fd9a", full_name: "Trần Châu", gender: "male", birth_year: null, death_year: null, is_deceased: true, generation: 3, birth_place: "Phước Hà - Tiên Phước", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "a5765e1b-b677-4ef0-b6af-c93a0e871e03", full_name: "Trần Hùng", gender: "male", birth_year: 1964, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "4cbb4732-19ec-44f9-8545-afc2849014c4", full_name: "Trần Văn Chung", gender: "male", birth_year: 1967, death_year: null, is_deceased: true, generation: 4, birth_order: 2, birth_place: "Tam Kì", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "5800f5a9-fe1c-4f43-8416-ae8b26d1c8f5", full_name: "Phan Mai Biên Phi", gender: "male", birth_year: 1972, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "918c47a3-6c77-44fd-85c8-5d4e97b890aa", full_name: "Trịnh Thị Hằng", gender: "female", birth_year: 1972, death_year: null, is_deceased: false, generation: 4, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "637b8062-4411-4133-90fe-597d0409881e", full_name: "Phan Tấn Đức Anh", gender: "male", birth_year: null, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "2f98a8cf-c3bc-4b44-8856-c9223efcbd75", full_name: "Phan Tấn Đức Em", gender: "male", birth_year: null, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "4e6363e8-984b-4b37-bdf4-e4a15a5d0353", full_name: "Đoàn Khánh Hoài", gender: "female", birth_year: 1962, death_year: null, is_deceased: false, generation: 3, birth_place: "Miền Bắc", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "cf90d775-227c-4a12-ab7a-b2ae9ce2f61b", full_name: "Nguyễn Thị Phượng", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 3, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "7409f9e6-8cf4-4a4d-b816-ef2ccb837cc6", full_name: "Huỳnh Thị Đồ", gender: "female", birth_year: 1960, death_year: null, is_deceased: false, generation: 3, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "64590a0b-0ab4-4b00-b992-b97ce445bd38", full_name: "Phan Huỳnh Phước Tiên", gender: "female", birth_year: 1980, death_year: null, is_deceased: false, generation: 4, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "ea4195b1-3445-431e-a133-8f335d827c4d", full_name: "Phan Tấn Hồng Anh", gender: "male", birth_year: null, death_year: null, is_deceased: false, generation: 4, birth_order: 2, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "0cb7d51f-6c1f-422f-9106-2388f0dcf774", full_name: "Phan Thị Thảo", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 4, birth_order: 3, birth_place: "Sài Gòn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "1c786d79-3b3c-478a-ae44-782b35d9865f", full_name: "Phan Thị Duyên", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 4, birth_order: 4, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "b0692cca-ec38-4969-89bc-11920b66fb54", full_name: "Con 4", gender: "female", birth_year: null, death_year: null, is_deceased: false, generation: 4, birth_order: 5, birth_place: null, occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "429f439c-8f84-4376-af0c-46c019bf8d98", full_name: "Trần Quang Bình", gender: "male", birth_year: 2020, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: "đà nẵng", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "a9fd5362-3e2c-4c28-89dc-09119c9fea7e", full_name: "Nguyễn Thị Hạnh Duyên", gender: "female", birth_year: 1996, death_year: null, is_deceased: false, generation: 4, birth_place: "bình tú, Thăng Bình", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "bc39a916-60f4-4640-a124-2b07f2cc124c", full_name: "Trần Ngọc Linh San", gender: "female", birth_year: 2023, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "523174eb-a7c1-447f-9914-33bdb7e0f3f4", full_name: "Maxwell Connelly", gender: "male", birth_year: null, death_year: null, is_deceased: false, generation: 4, birth_place: "ÚC", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "2c6f95cd-0064-4cc3-b8e4-41fcf5c191e6", full_name: "Nhã Uyên", gender: "female", birth_year: 2023, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: "úc", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "843d3f4d-bce5-4231-92d6-4edf84925361", full_name: "Nguyễn Nhi", gender: "female", birth_year: 2004, death_year: null, is_deceased: false, generation: 5, birth_place: "Quế Sơn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "407e7de2-5d86-4572-9110-816ca46ec337", full_name: "Nguyễn Trần Đăng Khoa", gender: "male", birth_year: 2023, death_year: null, is_deceased: false, generation: 6, birth_order: 1, birth_place: "Hiệp Đức", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "c9bf783d-8386-4b0c-8465-7bda10026be0", full_name: "Nguyễn Trần Gia Bảo", gender: "male", birth_year: 2014, death_year: 2014, is_deceased: true, generation: 5, birth_order: 1, birth_place: "Bình Sơn", occupation: null, phone: null, email: null, burial_place: "Bình Sơn", note: null, photo_url: null },
  { id: "e128e639-94df-4348-a826-391b3023f333", full_name: "Nguyễn Lan Anh", gender: "female", birth_year: 2000, death_year: null, is_deceased: false, generation: 4, birth_place: "Quế Sơn", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "8e444b7d-0c5d-41be-b832-e3ecdbb0a13a", full_name: "Nguyễn Thành Luân", gender: "male", birth_year: 2024, death_year: null, is_deceased: false, generation: 5, birth_order: 1, birth_place: "Quảng Nam", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
  { id: "8fda2623-aff6-4196-8d72-502c28339c79", full_name: "Trần Quang Vĩnh", gender: "male", birth_year: 2025, death_year: null, is_deceased: false, generation: 5, birth_order: 2, birth_place: "Đà Nẵng", occupation: null, phone: null, email: null, burial_place: null, note: null, photo_url: null },
];

const RELATIONSHIPS = [
  { id: "r1", type: "marriage", person_a: "6ac778ce-85d9-4a7b-9b2c-413c853fb84b", person_b: "89c85b59-43ce-48d7-96e9-8a5823d4298c" },
  { id: "r2", type: "marriage", person_a: "2cc959f5-f715-4b98-8979-9debe5c88677", person_b: "348e42a6-18c7-4eb0-a51c-d554f95b94eb" },
  { id: "r3", type: "marriage", person_a: "581ebb3a-c1d2-46bf-b87a-f98a8f2ef30c", person_b: "756838cd-6c03-4c90-8ab3-5a91df3f759f" },
  { id: "r4", type: "marriage", person_a: "7409f9e6-8cf4-4a4d-b816-ef2ccb837cc6", person_b: "aa1ad514-af79-4e57-8ece-f4b54191a38a" },
  { id: "r5", type: "marriage", person_a: "099f5a9d-9d48-4262-9d13-063fcb9ea88b", person_b: "e1749ebf-a5ef-4363-8b6c-1d61a004b784" },
  { id: "r6", type: "marriage", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "92f2085d-8f4c-40c9-9809-34c02c20ea89" },
  { id: "r7", type: "marriage", person_a: "071ce61e-cfff-44ec-8a57-9b3581a04d89", person_b: "f425d7d4-ebfd-4727-84b0-70193f0f2f9d" },
  { id: "r8", type: "marriage", person_a: "cd02a334-e3b1-4a28-9a7a-13b811805682", person_b: "e8656ff9-65de-4ba2-8fc1-3a4143c8ad8a" },
  { id: "r9", type: "marriage", person_a: "01a4773a-bd49-4c83-9f7b-9aa593410413", person_b: "4e6363e8-984b-4b37-bdf4-e4a15a5d0353" },
  { id: "r10", type: "marriage", person_a: "12bb73ac-073f-410e-b008-b86942b94e1a", person_b: "821ab95d-ed57-48f6-afb1-e8af34de163c" },
  { id: "r11", type: "marriage", person_a: "3b11d16d-8db9-40d7-9a94-a38daa8a79e7", person_b: "9625d965-81c7-43a2-a677-aea3625de8a2" },
  { id: "r12", type: "marriage", person_a: "78070928-2ec5-451f-895f-b1d5a56839ca", person_b: "8dcb0002-f4bf-4d2c-aa78-20fb2796856a" },
  { id: "r13", type: "marriage", person_a: "08856e9c-ed1f-4c12-8bcc-38445d0bb17d", person_b: "451604ca-deef-49e5-ae08-edcaa208157a" },
  { id: "r14", type: "marriage", person_a: "7ae8f1ff-941f-4fd3-a8ac-ffce1673b262", person_b: "a59d1d10-6fd3-4d4c-b09b-d8b43e5641d9" },
  { id: "r15", type: "marriage", person_a: "aaeaaaa5-1f23-4608-9731-731b0c699b0f", person_b: "ba8ccce9-9f22-4526-9b81-be4591a29fd6" },
  { id: "r16", type: "marriage", person_a: "ced99d18-c192-42ce-a4b7-3fa420f6feca", person_b: "e2419fa2-c000-405c-8e73-ccc665a020d8" },
  { id: "r17", type: "marriage", person_a: "523174eb-a7c1-447f-9914-33bdb7e0f3f4", person_b: "980da6b9-cd20-4710-b748-71649a868128" },
  { id: "r18", type: "marriage", person_a: "43430f7a-fb49-4ef7-9bcb-d7546b02b5e2", person_b: "a9fd5362-3e2c-4c28-89dc-09119c9fea7e" },
  { id: "r19", type: "marriage", person_a: "821ab95d-ed57-48f6-afb1-e8af34de163c", person_b: "9badc2e0-e267-4e66-be39-e19db74d9dee" },
  { id: "r20", type: "marriage", person_a: "0b773b3c-8c2d-48c3-be13-12abced62315", person_b: "9f594e50-729a-49a4-b3f4-5c661556f706" },
  { id: "r21", type: "marriage", person_a: "a532dccb-7b38-4605-9cc4-0c13916d330e", person_b: "e128e639-94df-4348-a826-391b3023f333" },
  { id: "r22", type: "marriage", person_a: "4e3fbd1b-cf49-4360-818a-93e6a4e49150", person_b: "53490c92-f64c-4887-afc4-874e22a8f4b2" },
  { id: "r23", type: "marriage", person_a: "65c76052-3ef7-468c-ba1a-9e9196812bd9", person_b: "ae8b559f-893a-4d2c-bd97-f60f9d9bd0d9" },
  { id: "r24", type: "marriage", person_a: "3d926593-4cc1-4052-a948-1fd9cfe2b1e5", person_b: "be19f82f-b8e5-40d8-9b52-509d3dbff0d8" },
  { id: "r25", type: "marriage", person_a: "9d029845-3688-4a38-afab-9656d7481fcc", person_b: "d8ade8ea-f9ae-4806-9ebf-c7ccc75859c4" },
  { id: "r26", type: "marriage", person_a: "2b9b542b-5977-42e2-8456-2c32d09c0db7", person_b: "ad87a8ad-6be8-4ad6-b155-ece7c3990acb" },
  { id: "r27", type: "marriage", person_a: "981a5871-bed1-42d0-9f15-b6acebe3d7e8", person_b: "fc127f9b-953b-427b-9fac-bf87d7d8cc0f" },
  { id: "r28", type: "marriage", person_a: "c0cc42e7-ce55-4210-ac1b-bdb9f6706d00", person_b: "f3dbe4c8-1e7e-4673-ac01-221cf58b4ddb" },
  { id: "r29", type: "marriage", person_a: "aa1ad514-af79-4e57-8ece-f4b54191a38a", person_b: "cf90d775-227c-4a12-ab7a-b2ae9ce2f61b" },
  { id: "r30", type: "marriage", person_a: "01dba837-b24f-4152-b65d-1c341d744cd6", person_b: "1fcef043-b4d7-47ee-abd6-a875a09a4204" },
  { id: "r31", type: "marriage", person_a: "5800f5a9-fe1c-4f43-8416-ae8b26d1c8f5", person_b: "918c47a3-6c77-44fd-85c8-5d4e97b890aa" },
  { id: "r32", type: "marriage", person_a: "3f4c7a88-4ad3-48ca-8317-f1208c71e5d7", person_b: "cb374b0c-5895-4174-a63c-023a7ed56ca7" },
  { id: "r33", type: "marriage", person_a: "a52a5d20-5e76-4a92-9ed4-25ae24d0fd9a", person_b: "c95f63e4-a4e6-4089-8ee2-cd12ff428964" },
  { id: "r34", type: "marriage", person_a: "843d3f4d-bce5-4231-92d6-4edf84925361", person_b: "b8f0164c-a350-4f05-84db-7e58be23b555" },
  { id: "r35", type: "marriage", person_a: "0289193e-6860-4e26-92e2-d42dde678439", person_b: "abb0fa73-ff9f-4215-95de-97afbd6c1c1a" },
  { id: "r36", type: "marriage", person_a: "68067fe9-a5da-43b6-9c0e-d71c40cf6df1", person_b: "98918fe0-8ee7-4f1f-ac84-4ada299ead63" },
  { id: "r37", type: "marriage", person_a: "0a88d955-c48c-438c-ac29-1c341c1b9fb5", person_b: "43a39dd9-2861-4322-8c5c-8bb96b88b0e4" },
  { id: "r38", type: "marriage", person_a: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", person_b: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7" },
  { id: "r39", type: "marriage", person_a: "39408911-64be-4fc1-b039-973ea5341327", person_b: "c1d21d19-59d4-4960-b536-2f78929d7be5" },
  { id: "r40", type: "marriage", person_a: "3b4d22a9-3cd5-4187-bfca-1f9c04d59998", person_b: "9c2bb029-5293-4a5c-98fe-8403c9afc813" },
  { id: "r41", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7" },
  { id: "r42", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "9f594e50-729a-49a4-b3f4-5c661556f706" },
  { id: "r43", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "cb374b0c-5895-4174-a63c-023a7ed56ca7" },
  { id: "r44", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "c1d21d19-59d4-4960-b536-2f78929d7be5" },
  { id: "r45", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "981a5871-bed1-42d0-9f15-b6acebe3d7e8" },
  { id: "r46", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "6a41b7bb-faae-4be7-b92b-4c20055363ee" },
  { id: "r47", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "c8e4167b-b67c-4898-8d5f-26b1426133e6" },
  { id: "r48", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "dca73201-019b-45ad-bbc0-f97b589c5d21" },
  { id: "r49", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "68067fe9-a5da-43b6-9c0e-d71c40cf6df1" },
  { id: "r50", type: "biological_child", person_a: "1fcef043-b4d7-47ee-abd6-a875a09a4204", person_b: "821ab95d-ed57-48f6-afb1-e8af34de163c" },
  { id: "r51", type: "biological_child", person_a: "01dba837-b24f-4152-b65d-1c341d744cd6", person_b: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7" },
  { id: "r52", type: "biological_child", person_a: "01dba837-b24f-4152-b65d-1c341d744cd6", person_b: "6a41b7bb-faae-4be7-b92b-4c20055363ee" },
  { id: "r53", type: "biological_child", person_a: "01dba837-b24f-4152-b65d-1c341d744cd6", person_b: "c8e4167b-b67c-4898-8d5f-26b1426133e6" },
  { id: "r54", type: "biological_child", person_a: "01dba837-b24f-4152-b65d-1c341d744cd6", person_b: "dca73201-019b-45ad-bbc0-f97b589c5d21" },
  { id: "r55", type: "biological_child", person_a: "92f2085d-8f4c-40c9-9809-34c02c20ea89", person_b: "9f594e50-729a-49a4-b3f4-5c661556f706" },
  { id: "r56", type: "biological_child", person_a: "92f2085d-8f4c-40c9-9809-34c02c20ea89", person_b: "cb374b0c-5895-4174-a63c-023a7ed56ca7" },
  { id: "r57", type: "biological_child", person_a: "92f2085d-8f4c-40c9-9809-34c02c20ea89", person_b: "c1d21d19-59d4-4960-b536-2f78929d7be5" },
  { id: "r58", type: "biological_child", person_a: "92f2085d-8f4c-40c9-9809-34c02c20ea89", person_b: "981a5871-bed1-42d0-9f15-b6acebe3d7e8" },
  { id: "r59", type: "biological_child", person_a: "92f2085d-8f4c-40c9-9809-34c02c20ea89", person_b: "68067fe9-a5da-43b6-9c0e-d71c40cf6df1" },
  { id: "r60", type: "biological_child", person_a: "92f2085d-8f4c-40c9-9809-34c02c20ea89", person_b: "821ab95d-ed57-48f6-afb1-e8af34de163c" },
  { id: "r61", type: "biological_child", person_a: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7", person_b: "af4b7f03-ef37-4395-a897-ccef767dbeec" },
  { id: "r62", type: "biological_child", person_a: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7", person_b: "d4882b5d-4823-42ed-8178-d24cf1bc0160" },
  { id: "r63", type: "biological_child", person_a: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7", person_b: "ed740a64-3f07-43f2-b176-a68670472478" },
  { id: "r64", type: "biological_child", person_a: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7", person_b: "aa1ad514-af79-4e57-8ece-f4b54191a38a" },
  { id: "r65", type: "biological_child", person_a: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7", person_b: "01a4773a-bd49-4c83-9f7b-9aa593410413" },
  { id: "r66", type: "biological_child", person_a: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7", person_b: "c95f63e4-a4e6-4089-8ee2-cd12ff428964" },
  { id: "r67", type: "biological_child", person_a: "8d5a8ed2-f070-4691-b2f1-ef9d95e325f7", person_b: "39718b66-3c09-498c-b953-de6801d1f1ff" },
  { id: "r68", type: "biological_child", person_a: "cb374b0c-5895-4174-a63c-023a7ed56ca7", person_b: "348e42a6-18c7-4eb0-a51c-d554f95b94eb" },
  { id: "r69", type: "biological_child", person_a: "cb374b0c-5895-4174-a63c-023a7ed56ca7", person_b: "02550b8b-1c09-454b-a6ac-30eb2702db91" },
  { id: "r70", type: "biological_child", person_a: "cb374b0c-5895-4174-a63c-023a7ed56ca7", person_b: "4ae2dd46-cd0b-4212-adf8-207704867af9" },
  { id: "r71", type: "biological_child", person_a: "c1d21d19-59d4-4960-b536-2f78929d7be5", person_b: "5a7530a6-21ea-4d2f-a804-b2b9cf0e6427" },
  { id: "r72", type: "biological_child", person_a: "c1d21d19-59d4-4960-b536-2f78929d7be5", person_b: "60acde25-035a-4b1a-9617-fb3a2fff86c3" },
  { id: "r73", type: "biological_child", person_a: "c1d21d19-59d4-4960-b536-2f78929d7be5", person_b: "00a0687e-89c1-4f70-b45f-0157b6b43253" },
  { id: "r74", type: "biological_child", person_a: "68067fe9-a5da-43b6-9c0e-d71c40cf6df1", person_b: "65c76052-3ef7-468c-ba1a-9e9196812bd9" },
  { id: "r75", type: "biological_child", person_a: "68067fe9-a5da-43b6-9c0e-d71c40cf6df1", person_b: "7b05d072-6d47-4871-97d6-ad0d4bac509f" },
  { id: "r76", type: "biological_child", person_a: "68067fe9-a5da-43b6-9c0e-d71c40cf6df1", person_b: "5c62dcc0-673a-4655-adf4-c767387b9611" },
  { id: "r77", type: "biological_child", person_a: "68067fe9-a5da-43b6-9c0e-d71c40cf6df1", person_b: "17024aca-b70c-4a73-8605-c0cc065547f7" },
  { id: "r78", type: "biological_child", person_a: "821ab95d-ed57-48f6-afb1-e8af34de163c", person_b: "1eb9cd0a-1300-4f5e-b767-91938e5af8c1" },
  { id: "r79", type: "biological_child", person_a: "821ab95d-ed57-48f6-afb1-e8af34de163c", person_b: "7ae8f1ff-941f-4fd3-a8ac-ffce1673b262" },
  { id: "r80", type: "biological_child", person_a: "821ab95d-ed57-48f6-afb1-e8af34de163c", person_b: "cd02a334-e3b1-4a28-9a7a-13b811805682" },
  { id: "r81", type: "biological_child", person_a: "981a5871-bed1-42d0-9f15-b6acebe3d7e8", person_b: "9c2bb029-5293-4a5c-98fe-8403c9afc813" },
  { id: "r82", type: "biological_child", person_a: "981a5871-bed1-42d0-9f15-b6acebe3d7e8", person_b: "ad87a8ad-6be8-4ad6-b155-ece7c3990acb" },
  { id: "r83", type: "biological_child", person_a: "981a5871-bed1-42d0-9f15-b6acebe3d7e8", person_b: "08856e9c-ed1f-4c12-8bcc-38445d0bb17d" },
  { id: "r84", type: "biological_child", person_a: "981a5871-bed1-42d0-9f15-b6acebe3d7e8", person_b: "aaeaaaa5-1f23-4608-9731-731b0c699b0f" },
  { id: "r85", type: "biological_child", person_a: "981a5871-bed1-42d0-9f15-b6acebe3d7e8", person_b: "0a88d955-c48c-438c-ac29-1c341c1b9fb5" },
  { id: "r86", type: "biological_child", person_a: "fc127f9b-953b-427b-9fac-bf87d7d8cc0f", person_b: "9c2bb029-5293-4a5c-98fe-8403c9afc813" },
  { id: "r87", type: "biological_child", person_a: "fc127f9b-953b-427b-9fac-bf87d7d8cc0f", person_b: "ad87a8ad-6be8-4ad6-b155-ece7c3990acb" },
  { id: "r88", type: "biological_child", person_a: "fc127f9b-953b-427b-9fac-bf87d7d8cc0f", person_b: "08856e9c-ed1f-4c12-8bcc-38445d0bb17d" },
  { id: "r89", type: "biological_child", person_a: "fc127f9b-953b-427b-9fac-bf87d7d8cc0f", person_b: "aaeaaaa5-1f23-4608-9731-731b0c699b0f" },
  { id: "r90", type: "biological_child", person_a: "fc127f9b-953b-427b-9fac-bf87d7d8cc0f", person_b: "0a88d955-c48c-438c-ac29-1c341c1b9fb5" },
  { id: "r91", type: "biological_child", person_a: "9c2bb029-5293-4a5c-98fe-8403c9afc813", person_b: "89c85b59-43ce-48d7-96e9-8a5823d4298c" },
  { id: "r92", type: "biological_child", person_a: "9c2bb029-5293-4a5c-98fe-8403c9afc813", person_b: "6f8f25bf-c20a-4a41-925b-ee5a7af9b874" },
  { id: "r93", type: "biological_child", person_a: "9c2bb029-5293-4a5c-98fe-8403c9afc813", person_b: "43430f7a-fb49-4ef7-9bcb-d7546b02b5e2" },
  { id: "r94", type: "biological_child", person_a: "ad87a8ad-6be8-4ad6-b155-ece7c3990acb", person_b: "980da6b9-cd20-4710-b748-71649a868128" },
  { id: "r95", type: "biological_child", person_a: "ad87a8ad-6be8-4ad6-b155-ece7c3990acb", person_b: "f11d886c-e221-4570-88d1-a7b0f867eb31" },
  { id: "r96", type: "biological_child", person_a: "ad87a8ad-6be8-4ad6-b155-ece7c3990acb", person_b: "dc6d9f8d-0222-4bf0-a8ca-3263e1e73606" },
  { id: "r97", type: "biological_child", person_a: "08856e9c-ed1f-4c12-8bcc-38445d0bb17d", person_b: "4ad8c18b-c1a9-4610-bca9-0b2f27917c6e" },
  { id: "r98", type: "biological_child", person_a: "08856e9c-ed1f-4c12-8bcc-38445d0bb17d", person_b: "9b88f174-5cc2-455d-ab80-533ca53f129b" },
  { id: "r99", type: "biological_child", person_a: "aaeaaaa5-1f23-4608-9731-731b0c699b0f", person_b: "3b882403-56bb-4eaa-b5fa-d1766e61e1de" },
  { id: "r100", type: "biological_child", person_a: "aaeaaaa5-1f23-4608-9731-731b0c699b0f", person_b: "0f59d86b-44c1-47bf-8843-6d800b622a87" },
  { id: "r101", type: "biological_child", person_a: "0a88d955-c48c-438c-ac29-1c341c1b9fb5", person_b: "086a5a1d-5605-4727-a938-66226befae84" },
  { id: "r102", type: "biological_child", person_a: "0a88d955-c48c-438c-ac29-1c341c1b9fb5", person_b: "54744268-f17c-49ca-99e8-4f553d229da5" },
  { id: "r103", type: "biological_child", person_a: "3b4d22a9-3cd5-4187-bfca-1f9c04d59998", person_b: "89c85b59-43ce-48d7-96e9-8a5823d4298c" },
  { id: "r104", type: "biological_child", person_a: "3b4d22a9-3cd5-4187-bfca-1f9c04d59998", person_b: "6f8f25bf-c20a-4a41-925b-ee5a7af9b874" },
  { id: "r105", type: "biological_child", person_a: "3b4d22a9-3cd5-4187-bfca-1f9c04d59998", person_b: "43430f7a-fb49-4ef7-9bcb-d7546b02b5e2" },
  { id: "r106", type: "biological_child", person_a: "89c85b59-43ce-48d7-96e9-8a5823d4298c", person_b: "429f439c-8f84-4376-af0c-46c019bf8d98" },
  { id: "r107", type: "biological_child", person_a: "89c85b59-43ce-48d7-96e9-8a5823d4298c", person_b: "8fda2623-aff6-4196-8d72-502c28339c79" },
  { id: "r108", type: "biological_child", person_a: "9f594e50-729a-49a4-b3f4-5c661556f706", person_b: "756838cd-6c03-4c90-8ab3-5a91df3f759f" },
  { id: "r109", type: "biological_child", person_a: "9f594e50-729a-49a4-b3f4-5c661556f706", person_b: "099f5a9d-9d48-4262-9d13-063fcb9ea88b" },
  { id: "r110", type: "biological_child", person_a: "9f594e50-729a-49a4-b3f4-5c661556f706", person_b: "fe75b0ae-fd43-4e0f-a754-137ed45a8b3d" },
  { id: "r111", type: "biological_child", person_a: "9f594e50-729a-49a4-b3f4-5c661556f706", person_b: "29215fbc-31fe-4c08-a2d9-b5bff15ae942" },
  { id: "r112", type: "biological_child", person_a: "9f594e50-729a-49a4-b3f4-5c661556f706", person_b: "f659a210-8101-4833-a36f-41f3ae8e21d9" },
  { id: "r113", type: "biological_child", person_a: "0b773b3c-8c2d-48c3-be13-12abced62315", person_b: "756838cd-6c03-4c90-8ab3-5a91df3f759f" },
  { id: "r114", type: "biological_child", person_a: "0b773b3c-8c2d-48c3-be13-12abced62315", person_b: "099f5a9d-9d48-4262-9d13-063fcb9ea88b" },
  { id: "r115", type: "biological_child", person_a: "0b773b3c-8c2d-48c3-be13-12abced62315", person_b: "fe75b0ae-fd43-4e0f-a754-137ed45a8b3d" },
  { id: "r116", type: "biological_child", person_a: "0b773b3c-8c2d-48c3-be13-12abced62315", person_b: "29215fbc-31fe-4c08-a2d9-b5bff15ae942" },
  { id: "r117", type: "biological_child", person_a: "0b773b3c-8c2d-48c3-be13-12abced62315", person_b: "f659a210-8101-4833-a36f-41f3ae8e21d9" },
  { id: "r118", type: "biological_child", person_a: "756838cd-6c03-4c90-8ab3-5a91df3f759f", person_b: "789642c1-4cfc-43c4-a36e-2984fdcf38aa" },
  { id: "r119", type: "biological_child", person_a: "756838cd-6c03-4c90-8ab3-5a91df3f759f", person_b: "040fc6b7-cb65-430d-84a8-be8a7c805eac" },
  { id: "r120", type: "biological_child", person_a: "099f5a9d-9d48-4262-9d13-063fcb9ea88b", person_b: "f425d7d4-ebfd-4727-84b0-70193f0f2f9d" },
  { id: "r121", type: "biological_child", person_a: "099f5a9d-9d48-4262-9d13-063fcb9ea88b", person_b: "8dcb0002-f4bf-4d2c-aa78-20fb2796856a" },
  { id: "r122", type: "biological_child", person_a: "581ebb3a-c1d2-46bf-b87a-f98a8f2ef30c", person_b: "789642c1-4cfc-43c4-a36e-2984fdcf38aa" },
  { id: "r123", type: "biological_child", person_a: "581ebb3a-c1d2-46bf-b87a-f98a8f2ef30c", person_b: "040fc6b7-cb65-430d-84a8-be8a7c805eac" },
  { id: "r124", type: "biological_child", person_a: "e1749ebf-a5ef-4363-8b6c-1d61a004b784", person_b: "f425d7d4-ebfd-4727-84b0-70193f0f2f9d" },
  { id: "r125", type: "biological_child", person_a: "e1749ebf-a5ef-4363-8b6c-1d61a004b784", person_b: "8dcb0002-f4bf-4d2c-aa78-20fb2796856a" },
  { id: "r126", type: "biological_child", person_a: "f425d7d4-ebfd-4727-84b0-70193f0f2f9d", person_b: "5a3308ca-7dd3-4428-bf7e-fd077c82dafa" },
  { id: "r127", type: "biological_child", person_a: "f425d7d4-ebfd-4727-84b0-70193f0f2f9d", person_b: "0daaf76b-31b0-4d57-8551-f3872009867b" },
  { id: "r128", type: "biological_child", person_a: "8dcb0002-f4bf-4d2c-aa78-20fb2796856a", person_b: "22521210-91be-4983-b122-8ffe8f7ac825" },
  { id: "r129", type: "biological_child", person_a: "8dcb0002-f4bf-4d2c-aa78-20fb2796856a", person_b: "abf3452f-3b08-4ec5-b98f-45ef252eb5db" },
  { id: "r130", type: "biological_child", person_a: "071ce61e-cfff-44ec-8a57-9b3581a04d89", person_b: "5a3308ca-7dd3-4428-bf7e-fd077c82dafa" },
  { id: "r131", type: "biological_child", person_a: "071ce61e-cfff-44ec-8a57-9b3581a04d89", person_b: "0daaf76b-31b0-4d57-8551-f3872009867b" },
  { id: "r132", type: "biological_child", person_a: "78070928-2ec5-451f-895f-b1d5a56839ca", person_b: "22521210-91be-4983-b122-8ffe8f7ac825" },
  { id: "r133", type: "biological_child", person_a: "78070928-2ec5-451f-895f-b1d5a56839ca", person_b: "abf3452f-3b08-4ec5-b98f-45ef252eb5db" },
  { id: "r134", type: "biological_child", person_a: "348e42a6-18c7-4eb0-a51c-d554f95b94eb", person_b: "d858deac-436c-4055-8857-8e5a00b3c378" },
  { id: "r135", type: "biological_child", person_a: "348e42a6-18c7-4eb0-a51c-d554f95b94eb", person_b: "9d029845-3688-4a38-afab-9656d7481fcc" },
  { id: "r136", type: "biological_child", person_a: "348e42a6-18c7-4eb0-a51c-d554f95b94eb", person_b: "3b11d16d-8db9-40d7-9a94-a38daa8a79e7" },
  { id: "r137", type: "biological_child", person_a: "348e42a6-18c7-4eb0-a51c-d554f95b94eb", person_b: "9ac9439a-999b-4a52-ba49-bc80230f3ee9" },
  { id: "r138", type: "biological_child", person_a: "348e42a6-18c7-4eb0-a51c-d554f95b94eb", person_b: "553fe1e3-0c1b-4f15-be1e-de289fd0953d" },
  { id: "r139", type: "biological_child", person_a: "39408911-64be-4fc1-b039-973ea5341327", person_b: "5a7530a6-21ea-4d2f-a804-b2b9cf0e6427" },
  { id: "r140", type: "biological_child", person_a: "39408911-64be-4fc1-b039-973ea5341327", person_b: "60acde25-035a-4b1a-9617-fb3a2fff86c3" },
  { id: "r141", type: "biological_child", person_a: "39408911-64be-4fc1-b039-973ea5341327", person_b: "00a0687e-89c1-4f70-b45f-0157b6b43253" },
  { id: "r142", type: "biological_child", person_a: "98918fe0-8ee7-4f1f-ac84-4ada299ead63", person_b: "65c76052-3ef7-468c-ba1a-9e9196812bd9" },
  { id: "r143", type: "biological_child", person_a: "98918fe0-8ee7-4f1f-ac84-4ada299ead63", person_b: "7b05d072-6d47-4871-97d6-ad0d4bac509f" },
  { id: "r144", type: "biological_child", person_a: "98918fe0-8ee7-4f1f-ac84-4ada299ead63", person_b: "5c62dcc0-673a-4655-adf4-c767387b9611" },
  { id: "r145", type: "biological_child", person_a: "98918fe0-8ee7-4f1f-ac84-4ada299ead63", person_b: "17024aca-b70c-4a73-8605-c0cc065547f7" },
  { id: "r146", type: "biological_child", person_a: "65c76052-3ef7-468c-ba1a-9e9196812bd9", person_b: "c0cc42e7-ce55-4210-ac1b-bdb9f6706d00" },
  { id: "r147", type: "biological_child", person_a: "65c76052-3ef7-468c-ba1a-9e9196812bd9", person_b: "3d926593-4cc1-4052-a948-1fd9cfe2b1e5" },
  { id: "r148", type: "biological_child", person_a: "65c76052-3ef7-468c-ba1a-9e9196812bd9", person_b: "53490c92-f64c-4887-afc4-874e22a8f4b2" },
  { id: "r149", type: "biological_child", person_a: "9badc2e0-e267-4e66-be39-e19db74d9dee", person_b: "1eb9cd0a-1300-4f5e-b767-91938e5af8c1" },
  { id: "r150", type: "biological_child", person_a: "9badc2e0-e267-4e66-be39-e19db74d9dee", person_b: "7ae8f1ff-941f-4fd3-a8ac-ffce1673b262" },
  { id: "r151", type: "biological_child", person_a: "7ae8f1ff-941f-4fd3-a8ac-ffce1673b262", person_b: "abb0fa73-ff9f-4215-95de-97afbd6c1c1a" },
  { id: "r152", type: "biological_child", person_a: "7ae8f1ff-941f-4fd3-a8ac-ffce1673b262", person_b: "e2419fa2-c000-405c-8e73-ccc665a020d8" },
  { id: "r153", type: "biological_child", person_a: "12bb73ac-073f-410e-b008-b86942b94e1a", person_b: "cd02a334-e3b1-4a28-9a7a-13b811805682" },
  { id: "r154", type: "biological_child", person_a: "cd02a334-e3b1-4a28-9a7a-13b811805682", person_b: "a532dccb-7b38-4605-9cc4-0c13916d330e" },
  { id: "r155", type: "biological_child", person_a: "cd02a334-e3b1-4a28-9a7a-13b811805682", person_b: "4faa47c7-5e73-4619-b9ff-fa20d550b946" },
  { id: "r156", type: "biological_child", person_a: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", person_b: "af4b7f03-ef37-4395-a897-ccef767dbeec" },
  { id: "r157", type: "biological_child", person_a: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", person_b: "d4882b5d-4823-42ed-8178-d24cf1bc0160" },
  { id: "r158", type: "biological_child", person_a: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", person_b: "ed740a64-3f07-43f2-b176-a68670472478" },
  { id: "r159", type: "biological_child", person_a: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", person_b: "aa1ad514-af79-4e57-8ece-f4b54191a38a" },
  { id: "r160", type: "biological_child", person_a: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", person_b: "01a4773a-bd49-4c83-9f7b-9aa593410413" },
  { id: "r161", type: "biological_child", person_a: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", person_b: "c95f63e4-a4e6-4089-8ee2-cd12ff428964" },
  { id: "r162", type: "biological_child", person_a: "1f7ec882-a91d-4d73-8b4a-541fa7fcff97", person_b: "39718b66-3c09-498c-b953-de6801d1f1ff" },
  { id: "r163", type: "biological_child", person_a: "c95f63e4-a4e6-4089-8ee2-cd12ff428964", person_b: "a5765e1b-b677-4ef0-b6af-c93a0e871e03" },
  { id: "r164", type: "biological_child", person_a: "c95f63e4-a4e6-4089-8ee2-cd12ff428964", person_b: "4cbb4732-19ec-44f9-8545-afc2849014c4" },
  { id: "r165", type: "biological_child", person_a: "af4b7f03-ef37-4395-a897-ccef767dbeec", person_b: "5800f5a9-fe1c-4f43-8416-ae8b26d1c8f5" },
  { id: "r166", type: "biological_child", person_a: "aa1ad514-af79-4e57-8ece-f4b54191a38a", person_b: "64590a0b-0ab4-4b00-b992-b97ce445bd38" },
  { id: "r167", type: "biological_child", person_a: "aa1ad514-af79-4e57-8ece-f4b54191a38a", person_b: "ea4195b1-3445-431e-a133-8f335d827c4d" },
  { id: "r168", type: "biological_child", person_a: "aa1ad514-af79-4e57-8ece-f4b54191a38a", person_b: "0cb7d51f-6c1f-422f-9106-2388f0dcf774" },
  { id: "r169", type: "biological_child", person_a: "aa1ad514-af79-4e57-8ece-f4b54191a38a", person_b: "1c786d79-3b3c-478a-ae44-782b35d9865f" },
  { id: "r170", type: "biological_child", person_a: "aa1ad514-af79-4e57-8ece-f4b54191a38a", person_b: "b0692cca-ec38-4969-89bc-11920b66fb54" },
  { id: "r171", type: "biological_child", person_a: "01a4773a-bd49-4c83-9f7b-9aa593410413", person_b: "637b8062-4411-4133-90fe-597d0409881e" },
  { id: "r172", type: "biological_child", person_a: "01a4773a-bd49-4c83-9f7b-9aa593410413", person_b: "2f98a8cf-c3bc-4b44-8856-c9223efcbd75" },
  { id: "r173", type: "biological_child", person_a: "43a39dd9-2861-4322-8c5c-8bb96b88b0e4", person_b: "086a5a1d-5605-4727-a938-66226befae84" },
  { id: "r174", type: "biological_child", person_a: "43a39dd9-2861-4322-8c5c-8bb96b88b0e4", person_b: "54744268-f17c-49ca-99e8-4f553d229da5" },
  { id: "r175", type: "biological_child", person_a: "451604ca-deef-49e5-ae08-edcaa208157a", person_b: "4ad8c18b-c1a9-4610-bca9-0b2f27917c6e" },
  { id: "r176", type: "biological_child", person_a: "451604ca-deef-49e5-ae08-edcaa208157a", person_b: "9b88f174-5cc2-455d-ab80-533ca53f129b" },
  { id: "r177", type: "biological_child", person_a: "2cc959f5-f715-4b98-8979-9debe5c88677", person_b: "d858deac-436c-4055-8857-8e5a00b3c378" },
  { id: "r178", type: "biological_child", person_a: "2cc959f5-f715-4b98-8979-9debe5c88677", person_b: "9d029845-3688-4a38-afab-9656d7481fcc" },
  { id: "r179", type: "biological_child", person_a: "2cc959f5-f715-4b98-8979-9debe5c88677", person_b: "3b11d16d-8db9-40d7-9a94-a38daa8a79e7" },
  { id: "r180", type: "biological_child", person_a: "2cc959f5-f715-4b98-8979-9debe5c88677", person_b: "9ac9439a-999b-4a52-ba49-bc80230f3ee9" },
  { id: "r181", type: "biological_child", person_a: "2cc959f5-f715-4b98-8979-9debe5c88677", person_b: "553fe1e3-0c1b-4f15-be1e-de289fd0953d" },
  { id: "r182", type: "biological_child", person_a: "9d029845-3688-4a38-afab-9656d7481fcc", person_b: "f71aaf3b-d37a-43ba-8197-1bcc52347394" },
  { id: "r183", type: "biological_child", person_a: "3b11d16d-8db9-40d7-9a94-a38daa8a79e7", person_b: "af7ee767-1bf9-4abb-83f9-0b1d1ce5846c" },
  { id: "r184", type: "biological_child", person_a: "3b11d16d-8db9-40d7-9a94-a38daa8a79e7", person_b: "3f3024e5-58fb-47ea-9958-11139ed2586c" },
  { id: "r185", type: "biological_child", person_a: "3b11d16d-8db9-40d7-9a94-a38daa8a79e7", person_b: "d1174d32-44bd-4b43-9942-548ef4abfdd2" },
  { id: "r186", type: "biological_child", person_a: "d8ade8ea-f9ae-4806-9ebf-c7ccc75859c4", person_b: "f71aaf3b-d37a-43ba-8197-1bcc52347394" },
  { id: "r187", type: "biological_child", person_a: "9625d965-81c7-43a2-a677-aea3625de8a2", person_b: "af7ee767-1bf9-4abb-83f9-0b1d1ce5846c" },
  { id: "r188", type: "biological_child", person_a: "9625d965-81c7-43a2-a677-aea3625de8a2", person_b: "3f3024e5-58fb-47ea-9958-11139ed2586c" },
  { id: "r189", type: "biological_child", person_a: "9625d965-81c7-43a2-a677-aea3625de8a2", person_b: "d1174d32-44bd-4b43-9942-548ef4abfdd2" },
  { id: "r190", type: "biological_child", person_a: "3f4c7a88-4ad3-48ca-8317-f1208c71e5d7", person_b: "348e42a6-18c7-4eb0-a51c-d554f95b94eb" },
  { id: "r191", type: "biological_child", person_a: "3f4c7a88-4ad3-48ca-8317-f1208c71e5d7", person_b: "02550b8b-1c09-454b-a6ac-30eb2702db91" },
  { id: "r192", type: "biological_child", person_a: "3f4c7a88-4ad3-48ca-8317-f1208c71e5d7", person_b: "4ae2dd46-cd0b-4212-adf8-207704867af9" },
  { id: "r193", type: "biological_child", person_a: "6ac778ce-85d9-4a7b-9b2c-413c853fb84b", person_b: "429f439c-8f84-4376-af0c-46c019bf8d98" },
  { id: "r194", type: "biological_child", person_a: "6ac778ce-85d9-4a7b-9b2c-413c853fb84b", person_b: "8fda2623-aff6-4196-8d72-502c28339c79" },
  { id: "r195", type: "biological_child", person_a: "43430f7a-fb49-4ef7-9bcb-d7546b02b5e2", person_b: "bc39a916-60f4-4640-a124-2b07f2cc124c" },
  { id: "r196", type: "biological_child", person_a: "2b9b542b-5977-42e2-8456-2c32d09c0db7", person_b: "980da6b9-cd20-4710-b748-71649a868128" },
  { id: "r197", type: "biological_child", person_a: "2b9b542b-5977-42e2-8456-2c32d09c0db7", person_b: "f11d886c-e221-4570-88d1-a7b0f867eb31" },
  { id: "r198", type: "biological_child", person_a: "2b9b542b-5977-42e2-8456-2c32d09c0db7", person_b: "dc6d9f8d-0222-4bf0-a8ca-3263e1e73606" },
  { id: "r199", type: "biological_child", person_a: "980da6b9-cd20-4710-b748-71649a868128", person_b: "2c6f95cd-0064-4cc3-b8e4-41fcf5c191e6" },
  { id: "r200", type: "biological_child", person_a: "ba8ccce9-9f22-4526-9b81-be4591a29fd6", person_b: "3b882403-56bb-4eaa-b5fa-d1766e61e1de" },
  { id: "r201", type: "biological_child", person_a: "ba8ccce9-9f22-4526-9b81-be4591a29fd6", person_b: "0f59d86b-44c1-47bf-8843-6d800b622a87" },
  { id: "r202", type: "biological_child", person_a: "e8656ff9-65de-4ba2-8fc1-3a4143c8ad8a", person_b: "a532dccb-7b38-4605-9cc4-0c13916d330e" },
  { id: "r203", type: "biological_child", person_a: "e8656ff9-65de-4ba2-8fc1-3a4143c8ad8a", person_b: "4faa47c7-5e73-4619-b9ff-fa20d550b946" },
  { id: "r204", type: "biological_child", person_a: "a532dccb-7b38-4605-9cc4-0c13916d330e", person_b: "8e444b7d-0c5d-41be-b832-e3ecdbb0a13a" },
  { id: "r205", type: "biological_child", person_a: "a59d1d10-6fd3-4d4c-b09b-d8b43e5641d9", person_b: "abb0fa73-ff9f-4215-95de-97afbd6c1c1a" },
  { id: "r206", type: "biological_child", person_a: "a59d1d10-6fd3-4d4c-b09b-d8b43e5641d9", person_b: "e2419fa2-c000-405c-8e73-ccc665a020d8" },
  { id: "r207", type: "biological_child", person_a: "abb0fa73-ff9f-4215-95de-97afbd6c1c1a", person_b: "b8f0164c-a350-4f05-84db-7e58be23b555" },
  { id: "r208", type: "biological_child", person_a: "abb0fa73-ff9f-4215-95de-97afbd6c1c1a", person_b: "652db289-3104-4722-aa46-3ea904d11294" },
  { id: "r209", type: "biological_child", person_a: "0289193e-6860-4e26-92e2-d42dde678439", person_b: "b8f0164c-a350-4f05-84db-7e58be23b555" },
  { id: "r210", type: "biological_child", person_a: "0289193e-6860-4e26-92e2-d42dde678439", person_b: "652db289-3104-4722-aa46-3ea904d11294" },
  { id: "r211", type: "biological_child", person_a: "b8f0164c-a350-4f05-84db-7e58be23b555", person_b: "407e7de2-5d86-4572-9110-816ca46ec337" },
  { id: "r212", type: "biological_child", person_a: "e2419fa2-c000-405c-8e73-ccc665a020d8", person_b: "c9bf783d-8386-4b0c-8465-7bda10026be0" },
  { id: "r213", type: "biological_child", person_a: "e2419fa2-c000-405c-8e73-ccc665a020d8", person_b: "cf94fd37-999c-405c-a5eb-b96740ba98ce" },
  { id: "r214", type: "biological_child", person_a: "ced99d18-c192-42ce-a4b7-3fa420f6feca", person_b: "c9bf783d-8386-4b0c-8465-7bda10026be0" },
  { id: "r215", type: "biological_child", person_a: "ced99d18-c192-42ce-a4b7-3fa420f6feca", person_b: "cf94fd37-999c-405c-a5eb-b96740ba98ce" },
  { id: "r216", type: "biological_child", person_a: "ae8b559f-893a-4d2c-bd97-f60f9d9bd0d9", person_b: "c0cc42e7-ce55-4210-ac1b-bdb9f6706d00" },
  { id: "r217", type: "biological_child", person_a: "ae8b559f-893a-4d2c-bd97-f60f9d9bd0d9", person_b: "3d926593-4cc1-4052-a948-1fd9cfe2b1e5" },
  { id: "r218", type: "biological_child", person_a: "ae8b559f-893a-4d2c-bd97-f60f9d9bd0d9", person_b: "53490c92-f64c-4887-afc4-874e22a8f4b2" },
  { id: "r219", type: "biological_child", person_a: "c0cc42e7-ce55-4210-ac1b-bdb9f6706d00", person_b: "e4831162-4f2d-4aec-bdac-4b33804940dd" },
  { id: "r220", type: "biological_child", person_a: "c0cc42e7-ce55-4210-ac1b-bdb9f6706d00", person_b: "fdc63a62-f38d-43b6-8de3-8419da0e6466" },
  { id: "r221", type: "biological_child", person_a: "c0cc42e7-ce55-4210-ac1b-bdb9f6706d00", person_b: "a89ebe39-9518-4482-9e25-ae7233d47acf" },
  { id: "r222", type: "biological_child", person_a: "f3dbe4c8-1e7e-4673-ac01-221cf58b4ddb", person_b: "e4831162-4f2d-4aec-bdac-4b33804940dd" },
  { id: "r223", type: "biological_child", person_a: "f3dbe4c8-1e7e-4673-ac01-221cf58b4ddb", person_b: "fdc63a62-f38d-43b6-8de3-8419da0e6466" },
  { id: "r224", type: "biological_child", person_a: "f3dbe4c8-1e7e-4673-ac01-221cf58b4ddb", person_b: "a89ebe39-9518-4482-9e25-ae7233d47acf" },
  { id: "r225", type: "biological_child", person_a: "3d926593-4cc1-4052-a948-1fd9cfe2b1e5", person_b: "3d4200dd-d55a-4279-8958-dda4546fa821" },
  { id: "r226", type: "biological_child", person_a: "3d926593-4cc1-4052-a948-1fd9cfe2b1e5", person_b: "3a92fc57-9ab2-4090-a20e-815f306e0977" },
  { id: "r227", type: "biological_child", person_a: "be19f82f-b8e5-40d8-9b52-509d3dbff0d8", person_b: "3d4200dd-d55a-4279-8958-dda4546fa821" },
  { id: "r228", type: "biological_child", person_a: "be19f82f-b8e5-40d8-9b52-509d3dbff0d8", person_b: "3a92fc57-9ab2-4090-a20e-815f306e0977" },
  { id: "r229", type: "biological_child", person_a: "53490c92-f64c-4887-afc4-874e22a8f4b2", person_b: "0aa34c78-0e3a-4bab-bf3f-65601303ff3c" },
  { id: "r230", type: "biological_child", person_a: "4e3fbd1b-cf49-4360-818a-93e6a4e49150", person_b: "0aa34c78-0e3a-4bab-bf3f-65601303ff3c" },
  { id: "r231", type: "biological_child", person_a: "a52a5d20-5e76-4a92-9ed4-25ae24d0fd9a", person_b: "a5765e1b-b677-4ef0-b6af-c93a0e871e03" },
  { id: "r232", type: "biological_child", person_a: "a52a5d20-5e76-4a92-9ed4-25ae24d0fd9a", person_b: "4cbb4732-19ec-44f9-8545-afc2849014c4" },
  { id: "r233", type: "biological_child", person_a: "4e6363e8-984b-4b37-bdf4-e4a15a5d0353", person_b: "637b8062-4411-4133-90fe-597d0409881e" },
  { id: "r234", type: "biological_child", person_a: "4e6363e8-984b-4b37-bdf4-e4a15a5d0353", person_b: "2f98a8cf-c3bc-4b44-8856-c9223efcbd75" },
  { id: "r235", type: "biological_child", person_a: "cf90d775-227c-4a12-ab7a-b2ae9ce2f61b", person_b: "ea4195b1-3445-431e-a133-8f335d827c4d" },
  { id: "r236", type: "biological_child", person_a: "cf90d775-227c-4a12-ab7a-b2ae9ce2f61b", person_b: "0cb7d51f-6c1f-422f-9106-2388f0dcf774" },
  { id: "r237", type: "biological_child", person_a: "cf90d775-227c-4a12-ab7a-b2ae9ce2f61b", person_b: "1c786d79-3b3c-478a-ae44-782b35d9865f" },
  { id: "r238", type: "biological_child", person_a: "cf90d775-227c-4a12-ab7a-b2ae9ce2f61b", person_b: "b0692cca-ec38-4969-89bc-11920b66fb54" },
  { id: "r239", type: "biological_child", person_a: "7409f9e6-8cf4-4a4d-b816-ef2ccb837cc6", person_b: "64590a0b-0ab4-4b00-b992-b97ce445bd38" },
  { id: "r240", type: "biological_child", person_a: "a9fd5362-3e2c-4c28-89dc-09119c9fea7e", person_b: "bc39a916-60f4-4640-a124-2b07f2cc124c" },
  { id: "r241", type: "biological_child", person_a: "523174eb-a7c1-447f-9914-33bdb7e0f3f4", person_b: "2c6f95cd-0064-4cc3-b8e4-41fcf5c191e6" },
  { id: "r242", type: "biological_child", person_a: "843d3f4d-bce5-4231-92d6-4edf84925361", person_b: "407e7de2-5d86-4572-9110-816ca46ec337" },
  { id: "r243", type: "biological_child", person_a: "e128e639-94df-4348-a826-391b3023f333", person_b: "8e444b7d-0c5d-41be-b832-e3ecdbb0a13a" },
];

// ─── LOGIC TỪ giapha (treeHelpers.ts) ────────────────────────────────────

function buildAdjacencyLists(relationships, personsMap) {
  const spouses = new Map();
  const children = new Map();

  relationships.forEach((r) => {
    if (r.type === "marriage") {
      if (!spouses.has(r.person_a)) spouses.set(r.person_a, []);
      if (!spouses.has(r.person_b)) spouses.set(r.person_b, []);
      const pB = personsMap.get(r.person_b);
      if (pB) spouses.get(r.person_a).push({ person: pB, note: r.note });
      const pA = personsMap.get(r.person_a);
      if (pA) spouses.get(r.person_b).push({ person: pA, note: r.note });
    } else {
      if (!children.has(r.person_a)) children.set(r.person_a, []);
      const child = personsMap.get(r.person_b);
      if (child) children.get(r.person_a).push(child);
    }
  });

  children.forEach((arr) => {
    arr.sort((a, b) => {
      const ao = a.birth_order ?? Infinity, bo = b.birth_order ?? Infinity;
      if (ao !== bo) return ao - bo;
      return (a.birth_year ?? Infinity) - (b.birth_year ?? Infinity);
    });
  });

  return { spousesByPersonId: spouses, childrenByPersonId: children };
}

function getTreeData(personId, personsMap, adj) {
  return {
    person: personsMap.get(personId),
    spouses: adj.spousesByPersonId.get(personId) || [],
    children: adj.childrenByPersonId.get(personId) || [],
  };
}

// ─── COMPONENT: NODE CARD ────────────────────────────────────────────────────

function NodeCard({ person, role, isRing, isPlus, onSelect, isHighlighted }) {
  const isMale = person.gender === "male";
  const bgGrad = isMale
    ? "linear-gradient(135deg,#1a3a5c 0%,#2563a8 100%)"
    : "linear-gradient(135deg,#6b2155 0%,#c0527a 100%)";
  const initial = person.full_name.trim().split(" ").pop()?.[0] ?? "?";

  return (
    <button
      onClick={() => onSelect(person)}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "8px 6px 6px",
        background: "none",
        border: "none",
        cursor: "pointer",
        width: 78,
        transition: "transform 0.2s",
        borderRadius: 14,
        outline: isHighlighted ? "3px solid #e6a23c" : "none",
        outlineOffset: 2,
      }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
      title={person.full_name}
    >
      {isRing && <span style={{ position: "absolute", top: 8, left: 2, fontSize: 11 }}>💍</span>}
      {isPlus && <span style={{ position: "absolute", top: 8, left: 2, fontSize: 11, fontWeight: 700, color: "#888" }}>+</span>}

      {person.photo_url ? (
        <img
          src={person.photo_url}
          alt={person.full_name}
          style={{
            width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
            border: "2.5px solid #fff",
            boxShadow: person.is_deceased ? "none" : "0 3px 10px rgba(0,0,0,0.25)",
            opacity: person.is_deceased ? 0.6 : 1,
            filter: person.is_deceased ? "grayscale(0.4)" : "none",
            flexShrink: 0,
          }}
        />
      ) : (
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: bgGrad,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 16, fontWeight: 700,
          boxShadow: person.is_deceased ? "none" : "0 3px 10px rgba(0,0,0,0.25)",
          opacity: person.is_deceased ? 0.6 : 1,
          filter: person.is_deceased ? "grayscale(0.4)" : "none",
          border: "2.5px solid #fff",
          flexShrink: 0,
          fontFamily: "'Noto Serif', serif",
        }}>
          {initial}
        </div>
      )}

      <span style={{
        fontSize: 10, fontWeight: 600, lineHeight: 1.3,
        color: person.is_deceased ? "#8a99b8" : "#e8edf7",
        textAlign: "center", whiteSpace: "normal",
        maxWidth: 74,
        fontFamily: "'Noto Sans', sans-serif",
      }}>
        {person.full_name.split(" ").map((w, i) => <span key={i} style={{ display: "block" }}>{w}</span>)}
      </span>

      <span style={{ fontSize: 9, color: "#6f84ac", fontFamily: "monospace" }}>
        {person.birth_year || "?"}{person.is_deceased && person.death_year ? `–${person.death_year}` : ""}
      </span>

      {role && <span style={{ fontSize: 9, color: "#f0a8c4", fontWeight: 600 }}>{role}</span>}
    </button>
  );
}

// ─── CSS TREE LINES ─────────────────────────────────────────────────────────

const TREE_CSS = `
.gp-tree ul {
  padding-top: 28px;
  position: relative;
  display: flex;
  justify-content: center;
  padding-left: 0;
  list-style: none;
}
.gp-tree li {
  float: left;
  text-align: center;
  list-style-type: none;
  position: relative;
  padding: 28px 4px 0 4px;
}
.gp-tree li::before, .gp-tree li::after {
  content: '';
  position: absolute; top: 0; right: 50%;
  border-top: 2px solid #3a5680;
  width: 50%; height: 28px;
}
.gp-tree li::after {
  right: auto; left: 50%;
  border-left: 2px solid #3a5680;
}
.gp-tree li:only-child::after { display: none; }
.gp-tree li:only-child::before {
  content: ''; position: absolute; top: 0; left: 50%;
  border-left: 2px solid #3a5680; width: 0; height: 28px;
}
.gp-tree ul:first-child > li { padding-top: 0; }
.gp-tree ul:first-child > li::before { display: none; }
.gp-tree li:first-child::before, .gp-tree li:last-child::after { border: 0 none; }
.gp-tree li:last-child::before { border-right: 2px solid #3a5680; border-radius: 0 10px 0 0; }
.gp-tree li:first-child::after { border-radius: 10px 0 0 0; }
.gp-tree ul ul::before {
  content: ''; position: absolute; top: 0; left: 50%;
  border-left: 2px solid #3a5680; width: 0; height: 28px;
}
`;

// ─── TREE NODE (đệ quy) ──────────────────────────────────────────────────────

function TreeNode({ personId, personsMap, adj, collapsedNodes, toggleCollapse, onSelect, highlightId, visited, level = 0 }) {
  if (visited.has(personId)) return null;
  const newVisited = new Set(visited);
  newVisited.add(personId);

  const data = getTreeData(personId, personsMap, adj);
  if (!data.person) return null;

  const hasChildren = data.children.length > 0;
  const isCollapsed = collapsedNodes.has(personId);

  return (
    <li>
      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "stretch", position: "relative",
          background: "#1a2e4ecc", borderRadius: 16, border: "1px solid #2e466e",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}>
          <NodeCard person={data.person} onSelect={onSelect} isHighlighted={highlightId === data.person.id} />

          {data.spouses.map((sd, idx) => (
            <div key={sd.person.id} style={{ display: "flex", position: "relative" }}>
              <NodeCard
                person={sd.person}
                isRing={idx === 0}
                isPlus={idx > 0}
                role={sd.person.gender === "male" ? "Chồng" : "Vợ"}
                onSelect={onSelect}
                isHighlighted={highlightId === sd.person.id}
              />
            </div>
          ))}

          {hasChildren && (
            <button
              onClick={(e) => { e.stopPropagation(); toggleCollapse(personId); }}
              style={{
                position: "absolute", bottom: -11, left: "50%", transform: "translateX(-50%)",
                width: 22, height: 22, borderRadius: "50%",
                background: "#1a2e4e", border: "1.5px solid #3a5680",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", zIndex: 10,
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                fontSize: 13, color: "#e6a23c", lineHeight: 1,
              }}
              title={isCollapsed ? "Mở rộng" : "Thu gọn"}
            >
              {isCollapsed ? "＋" : "－"}
            </button>
          )}
        </div>
      </div>

      {hasChildren && !isCollapsed && (
        <ul>
          {data.children.map(child => (
            <TreeNode
              key={child.id}
              personId={child.id}
              personsMap={personsMap}
              adj={adj}
              collapsedNodes={collapsedNodes}
              toggleCollapse={toggleCollapse}
              onSelect={onSelect}
              highlightId={highlightId}
              visited={newVisited}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── MODAL CHI TIẾT ──────────────────────────────────────────────────────────

function PersonModal({ person, onClose, onEdit }) {
  if (!person) return null;
  const isMale = person.gender === "male";

  const basicFields = [
    ["Giới tính", isMale ? "Nam" : person.gender === "female" ? "Nữ" : "Khác"],
    ["Năm sinh", person.birth_year ?? "Không rõ"],
    ["Năm mất", person.is_deceased ? (person.death_year ?? "Không rõ") : "Còn sống"],
    ["Thế hệ", person.generation ? `Đời ${person.generation}` : "—"],
  ];

  const extraFields = [
    ["📍 Nơi sinh / sống", person.birth_place],
    ["💼 Nghề nghiệp", person.occupation],
    ["📞 Số điện thoại", person.phone],
    ["✉️ Email", person.email],
    ["⚰️ Nơi an táng / mộ phần", person.burial_place],
  ].filter(([, val]) => val);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(10,10,20,0.5)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
        overflowY: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#1a2e4e",
          borderRadius: 20,
          padding: "28px 32px",
          maxWidth: 380, width: "100%",
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          fontFamily: "'Noto Sans', sans-serif",
          border: "1px solid #2e466e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          {person.photo_url ? (
            <img
              src={person.photo_url}
              alt={person.full_name}
              style={{
                width: 56, height: 56, borderRadius: "50%", objectFit: "cover",
                border: "2px solid " + (isMale ? "#2563a8" : "#c0527a"),
                flexShrink: 0,
              }}
            />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: isMale
                ? "linear-gradient(135deg,#1a3a5c,#2563a8)"
                : "linear-gradient(135deg,#6b2155,#c0527a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 22, fontWeight: 700,
              fontFamily: "'Noto Serif', serif",
              flexShrink: 0,
            }}>
              {person.full_name.trim().split(" ").pop()?.[0]}
            </div>
          )}
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#e8edf7", fontFamily: "'Noto Serif', serif" }}>
              {person.full_name}
            </div>
            <div style={{ fontSize: 12, color: isMale ? "#6db3f2" : "#f0a8c4", fontWeight: 600, marginTop: 2 }}>
              {person.is_deceased ? "✦ Đã mất" : "✦ Còn sống"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {basicFields.map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #2e466e", paddingBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#6f84ac" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e8edf7", textAlign: "right", maxWidth: "60%" }}>{val}</span>
            </div>
          ))}
        </div>

        {extraFields.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px dashed #2e466e" }}>
            {extraFields.map(([label, val]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span style={{ fontSize: 12, color: "#6f84ac", flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#e8edf7", textAlign: "right" }}>{val}</span>
              </div>
            ))}
          </div>
        )}

        {person.note && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed #2e466e" }}>
            <div style={{ fontSize: 12, color: "#6f84ac", marginBottom: 4 }}>📝 Ghi chú / Tiểu sử</div>
            <div style={{ fontSize: 13, color: "#e8edf7", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{person.note}</div>
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
          {onEdit && (
            <button
              onClick={() => onEdit(person)}
              style={{
                flex: 1, padding: "10px 0",
                background: "#1a2e4e", color: "#e6a23c", border: "1px solid #e6a23c",
                borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}
            >
              ✏️ Sửa thông tin
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px 0",
              background: "#e6a23c", color: "#1a2e4e", border: "none",
              borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function Stats({ persons }) {
  const total = persons.length;
  const males = persons.filter(p => p.gender === "male").length;
  const females = persons.filter(p => p.gender === "female").length;
  const deceased = persons.filter(p => p.is_deceased).length;
  const maxGen = Math.max(...persons.map(p => p.generation || 0));

  const items = [
    { label: "Tổng thành viên", value: total, icon: "👨‍👩‍👧‍👦" },
    { label: "Nam", value: males, icon: "👨" },
    { label: "Nữ", value: females, icon: "👩" },
    { label: "Đã mất", value: deceased, icon: "🕊️" },
    { label: "Số đời", value: maxGen, icon: "🌿" },
  ];

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", padding: "12px 16px" }}>
      {items.map(({ label, value, icon }) => (
        <div key={label} style={{
          background: "#1a2e4ecc", borderRadius: 12, padding: "10px 16px",
          border: "1px solid #2e466e", textAlign: "center", minWidth: 90,
          fontFamily: "'Noto Sans', sans-serif",
        }}>
          <div style={{ fontSize: 20 }}>{icon}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#e8edf7" }}>{value}</div>
          <div style={{ fontSize: 10, color: "#8a99b8" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── SEARCH BAR ──────────────────────────────────────────────────────────────

function SearchBar({ persons, onJump }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return persons.filter(p => p.full_name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, persons]);

  return (
    <div style={{ position: "relative", maxWidth: 320, width: "100%", margin: "0 auto" }}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="🔍 Tìm tên thành viên..."
        style={{
          width: "100%", padding: "9px 14px", borderRadius: 20,
          border: "1px solid #3a5680", fontSize: 13, outline: "none",
          fontFamily: "'Noto Sans', sans-serif", background: "#1a2e4e",
          color: "#e8edf7",
          boxSizing: "border-box",
        }}
      />
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#1a2e4e", borderRadius: 12, border: "1px solid #3a5680",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 100, overflow: "hidden",
          maxHeight: 260, overflowY: "auto",
        }}>
          {results.map(p => (
            <button
              key={p.id}
              onClick={() => { onJump(p.id); setQuery(""); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 14px", border: "none", background: "none",
                cursor: "pointer", fontSize: 12.5, borderBottom: "1px solid #2e466e",
                fontFamily: "'Noto Sans', sans-serif", color: "#e8edf7",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#25395c"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <strong>{p.full_name}</strong>
              <span style={{ color: "#6f84ac", marginLeft: 6 }}>· Đời {p.generation}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── BẢNG MÀU CHO FORM ────────────────────────────────────────────────────────

const inputStyle = {
  width: "100%", padding: "9px 12px", borderRadius: 8,
  border: "1px solid #3a5680", fontSize: 13, outline: "none",
  fontFamily: "'Noto Sans', sans-serif", background: "#1a2e4e",
  color: "#e8edf7", boxSizing: "border-box",
};

const labelStyle = { fontSize: 12, color: "#a8b8d8", marginBottom: 4, display: "block", fontWeight: 600 };

const fieldWrap = { marginBottom: 12 };

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ─── BỘ CHỌN NGƯỜI (autocomplete đơn giản) ────────────────────────────────────

function PersonPicker({ persons, value, onChange, placeholder }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const selected = persons.find(p => p.id === value);

  const results = useMemo(() => {
    if (!query.trim()) return persons.slice(0, 8);
    const q = query.trim().toLowerCase();
    return persons.filter(p => p.full_name.toLowerCase().includes(q)).slice(0, 8);
  }, [query, persons]);

  return (
    <div style={{ position: "relative" }}>
      <input
        value={selected ? selected.full_name : query}
        onChange={e => { setQuery(e.target.value); setOpen(true); if (selected) onChange(""); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        style={inputStyle}
      />
      {selected && (
        <button
          onClick={() => { onChange(""); setQuery(""); }}
          style={{
            position: "absolute", right: 8, top: 8, background: "none", border: "none",
            color: "#f0a8c4", cursor: "pointer", fontSize: 14,
          }}
          title="Bỏ chọn"
        >✕</button>
      )}
      {open && !selected && results.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "#1a2e4e", borderRadius: 8, border: "1px solid #3a5680",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)", zIndex: 100, overflow: "hidden",
          maxHeight: 220, overflowY: "auto",
        }}>
          {results.map(p => (
            <button
              key={p.id}
              onClick={() => { onChange(p.id); setQuery(""); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 12px", border: "none", background: "none",
                cursor: "pointer", fontSize: 12.5, borderBottom: "1px solid #2e466e",
                color: "#e8edf7", fontFamily: "'Noto Sans', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#25395c"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              {p.full_name} <span style={{ color: "#6f84ac" }}>· Đời {p.generation}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── FORM THÊM THÀNH VIÊN MỚI ──────────────────────────────────────────────────

function AddPersonForm({ allPersons, onSubmitAdd, isAdmin }) {
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("male");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [isDeceased, setIsDeceased] = useState(false);
  const [parentId, setParentId] = useState("");
  const [spouseId, setSpouseId] = useState("");
  const [note, setNote] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = () => {
    if (!fullName.trim()) return;

    const parent = allPersons.find(p => p.id === parentId);
    const spouse = allPersons.find(p => p.id === spouseId);
    const generation = parent ? (parent.generation || 1) + 1 : (spouse ? spouse.generation : 1);

    const newPerson = {
      id: "custom-" + uuidv4(),
      full_name: fullName.trim(),
      gender,
      birth_year: birthYear ? parseInt(birthYear, 10) : null,
      death_year: isDeceased && deathYear ? parseInt(deathYear, 10) : null,
      is_deceased: isDeceased,
      generation,
      birth_place: null,
      occupation: null,
      phone: null,
      email: null,
      burial_place: null,
      note: note.trim() || null,
      photo_url: null,
    };

    onSubmitAdd(newPerson, parentId || null, spouseId || null);

    setSuccess(isAdmin
      ? `Đã thêm "${newPerson.full_name}" vào gia phả!`
      : `Đã gửi yêu cầu thêm "${newPerson.full_name}". Chờ quản lý duyệt.`);
    setFullName(""); setBirthYear(""); setDeathYear(""); setIsDeceased(false);
    setParentId(""); setSpouseId(""); setNote("");
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div>
      {!isAdmin && (
        <div style={{ marginBottom: 14, padding: "10px 14px", background: "#1f3a4a", border: "1px solid #2f5a6b", borderRadius: 8, color: "#a8d4e6", fontSize: 12 }}>
          ℹ️ Yêu cầu của bạn sẽ ở trạng thái <strong>chờ duyệt</strong> cho đến khi quản lý xác nhận.
        </div>
      )}

      <div style={fieldWrap}>
        <label style={labelStyle}>Họ và tên *</label>
        <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="VD: Phan Văn An" style={inputStyle} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ ...fieldWrap, flex: 1 }}>
          <label style={labelStyle}>Giới tính</label>
          <select value={gender} onChange={e => setGender(e.target.value)} style={inputStyle}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div style={{ ...fieldWrap, flex: 1 }}>
          <label style={labelStyle}>Năm sinh</label>
          <input value={birthYear} onChange={e => setBirthYear(e.target.value.replace(/\D/g, ""))} placeholder="VD: 1995" style={inputStyle} />
        </div>
      </div>

      <div style={fieldWrap}>
        <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input type="checkbox" checked={isDeceased} onChange={e => setIsDeceased(e.target.checked)} />
          Đã mất
        </label>
        {isDeceased && (
          <input value={deathYear} onChange={e => setDeathYear(e.target.value.replace(/\D/g, ""))} placeholder="Năm mất" style={{ ...inputStyle, marginTop: 6 }} />
        )}
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Cha hoặc Mẹ (để tự nối vào cây)</label>
        <PersonPicker persons={allPersons} value={parentId} onChange={setParentId} placeholder="Tìm tên cha/mẹ..." />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Vợ / Chồng (nếu có)</label>
        <PersonPicker persons={allPersons} value={spouseId} onChange={setSpouseId} placeholder="Tìm tên vợ/chồng..." />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>Ghi chú / Tiểu sử</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} placeholder="Thông tin thêm về người này..." />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!fullName.trim()}
        style={{
          width: "100%", padding: "11px 0", marginTop: 6,
          background: fullName.trim() ? "#e6a23c" : "#3a5680",
          color: fullName.trim() ? "#1a2e4e" : "#6f84ac",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700,
          cursor: fullName.trim() ? "pointer" : "not-allowed",
        }}
      >
        {isAdmin ? "➕ Thêm thành viên" : "📨 Gửi yêu cầu thêm"}
      </button>

      {success && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#1f4a2e", border: "1px solid #2f6b44", borderRadius: 8, color: "#a8e6c0", fontSize: 13 }}>
          ✓ {success}
        </div>
      )}

      {!parentId && !spouseId && fullName.trim() && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#4a3a1f", border: "1px solid #6b5a2f", borderRadius: 8, color: "#e6c8a8", fontSize: 12 }}>
          ⚠️ Nếu không chọn cha/mẹ hoặc vợ/chồng, thành viên sẽ được thêm vào danh sách nhưng <strong>không hiển thị trên sơ đồ cây</strong> (vì không có liên kết).
        </div>
      )}
    </div>
  );
}

// ─── FORM SỬA THÔNG TIN THÀNH VIÊN ──────────────────────────────────────────────

function EditPersonForm({ allPersons, onSubmitUpdate, editingPerson, setEditingPerson, isAdmin }) {
  const [selectedId, setSelectedId] = useState(editingPerson ? editingPerson.id : "");
  const person = allPersons.find(p => p.id === selectedId);

  const [fields, setFields] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (editingPerson) setSelectedId(editingPerson.id);
  }, [editingPerson]);

  useEffect(() => {
    if (person) {
      setFields({
        birth_place: person.birth_place || "",
        occupation: person.occupation || "",
        phone: person.phone || "",
        email: person.email || "",
        burial_place: person.burial_place || "",
        note: person.note || "",
        photo_url: person.photo_url || "",
      });
    } else {
      setFields({});
    }
  }, [person?.id]);

  if (!person) {
    return (
      <div>
        <div style={fieldWrap}>
          <label style={labelStyle}>Chọn thành viên cần sửa</label>
          <PersonPicker persons={allPersons} value={selectedId} onChange={setSelectedId} placeholder="Tìm tên thành viên..." />
        </div>
      </div>
    );
  }

  const setField = (key, val) => setFields(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    const cleaned = {};
    Object.entries(fields).forEach(([k, v]) => {
      cleaned[k] = v.trim() ? v.trim() : null;
    });
    onSubmitUpdate(person.id, cleaned, person.full_name);
    setSuccess(isAdmin
      ? `Đã lưu thông tin cho "${person.full_name}"!`
      : `Đã gửi yêu cầu sửa thông tin "${person.full_name}". Chờ quản lý duyệt.`);
    setTimeout(() => setSuccess(""), 4000);
  };

  return (
    <div>
      {!isAdmin && (
        <div style={{ marginBottom: 14, padding: "10px 14px", background: "#1f3a4a", border: "1px solid #2f5a6b", borderRadius: 8, color: "#a8d4e6", fontSize: 12 }}>
          ℹ️ Yêu cầu của bạn sẽ ở trạng thái <strong>chờ duyệt</strong> cho đến khi quản lý xác nhận.
        </div>
      )}

      <div style={fieldWrap}>
        <label style={labelStyle}>Thành viên đang sửa</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1, ...inputStyle, display: "flex", alignItems: "center", fontWeight: 700 }}>
            {person.full_name} <span style={{ color: "#6f84ac", marginLeft: 6, fontWeight: 400 }}>· Đời {person.generation}</span>
          </div>
          <button
            onClick={() => { setSelectedId(""); setEditingPerson(null); }}
            style={{ padding: "9px 12px", background: "#1a2e4e", border: "1px solid #3a5680", borderRadius: 8, color: "#e6a23c", cursor: "pointer", fontSize: 12 }}
          >
            Đổi
          </button>
        </div>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>📍 Nơi sinh / sống</label>
        <input value={fields.birth_place || ""} onChange={e => setField("birth_place", e.target.value)} style={inputStyle} placeholder="VD: Thăng Phước, Quảng Nam" />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>💼 Nghề nghiệp</label>
        <input value={fields.occupation || ""} onChange={e => setField("occupation", e.target.value)} style={inputStyle} placeholder="VD: Giáo viên" />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ ...fieldWrap, flex: 1 }}>
          <label style={labelStyle}>📞 Số điện thoại</label>
          <input value={fields.phone || ""} onChange={e => setField("phone", e.target.value)} style={inputStyle} placeholder="09xxxxxxxx" />
        </div>
        <div style={{ ...fieldWrap, flex: 1 }}>
          <label style={labelStyle}>✉️ Email</label>
          <input value={fields.email || ""} onChange={e => setField("email", e.target.value)} style={inputStyle} placeholder="email@..." />
        </div>
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>⚰️ Nơi an táng / mộ phần</label>
        <input value={fields.burial_place || ""} onChange={e => setField("burial_place", e.target.value)} style={inputStyle} placeholder="VD: Nghĩa trang gia tộc, Thăng Phước" />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>🖼️ Đường dẫn ảnh đại diện (URL)</label>
        <input value={fields.photo_url || ""} onChange={e => setField("photo_url", e.target.value)} style={inputStyle} placeholder="https://..." />
      </div>

      <div style={fieldWrap}>
        <label style={labelStyle}>📝 Ghi chú / Tiểu sử</label>
        <textarea value={fields.note || ""} onChange={e => setField("note", e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} placeholder="Thông tin thêm về người này..." />
      </div>

      <button
        onClick={handleSave}
        style={{
          width: "100%", padding: "11px 0", marginTop: 6,
          background: "#e6a23c", color: "#1a2e4e",
          border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer",
        }}
      >
        {isAdmin ? "💾 Lưu thông tin" : "📨 Gửi yêu cầu sửa"}
      </button>

      {success && (
        <div style={{ marginTop: 12, padding: "10px 14px", background: "#1f4a2e", border: "1px solid #2f6b44", borderRadius: 8, color: "#a8e6c0", fontSize: 13 }}>
          ✓ {success}
        </div>
      )}
    </div>
  );
}

// ─── PANEL QUẢN LÝ (THÊM / SỬA) ──────────────────────────────────────────────

function AdminLoginBox({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (onLogin(pin)) {
      setPin(""); setError("");
    } else {
      setError("Mã PIN không đúng. Vui lòng thử lại.");
      setPin("");
    }
  };

  return (
    <div style={{
      background: "#1a2e4ecc", border: "1px solid #2e466e", borderRadius: 16,
      padding: 20, marginBottom: 16,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#a8b8d8", marginBottom: 10 }}>
        🔐 Đăng nhập vai Quản lý để duyệt thay đổi
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="password"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          placeholder="Nhập mã PIN quản lý"
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={handleLogin}
          style={{
            padding: "9px 18px", background: "#e6a23c", color: "#1a2e4e",
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}
        >
          Vào
        </button>
      </div>
      {error && <div style={{ marginTop: 8, fontSize: 12, color: "#f0a8a8" }}>{error}</div>}
    </div>
  );
}

function PendingChangeCard({ change, onApprove, onReject }) {
  const isAdd = change.type === "add";
  return (
    <div style={{
      background: "#1a2e4ecc", border: "1px solid #2e466e", borderRadius: 12,
      padding: "14px 16px", marginBottom: 10,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
            background: isAdd ? "#1f4a2e" : "#1f3a4a",
            color: isAdd ? "#a8e6c0" : "#a8d4e6",
            marginRight: 8,
          }}>
            {isAdd ? "THÊM MỚI" : "SỬA THÔNG TIN"}
          </span>
          <strong style={{ color: "#e8edf7", fontSize: 14 }}>
            {isAdd ? change.newPerson.full_name : change.personName}
          </strong>
        </div>
        <span style={{ fontSize: 10, color: "#6f84ac", whiteSpace: "nowrap" }}>
          {new Date(change.submittedAt).toLocaleString("vi-VN")}
        </span>
      </div>

      <div style={{ marginTop: 8, fontSize: 12, color: "#a8b8d8", lineHeight: 1.6 }}>
        {isAdd ? (
          <>
            {change.newPerson.gender === "male" ? "Nam" : change.newPerson.gender === "female" ? "Nữ" : "Khác"}
            {change.newPerson.birth_year ? ` · Sinh ${change.newPerson.birth_year}` : ""}
            {change.newPerson.is_deceased ? ` · Đã mất${change.newPerson.death_year ? " " + change.newPerson.death_year : ""}` : ""}
            {change.newPerson.note ? <div style={{ marginTop: 4 }}>📝 {change.newPerson.note}</div> : null}
          </>
        ) : (
          <>
            {Object.entries(change.fields).filter(([, v]) => v).map(([k, v]) => (
              <div key={k}>• {k}: <strong style={{ color: "#e8edf7" }}>{v}</strong></div>
            ))}
            {Object.values(change.fields).every(v => !v) && <span style={{ color: "#6f84ac" }}>(Xóa hết các trường đã điền)</span>}
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={() => onApprove(change.id)}
          style={{
            flex: 1, padding: "8px 0", background: "#2f6b44", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          ✓ Duyệt
        </button>
        <button
          onClick={() => onReject(change.id)}
          style={{
            flex: 1, padding: "8px 0", background: "#1a2e4e", color: "#f0a8a8",
            border: "1px solid #5a3a3a", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}
        >
          ✕ Từ chối
        </button>
      </div>
    </div>
  );
}

function ManagePanel({
  allPersons, editingPerson, setEditingPerson,
  isAdmin, onAdminLogin, onAdminLogout,
  pendingChanges, onApproveChange, onRejectChange,
  onSubmitAdd, onSubmitUpdate,
}) {
  const [mode, setMode] = useState(editingPerson ? "edit" : "add");

  useEffect(() => {
    if (editingPerson) setMode("edit");
  }, [editingPerson]);

  const tabs = isAdmin
    ? [["add", "➕ Thêm thành viên mới"], ["edit", "✏️ Sửa thông tin"], ["approve", `🗂️ Chờ duyệt (${pendingChanges.length})`]]
    : [["add", "➕ Thêm thành viên mới"], ["edit", "✏️ Sửa thông tin"]];

  return (
    <div style={{ padding: "16px 20px 60px", maxWidth: 560, margin: "0 auto" }}>
      {!isAdmin && <AdminLoginBox onLogin={onAdminLogin} />}

      {isAdmin && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "#1f4a2e", border: "1px solid #2f6b44", borderRadius: 10,
          padding: "8px 14px", marginBottom: 14, fontSize: 12, color: "#a8e6c0",
        }}>
          <span>🔓 Đang ở vai <strong>Quản lý</strong></span>
          <button
            onClick={onAdminLogout}
            style={{ background: "none", border: "none", color: "#a8e6c0", textDecoration: "underline", cursor: "pointer", fontSize: 12 }}
          >
            Đăng xuất
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => { setMode(key); if (key === "add") setEditingPerson(null); }}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: mode === key ? "#e6a23c" : "#1a2e4ecc",
              color: mode === key ? "#1a2e4e" : "#a8b8d8",
              border: mode === key ? "none" : "1px solid #2e466e",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "approve" && isAdmin ? (
        pendingChanges.length === 0 ? (
          <div style={{
            background: "#1a2e4ecc", border: "1px solid #2e466e", borderRadius: 16,
            padding: 30, textAlign: "center", color: "#6f84ac", fontSize: 13,
          }}>
            ✓ Không có yêu cầu nào đang chờ duyệt.
          </div>
        ) : (
          <div>
            {pendingChanges.map(change => (
              <PendingChangeCard key={change.id} change={change} onApprove={onApproveChange} onReject={onRejectChange} />
            ))}
          </div>
        )
      ) : (
        <div style={{
          background: "#1a2e4ecc", border: "1px solid #2e466e", borderRadius: 16,
          padding: 20,
        }}>
          {mode === "add" ? (
            <AddPersonForm allPersons={allPersons} onSubmitAdd={onSubmitAdd} isAdmin={isAdmin} />
          ) : (
            <EditPersonForm
              allPersons={allPersons}
              onSubmitUpdate={onSubmitUpdate}
              editingPerson={editingPerson}
              setEditingPerson={setEditingPerson}
              isAdmin={isAdmin}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ─── APP CHÍNH ───────────────────────────────────────────────────────────────

const ROOT_ID = "1fcef043-b4d7-47ee-abd6-a875a09a4204";

export default function GiaPhaHoPhan() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [scale, setScale] = useState(0.85);
  const [tab, setTab] = useState("tree");
  const [highlightId, setHighlightId] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const containerRef = useRef(null);

  // ─── Dữ liệu tùy chỉnh (lưu trữ giữa các lần mở) ──────────────────────────
  const [customPersons, setCustomPersons] = useState([]);
  const [customRels, setCustomRels] = useState([]);
  const [overrides, setOverrides] = useState({}); // id -> { field: value }
  const [storageReady, setStorageReady] = useState(false);

  // ─── Hàng đợi chờ duyệt + vai trò quản lý ─────────────────────────────────
  const [pendingChanges, setPendingChanges] = useState([]); // [{ id, type: 'add'|'edit', ..., submittedAt }]
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_PIN = "DC170392"; // năm sinh Ông Cố — đổi mã này nếu muốn

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("giapha-custom-data", true);
        if (r && r.value) {
          const parsed = JSON.parse(r.value);
          setCustomPersons(parsed.customPersons || []);
          setCustomRels(parsed.customRels || []);
          setOverrides(parsed.overrides || {});
        }
      } catch (e) {
        // chưa có dữ liệu lưu, dùng mặc định
      }
      try {
        const rp = await window.storage.get("giapha-pending-changes", true);
        if (rp && rp.value) {
          setPendingChanges(JSON.parse(rp.value) || []);
        }
      } catch (e) {
        // chưa có hàng đợi
      }
      setStorageReady(true);
    })();
  }, []);

  const saveCustomData = useCallback(async (next) => {
    try {
      await window.storage.set("giapha-custom-data", JSON.stringify(next), true);
    } catch (e) {
      console.error("Lưu dữ liệu thất bại:", e);
    }
  }, []);

  const savePendingChanges = useCallback(async (next) => {
    try {
      await window.storage.set("giapha-pending-changes", JSON.stringify(next), true);
    } catch (e) {
      console.error("Lưu hàng đợi chờ duyệt thất bại:", e);
    }
  }, []);

  const allPersons = useMemo(() => {
    const base = PERSONS.map(p => overrides[p.id] ? { ...p, ...overrides[p.id] } : p);
    const custom = customPersons.map(p => overrides[p.id] ? { ...p, ...overrides[p.id] } : p);
    return [...base, ...custom];
  }, [customPersons, overrides]);

  const allRelationships = useMemo(() => [...RELATIONSHIPS, ...customRels], [customRels]);

  // Gửi yêu cầu thêm thành viên mới vào hàng đợi chờ duyệt
  const handleAdminLogin = useCallback((pin) => {
    if (pin === ADMIN_PIN) { setIsAdmin(true); return true; }
    return false;
  }, [ADMIN_PIN]);

  const handleAdminLogout = useCallback(() => setIsAdmin(false), []);

  // Nếu là admin → commit thẳng; ngược lại → đưa vào hàng đợi
  const submitAddPerson = useCallback((newPerson, parentId, spouseId) => {
    if (isAdmin) {
      // Commit ngay
      setCustomPersons(prevPersons => {
        const nextPersons = [...prevPersons, newPerson];
        setCustomRels(prevRels => {
          const nextRels = [...prevRels];
          if (parentId) nextRels.push({ id: "custom-r-" + newPerson.id + "-child", type: "biological_child", person_a: parentId, person_b: newPerson.id });
          if (spouseId) nextRels.push({ id: "custom-r-" + newPerson.id + "-marriage", type: "marriage", person_a: newPerson.id, person_b: spouseId });
          setOverrides(prev => { saveCustomData({ customPersons: nextPersons, customRels: nextRels, overrides: prev }); return prev; });
          return nextRels;
        });
        return nextPersons;
      });
    } else {
      // Vào hàng đợi chờ duyệt
      setPendingChanges(prev => {
        const next = [...prev, { id: "pending-" + uuidv4(), type: "add", newPerson, parentId, spouseId, submittedAt: new Date().toISOString() }];
        savePendingChanges(next);
        return next;
      });
    }
  }, [isAdmin, overrides, saveCustomData, savePendingChanges]);

  const submitUpdatePerson = useCallback((personId, fields, personName) => {
    if (isAdmin) {
      setOverrides(prev => {
        const next = { ...prev, [personId]: { ...(prev[personId] || {}), ...fields } };
        setCustomPersons(cp => { setCustomRels(cr => { saveCustomData({ customPersons: cp, customRels: cr, overrides: next }); return cr; }); return cp; });
        return next;
      });
    } else {
      setPendingChanges(prev => {
        const next = [...prev, { id: "pending-" + uuidv4(), type: "edit", personId, fields, personName, submittedAt: new Date().toISOString() }];
        savePendingChanges(next);
        return next;
      });
    }
  }, [isAdmin, saveCustomData, savePendingChanges]);

  // Quản lý duyệt một thay đổi → áp dụng thật vào dữ liệu
  const approveChange = useCallback((changeId) => {
    setPendingChanges(prevPending => {
      const change = prevPending.find(c => c.id === changeId);
      if (!change) return prevPending;

      if (change.type === "add") {
        setCustomPersons(prevPersons => {
          const nextPersons = [...prevPersons, change.newPerson];
          setCustomRels(prevRels => {
            const nextRels = [...prevRels];
            if (change.parentId) {
              nextRels.push({ id: "custom-r-" + change.newPerson.id + "-child", type: "biological_child", person_a: change.parentId, person_b: change.newPerson.id });
            }
            if (change.spouseId) {
              nextRels.push({ id: "custom-r-" + change.newPerson.id + "-marriage", type: "marriage", person_a: change.newPerson.id, person_b: change.spouseId });
            }
            setOverrides(prevOverrides => {
              saveCustomData({ customPersons: nextPersons, customRels: nextRels, overrides: prevOverrides });
              return prevOverrides;
            });
            return nextRels;
          });
          return nextPersons;
        });
      } else if (change.type === "edit") {
        setOverrides(prevOverrides => {
          const nextOverrides = { ...prevOverrides, [change.personId]: { ...(prevOverrides[change.personId] || {}), ...change.fields } };
          setCustomPersons(prevPersons => {
            setCustomRels(prevRels => {
              saveCustomData({ customPersons: prevPersons, customRels: prevRels, overrides: nextOverrides });
              return prevRels;
            });
            return prevPersons;
          });
          return nextOverrides;
        });
      }

      const nextPending = prevPending.filter(c => c.id !== changeId);
      savePendingChanges(nextPending);
      return nextPending;
    });
  }, [saveCustomData, savePendingChanges]);

  // Quản lý từ chối một thay đổi → xóa khỏi hàng đợi
  const rejectChange = useCallback((changeId) => {
    setPendingChanges(prev => {
      const next = prev.filter(c => c.id !== changeId);
      savePendingChanges(next);
      return next;
    });
  }, [savePendingChanges]);

  const personsMap = useMemo(() => new Map(allPersons.map(p => [p.id, p])), [allPersons]);
  const adj = useMemo(() => buildAdjacencyLists(allRelationships, personsMap), [personsMap, allRelationships]);
  const roots = useMemo(() => [personsMap.get(ROOT_ID)], [personsMap]);

  // Auto-collapse từ đời 4 trở đi để dễ nhìn lúc đầu
  useEffect(() => {
    const autoCollapsed = new Set();
    const AUTO_COLLAPSE_GEN = 4;
    const walk = (personId, visited) => {
      if (visited.has(personId)) return;
      const nv = new Set(visited); nv.add(personId);
      const data = getTreeData(personId, personsMap, adj);
      if (!data.person) return;
      if (data.person.generation >= AUTO_COLLAPSE_GEN && data.children.length > 0) {
        autoCollapsed.add(personId);
        return; // không cần đi sâu hơn
      }
      data.children.forEach(c => walk(c.id, nv));
    };
    walk(ROOT_ID, new Set());
    setCollapsedNodes(autoCollapsed);
  }, [personsMap, adj]);

  const toggleCollapse = useCallback((id) => {
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.1, 1.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.1, 0.25));
  const handleReset = () => {
    setScale(0.85);
    if (containerRef.current) {
      containerRef.current.scrollLeft = (containerRef.current.scrollWidth - containerRef.current.clientWidth) / 2;
      containerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = (containerRef.current.scrollWidth - containerRef.current.clientWidth) / 2;
      }
    }, 150);
  }, [tab]);

  // Mở rộng tất cả các nhánh cha của 1 node để có thể jump tới
  const expandPathTo = useCallback((personId) => {
    const parentMap = new Map(); // child -> parent
    allRelationships.forEach(r => {
      if (r.type !== "marriage") parentMap.set(r.person_b, r.person_a);
    });
    const path = [];
    let cur = personId;
    const visited = new Set();
    while (cur && !visited.has(cur)) {
      visited.add(cur);
      path.push(cur);
      cur = parentMap.get(cur);
    }
    setCollapsedNodes(prev => {
      const next = new Set(prev);
      path.forEach(id => next.delete(id));
      return next;
    });
    setHighlightId(personId);
    setTab("tree");
    setTimeout(() => {
      const el = document.getElementById("person-" + personId);
      if (el && containerRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    }, 200);
    setTimeout(() => setHighlightId(null), 3000);
  }, []);

  const COLORS = { bg: "#0f1f38" };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Noto Sans', sans-serif" }}>
      <style>{TREE_CSS}</style>

      <div style={{
        background: "linear-gradient(135deg, #2c1a0e 0%, #5a3210 100%)",
        color: "#f0e6d0",
        padding: "20px 24px 16px",
        textAlign: "center",
        borderBottom: "3px solid #b8860b",
      }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#c8a86a", marginBottom: 4, textTransform: "uppercase" }}>Gia Phả Dòng Họ</div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, fontFamily: "'Noto Serif', serif", letterSpacing: 2, color: "#f5e6c0" }}>
          🌳 PHAN TỘC PHẢ HỆ
        </h1>
        <p style={{ margin: "6px 0 14px", fontSize: 12, color: "#a89060" }}>
          Ông Cố: Phan Tấn Liêu (1880–1955) · Thăng Phước
        </p>
        <SearchBar persons={allPersons} onJump={expandPathTo} />
      </div>

      <Stats persons={allPersons} />

      <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "8px 16px 0" }}>
        {[["tree", "🌲 Sơ đồ cây"], ["list", "📋 Danh sách"], ["manage", `➕ Thêm vào${pendingChanges.length > 0 ? ` (${pendingChanges.length})` : ""}`]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: "8px 20px", borderRadius: 20, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600,
              background: tab === key ? "#e6a23c" : "#1a2e4e",
              color: tab === key ? "#1a2e4e" : "#a8b8d8",
              boxShadow: tab === key ? "0 3px 10px rgba(230,162,60,0.4)" : "none",
              transition: "all 0.2s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "tree" && (
        <div style={{ position: "relative", height: "calc(100vh - 290px)", minHeight: 480 }}>
          <div style={{
            position: "absolute", top: 12, right: 12, zIndex: 50,
            display: "flex", flexDirection: "column", gap: 6,
          }}>
            {[["＋", handleZoomIn], ["－", handleZoomOut], ["⌂", handleReset]].map(([label, fn]) => (
              <button
                key={label}
                onClick={fn}
                style={{
                  width: 34, height: 34, borderRadius: 8, border: "1px solid #3a5680",
                  background: "#1a2e4e", cursor: "pointer", fontSize: 16, color: "#e8edf7",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            ref={containerRef}
            style={{
              width: "100%", height: "100%",
              overflow: "auto",
              background: "repeating-linear-gradient(0deg, transparent, transparent 39px, #25395c 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #25395c 40px)",
              backgroundSize: "40px 40px",
              cursor: "grab",
            }}
          >
            <div
              className="gp-tree"
              style={{
                display: "inline-block",
                minWidth: "100%",
                padding: "40px 60px 80px",
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                transition: "transform 0.2s",
              }}
            >
              <ul>
                {roots.map(root => (
                  <TreeNode
                    key={root.id}
                    personId={root.id}
                    personsMap={personsMap}
                    adj={adj}
                    collapsedNodes={collapsedNodes}
                    toggleCollapse={toggleCollapse}
                    onSelect={setSelectedPerson}
                    highlightId={highlightId}
                    visited={new Set()}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === "list" && (
        <div style={{ padding: "16px 20px 40px", maxWidth: 900, margin: "0 auto" }}>
          {[1, 2, 3, 4, 5, 6, 7].map(gen => {
            const members = allPersons.filter(p => p.generation === gen);
            if (!members.length) return null;
            return (
              <div key={gen} style={{ marginBottom: 20 }}>
                <h3 style={{
                  margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#e6a23c",
                  borderLeft: "3px solid #e6a23c", paddingLeft: 10,
                  fontFamily: "'Noto Serif', serif",
                }}>
                  Đời {gen} <span style={{ color: "#6f84ac", fontWeight: 400, fontSize: 12 }}>({members.length} người)</span>
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
                  {members.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPerson(p)}
                      style={{
                        background: "#1a2e4ecc", borderRadius: 12, padding: "10px 14px",
                        border: "1px solid #2e466e", textAlign: "left", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 12,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                        transition: "transform 0.15s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "none"}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: p.gender === "male"
                          ? "linear-gradient(135deg,#1a3a5c,#2563a8)"
                          : "linear-gradient(135deg,#6b2155,#c0527a)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 14, fontWeight: 700,
                        opacity: p.is_deceased ? 0.65 : 1,
                        fontFamily: "'Noto Serif', serif",
                      }}>
                        {p.full_name.trim().split(" ").pop()?.[0]}
                      </div>
                      <div style={{ overflow: "hidden" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: p.is_deceased ? "#8a99b8" : "#e8edf7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.full_name}</div>
                        <div style={{ fontSize: 11, color: "#6f84ac" }}>
                          {p.birth_year ?? "?"}{p.is_deceased ? ` – ${p.death_year ?? "?"}` : ""}
                          {" · "}{p.gender === "male" ? "Nam" : "Nữ"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "manage" && (
        <ManagePanel
          allPersons={allPersons}
          editingPerson={editingPerson}
          setEditingPerson={setEditingPerson}
          isAdmin={isAdmin}
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
          pendingChanges={pendingChanges}
          onApproveChange={approveChange}
          onRejectChange={rejectChange}
          onSubmitAdd={submitAddPerson}
          onSubmitUpdate={submitUpdatePerson}
        />
      )}

      <PersonModal
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onEdit={(p) => { setSelectedPerson(null); setEditingPerson(p); setTab("manage"); }}
      />

      <div style={{ textAlign: "center", padding: "12px", fontSize: 11, color: "#6f84ac", borderTop: "1px solid #2e466e" }}>
        Gia Phả Họ Phan · {allPersons.length} thành viên · Xây dựng từ mã nguồn <strong>giapha-os</strong> · {new Date().getFullYear()}
      </div>
    </div>
  );
}
