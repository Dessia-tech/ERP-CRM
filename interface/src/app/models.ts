export interface Deserializable<T> {
  deserialize(input: any): T;
}

export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  admin: boolean;
  active:boolean;
  phone_country:string;
  phone_number:string;
}

export class Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_country:string;
  phone_number:string;
  organization: number;
}

export class Organization {
  id: number;
  name: string;
  country: string;
}

export class Token{
  access_token:string;
}

export class Meeting{
  contact_participants: any[];
  start_date: number;
  end_date: number;
  name: string;
  report: string;
}
