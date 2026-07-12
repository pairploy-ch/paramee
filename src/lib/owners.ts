export interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export const owners: Owner[] = [
  { id: "owner-1", name: "คุณสมชาย ใจดี", email: "owner@paramee.co.th", phone: "081-234-5678" },
  { id: "owner-2", name: "คุณพิมพ์ใจ รักษ์ทรัพย์", email: "pimjai@paramee.co.th", phone: "089-876-5432" },
  { id: "owner-3", name: "คุณอนันต์ มั่งมี", email: "anan@paramee.co.th", phone: "062-345-6789" },
];

export function getOwnerByEmail(email: string): Owner | undefined {
  return owners.find((o) => o.email.toLowerCase() === email.toLowerCase());
}

export function getOwnerById(id: string): Owner | undefined {
  return owners.find((o) => o.id === id);
}
